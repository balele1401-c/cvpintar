// ====================================================================
// KERJAAI MULTI-PROVIDER AI ROUTER WITH AUTOMATIC FAILOVER
// ====================================================================
// Failover Order: Gemini (Primary) -> DeepSeek (Fallback 1) -> Groq (Fallback 2) -> Deterministic Fallback

import { GenerateTextOptions, ProviderExecutionResult, AIProviderName } from './types';
import { providerCooldown } from './cooldown';
import { aiCache } from './cache';
import { geminiProvider } from './providers/gemini';
import { deepseekProvider } from './providers/deepseek';
import { groqProvider } from './providers/groq';

export interface AIRouterOptions {
  gemini?: typeof geminiProvider;
  deepseek?: typeof deepseekProvider;
  groq?: typeof groqProvider;
}

export class AIRouter {
  private gemini: typeof geminiProvider;
  private deepseek: typeof deepseekProvider;
  private groq: typeof groqProvider;

  constructor(options?: AIRouterOptions) {
    this.gemini = options?.gemini || geminiProvider;
    this.deepseek = options?.deepseek || deepseekProvider;
    this.groq = options?.groq || groqProvider;
  }

  /**
   * Determine if an error from an AI provider is retryable for failover
   */
  isRetryableError(error: unknown): boolean {
    if (!error) return true;

    const err = error as { status?: number; name?: string; message?: string };
    const status = err.status;
    const msg = String(err.message || '').toLowerCase();
    const name = String(err.name || '').toLowerCase();

    // 429 Rate Limit / Quota Exceeded
    if (status === 429 || msg.includes('429') || msg.includes('quota') || msg.includes('rate limit') || msg.includes('resource exhausted')) {
      return true;
    }

    // 5xx Server Errors & 408 Timeout
    if (status && (status >= 500 || status === 408 || status === 502 || status === 503 || status === 504)) {
      return true;
    }

    // Timeout / Abort / Network errors
    if (
      name.includes('abort') ||
      name.includes('timeout') ||
      msg.includes('aborted') ||
      msg.includes('timeout') ||
      msg.includes('fetch failed') ||
      msg.includes('econnrefused') ||
      msg.includes('network') ||
      msg.includes('empty or invalid text')
    ) {
      return true;
    }

    // Explicit 400 Bad Request usually indicates schema issue or client error, but can be retried across different engines
    if (status === 400 && !msg.includes('invalid user input')) {
      return true;
    }

    return true; // Default to failover safety
  }

  /**
   * Orchestrates the multi-provider chain execution
   */
  async generateText(options: GenerateTextOptions): Promise<ProviderExecutionResult> {
    const sysPrompt = options.systemPrompt || 'Anda adalah asisten karir profesional CVPintar.';
    
    // Check in-memory cache first
    const cached = aiCache.get(sysPrompt, options.prompt);
    if (cached) {
      console.log(`[AI] Cache HIT for prompt. Returning instant response (0 API cost).`);
      return cached;
    }

    const providers: {
      name: AIProviderName;
      instance: typeof geminiProvider | typeof deepseekProvider | typeof groqProvider;
    }[] = [
      { name: 'gemini', instance: this.gemini },
      { name: 'deepseek', instance: this.deepseek },
      { name: 'groq', instance: this.groq },
    ];

    for (let i = 0; i < providers.length; i++) {
      const { name, instance } = providers[i];
      const nextProviderName = i + 1 < providers.length ? providers[i + 1].name : 'fallback';

      // 1. Check configuration
      if (!instance.isConfigured()) {
        continue;
      }

      // 2. Check in-memory cooldown
      if (providerCooldown.isInCooldown(name)) {
        console.warn(`[AI] provider=${name} status=cooldown_skipped`);
        continue;
      }

      // 3. Attempt execution
      try {
        const result = await instance.execute(options);
        providerCooldown.markSuccess(name);
        console.log(
          `[AI] provider=${name} status=success latency=${result.latencyMs}ms model=${result.model}`
        );

        // Store in cache
        aiCache.set(sysPrompt, options.prompt, result);

        return result;
      } catch (err: unknown) {
        const status = (err as { status?: number })?.status || 'error';
        console.warn(`[AI] provider=${name} status=${status}`);

        // If retryable, put provider in cooldown and failover to next provider
        if (this.isRetryableError(err)) {
          providerCooldown.markFailure(name);
          console.log(`[AI] failover provider=${nextProviderName}`);
          continue;
        }

        // Non-retryable error
        console.error(`[AI] Non-retryable error encountered on provider ${name}:`, err);
        break;
      }
    }

    // 4. Final Deterministic Fallback if all providers failed or were unconfigured
    console.log('[AI] all_external_providers_exhausted status=using_deterministic_fallback');
    const fallbackText = this.generateDeterministicFallback(options.prompt);
    return {
      text: fallbackText,
      provider: 'fallback',
      model: 'deterministic-heuristic-v1',
      latencyMs: 0,
    };
  }

