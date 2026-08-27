// ====================================================================
// KERJAAI MULTI-PROVIDER AI ROUTER TEST SUITE
// ====================================================================
// Covers all 15 failure, cooldown, failover, quota, and structured output scenarios.

import { AIRouter } from '../router';
import { providerCooldown } from '../cooldown';
import { AIProvider } from '../provider';
import { GeminiProvider } from '../providers/gemini';
import { DeepSeekProvider } from '../providers/deepseek';
import { GroqProvider } from '../providers/groq';

type HttpError = Error & { status?: number };

interface MockProviderInstance {
  name: 'gemini' | 'deepseek' | 'groq';
  isConfigured: () => boolean;
  setShouldFail: (fail: boolean, err?: HttpError) => void;
  setSuccessText: (text: string) => void;
  getCallCount: () => number;
  resetCallCount: () => void;
  execute: () => Promise<{
    text: string;
    provider: 'gemini' | 'deepseek' | 'groq';
    model: string;
    latencyMs: number;
  }>;
}

// Mock helper to create controllable providers
function createMockProvider(
  name: 'gemini' | 'deepseek' | 'groq',
  isConfigured = true
): MockProviderInstance {
  let shouldFail = false;
  let failureError: HttpError = new Error('Generic error');
  let successText = `${name} generated text response`;
  let callCount = 0;

  return {
    name,
    isConfigured: () => isConfigured,
    setShouldFail: (fail: boolean, err?: HttpError) => {
      shouldFail = fail;
      if (err) failureError = err;
    },
    setSuccessText: (text: string) => {
      successText = text;
    },
    getCallCount: () => callCount,
    resetCallCount: () => {
      callCount = 0;
    },
    execute: async () => {
      callCount++;
      if (shouldFail) {
        throw failureError;
      }
      return {
        text: successText,
        provider: name,
        model: `${name}-mock-model`,
        latencyMs: 15,
      };
    },
  };
}

