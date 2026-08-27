// ====================================================================
// DEEPSEEK AI PROVIDER (FALLBACK 1)
// ====================================================================

import { GenerateTextOptions, ProviderExecutionResult } from '../types';

export class DeepSeekProvider {
  readonly name = 'deepseek' as const;

  get apiKey(): string {
    return process.env.DEEPSEEK_API_KEY || '';
  }

  get modelName(): string {
    return process.env.DEEPSEEK_MODEL_NAME || 'deepseek-chat';
  }

  isConfigured(): boolean {
    const key = this.apiKey.trim();
    return (
      key.length > 0 &&
      !key.includes('placeholder') &&
      !key.includes('your-deepseek-api-key')
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
      throw new Error('DeepSeek API key is not configured');
    }

    const startTime = Date.now();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    const fullSystemPrompt = `${systemPrompt}\n\nATURAN MUTLAK:\n1. JANGAN mengarang pengalaman kerja, perusahaan, institusi, atau keterampilan palsu yang tidak ada di input user.\n2. Balas selalu dalam Bahasa Indonesia profesional dan terstruktur.`;

    try {
      const response = await fetch('https://api.deepseek.com/chat/completions', {
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
          `DeepSeek request failed with HTTP ${response.status}: ${errorText.slice(0, 100)}`
        );
        (error as unknown as { status: number }).status = response.status;
        throw error;
      }

      const data = await response.json();
      const text = data?.choices?.[0]?.message?.content;

      if (!text || typeof text !== 'string' || text.trim().length === 0) {
        throw new Error('DeepSeek returned an empty or invalid text response');
      }

      return {
        text: text.trim(),
        provider: 'deepseek',
        model: this.modelName,
        latencyMs: Date.now() - startTime,
      };
    } catch (err: unknown) {
      clearTimeout(timeoutId);
      throw err;
    }
  }
}

export const deepseekProvider = new DeepSeekProvider();