  /**
   * Deterministic local fallback generator preserving user facts
   */
  generateDeterministicFallback(prompt: string): string {
    // 1. Experience Rewrite Fallback
    if (prompt.includes('Optimalkan deskripsi')) {
      const cleaned = prompt
        .replace('Optimalkan deskripsi berikut:', '')
        .replace(/"/g, '')
        .trim();
      return `• Mengembangkan dan mengoptimalkan tugas: ${cleaned || 'operasional terstruktur'} dengan hasil terukur.\n• Berkolaborasi secara proaktif dengan tim untuk mencapai target proyek tepat waktu.\n• Menerapkan best practice dalam menyelesaikan tantangan kerja harian.`;
    }

    // 2. Cover Letter Fallback
    if (
      prompt.includes('Perusahaan Target') ||
      prompt.includes('Perusahaan:') ||
      prompt.includes('Posisi yang Dilamar') ||
      prompt.includes('Posisi:')
    ) {
      const companyMatch = prompt.match(/(?:Perusahaan Target|Perusahaan):\s*([^\n]+)/i);
      const positionMatch = prompt.match(/(?:Posisi yang Dilamar|Posisi):\s*([^\n]+)/i);
      const skillsMatch = prompt.match(/(?:Keahlian \/ Fokus Utama|Keahlian Utama|Skills):\s*([^\n]+)/i);
      const nameMatch = prompt.match(/(?:Nama Pelamar|Nama):\s*([^\n]+)/i);

      const company = companyMatch ? companyMatch[1].trim() : 'Perusahaan';
      const position = positionMatch ? positionMatch[1].trim() : 'Posisi Terkait';
      const skills = skillsMatch ? skillsMatch[1].trim() : 'Keahlian Terkait';
      const applicantName = nameMatch ? nameMatch[1].trim() : 'Pelamar CVPintar';

      const today = new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });

      return `Jakarta, ${today}

Perihal: Lamaran Pekerjaan – ${position}
Lampiran: 1 (Satu) Berkas Curriculum Vitae

Yth. Tim Rekrutmen / HRD ${company}
Di Tempat

Dengan hormat,

Sehubungan dengan informasi lowongan pekerjaan yang dibuka oleh ${company}, melalui surat lamaran ini saya bermaksud untuk mengajukan diri guna mengisi posisi sebagai ${position}.

Saya memiliki latar belakang profesional dan keahlian yang relevan, khususnya dalam bidang ${skills}. Selama menjalani aktivitas profesional dan akademis, saya terbiasa bekerja secara terstruktur, menganalisis kebutuhan operasional, serta berorientasi pada penyelesaian masalah (problem solving) dengan hasil yang terukur. Saya meyakini bahwa kemampuan saya dalam ${skills} akan mampu memberikan kontribusi positif terhadap efisiensi dan perkembangan tim di ${company}.

${company} dikenal memiliki dedikasi dan reputasi yang sangat baik dalam industrinya. Kesempatan untuk bergabung dan berkembang bersama tim profesional ${company} merupakan motivasi besar bagi saya untuk terus memberikan kinerja terbaik.

Sebagai bahan pertimbangan Bapak/Ibu, saya turut melampirkan Curriculum Vitae (CV) terbaru yang memuat rincian rekam jejak dan kualifikasi saya.

Besar harapan saya untuk memperoleh kesempatan wawancara agar dapat menjelaskan secara lebih mendalam mengenai potensi dan kontribusi yang dapat saya berikan bagi ${company}. Demikian surat lamaran ini saya sampaikan, atas perhatian dan kesempatan yang Bapak/Ibu berikan, saya ucapkan terima kasih.


Hormat saya,


${applicantName}`;
    }

    // 3. Summary Generator Fallback
    if (prompt.includes('Target Role:')) {
      const roleMatch = prompt.match(/Target Role:\s*([^\n]+)/i);
      const role = roleMatch ? roleMatch[1].trim() : 'Profesional';
      return `Profesional di bidang ${role} yang berdedikasi dan adaptif dengan kemampuan komunikasi yang kuat serta rekam jejak dalam menyelesaikan tugas secara terstruktur. Siap memberikan kontribusi positif bagi pertumbuhan tim.`;
    }

    return `Profesional yang berdedikasi dan adaptif dengan kemampuan komunikasi yang kuat serta rekam jejak dalam menyelesaikan tugas secara terstruktur. Siap memberikan kontribusi positif bagi pertumbuhan tim.`;
  }
}

export const aiRouter = new AIRouter();
