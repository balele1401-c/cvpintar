'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

import { PaywallModal } from '@/components/paywall/paywall-modal';
import {
  Target,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  FileText,
} from 'lucide-react';
import { ATSAnalysisResult, CV, UserPlan } from '@/types';

export default function ATSCheckerPage() {
  const router = useRouter();
  const [cvs, setCvs] = useState<CV[]>([]);
  const [selectedCvId, setSelectedCvId] = useState<string>('');
  const [cvText, setCvText] = useState<string>('');
  const [targetJob, setTargetJob] = useState<string>('');
  const [plan, setPlan] = useState<UserPlan>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('kerjaai_user_plan') as UserPlan) || 'free';
    }
    return 'free';
  });
  const [userEmail, setUserEmail] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('kerjaai_user_email') || null;
    }
    return null;
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [analysis, setAnalysis] = useState<ATSAnalysisResult | null>(null);
  const [isPaywallOpen, setIsPaywallOpen] = useState<boolean>(false);

  const extractCvText = (cvItem: CV) => {
    const c = cvItem.content_json;
    const textParts = [
      `Nama: ${c.personalInfo?.fullName || ''}`,
      `Profesi: ${c.personalInfo?.professionalTitle || ''}`,
      `Ringkasan: ${c.personalInfo?.summary || ''}`,
      `Pendidikan: ${c.education?.map((e) => `${e.institution} - ${e.degree} ${e.fieldOfStudy}`).join(', ') || ''}`,
      `Pengalaman: ${c.experience?.map((e) => `${e.position} di ${e.company}. ${e.description}`).join('\n') || ''}`,
      `Keahlian: ${c.skills?.map((s) => s.name).join(', ') || ''}`,
    ];
    setCvText(textParts.join('\n\n'));
  };

  useEffect(() => {
    async function loadData() {
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

      const { data: cvsData } = await supabase
        .from('cvs')
        .select('*')
        .eq('user_id', session.user.id);

      if (cvsData && cvsData.length > 0) {
        setCvs(cvsData as CV[]);
        setSelectedCvId(cvsData[0].id);
        extractCvText(cvsData[0] as CV);
      }
    }

    loadData();
  }, [router]);

  const handleSelectCV = (e: React.ChangeEvent<HTMLSelectElement>) => {

    const id = e.target.value;
    setSelectedCvId(id);
    const chosen = cvs.find((item) => item.id === id);
    if (chosen) {
      extractCvText(chosen);
    }
  };

  const handleAnalyze = async () => {
    if (plan !== 'pro') {
      setIsPaywallOpen(true);
      return;
    }

    if (!cvText.trim()) {
      alert('Teks CV tidak boleh kosong.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/ai/ats-checker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cvText, targetJob }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (data.isProRequired) {
          setIsPaywallOpen(true);
        } else {
          alert(data.error || 'Gagal menganalisis skor ATS.');
        }
        return;
      }

      setAnalysis(data);
    } catch {
      alert('Terjadi kesalahan saat memproses ATS Checker.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar userEmail={userEmail} userPlan={plan} />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                <Target className="w-5 h-5" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                ATS Score Checker
              </h1>
              <Badge variant="pro">PRO</Badge>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Simulasikan algoritma parser ATS perusahaan untuk memeriksa keterbacaan dan kata kunci CV Anda.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Input Panel */}
          <div className="lg:col-span-5 space-y-4">
            <Card className="p-5">
              <h2 className="text-sm font-bold text-slate-900 mb-3">
                1. Pilih atau Masukkan Data CV
              </h2>

              {cvs.length > 0 && (
                <div className="mb-3">
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Gunakan Data dari CV Tersimpan:
                  </label>
                  <select
                    value={selectedCvId}
                    onChange={handleSelectCV}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                  >
                    {cvs.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <Textarea
                label="Teks Dokumen CV"
                rows={8}
                value={cvText}
                onChange={(e) => setCvText(e.target.value)}
                placeholder="Tempel teks CV lengkap Anda di sini..."
              />

              <div className="mt-4">
                <Input
                  label="Target Posisi / Pekerjaan (Opsional)"
                  value={targetJob}
                  onChange={(e) => setTargetJob(e.target.value)}
                  placeholder="Contoh: Junior Frontend Developer"
                />
              </div>

              <div className="mt-5">
                <Button
                  variant="accent"
                  size="md"
                  onClick={handleAnalyze}
                  isLoading={isLoading}
                  leftIcon={<Sparkles className="w-4 h-4" />}
                  className="w-full justify-center bg-blue-600 hover:bg-blue-700"
                >
                  Analisis Skor ATS Sekarang
                </Button>
              </div>
            </Card>
          </div>

          {/* Result Panel */}
          <div className="lg:col-span-7">
            {analysis ? (
              <div className="space-y-4 animate-in fade-in duration-300">
                {/* Score Card */}
                <Card className="p-6 bg-gradient-to-br from-slate-900 to-slate-850 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Hasil Analisis ATS
                      </span>
                      <h2 className="text-2xl font-bold mt-1">Estimasi Kesiapan ATS</h2>
                    </div>
                    <div className="text-right">
                      <span className="text-4xl font-extrabold text-blue-400">
                        {analysis.score}
                      </span>
                      <span className="text-slate-400 text-sm"> / 100</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 mt-4 leading-relaxed bg-white/10 p-3 rounded-lg border border-white/10">
                    {analysis.summary}
                  </p>
                </Card>

                {/* Strengths */}
                <Card className="p-5">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Kelebihan Format Terdeteksi
                  </h3>
                  <ul className="space-y-2 text-xs text-slate-700">
                    {analysis.strengths.map((str, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </Card>

                {/* Missing Keywords */}
                <Card className="p-5">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    Kata Kunci & Aspek yang Perlu Ditambahkan
                  </h3>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {analysis.missingKeywords.map((kw, idx) => (
                      <Badge key={idx} variant="warning" className="text-xs py-1">
                        ! {kw}
                      </Badge>
                    ))}
                  </div>
                </Card>

                {/* Recommendations */}
                <Card className="p-5">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
                    <Lightbulb className="w-4 h-4 text-blue-600" />
                    Rekomendasi Perbaikan
                  </h3>
                  <ul className="space-y-2 text-xs text-slate-700">
                    {analysis.recommendations.map((rec, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>
            ) : (
              <Card className="p-12 text-center border-dashed border-2 border-slate-300">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Hasil Analisis Akan Ditampilkan di Sini
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Pilih data CV Anda di sebelah kiri lalu klik tombol analisis untuk melihat skor dan rekomendasi kata kunci.
                </p>
              </Card>
            )}
          </div>
        </div>
      </main>

      <Footer />

      <PaywallModal
        isOpen={isPaywallOpen}
        onClose={() => setIsPaywallOpen(false)}
        featureName="ATS Score Checker"
        featureDescription="Fitur simulasi ATS Score & Keyword Checker eksklusif untuk pengguna CVPintar Pro."
      />
    </div>
  );
}
