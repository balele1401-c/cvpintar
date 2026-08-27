'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { PaywallModal } from '@/components/paywall/paywall-modal';
import {
  FileText,
  Plus,
  Sparkles,
  Zap,
  Trash2,
  Edit3,
  Eye,
  Clock,
  Target,
  FileCheck2,
  MessageSquare,
  ArrowRight,
  Copy,
} from 'lucide-react';

import { CV, Profile, UserPlan } from '@/types';
import { getFeatureLimits, PRO_PRICE_LABEL } from '@/lib/constants';
import { formatDate } from '@/lib/utils';
import { CVThumbnail } from '@/components/cv/cv-thumbnail';

export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('kerjaai_user_email') || null;
    }
    return null;
  });
  const [cachedPlan] = useState<UserPlan>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('kerjaai_user_plan') as UserPlan) || 'free';
    }
    return 'free';
  });
  const [cvs, setCvs] = useState<CV[]>([]);
  const [aiUsageCount, setAiUsageCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isPaywallOpen, setIsPaywallOpen] = useState<boolean>(false);
  const [paywallFeature, setPaywallFeature] = useState<string>('Batas Jumlah CV');
  const [paywallDescription, setPaywallDescription] = useState<string>(
    'Free Plan dibatasi maksimal membuat 1 CV. Upgrade ke Pro untuk membuat CV tanpa batas.'
  );

  const plan: UserPlan = profile?.plan || cachedPlan || 'free';
  const limits = getFeatureLimits(plan);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const supabase = createClient();
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          router.push('/login');
          return;
        }

        const email = session.user.email || null;
        setUserEmail(email);
        if (email && typeof window !== 'undefined') {
          localStorage.setItem('kerjaai_user_email', email);
        }

        // 1. Fetch user profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', session.user.id)
          .single();

        if (profileData) {
          setProfile(profileData as Profile);
          if (profileData.plan && typeof window !== 'undefined') {
            localStorage.setItem('kerjaai_user_plan', profileData.plan);
          }
        } else {
          // Fallback initial profile
          setProfile({
            id: session.user.id,
            user_id: session.user.id,
            full_name: session.user.user_metadata?.full_name || 'Pengguna',
            avatar_url: null,
            plan: 'free',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
        }

        // 2. Fetch user CVs
        const { data: cvsData } = await supabase
          .from('cvs')
          .select('*')
          .eq('user_id', session.user.id)
          .order('updated_at', { ascending: false });

        if (cvsData) {
          setCvs(cvsData as CV[]);
        }

        // 3. Fetch today's AI usage count
        const todayStr = new Date().toISOString().split('T')[0];
        const { data: usageData } = await supabase
          .from('ai_usage')
          .select('usage_count')
          .eq('user_id', session.user.id)
          .eq('usage_date', todayStr);

        if (usageData && usageData.length > 0) {
          const total = usageData.reduce((acc, curr) => acc + curr.usage_count, 0);
          setAiUsageCount(total);
        }
      } catch (err) {
        console.error('Error loading dashboard:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboardData();
  }, [router]);

  const handleCreateNewCV = () => {
    if (plan === 'free' && cvs.length >= limits.maxCVs) {
      setPaywallFeature('Unlimited CV');
      setPaywallDescription(
        'Akun Free dibatasi maksimal 1 CV. Upgrade ke Pro untuk membuat dan menyimpan CV tanpa batas untuk berbagai jenis lowongan.'
      );
      setIsPaywallOpen(true);
      return;
    }
    router.push('/cv/new');
  };

  const handleDeleteCV = async (cvId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Apakah Anda yakin ingin menghapus CV ini?')) return;

    try {
      const supabase = createClient();
      await supabase.from('cvs').delete().eq('id', cvId);
      setCvs((prev) => prev.filter((item) => item.id !== cvId));
    } catch (err) {
      console.error('Error deleting CV:', err);
      alert('Gagal menghapus CV. Silakan coba lagi.');
    }
  };

  const handleDuplicateCV = async (cv: CV, e: React.MouseEvent) => {
    e.stopPropagation();
    if (plan === 'free' && cvs.length >= limits.maxCVs) {
      setPaywallFeature('Duplikasi CV');
      setPaywallDescription(
        'Duplikasi dan kelola banyak versi CV adalah fitur eksklusif CVPintar Pro.'
      );
      setIsPaywallOpen(true);
      return;
    }

    try {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;

      const { data: newCv } = await supabase
        .from('cvs')
        .insert({
          user_id: session.user.id,
          title: `${cv.title} (Salinan)`,
          template_id: cv.template_id,
          content_json: cv.content_json,
        })
        .select()
        .single();

      if (newCv) {
        setCvs((prev) => [newCv as CV, ...prev]);
      }
    } catch (err) {
      console.error('Error duplicating CV:', err);
    }
  };

  const handleLogout = async () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('kerjaai_user_email');
      localStorage.removeItem('kerjaai_user_plan');
      localStorage.removeItem('kerjaai_user_name');
      localStorage.removeItem('kerjaai_user_avatar');
    }
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  const openProFeature = (featureName: string, desc: string, targetPath: string) => {
    if (plan !== 'pro') {
      setPaywallFeature(featureName);
      setPaywallDescription(desc);
      setIsPaywallOpen(true);
      return;
    }
    router.push(targetPath);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar
        userEmail={userEmail}
        userPlan={plan}
        onLogout={handleLogout}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 space-y-8">
        {/* Header Greeting & Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Halo, {profile?.full_name || 'Job Seeker'} 👋
              </h1>
              <Badge variant={plan === 'pro' ? 'pro' : 'default'} className="uppercase">
                {plan} Plan
              </Badge>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Kelola dokumen CV dan optimalkan lamaran kerja Anda dengan bantuan AI.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {plan !== 'pro' && (
              <Link href="/pricing">
                <Button
                  variant="secondary"
                  size="md"
                  leftIcon={<Sparkles className="w-4 h-4 text-blue-600" />}
                  className="hidden sm:inline-flex border-blue-200 text-blue-700 bg-blue-50/50 hover:bg-blue-50"
                >
                  Upgrade ke Pro
                </Button>
              </Link>
            )}
            <Button
              variant="accent"
              size="md"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={handleCreateNewCV}
              className="bg-blue-600 hover:bg-blue-700 shadow-sm"
            >
              Buat CV Baru
            </Button>
          </div>
        </div>

        {/* Stats & Quota Overview Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Plan */}
          <Card className="p-5 bg-white border-slate-200">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>Paket Saat Ini</span>
              <Sparkles className="w-4 h-4 text-blue-600" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-slate-900 uppercase">
                {plan}
              </span>
              {plan === 'free' && (
                <span className="text-xs text-slate-500">Rp0 / bln</span>
              )}
            </div>
            <div className="mt-2 text-xs text-slate-500 flex items-center justify-between">
              <span>{plan === 'pro' ? 'Akses Penuh AI' : 'Fitur Terbatas'}</span>
              {plan === 'free' && (
                <Link
                  href="/pricing"
                  className="text-blue-600 font-semibold hover:underline text-[11px]"
                >
                  Upgrade
                </Link>
              )}
            </div>
          </Card>

          {/* Card 2: CV Created */}
          <Card className="p-5 bg-white border-slate-200">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>Dokumen CV Dibuat</span>
              <FileText className="w-4 h-4 text-slate-500" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-slate-900">
                {cvs.length}
              </span>
              <span className="text-xs text-slate-500">
                / {plan === 'pro' ? '∞' : `${limits.maxCVs}`} CV
              </span>
            </div>
            <div className="mt-2">
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 transition-all"
                  style={{
                    width:
                      plan === 'pro'
                        ? '20%'
                        : `${Math.min(100, (cvs.length / limits.maxCVs) * 100)}%`,
                  }}
                />
              </div>
            </div>
          </Card>

          {/* Card 3: AI Daily Usage */}
          <Card className="p-5 bg-white border-slate-200">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>Penggunaan AI Hari Ini</span>
              <Zap className="w-4 h-4 text-amber-500" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-slate-900">
                {aiUsageCount}
              </span>
              <span className="text-xs text-slate-500">
                / {limits.aiDailyLimit} kali
              </span>
            </div>
            <div className="mt-2">
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 transition-all"
                  style={{
                    width: `${Math.min(100, (aiUsageCount / limits.aiDailyLimit) * 100)}%`,
                  }}
                />
              </div>
            </div>
          </Card>

          {/* Card 4: ATS Readiness */}
          <Card className="p-5 bg-white border-slate-200">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>Rata-Rata Skor ATS</span>
              <Target className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-emerald-600">
                {cvs.length > 0 ? '88%' : '-'}
              </span>
              <span className="text-xs text-slate-500">Kesiapan Kerja</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-2">
              {cvs.length > 0
                ? 'Format ATS Standard A4'
                : 'Buat CV pertama Anda'}
            </p>
          </Card>
        </div>

        {/* Upgrade Banner for Free Users */}
        {plan !== 'pro' && (
          <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md relative overflow-hidden">
            <div className="space-y-2 relative z-10 text-center sm:text-left">
              <Badge variant="pro" className="bg-white/20 text-white border-white/20">
                <Sparkles className="w-3.5 h-3.5 mr-1" /> Tingkatkan Peluang Lolos
              </Badge>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
                Buka Semua Template Premium & Fitur AI Tanpa Batas
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                Dapatkan ATS Score Checker, Job Description Analyzer, Cover Letter Generator, dan ekspor PDF tanpa watermark hanya {PRO_PRICE_LABEL}.
              </p>
            </div>
            <Link href="/pricing" className="shrink-0 relative z-10 w-full sm:w-auto">
              <Button
                variant="accent"
                size="lg"
                className="w-full justify-center bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-6 shadow-lg shadow-blue-500/30"
                rightIcon={<ArrowRight className="w-4 h-4 ml-1" />}
              >
                Upgrade ke Pro
              </Button>
            </Link>
          </div>
        )}

        {/* Pro AI Tools Quick Launcher */}
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">
            Alat Karir Cerdas (AI Tools)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div
              onClick={() =>
                openProFeature(
                  'ATS Score Checker',
                  'Periksa skor keterbacaan CV Anda terhadap sistem ATS dan dapatkan saran perbaikan kata kunci.',
                  '/ats'
                )
              }
              className="bg-white p-5 rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Target className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  ATS Score Checker
                </h3>
                {plan !== 'pro' && <Badge variant="outline">Pro</Badge>}
              </div>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Analisis kata kunci dan struktur CV Anda terhadap format ATS.
              </p>
            </div>

            <div
              onClick={() =>
                openProFeature(
                  'Job Description Analyzer',
                  'Cocokkan CV Anda secara spesifik dengan lowongan kerja yang sedang Anda lamar.',
                  '/job-analyzer'
                )
              }
              className="bg-white p-5 rounded-xl border border-slate-200 hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  Job Match Analyzer
                </h3>
                {plan !== 'pro' && <Badge variant="outline">Pro</Badge>}
              </div>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Ekstrak kata kunci wajib dari poster lowongan kerja.
              </p>
            </div>

            <div
              onClick={() =>
                openProFeature(
                  'Cover Letter Generator',
                  'Buat surat lamaran kerja yang elegan dan personal untuk HRD dalam hitungan detik.',
                  '/cover-letter'
                )
              }
              className="bg-white p-5 rounded-xl border border-slate-200 hover:border-purple-400 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <FileText className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
                  Cover Letter Generator
                </h3>
                {plan !== 'pro' && <Badge variant="outline">Pro</Badge>}
              </div>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Generate surat lamaran kerja profesional otomatis dari data CV.
              </p>
            </div>

            <div
              onClick={() =>
                openProFeature(
                  'Simulasi Tanya Jawab Interview',
                  'Latih kemampuan interview kerja Anda dengan prediksi pertanyaan HR dan teknis berbasis CV.',
                  '/interview'
                )
              }
              className="bg-white p-5 rounded-xl border border-slate-200 hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                  Interview Preparation
                </h3>
                {plan !== 'pro' && <Badge variant="outline">Pro</Badge>}
              </div>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Prediksi pertanyaan HRD dan panduan jawaban terstruktur.
              </p>
            </div>
          </div>
        </div>

        {/* CV List Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Dokumen CV Saya ({cvs.length})
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Kelola dan edit resume karir profesional Anda kapan saja.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Plus className="w-3.5 h-3.5" />}
              onClick={handleCreateNewCV}
            >
              Tambah CV
            </Button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl border border-slate-200 p-6 h-48 animate-pulse space-y-4"
                >
                  <div className="h-4 bg-slate-200 rounded w-2/3" />
                  <div className="h-3 bg-slate-100 rounded w-1/2" />
                  <div className="h-10 bg-slate-100 rounded w-full mt-8" />
                </div>
              ))}
            </div>
          ) : cvs.length === 0 ? (
            <Card className="p-12 text-center border-dashed border-2 border-slate-300">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
                <FileText className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Belum Ada CV yang Dibuat
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
                Mulai buat CV profesional pertama Anda sekarang. AI kami siap membantu menyusun kalimat pencapaian terbaik Anda.
              </p>
              <div className="mt-6">
                <Button
                  variant="accent"
                  size="md"
                  onClick={handleCreateNewCV}
                  leftIcon={<Plus className="w-4 h-4" />}
                >
                  Buat CV Pertama Sekarang
                </Button>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {cvs.map((cv) => (
                <div
                  key={cv.id}
                  className="group bg-white rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
                >
                  {/* CV Thumbnail Visual Preview */}
                  <div className="p-3 pb-0 bg-slate-50/50">
                    <Link href={`/cv/${cv.id}/preview`} className="block relative group-hover:opacity-95 transition-opacity">
                      <CVThumbnail
                        data={cv.content_json}
                        templateId={cv.template_id || 'classic'}
                        className="shadow-2xs group-hover:shadow-sm transition-all"
                      />
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/5 transition-colors rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <span className="px-3 py-1 bg-white/95 backdrop-blur-sm text-[11px] font-bold text-blue-700 rounded-full shadow-md border border-blue-100">
                          <Eye className="w-3 h-3 inline mr-1" /> Preview
                        </span>
                      </div>
                    </Link>
                  </div>

                  {/* CV Info & Bottom Actions */}
                  <div className="p-3.5 space-y-3 bg-white flex-1 flex flex-col justify-between">
                    <div className="space-y-1">
                      <div className="flex items-start justify-between gap-1.5">
                        <h3 className="font-bold text-xs text-slate-900 line-clamp-1 flex-1" title={cv.title || 'CV Tanpa Judul'}>
                          {cv.title || 'CV Tanpa Judul'}
                        </h3>
                        <Badge variant="outline" className="text-[8px] font-mono capitalize px-1.5 py-0 shrink-0 text-slate-500 bg-slate-50">
                          {(cv.template_id || 'classic').length > 10
                            ? (cv.template_id || 'classic').substring(0, 10) + '…'
                            : cv.template_id || 'classic'}
                        </Badge>
                      </div>
                      <p className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {formatDate(cv.updated_at)}
                      </p>
                    </div>

                    {/* Action Bar */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1.5">
                      <Link href={`/cv/${cv.id}/edit`} className="flex-1">
                        <Button
                          variant="secondary"
                          size="sm"
                          className="w-full justify-center text-[11px] font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200/80 py-1 h-7"
                          leftIcon={<Edit3 className="w-3 h-3" />}
                        >
                          Edit CV
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                        onClick={(e) => handleDuplicateCV(cv, e)}
                        title="Duplikasi CV"
                        aria-label="Duplikasi"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 text-slate-400 hover:text-red-600 hover:bg-red-50"
                        onClick={(e) => handleDeleteCV(cv.id, e)}
                        title="Hapus CV"
                        aria-label="Hapus"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Centralized Paywall Modal */}
      <PaywallModal
        isOpen={isPaywallOpen}
        onClose={() => setIsPaywallOpen(false)}
        featureName={paywallFeature}
        featureDescription={paywallDescription}
      />
    </div>
  );
}
