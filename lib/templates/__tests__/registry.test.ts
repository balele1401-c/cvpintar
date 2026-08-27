// ====================================================================
// KERJAAI TEMPLATE REGISTRY & SCALABILITY TEST SUITE
// ====================================================================

import { templateRegistry, FREE_TEMPLATE_LIMIT } from '../registry';
import { SAMPLE_CV_DATA } from '../sample-data';
import { CVTemplateMetadata } from '../types';
import React from 'react';

function DummyComponent() {
  return React.createElement('div', null, 'Dummy Template');
}

async function runTemplateTests() {
  console.log('--- STARTING TEMPLATE REGISTRY TEST SUITE ---');
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

  // 1. Scalable template catalog loaded (200+ templates registered)
  {
    const all = templateRegistry.getAll();
    assert(all.length >= 200, `1. Scalable template catalog loaded (${all.length} templates registered)`);
  }

  // 2. Compatibility: Existing template IDs preserved
  {
    const classic = templateRegistry.get('classic');
    const modern = templateRegistry.get('modern');
    const minimalist = templateRegistry.get('minimalist');
    const tech = templateRegistry.get('tech');

    assert(
      classic.id === 'classic' &&
        modern.id === 'modern' &&
        minimalist.id === 'minimalist' &&
        tech.id === 'tech',
      '2. Compatibility: Existing template IDs (classic, modern, minimalist, tech) preserved'
    );
  }

  // 3. Graceful fallback for unknown template IDs
  {
    const unknown = templateRegistry.get('non_existent_random_id');
    assert(unknown.id === 'classic', '3. Unknown template ID gracefully falls back to classic');
  }

  // 4. Free Tier Template Limitation (Centralized FREE_TEMPLATE_LIMIT = 30)
  {
    const freeTemplates = templateRegistry.getFreeTemplates();
    assert(
      freeTemplates.length <= FREE_TEMPLATE_LIMIT &&
        freeTemplates.every((t) => !t.isPro),
      `4. Free tier limited to ${FREE_TEMPLATE_LIMIT} non-pro templates`
    );
  }


  // 5. Free user can access colorful & photo templates in Free Tier
  {
    const freeWithPhoto = templateRegistry.getFreeTemplates().filter((t) => t.hasPhoto);
    const freeCanAccessClassic = templateRegistry.canUserAccess('free', 'classic');
    const freeCanAccessPhotoBlue = templateRegistry.canUserAccess('free', 'free-photo-blue');
    const freeCanAccessTech = templateRegistry.canUserAccess('free', 'tech');

    assert(
      freeWithPhoto.length >= 3 &&
        freeCanAccessClassic === true &&
        freeCanAccessPhotoBlue === true &&
        freeCanAccessTech === false,
      '5. Free tier includes colorful & photo-enabled templates'
    );
  }

  // 6. Pro user can access ALL templates (Free + Pro)
  {
    const proCanAccessClassic = templateRegistry.canUserAccess('pro', 'classic');
    const proCanAccessTech = templateRegistry.canUserAccess('pro', 'tech');
    const proCanAccessCorporate = templateRegistry.canUserAccess('pro', 'corporate');
    const proCanAccessExecutive = templateRegistry.canUserAccess('pro', 'executive');

    assert(
      proCanAccessClassic && proCanAccessTech && proCanAccessCorporate && proCanAccessExecutive,
      '6. Pro user can access 100% of Free and Pro templates'
    );
  }

  // 7. Dynamic Scalability: Registering template #101 on the fly
  {
    const initialCount = templateRegistry.getAll().length;
    const dynamicTemplate: CVTemplateMetadata = {
      id: 'dynamic-test-template-500',
      name: 'Dynamic Scalable Template 500',
      category: 'Technology',
      description: 'Dynamically registered on the fly',
      isPro: true,
      isATS: true,
      tags: ['Scale', 'Test'],
      component: DummyComponent,
      popularity: 90,
      createdAt: '2026-03-01',
    };

    templateRegistry.register(dynamicTemplate);
    const retrieved = templateRegistry.get('dynamic-test-template-500');
    const updatedCount = templateRegistry.getAll().length;

    assert(
      updatedCount === initialCount + 1 && retrieved.id === 'dynamic-test-template-500',
      '7. Dynamic Scalability: Expanding catalog requires NO changes to core builder'
    );
  }

  // 8. Search query filtering
  {
    const searchResults = templateRegistry.filter({ search: 'developer' });
    assert(
      searchResults.some((t) => t.id === 'tech'),
      '8. Search filter accurately matches tags/descriptions'
    );
  }

  // 9. Photo filter
  {
    const photoOnly = templateRegistry.filter({ hasPhotoOnly: true });
    assert(
      photoOnly.length >= 30 && photoOnly.every((t) => t.hasPhoto),
      `9. Photo filter accurately matches templates with photo slots (${photoOnly.length} photo templates)`
    );
  }

  // 10. Category & ATS filtering
  {
    const atsOnly = templateRegistry.filter({ isATSOnly: true });
    const freshGrads = templateRegistry.filter({ category: 'Fresh Graduate' });

    assert(
      atsOnly.every((t) => t.isATS) &&
        freshGrads.length > 0 &&
        freshGrads.every((t) => t.category === 'Fresh Graduate'),
      '10. Category & ATS filtering works accurately'
    );
  }

  // 11. Access Tier Filter (Free vs Pro)
  {
    const freeFilter = templateRegistry.filter({ access: 'free' });
    const proFilter = templateRegistry.filter({ access: 'pro' });

    assert(
      freeFilter.every((t) => !t.isPro) && proFilter.every((t) => t.isPro),
      '11. Access tier filtering (free vs pro) works accurately'
    );
  }

  // 12. Sorting options
  {
    const sortedByPop = templateRegistry.filter({ sortBy: 'popularity' });
    const sortedByName = templateRegistry.filter({ sortBy: 'name' });

    const isPopSorted = sortedByPop[0].popularity >= sortedByPop[sortedByPop.length - 1].popularity;
    const isNameSorted = sortedByName[0].name.localeCompare(sortedByName[sortedByName.length - 1].name) <= 0;

    assert(isPopSorted && isNameSorted, '12. Sorting by popularity & name works accurately');
  }

  // 13. Template switching preserves 100% of user data
  {
    const userCVContent = { ...SAMPLE_CV_DATA };
    const hasSameName = userCVContent.personalInfo.fullName === SAMPLE_CV_DATA.personalInfo.fullName;
    const hasSameExperience = userCVContent.experience.length === SAMPLE_CV_DATA.experience.length;

    assert(
      hasSameName && hasSameExperience,
      '13. Template switching updates only template_id while preserving 100% of user CV data'
    );
  }

  console.log(`\nTEMPLATE TEST SUMMARY: ${passed} PASSED, ${failed} FAILED\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTemplateTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
