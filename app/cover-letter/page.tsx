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
  FileText,
  Sparkles,
  Copy,
  Check,
  Building,
  Download,
} from 'lucide-react';
import { UserPlan } from '@/types';

export default function CoverLetterPage() {
  const router = useRouter();
  const [company, setCompany] = useState<string>('');
  const [position, setPosition] = useState<string>('');
  const [skills, setSkills] = useState<string>('');
  const [generatedLetter, setGeneratedLetter] = useState<string>('');
  const [plan, setPlan] = useState<UserPlan>('free');
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
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

  const handleGenerate = async () => {
    if (plan !== 'pro') {
      setIsPaywallOpen(true);
      return;
    }

    if (!company.trim() || !position.trim()) {
      alert('Nama perusahaan dan posisi pekerjaan wajib diisi.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/ai/cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company, position, skills }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (data.isProRequired) {
          setIsPaywallOpen(true);
        } else {
          alert(data.error || 'Gagal menghasilkan surat lamaran kerja.');
        }
        return;
      }

      setGeneratedLetter(data.result);
    } catch {
      alert('Gagal menghasilkan surat lamaran kerja.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([generatedLetter], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Surat_Lamaran_${company.replace(/\s+/g, '_')}_${position.replace(/\s+/g, '_')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar userEmail={userEmail} userPlan={plan} />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Cover Letter Generator
            </h1>
            <Badge variant="pro">PRO</Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Buat surat lamaran kerja formal yang selaras dengan data CV dan target perusahaan impian Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5">
            <Card className="p-6 space-y-4 bg-white shadow-xs border border-slate-200">
              <Input
                label="Nama Perusahaan Target *"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Contoh: PT Optik Timur"
                leftIcon={<Building className="w-4 h-4" />}
              />

              <Input
                label="Posisi / Jabatan yang Dilamar *"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                placeholder="Contoh: Junior Data Analyst"
              />

              <Textarea
                label="Keahlian Utama yang Ingin Ditekankan"
                rows={3}
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="Contoh: SQL, Python, Tableau, Analisis Data Penjualan"
              />

              <Button
                variant="accent"
                size="md"
                onClick={handleGenerate}
                isLoading={isLoading}
                leftIcon={<Sparkles className="w-4 h-4" />}
                className="w-full justify-center bg-purple-600 hover:bg-purple-700 mt-2 text-white shadow-md shadow-purple-500/20"
              >
                Generate Surat Lamaran
              </Button>
            </Card>
          </div>

          <div className="lg:col-span-7">
            {generatedLetter ? (
              <Card className="p-6 space-y-4 bg-white shadow-sm border border-slate-200">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="text-xs font-bold text-slate-800">
                      Surat Lamaran Kerja Resmi (Siap Kirim)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={handleCopy}
                      leftIcon={
                        copied ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )
                      }
                      className="text-xs"
                    >
                      {copied ? 'Tersalin!' : 'Salin Teks'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDownload}
                      leftIcon={<Download className="w-3.5 h-3.5 text-slate-600" />}
                      className="text-xs"
                    >
                      Unduh (.txt)
                    </Button>
                  </div>
                </div>
                <div className="p-6 bg-slate-50/80 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 font-sans leading-relaxed whitespace-pre-wrap select-text">
                  {generatedLetter}
                </div>
              </Card>
            ) : (
              <Card className="p-12 text-center border-dashed border-2 border-slate-300 bg-white/50">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-3">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Surat Lamaran Akan Tampil di Sini
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Isi data perusahaan dan posisi di sebelah kiri, lalu klik tombol generate.
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
        featureName="Cover Letter Generator"
        featureDescription="Fitur Cover Letter Generator eksklusif untuk pelanggan CVPintar Pro."
      />
    </div>
  );
}
