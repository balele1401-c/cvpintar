// ====================================================================
// KERJAAI IN-MEMORY PROVIDER COOLDOWN MANAGER
// ====================================================================
// Note: In-memory cooldown is instance-local and resets when server restarts.

import { AIProviderName } from './types';
import { aiCache } from './cache';

export class ProviderCooldownManager {
  private cooldowns = new Map<AIProviderName, number>();
  private failureCounts = new Map<AIProviderName, number>();
  private defaultCooldownMs: number;

  constructor(defaultCooldownMs = 60000) {
    this.defaultCooldownMs = defaultCooldownMs;
  }

  /**
   * Check if a provider is currently cooling down after errors (429, 503, timeout)
   */
  isInCooldown(provider: AIProviderName): boolean {
    const expiresAt = this.cooldowns.get(provider);
    if (!expiresAt) return false;

    if (Date.now() < expiresAt) {
      return true;
    }

    // Cooldown has expired, clean up
    this.cooldowns.delete(provider);
    return false;
  }

  /**
   * Record a retryable failure and trigger a cooldown period
   */
  markFailure(provider: AIProviderName, customDurationMs?: number): void {
    const currentFailures = (this.failureCounts.get(provider) || 0) + 1;
    this.failureCounts.set(provider, currentFailures);

    const duration = customDurationMs || this.defaultCooldownMs;
    this.cooldowns.set(provider, Date.now() + duration);

    console.warn(
      `[AI] provider=${provider} status=cooldown_started duration=${duration}ms consecutiveFailures=${currentFailures}`
    );
  }

  /**
   * Reset failure count & clear cooldown on successful request
   */
  markSuccess(provider: AIProviderName): void {
    this.cooldowns.delete(provider);
    this.failureCounts.delete(provider);
  }

  /**
   * Get remaining cooldown time in milliseconds
   */
  getRemainingCooldownMs(provider: AIProviderName): number {
    const expiresAt = this.cooldowns.get(provider);
    if (!expiresAt) return 0;
    return Math.max(0, expiresAt - Date.now());
  }

  /**
   * Clear all active cooldowns & in-memory cache (for test isolation)
   */
  resetAll(): void {
    this.cooldowns.clear();
    this.failureCounts.clear();
    aiCache.clear();
  }
}

export const providerCooldown = new ProviderCooldownManager();