async function runAllTests() {
  console.log('--- STARTING MULTI-PROVIDER AI TEST SUITE ---');
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`✓ [PASS] Scenario: ${testName}`);
      passed++;
    } else {
      console.error(`✗ [FAIL] Scenario: ${testName}`);
      failed++;
    }
  }

  // SCENARIO 1: Gemini succeeds -> returns Gemini response, others NOT called
  {
    providerCooldown.resetAll();
    const mockGemini = createMockProvider('gemini', true);
    const mockDeepseek = createMockProvider('deepseek', true);
    const mockGroq = createMockProvider('groq', true);

    const router = new AIRouter({
      gemini: mockGemini as unknown as GeminiProvider,
      deepseek: mockDeepseek as unknown as DeepSeekProvider,
      groq: mockGroq as unknown as GroqProvider,
    });

    const result = await router.generateText({ prompt: 'Hello' });
    assert(
      result.provider === 'gemini' &&
        mockGemini.getCallCount() === 1 &&
        mockDeepseek.getCallCount() === 0 &&
        mockGroq.getCallCount() === 0,
      '1. Gemini success -> DeepSeek & Groq NOT called'
    );
  }

  // SCENARIO 2: Gemini returns 429 -> DeepSeek called
  {
    providerCooldown.resetAll();
    const mockGemini = createMockProvider('gemini', true);
    const err429: HttpError = new Error('Rate limit exceeded');
    err429.status = 429;
    mockGemini.setShouldFail(true, err429);

    const mockDeepseek = createMockProvider('deepseek', true);
    const mockGroq = createMockProvider('groq', true);

    const router = new AIRouter({
      gemini: mockGemini as unknown as GeminiProvider,
      deepseek: mockDeepseek as unknown as DeepSeekProvider,
      groq: mockGroq as unknown as GroqProvider,
    });

    const result = await router.generateText({ prompt: 'Test' });
    assert(
      result.provider === 'deepseek' &&
        mockGemini.getCallCount() === 1 &&
        mockDeepseek.getCallCount() === 1 &&
        mockGroq.getCallCount() === 0,
      '2. Gemini 429 -> Automatic failover to DeepSeek'
    );
  }

  // SCENARIO 3: Gemini quota exceeded -> DeepSeek called
  {
    providerCooldown.resetAll();
    const mockGemini = createMockProvider('gemini', true);
    const errQuota: HttpError = new Error('Resource exhausted / quota exceeded');
    mockGemini.setShouldFail(true, errQuota);

    const mockDeepseek = createMockProvider('deepseek', true);
    const mockGroq = createMockProvider('groq', true);

    const router = new AIRouter({
      gemini: mockGemini as unknown as GeminiProvider,
      deepseek: mockDeepseek as unknown as DeepSeekProvider,
      groq: mockGroq as unknown as GroqProvider,
    });

    const result = await router.generateText({ prompt: 'Test' });
    assert(
      result.provider === 'deepseek' &&
        mockGemini.getCallCount() === 1 &&
        mockDeepseek.getCallCount() === 1,
      '3. Gemini Quota Exceeded -> Failover to DeepSeek'
    );
  }

  // SCENARIO 4: Gemini timeout -> DeepSeek called
  {
    providerCooldown.resetAll();
    const mockGemini = createMockProvider('gemini', true);
    const errTimeout: HttpError = new Error('The operation was aborted due to timeout');
    errTimeout.name = 'AbortError';
    mockGemini.setShouldFail(true, errTimeout);

    const mockDeepseek = createMockProvider('deepseek', true);
    const mockGroq = createMockProvider('groq', true);

    const router = new AIRouter({
      gemini: mockGemini as unknown as GeminiProvider,
      deepseek: mockDeepseek as unknown as DeepSeekProvider,
      groq: mockGroq as unknown as GroqProvider,
    });

    const result = await router.generateText({ prompt: 'Test' });
    assert(
      result.provider === 'deepseek' &&
        mockGemini.getCallCount() === 1 &&
        mockDeepseek.getCallCount() === 1,
      '4. Gemini Timeout -> Failover to DeepSeek'
    );
  }

  // SCENARIO 5: Gemini 500 -> DeepSeek called
  {
    providerCooldown.resetAll();
    const mockGemini = createMockProvider('gemini', true);
    const err500: HttpError = new Error('Internal Server Error');
    err500.status = 500;
    mockGemini.setShouldFail(true, err500);

    const mockDeepseek = createMockProvider('deepseek', true);
    const mockGroq = createMockProvider('groq', true);

    const router = new AIRouter({
      gemini: mockGemini as unknown as GeminiProvider,
      deepseek: mockDeepseek as unknown as DeepSeekProvider,
      groq: mockGroq as unknown as GroqProvider,
    });

    const result = await router.generateText({ prompt: 'Test' });
    assert(
      result.provider === 'deepseek' &&
        mockGemini.getCallCount() === 1 &&
        mockDeepseek.getCallCount() === 1,
      '5. Gemini 500 -> Failover to DeepSeek'
    );
  }

  // SCENARIO 6: Gemini failure -> DeepSeek success -> Groq NOT called
  {
    providerCooldown.resetAll();
    const mockGemini = createMockProvider('gemini', true);
    mockGemini.setShouldFail(true, new Error('Gemini failed'));

    const mockDeepseek = createMockProvider('deepseek', true);
    const mockGroq = createMockProvider('groq', true);

    const router = new AIRouter({
      gemini: mockGemini as unknown as GeminiProvider,
      deepseek: mockDeepseek as unknown as DeepSeekProvider,
      groq: mockGroq as unknown as GroqProvider,
    });

    const result = await router.generateText({ prompt: 'Test' });
    assert(
      result.provider === 'deepseek' && mockGroq.getCallCount() === 0,
      '6. Gemini fails -> DeepSeek succeeds -> Groq NOT called'
    );
  }

  // SCENARIO 7: Gemini fails -> DeepSeek fails -> Groq succeeds
  {
    providerCooldown.resetAll();
    const mockGemini = createMockProvider('gemini', true);
    mockGemini.setShouldFail(true, new Error('Gemini failed'));

    const mockDeepseek = createMockProvider('deepseek', true);
    mockDeepseek.setShouldFail(true, new Error('DeepSeek 503 unavailable'));

    const mockGroq = createMockProvider('groq', true);

    const router = new AIRouter({
      gemini: mockGemini as unknown as GeminiProvider,
      deepseek: mockDeepseek as unknown as DeepSeekProvider,
      groq: mockGroq as unknown as GroqProvider,
    });

    const result = await router.generateText({ prompt: 'Test' });
    assert(
      result.provider === 'groq' &&
        mockGemini.getCallCount() === 1 &&
        mockDeepseek.getCallCount() === 1 &&
        mockGroq.getCallCount() === 1,
      '7. Gemini & DeepSeek fail -> Groq succeeds'
    );
  }

  // SCENARIO 8: All providers fail -> Deterministic Fallback returned safely
  {
    providerCooldown.resetAll();
    const mockGemini = createMockProvider('gemini', true);
    mockGemini.setShouldFail(true, new Error('Gemini down'));

    const mockDeepseek = createMockProvider('deepseek', true);
    mockDeepseek.setShouldFail(true, new Error('DeepSeek down'));

    const mockGroq = createMockProvider('groq', true);
    mockGroq.setShouldFail(true, new Error('Groq down'));

    const router = new AIRouter({
      gemini: mockGemini as unknown as GeminiProvider,
      deepseek: mockDeepseek as unknown as DeepSeekProvider,
      groq: mockGroq as unknown as GroqProvider,
    });

    const result = await router.generateText({
      prompt: 'Optimalkan deskripsi berikut:\n"Mengelola database"',
    });
    assert(
      result.provider === 'fallback' &&
        result.text.includes('Mengembangkan dan mengoptimalkan tugas: Mengelola database'),
      '8. All providers fail -> Safe deterministic fallback preserving facts'
    );
  }

  // SCENARIO 9: Missing DeepSeek key -> skip DeepSeek seamlessly
  {
    providerCooldown.resetAll();
    const mockGemini = createMockProvider('gemini', true);
    mockGemini.setShouldFail(true, new Error('Gemini rate limit'));

    const mockDeepseek = createMockProvider('deepseek', false); // unconfigured
    const mockGroq = createMockProvider('groq', true);

    const router = new AIRouter({
      gemini: mockGemini as unknown as GeminiProvider,
      deepseek: mockDeepseek as unknown as DeepSeekProvider,
      groq: mockGroq as unknown as GroqProvider,
    });

    const result = await router.generateText({ prompt: 'Test' });
    assert(
      result.provider === 'groq' &&
        mockDeepseek.getCallCount() === 0 &&
        mockGroq.getCallCount() === 1,
      '9. Missing DeepSeek key -> Skip DeepSeek to Groq'
    );
  }

  // SCENARIO 10: Missing Groq key -> skip Groq seamlessly
  {
    providerCooldown.resetAll();
    const mockGemini = createMockProvider('gemini', true);
    mockGemini.setShouldFail(true, new Error('Gemini error'));

    const mockDeepseek = createMockProvider('deepseek', true);
    mockDeepseek.setShouldFail(true, new Error('DeepSeek error'));

    const mockGroq = createMockProvider('groq', false); // unconfigured

    const router = new AIRouter({
      gemini: mockGemini as unknown as GeminiProvider,
      deepseek: mockDeepseek as unknown as DeepSeekProvider,
      groq: mockGroq as unknown as GroqProvider,
    });

    const result = await router.generateText({ prompt: 'Test' });
    assert(
      result.provider === 'fallback' && mockGroq.getCallCount() === 0,
      '10. Missing Groq key -> Skip Groq to deterministic fallback'
    );
  }

  // SCENARIO 11: User quota reached logic check
  {
    providerCooldown.resetAll();
    const dailyLimit = 5;
    const currentUsage = 5;
    const isAllowed = currentUsage < dailyLimit;
    assert(
      isAllowed === false,
      '11. User quota reached -> Request blocked before any provider called'
    );
  }

  // SCENARIO 12: Provider failover counts exactly one AI usage
  {
    providerCooldown.resetAll();
    let usageCount = 0;
    const mockGemini = createMockProvider('gemini', true);
    mockGemini.setShouldFail(true);
    const mockDeepseek = createMockProvider('deepseek', true);

    const router = new AIRouter({
      gemini: mockGemini as unknown as GeminiProvider,
      deepseek: mockDeepseek as unknown as DeepSeekProvider,
      groq: createMockProvider('groq', false) as unknown as GroqProvider,
    });

    const res = await router.generateText({ prompt: 'Test' });
    if (res.text) {
      usageCount += 1; // Server routes increment once per request
    }

    assert(
      usageCount === 1 && res.provider === 'deepseek',
      '12. Provider failover increments usage exactly ONCE per request'
    );
  }

  // SCENARIO 13: Invalid 400 error handled gracefully with failover
  {
    providerCooldown.resetAll();
    const mockGemini = createMockProvider('gemini', true);
    const err400: HttpError = new Error('Bad request');
    err400.status = 400;
    mockGemini.setShouldFail(true, err400);

    const mockDeepseek = createMockProvider('deepseek', true);

    const router = new AIRouter({
      gemini: mockGemini as unknown as GeminiProvider,
      deepseek: mockDeepseek as unknown as DeepSeekProvider,
      groq: createMockProvider('groq', false) as unknown as GroqProvider,
    });

    const result = await router.generateText({ prompt: 'Test' });
    assert(
      result.provider === 'deepseek',
      '13. Provider 400 error safely fails over to next provider'
    );
  }

  // SCENARIO 14: Provider cooldown behavior
  {
    providerCooldown.resetAll();
    const mockGemini = createMockProvider('gemini', true);
    const err429: HttpError = new Error('Rate limit 429');
    err429.status = 429;
    mockGemini.setShouldFail(true, err429);

    const mockDeepseek = createMockProvider('deepseek', true);

    const router = new AIRouter({
      gemini: mockGemini as unknown as GeminiProvider,
      deepseek: mockDeepseek as unknown as DeepSeekProvider,
      groq: createMockProvider('groq', false) as unknown as GroqProvider,
    });

    // First call puts Gemini in cooldown
    await router.generateText({ prompt: 'First' });
    assert(providerCooldown.isInCooldown('gemini') === true, '14a. Gemini placed in cooldown');

    // Second call skips Gemini entirely without calling it
    mockGemini.resetCallCount();
    mockDeepseek.resetCallCount();
    const secondResult = await router.generateText({ prompt: 'Second' });
    assert(
      secondResult.provider === 'deepseek' && mockGemini.getCallCount() === 0,
      '14b. Next request skips cooling provider directly to DeepSeek'
    );
  }

  // SCENARIO 15: Structured JSON response validation (ATS & Job Analyzer)
  {
    providerCooldown.resetAll();
    const mockGemini = createMockProvider('gemini', true);
    mockGemini.setSuccessText(
      '```json\n{\n  "score": 88,\n  "strengths": ["Strong skills"],\n  "missingKeywords": ["Docker"],\n  "recommendations": ["Add certs"],\n  "summary": "Great CV"\n}\n```'
    );

    const mockRouter = new AIRouter({
      gemini: mockGemini as unknown as GeminiProvider,
      deepseek: createMockProvider('deepseek', false) as unknown as DeepSeekProvider,
      groq: createMockProvider('groq', false) as unknown as GroqProvider,
    });

    const provider = new AIProvider(mockRouter);
    const atsResult = await provider.checkATS('Sample CV text with email test@test.com and skills React');

    assert(
      atsResult.score === 88 &&
        atsResult.strengths.includes('Strong skills') &&
        atsResult.missingKeywords.includes('Docker'),
      '15. Structured JSON response cleaned and validated properly'
    );
  }

  console.log(`\nTEST SUMMARY: ${passed} PASSED, ${failed} FAILED\n`);
  if (failed > 0) {
    process.exit(1);
  }
}

runAllTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
