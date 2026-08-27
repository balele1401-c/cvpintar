// ====================================================================
// KERJAAI AI MULTI-PROVIDER TYPES & SCHEMAS (SERVER-SIDE ONLY)
// ====================================================================

export type AIProviderName = 'gemini' | 'deepseek' | 'groq' | 'fallback';

export interface GenerateTextOptions {
  systemPrompt?: string;
  prompt: string;
  temperature?: number;
  maxTokens?: number;
  timeoutMs?: number;
}

export interface ProviderExecutionResult {
  text: string;
  provider: AIProviderName;
  model: string;
  latencyMs: number;
}

export interface ATSAnalysisResult {
  score: number;
  strengths: string[];
  missingKeywords: string[];
  recommendations: string[];
  summary: string;
}

export interface JobAnalysisResult {
  role: string;
  requiredSkills: string[];
  preferredSkills: string[];
  importantKeywords: string[];
  cvRecommendations: string[];
}

export interface InterviewQA {
  category: string;
  q: string;
  a: string;
}
