// ====================================================================
// KERJAAI SCALABLE TEMPLATE REGISTRY & ENGINE
// ====================================================================
// Architectural principle: Open, expandable registry capable of scaling to
// 100+, 500+, 1000+ templates without modifying CV Builder core.

import { UserPlan } from '@/types';
import { CVTemplateMetadata, TemplateFilterOptions } from './types';
import { buildTemplateCatalog } from './catalog';

// Centralized Free User Template Limit (Expanded to 30 including colorful & photo Canva/Pinterest designs)
export const FREE_TEMPLATE_LIMIT = 30;


class TemplateRegistry {
  private templates: Map<string, CVTemplateMetadata> = new Map();

  constructor() {
    this.registerInitialTemplates();
  }

  /**
   * Register an individual template into the scalable catalog
   */
  register(template: CVTemplateMetadata): void {
    this.templates.set(template.id, template);
  }

  /**
   * Get template by ID, falls back to 'classic' if not found
   */
  get(id: string): CVTemplateMetadata {
    const found = this.templates.get(id);
    if (found) return found;

    // Fallback to classic
    const classic = this.templates.get('classic');
    if (classic) return classic;

    // Guaranteed fallback
    return Array.from(this.templates.values())[0];
  }

  /**
   * Return all registered templates in catalog
   */
  getAll(): CVTemplateMetadata[] {
    return Array.from(this.templates.values());
  }

  /**
   * Return templates accessible to Free tier users (within FREE_TEMPLATE_LIMIT)
   */
  getFreeTemplates(): CVTemplateMetadata[] {
    return this.getAll()
      .filter((t) => !t.isPro)
      .slice(0, FREE_TEMPLATE_LIMIT);
  }

  /**
   * Return all Pro templates
   */
  getProTemplates(): CVTemplateMetadata[] {
    return this.getAll().filter((t) => t.isPro);
  }

  /**
   * Server and client authorization helper
   * Pro users can access 100% of templates.
   * Free users can only access allowed non-pro templates.
   */
  canUserAccess(plan: UserPlan, templateId: string): boolean {
    if (plan === 'pro') return true;

    const template = this.get(templateId);
    if (template.isPro) return false;

    const allowedFree = this.getFreeTemplates().map((t) => t.id);
    return allowedFree.includes(template.id);
  }

  /**
   * Filter, search, and sort templates dynamically for marketplace discovery
   */
  filter(options: TemplateFilterOptions = {}): CVTemplateMetadata[] {
    const {
      search = '',
      category = 'ALL',
      access = 'all',
      isATSOnly = false,
      hasPhotoOnly = false,
      photoFilter = 'all',
      sortBy = 'popularity',
    } = options;

    let list = this.getAll();

    // 1. Search Query
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q) ||
          t.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }

    // 2. Category Filter
    if (category && category !== 'ALL') {
      list = list.filter((t) => t.category === category);
    }

    // 3. Access Tier Filter
    if (access === 'free') {
      list = list.filter((t) => !t.isPro);
    } else if (access === 'pro') {
      list = list.filter((t) => t.isPro);
    }

    // 4. ATS Only Filter
    if (isATSOnly) {
      list = list.filter((t) => t.isATS);
    }

    // 5. Photo Filter
    if (photoFilter === 'with-photo' || hasPhotoOnly) {
      list = list.filter((t) => t.hasPhoto);
    } else if (photoFilter === 'without-photo') {
      list = list.filter((t) => !t.hasPhoto);
    }

    // 6. Sorting
    list = [...list].sort((a, b) => {
      if (sortBy === 'popularity') {
        return (b.popularity || 0) - (a.popularity || 0);
      }
      if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });

    return list;
  }

  /**
   * Initial template collection bootstrap (Loads complete 100-template catalog)
   */
  private registerInitialTemplates(): void {
    const catalog = buildTemplateCatalog();
    for (const template of catalog) {
      this.register(template);
    }
  }
}

export const templateRegistry = new TemplateRegistry();
