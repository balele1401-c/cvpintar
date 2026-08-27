// ==========================================
// KERJAAI CORE TYPES & INTERFACES
// ==========================================

export type UserPlan = 'free' | 'pro';

export interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
  plan: UserPlan;
  created_at: string;
  updated_at: string;
}

// ------------------------------------------
// CV Schema Types
// ------------------------------------------
export interface PersonalInfo {
  fullName: string;
  professionalTitle: string;
  email: string;
  phone: string;
  location: string;
  linkedIn?: string;
  github?: string;
  portfolio?: string;
  summary: string;
  photoUrl?: string;
}


export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  current?: boolean;
  description?: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location?: string;
  startDate: string;
  endDate: string;
  current?: boolean;
  description: string;
  achievements?: string[];
}

export interface Skill {
  id: string;
  name: string;
  category?: 'technical' | 'soft' | 'language' | 'tool';
  level?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  url?: string;
  startDate?: string;
  endDate?: string;
}

export interface Organization {
  id: string;
  organization: string;
  position: string;
  period: string;
  description?: string;
}

export interface CVContent {
  personalInfo: PersonalInfo;
  education: Education[];
  experience: Experience[];
  skills: Skill[];
  projects: Project[];
  organizations: Organization[];
}

export type TemplateId = string;

export interface CV {
  id: string;
  user_id: string;
  title: string;
  template_id: TemplateId;
  content_json: CVContent;
  created_at: string;
  updated_at: string;
}

// ------------------------------------------
// Subscription & Payment Types
// ------------------------------------------
export type SubscriptionStatus = 'free' | 'active' | 'expired' | 'cancelled';

export interface Subscription {
  id: string;
  user_id: string;
  plan: UserPlan;
  status: SubscriptionStatus;
  provider: 'doku';
  provider_reference: string | null;
  started_at: string | null;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
}

export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'EXPIRED' | 'CANCELLED';

export interface Payment {
  id: string;
  user_id: string;
  subscription_id: string | null;
  provider: 'doku';
  provider_reference: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
}

// ------------------------------------------
// AI Usage & Feature Types
// ------------------------------------------
export type AIFeatureType =
  | 'cv_writer'
  | 'rewrite'
  | 'summary'
  | 'ats_checker'
  | 'job_analyzer'
  | 'cover_letter'
  | 'interview_prep';

export interface AIUsage {
  id: string;
  user_id: string;
  feature: AIFeatureType;
  usage_count: number;
  usage_date: string;
  created_at: string;
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


// ------------------------------------------
// Feature Access & Matrix Types
// ------------------------------------------
export interface FeatureAccess {
  maxCVs: number;
  allowedTemplates: TemplateId[];
  aiDailyLimit: number;
  atsChecker: boolean;
  jobAnalyzer: boolean;
  coverLetter: boolean;
  interviewPrep: boolean;
  watermarkFree: boolean;
}
