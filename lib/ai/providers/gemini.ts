// ====================================================================
// GEMINI AI PROVIDER WITH MULTI-KEY POOL & ROTATION
// ====================================================================

import { GenerateTextOptions, ProviderExecutionResult } from '../types';

export class GeminiProvider {
  readonly name = 'gemini' as const;
  private currentKeyIndex = 0;
  private keyCooldowns: Map<string, number> = new Map();

  /**
   * Retrieves all configured Gemini API keys
   * Supports comma-separated keys or single key in AI_API_KEY / GEMINI_API_KEY / GEMINI_API_KEYS
   */
  get apiKeys(): string[] {
    const raw =
      process.env.AI_API_KEY ||
      process.env.GEMINI_API_KEY ||
      process.env.GEMINI_API_KEYS ||
      '';
    return raw
      .split(',')
      .map((k) => k.trim())
      .filter(
        (k) =>
          k.length > 0 &&
          !k.includes('placeholder') &&
          !k.includes('your-ai-api-key')
      );
  }

  get apiKey(): string {
    const keys = this.apiKeys;
    if (keys.length === 0) return '';
    return keys[this.currentKeyIndex % keys.length];
  }

  get modelName(): string {
    return process.env.AI_MODEL_NAME || 'gemini-2.0-flash';
  }

  isConfigured(): boolean {
    return this.apiKeys.length > 0;
  }

  /**
   * Get available active key not in cooldown
   */
  private getAvailableKey(): { key: string; index: number } | null {
    const keys = this.apiKeys;
    if (keys.length === 0) return null;

    const now = Date.now();
    for (let i = 0; i < keys.length; i++) {
      const idx = (this.currentKeyIndex + i) % keys.length;
      const key = keys[idx];
      const cooldownUntil = this.keyCooldowns.get(key) || 0;
      if (now > cooldownUntil) {
        return { key, index: idx };
      }
    }

    // If all in cooldown, return least recently used
    return { key: keys[this.currentKeyIndex % keys.length], index: this.currentKeyIndex % keys.length };
  }

  private markKeyCooldown(key: string, durationMs = 60000) {
    this.keyCooldowns.set(key, Date.now() + durationMs);
    const keys = this.apiKeys;
    if (keys.length > 1) {
      this.currentKeyIndex = (this.currentKeyIndex + 1) % keys.length;
    }
  }

  async execute({
    systemPrompt = 'Anda adalah asisten karir profesional CVPintar.',
    prompt,
    temperature = 0.7,
    timeoutMs = 15000,
  }: GenerateTextOptions): Promise<ProviderExecutionResult> {
    const allKeys = this.apiKeys;
    if (allKeys.length === 0) {
      throw new Error('Gemini API key is not configured');
    }

    const maxKeyAttempts = Math.min(allKeys.length, 3);
    let lastError: unknown = null;

    for (let attempt = 0; attempt < maxKeyAttempts; attempt++) {
      const activeKeyInfo = this.getAvailableKey();
      if (!activeKeyInfo) break;

      const activeKey = activeKeyInfo.key;
      this.currentKeyIndex = (activeKeyInfo.index + 1) % allKeys.length;

      const startTime = Date.now();
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${this.modelName}:generateContent?key=${activeKey}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              contents: [
                {
                  role: 'user',
                  parts: [
                    {
                      text: `${systemPrompt}\n\nATURAN MUTLAK:\n1. JANGAN mengarang pengalaman kerja, perusahaan, institusi, atau keterampilan palsu yang tidak ada di input user.\n2. Balas selalu dalam Bahasa Indonesia profesional dan terstruktur.\n\nInput Pengguna:\n${prompt}`,
                    },
                  ],
                },
              ],
              generationConfig: {
                temperature,
              },
            }),
            signal: controller.signal,
          }
        );

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorText = await response.text().catch(() => '');
          const error = new Error(
            `Gemini request failed with HTTP ${response.status}: ${errorText.slice(0, 120)}`
          );
          (error as unknown as { status: number }).status = response.status;

          // If rate limit (429) or quota exceeded, mark this specific key into cooldown and try next key in pool
          if (response.status === 429 || errorText.toLowerCase().includes('quota') || errorText.toLowerCase().includes('rate')) {
            console.warn(`[Gemini] Key ...${activeKey.slice(-6)} hit rate limit. Rotating to next key in pool.`);
            this.markKeyCooldown(activeKey);
            lastError = error;
            continue; // Try next key
          }

          throw error;
        }

        const data = await response.json();
        const textParts = data?.candidates?.[0]?.content?.parts?.filter(
          (p: { text?: string }) => typeof p?.text === 'string' && p.text.trim().length > 0
        );
        const text =
          textParts?.map((p: { text: string }) => p.text).join('\n') ||
          data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!text || typeof text !== 'string' || text.trim().length === 0) {
          throw new Error('Gemini returned an empty or invalid text response');
        }

        return {
          text: text.trim(),
          provider: 'gemini',
          model: this.modelName,
          latencyMs: Date.now() - startTime,
        };
      } catch (err: unknown) {
        clearTimeout(timeoutId);
        lastError = err;
        const errStatus = (err as { status?: number })?.status;
        if (errStatus === 429 && attempt < maxKeyAttempts - 1) {
          continue;
        }
        throw err;
      }
    }

    throw lastError || new Error('All configured Gemini keys were rate limited');
  }
}

export const geminiProvider = new GeminiProvider();
