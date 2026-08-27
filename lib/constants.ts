import { FeatureAccess, TemplateId, UserPlan } from '@/types';
import { templateRegistry, FREE_TEMPLATE_LIMIT } from '@/lib/templates/registry';

// ==========================================
// BUSINESS CONSTANTS & ENVIRONMENT-AWARE PRICING
// ==========================================
export const APP_NAME = 'CVPintar';
export const APP_TAGLINE = 'Buat CV Profesional dengan AI dalam Hitungan Menit.';

// Business Constants & Pricing
export const PRO_PRICE_IDR = 25000;
export const PRO_PRICE_RAW_LABEL = 'Rp25.000';
export const PRO_PRICE_LABEL = 'Rp25.000 / bulan';

// ==========================================
// FEATURE ACCESS & USAGE LIMIT MATRIX
// ==========================================
export const FREE_LIMITS: FeatureAccess = {
  maxCVs: 1,
  allowedTemplates: templateRegistry.getFreeTemplates().map((t) => t.id),
  aiDailyLimit: 5,
  atsChecker: false,
  jobAnalyzer: false,
  coverLetter: false,
  interviewPrep: true, // Limited
  watermarkFree: false,
};

export const PRO_LIMITS: FeatureAccess = {
  maxCVs: 9999, // Unlimited
  allowedTemplates: templateRegistry.getAll().map((t) => t.id),
  aiDailyLimit: 100, // Generous fair-use limit
  atsChecker: true,
  jobAnalyzer: true,
  coverLetter: true,
  interviewPrep: true,
  watermarkFree: true,
};

export function getFeatureLimits(plan: UserPlan): FeatureAccess {
  return plan === 'pro'
    ? {
        ...PRO_LIMITS,
        allowedTemplates: templateRegistry.getAll().map((t) => t.id),
      }
    : {
        ...FREE_LIMITS,
        allowedTemplates: templateRegistry.getFreeTemplates().map((t) => t.id),
      };
}

export function canUseTemplate(plan: UserPlan, templateId: TemplateId): boolean {
  return templateRegistry.canUserAccess(plan, templateId);
}

export { FREE_TEMPLATE_LIMIT };
