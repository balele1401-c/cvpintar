// ====================================================================
// IN-MEMORY LRU RESPONSE CACHE FOR AI REQUESTS
// ====================================================================
// Eliminates duplicate API calls, saves token quota, and prevents 429 limits.

import { ProviderExecutionResult } from './types';

interface CacheEntry {
  result: ProviderExecutionResult;
  expiresAt: number;
}

class AICache {
  private cache: Map<string, CacheEntry> = new Map();
  private maxEntries: number = 200;
  private defaultTtlMs: number = 10 * 60 * 1000; // 10 minutes

  private generateKey(systemPrompt: string, prompt: string, model?: string): string {
    const raw = `${model || 'default'}:::${systemPrompt}:::${prompt}`;
    // Simple fast hashing
    let hash = 0;
    for (let i = 0; i < raw.length; i++) {
      hash = (hash << 5) - hash + raw.charCodeAt(i);
      hash |= 0;
    }
    return `${hash}_${raw.length}`;
  }

  get(systemPrompt: string, prompt: string, model?: string): ProviderExecutionResult | null {
    const key = this.generateKey(systemPrompt, prompt, model);
    const entry = this.cache.get(key);

    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.result;
  }

  set(
    systemPrompt: string,
    prompt: string,
    result: ProviderExecutionResult,
    ttlMs: number = this.defaultTtlMs,
    model?: string
  ): void {
    // Evict oldest if full
    if (this.cache.size >= this.maxEntries) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) this.cache.delete(oldestKey);
    }

    const key = this.generateKey(systemPrompt, prompt, model);
    this.cache.set(key, {
      result: {
        ...result,
        latencyMs: 1, // Served instantly from cache
      },
      expiresAt: Date.now() + ttlMs,
    });
  }

  clear(): void {
    this.cache.clear();
  }
}

export const aiCache = new AICache();
