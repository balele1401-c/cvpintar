'use client';

import React, { useState, useEffect, useCallback, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CVPreviewRenderer } from '@/components/cv/cv-preview-renderer';
import { TemplateDrawer } from '@/components/cv/template-drawer';
import { PaywallModal } from '@/components/paywall/paywall-modal';
import { templateRegistry } from '@/lib/templates/registry';
import {
  ArrowLeft,
  Download,
  Edit3,
  Sparkles,
  Target,
  ShieldCheck,
  LayoutGrid,
} from 'lucide-react';
import { downloadCvAsPdf } from '@/lib/pdf';

import { CV, CVContent, TemplateId, UserPlan } from '@/types';

interface PreviewCVPageProps {
  params: Promise<{ id: string }>;
}

export default function PreviewCVPage({ params }: PreviewCVPageProps) {
  const resolvedParams = use(params);
  const cvId = resolvedParams.id;
  const router = useRouter();

  const [cv, setCv] = useState<CV | null>(null);
  const [content, setContent] = useState<CVContent | null>(null);
  const [templateId, setTemplateId] = useState<TemplateId>('classic');
  const [plan, setPlan] = useState<UserPlan>('free');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isTemplateDrawerOpen, setIsTemplateDrawerOpen] = useState<boolean>(false);
  const [isPaywallOpen, setIsPaywallOpen] = useState<boolean>(false);
  const [paywallFeature, setPaywallFeature] = useState<string>('');
  const [paywallDesc, setPaywallDesc] = useState<string>('');

  useEffect(() => {
    async function loadCV() {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          router.push('/login');
          return;
        }

        const { data: profileData } = await supabase
          .from('profiles')
          .select('plan')
          .eq('user_id', user.id)
          .single();

        if (profileData) {
          setPlan(profileData.plan as UserPlan);
        }

        const { data: cvData, error } = await supabase
          .from('cvs')
          .select('*')
          .eq('id', cvId)
          .eq('user_id', user.id)
          .single();

        if (error || !cvData) {
          router.push('/dashboard');
          return;
        }

        setCv(cvData as CV);
        setTemplateId(cvData.template_id as TemplateId);
        setContent(cvData.content_json as CVContent);
      } catch (err) {
        console.error('Error loading CV preview:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadCV();
  }, [cvId, router]);

  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  const handleDownloadPdf = useCallback(async () => {
    try {
      setIsDownloading(true);
      const safeTitle = (cv?.title || 'CV').replace(/[^a-zA-Z0-9_-]/g, '_');
      const safeName = (content?.personalInfo?.fullName || 'CVPintar').replace(/[^a-zA-Z0-9_-]/g, '_');
      await downloadCvAsPdf({
        filename: `${safeTitle}_${safeName}.pdf`,
        elementId: 'cv-printable-area',
      });
    } catch (err) {
      console.error('Download PDF error:', err);
      // Fallback to window.print() if canvas rendering fails
      window.print();
    } finally {
      setIsDownloading(false);
    }
  }, [cv, content]);

  // Auto-trigger direct download when opened with ?download=true
  useEffect(() => {
    if (!isLoading && content) {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('download') === 'true') {
        const timer = setTimeout(() => {
          handleDownloadPdf();
        }, 400);
        return () => clearTimeout(timer);
      } else if (urlParams.get('print') === 'true') {
        const timer = setTimeout(() => window.print(), 500);
        return () => clearTimeout(timer);
      }
    }
  }, [isLoading, content, handleDownloadPdf]);

  const handleSelectTemplate = async (newTemplate: TemplateId) => {
    if (!templateRegistry.canUserAccess(plan, newTemplate)) {
      const templateMeta = templateRegistry.get(newTemplate);
      setPaywallFeature(`Template ${templateMeta.name}`);
      setPaywallDesc(
        `Template "${templateMeta.name}" adalah template premium CVPintar Pro. Upgrade sekarang untuk menggunakannya tanpa watermark.`
      );
      setIsPaywallOpen(true);
      return;
    }

    setTemplateId(newTemplate);
    if (cv) {
      const supabase = createClient();
      await supabase
        .from('cvs')
        .update({ template_id: newTemplate, updated_at: new Date().toISOString() })
        .eq('id', cv.id);
    }
  };

  if (isLoading || !content) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const currentTemplate = templateRegistry.get(templateId);

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 print:bg-white">
      {/* Top Action Bar (Hidden on Print) */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs px-4 sm:px-6 py-3 no-print">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-900">
                <ArrowLeft className="w-4 h-4 mr-1" /> Kembali
              </Button>
            </Link>
            <div className="h-5 w-px bg-slate-200 hidden sm:block" />
            <h1 className="font-bold text-sm text-slate-900 line-clamp-1 hidden sm:block">
              {cv?.title || 'Preview CV'}
            </h1>
          </div>

          {/* Template Switcher Button */}
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsTemplateDrawerOpen(true)}
              leftIcon={<LayoutGrid className="w-3.5 h-3.5 text-blue-600" />}
              className="text-xs font-semibold"
            >
              Ganti Desain
            </Button>

            <Link href={`/cv/${cvId}/edit`}>
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<Edit3 className="w-3.5 h-3.5 text-blue-600" />}
                className="font-bold text-blue-700 bg-blue-50/80 hover:bg-blue-100 border-blue-200 shadow-2xs"
              >
                Edit CV
              </Button>
            </Link>

            <Button
              variant="accent"
              size="sm"
              onClick={handleDownloadPdf}
              isLoading={isDownloading}
              leftIcon={<Download className="w-4 h-4" />}
              className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm font-semibold"
            >
              {isDownloading ? 'Mengunduh PDF...' : 'Download PDF'}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Preview Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-8 print:p-0">
        {/* ATS Readiness Banner for Free vs Pro */}
        <div className="no-print mb-6 bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-slate-900">
                  {currentTemplate.isATS ? 'Format Standar ATS Terpenuhi' : 'Desain Visual Kreatif'}
                </span>
                {currentTemplate.isATS ? (
                  <Badge variant="success" className="text-[10px]">
                    ATS 100%
                  </Badge>
                ) : (
                  <Badge variant="primary" className="text-[10px]">
                    Visual Portfolio
                  </Badge>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {currentTemplate.description}
              </p>
            </div>
          </div>

          {plan === 'free' ? (
            <Link href="/pricing">
              <Button
                variant="outline"
                size="sm"
                className="text-xs border-blue-200 text-blue-700 bg-blue-50/50 hover:bg-blue-50"
                leftIcon={<Sparkles className="w-3.5 h-3.5" />}
              >
                Hapus Watermark dengan Pro
              </Button>
            </Link>
          ) : (
            <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
              <ShieldCheck className="w-4 h-4" />
              <span>Bebas Watermark (Pro Aktif)</span>
            </div>
          )}
        </div>

        {/* Paper Sheet Preview Area */}
        <div className="bg-white shadow-2xl rounded-xl print:shadow-none print:rounded-none overflow-hidden">
          <CVPreviewRenderer data={content} templateId={templateId} plan={plan} />
        </div>
      </main>

      {/* Template Switcher Drawer / Modal */}
      <TemplateDrawer
        isOpen={isTemplateDrawerOpen}
        currentTemplateId={templateId}
        userPlan={plan}
        onClose={() => setIsTemplateDrawerOpen(false)}
        onSelectTemplate={(id) => handleSelectTemplate(id)}
      />

      {/* Paywall Modal */}
      <PaywallModal
        isOpen={isPaywallOpen}
        onClose={() => setIsPaywallOpen(false)}
        featureName={paywallFeature}
        featureDescription={paywallDesc}
      />
    </div>
  );
}
