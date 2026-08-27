// ====================================================================
// GROQ AI PROVIDER (FALLBACK 2)
// ====================================================================

import { GenerateTextOptions, ProviderExecutionResult } from '../types';

export class GroqProvider {
  readonly name = 'groq' as const;

  get apiKey(): string {
    return process.env.GROQ_API_KEY || '';
  }

  get modelName(): string {
    return process.env.GROQ_MODEL_NAME || 'llama-3.3-70b-versatile';
  }

  isConfigured(): boolean {
    const key = this.apiKey.trim();
    return (
      key.length > 0 &&
      !key.includes('placeholder') &&
      !key.includes('your-groq-api-key')
    );
  }

  async execute({
    systemPrompt = 'Anda adalah asisten karir profesional CVPintar.',
    prompt,
    temperature = 0.7,
    maxTokens = 2048,
    timeoutMs = 12000,
  }: GenerateTextOptions): Promise<ProviderExecutionResult> {
    if (!this.isConfigured()) {
      throw new Error('Groq API key is not configured');
    }

    const startTime = Date.now();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    const fullSystemPrompt = `${systemPrompt}\n\nATURAN MUTLAK:\n1. JANGAN mengarang pengalaman kerja, perusahaan, institusi, atau keterampilan palsu yang tidak ada di input user.\n2. Balas selalu dalam Bahasa Indonesia profesional dan terstruktur.`;

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.modelName,
          messages: [
            {
              role: 'system',
              content: fullSystemPrompt,
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature,
          max_tokens: maxTokens,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text().catch(() => '');
        const error = new Error(
          `Groq request failed with HTTP ${response.status}: ${errorText.slice(0, 120)}`
        );
        (error as unknown as { status: number }).status = response.status;
        throw error;
      }

      const data = await response.json();
      const text = data?.choices?.[0]?.message?.content;

      if (!text || typeof text !== 'string' || text.trim().length === 0) {
        throw new Error('Groq returned an empty or invalid text response');
      }

      return {
        text: text.trim(),
        provider: 'groq',
        model: this.modelName,
        latencyMs: Date.now() - startTime,
      };
    } catch (err: unknown) {
      clearTimeout(timeoutId);
      throw err;
    }
  }
}

export const groqProvider = new GroqProvider();
