'use client';

import React, { useEffect, useState, useRef, use } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { CVContent, UserPlan } from '@/types';
import { getFeatureLimits } from '@/lib/constants';
import { templateRegistry } from '@/lib/templates/registry';

interface NewCVPageProps {
  searchParams?: Promise<{ template?: string }>;
}

const defaultCVContent: CVContent = {
  personalInfo: {
    fullName: '',
    professionalTitle: '',
    email: '',
    phone: '',
    location: 'Jakarta, Indonesia',
    linkedIn: '',
    github: '',
    portfolio: '',
    summary: '',
  },
  education: [
    {
      id: 'edu-1',
      institution: '',
      degree: 'Sarjana (S1)',
      fieldOfStudy: '',
      startDate: '2020',
      endDate: '2024',
      current: false,
      description: '',
    },
  ],
  experience: [
    {
      id: 'exp-1',
      company: '',
      position: '',
      location: 'Jakarta',
      startDate: '2023',
      endDate: '2024',
      current: false,
      description: '',
    },
  ],
  skills: [
    { id: 'skill-1', name: 'Komunikasi' },
    { id: 'skill-2', name: 'Microsoft Office' },
  ],
  projects: [],
  organizations: [],
};

export default function NewCVPage({ searchParams }: NewCVPageProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const resolvedParams = searchParams ? use(searchParams) : undefined;
  const requestedTemplate = resolvedParams?.template || 'classic';
  const isCreatingRef = useRef<boolean>(false);

  useEffect(() => {
    if (isCreatingRef.current) return;
    isCreatingRef.current = true;

    async function createInitialCV() {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          router.push('/login?next=/cv/new');
          return;
        }

        // Check user plan & limits
        const { data: profile } = await supabase
          .from('profiles')
          .select('plan')
          .eq('user_id', user.id)
          .single();

        const plan = (profile?.plan as UserPlan) || 'free';
        const limits = getFeatureLimits(plan);

        const { count } = await supabase
          .from('cvs')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);

        if (count !== null && count >= limits.maxCVs && plan === 'free') {
          router.push('/pricing?reason=cv_limit');
          return;
        }

        // Verify template access authorization
        let templateToUse = requestedTemplate;
        const canAccess = templateRegistry.canUserAccess(plan, requestedTemplate);
        if (!canAccess) {
          templateToUse = 'classic';
        }

        // Insert new initial CV
        const { data: newCV, error: insertError } = await supabase
          .from('cvs')
          .insert({
            user_id: user.id,
            title: `CV Saya (${(count || 0) + 1})`,
            template_id: templateToUse,
            content_json: {
              ...defaultCVContent,
              personalInfo: {
                ...defaultCVContent.personalInfo,
                fullName: user.user_metadata?.full_name || '',
                email: user.email || '',
              },
            },
          })
          .select()
          .single();

        if (insertError) throw insertError;

        if (newCV) {
          router.push(`/cv/${newCV.id}/edit`);
        }
      } catch (err: unknown) {
        console.error('Error creating new CV:', err);
        setError('Gagal membuat draft CV baru. Silakan coba lagi.');
      }
    }

    createInitialCV();
  }, [router, requestedTemplate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      {error ? (
        <div className="bg-white p-6 rounded-2xl border border-red-200 text-center max-w-sm">
          <p className="text-sm text-red-600 mb-4">{error}</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold"
          >
            Kembali ke Dashboard
          </button>
        </div>
      ) : (
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-medium text-slate-600">
            Menyiapkan lembar kerja CV baru Anda...
          </p>
        </div>
      )}
    </div>
  );
}
