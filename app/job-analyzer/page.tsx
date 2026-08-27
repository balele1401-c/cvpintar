'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { PaywallModal } from '@/components/paywall/paywall-modal';
import {
  FileCheck2,
  Sparkles,
  CheckCircle2,
  Key,
  Lightbulb,
} from 'lucide-react';

import { JobAnalysisResult, UserPlan } from '@/types';

export default function JobAnalyzerPage() {
  const router = useRouter();
  const [jobDesc, setJobDesc] = useState<string>('');
  const [plan, setPlan] = useState<UserPlan>('free');
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<JobAnalysisResult | null>(null);
  const [isPaywallOpen, setIsPaywallOpen] = useState<boolean>(false);

  useEffect(() => {
    async function checkAuth() {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push('/login');
        return;
      }

      setUserEmail(session.user.email || null);

      const { data: profile } = await supabase
        .from('profiles')
        .select('plan')
        .eq('user_id', session.user.id)
        .single();

      if (profile) {
        setPlan(profile.plan as UserPlan);
        if (profile.plan !== 'pro') {
          setIsPaywallOpen(true);
        }
      }
    }

    checkAuth();
  }, [router]);

  const handleAnalyzeJob = async () => {
    if (plan !== 'pro') {
      setIsPaywallOpen(true);
      return;
    }

    if (!jobDesc.trim()) {
      alert('Silakan tempel teks deskripsi lowongan kerja terlebih dahulu.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/ai/job-analyzer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDescription: jobDesc }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (data.isProRequired) {
          setIsPaywallOpen(true);
        } else {
          alert(data.error || 'Gagal menganalisis lowongan.');
        }
        return;
      }

      setResult(data);
    } catch {
      alert('Terjadi kesalahan saat memproses lowongan.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar userEmail={userEmail} userPlan={plan} />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Job Description Match Analyzer
            </h1>
            <Badge variant="pro">PRO</Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Ekstrak kata kunci wajib, keahlian utama, dan rekomendasi fokus CV dari deskripsi lowongan kerja.
          </p>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-sm font-bold text-slate-900 mb-2">
              Tempel Deskripsi Lowongan Pekerjaan
            </h2>
            <Textarea
              rows={6}
              value={jobDesc}
              onChange={(e) => setJobDesc(e.target.value)}
              placeholder="Contoh: Kami sedang mencari Junior Web Developer yang menguasai React, Tailwind CSS, dan REST API. Memiliki pemahaman tentang Git dan metodologi Agile..."
            />
            <div className="mt-4 flex justify-end">
              <Button
                variant="accent"
                size="md"
                onClick={handleAnalyzeJob}
                isLoading={isLoading}
                leftIcon={<Sparkles className="w-4 h-4" />}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                Ekstrak Kata Kunci & Analisis
              </Button>
            </div>
          </Card>

          {result && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <Card className="p-6 bg-slate-900 text-white">
                <span className="text-xs text-indigo-400 font-bold uppercase tracking-wider">
                  Target Role Terdeteksi
                </span>
                <h3 className="text-xl font-bold mt-1">{result.role}</h3>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-5">
                  <h4 className="text-xs font-bold uppercase text-slate-500 flex items-center gap-1.5 mb-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Keahlian Wajib (Required)
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {result.requiredSkills.map((s, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </Card>

                <Card className="p-5">
                  <h4 className="text-xs font-bold uppercase text-slate-500 flex items-center gap-1.5 mb-3">
                    <Key className="w-4 h-4 text-amber-500" /> Kata Kunci Penting
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {result.importantKeywords.map((k, idx) => (
                      <Badge key={idx} variant="primary" className="text-xs">
                        {k}
                      </Badge>
                    ))}
                  </div>
                </Card>
              </div>

              <Card className="p-5">
                <h4 className="text-xs font-bold uppercase text-slate-500 flex items-center gap-1.5 mb-3">
                  <Lightbulb className="w-4 h-4 text-blue-600" /> Rekomendasi Penyesuaian CV
                </h4>
                <ul className="space-y-2 text-xs text-slate-700">
                  {result.cvRecommendations.map((r, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          )}
        </div>
      </main>

      <Footer />

      <PaywallModal
        isOpen={isPaywallOpen}
        onClose={() => setIsPaywallOpen(false)}
        featureName="Job Description Analyzer"
        featureDescription="Fitur Job Description Match Analyzer eksklusif untuk pelanggan CVPintar Pro."
      />
    </div>
  );
}
