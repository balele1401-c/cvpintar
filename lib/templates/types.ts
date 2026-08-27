// ====================================================================
// KERJAAI SCALABLE TEMPLATE LIBRARY TYPES & SCHEMAS
// ====================================================================

import React from 'react';
import { CVContent } from '@/types';

export type TemplateCategory =
  | 'ATS'
  | 'Modern'
  | 'Minimal'
  | 'Professional'
  | 'Corporate'
  | 'Executive'
  | 'Technology'
  | 'Creative'
  | 'Marketing'
  | 'Finance'
  | 'Healthcare'
  | 'Academic'
  | 'Fresh Graduate';

export interface CVTemplateMetadata {
  id: string;
  name: string;
  category: TemplateCategory;
  description: string;
  isPro: boolean;
  isATS: boolean;
  hasPhoto?: boolean;
  tags: string[];
  component: React.ComponentType<{ data: CVContent }>;
  popularity: number; // 1 - 100 for sorting
  featured?: boolean;
  createdAt: string;
  accentColor?: string;
}

export interface TemplateFilterOptions {
  search?: string;
  category?: TemplateCategory | 'ALL';
  access?: 'all' | 'free' | 'pro';
  isATSOnly?: boolean;
  hasPhotoOnly?: boolean;
  photoFilter?: 'all' | 'with-photo' | 'without-photo';
  sortBy?: 'popularity' | 'newest' | 'name';
}

