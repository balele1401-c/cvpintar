'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { PaywallModal } from '@/components/paywall/paywall-modal';
import {
  MessageSquare,
  Sparkles,
  HelpCircle,
  Lightbulb,
  CheckCircle2,
} from 'lucide-react';
import { UserPlan } from '@/types';

export default function InterviewPrepPage() {
  const router = useRouter();
  const [targetRole, setTargetRole] = useState<string>('Frontend Developer');
  const [questions, setQuestions] = useState<
    { q: string; a: string; category: string }[]
  >([]);
  const [plan, setPlan] = useState<UserPlan>('free');
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
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

  const handleGenerateQuestions = async () => {
    if (plan !== 'pro') {
      setIsPaywallOpen(true);
      return;
    }

    if (!targetRole.trim()) {
      alert('Target posisi pekerjaan tidak boleh kosong.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/ai/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: targetRole }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (data.isProRequired) {
          setIsPaywallOpen(true);
        } else {
          alert(data.error || 'Gagal memproses simulasi interview.');
        }
        return;
      }

      setQuestions(data.result || []);
    } catch {
      alert('Terjadi kesalahan koneksi.');
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
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Simulasi & Panduan Tanya Jawab Interview
            </h1>
            <Badge variant="pro">PRO</Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Latih kesiapan wawancara kerja Anda dengan prediksi pertanyaan HRD dan struktur jawaban STAR.
          </p>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex flex-col sm:flex-row items-end gap-3">
              <div className="flex-1 w-full">
                <Input
                  label="Target Posisi / Profesi yang Sedang Anda Lamar"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="Contoh: Digital Marketer, Frontend Engineer, Admin Keuangan"
                />
              </div>
              <Button
                variant="accent"
                size="md"
                onClick={handleGenerateQuestions}
                isLoading={isLoading}
                leftIcon={<Sparkles className="w-4 h-4" />}
                className="bg-emerald-600 hover:bg-emerald-700 w-full sm:w-auto"
              >
                Generate Prediksi Tanya Jawab
              </Button>
            </div>
          </Card>

          {questions.length > 0 ? (
            <div className="space-y-4 animate-in fade-in duration-300">
              {questions.map((item, idx) => (
                <Card key={idx} className="p-5 space-y-3 bg-white">
                  <div className="flex items-center justify-between">
                    <Badge variant="primary" className="text-[10px]">
                      {item.category}
                    </Badge>
                    <span className="text-xs text-slate-400 font-semibold">
                      Pertanyaan #{idx + 1}
                    </span>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <HelpCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <h3 className="text-sm font-bold text-slate-900 leading-snug">
                      &quot;{item.q}&quot;
                    </h3>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-700 space-y-1">
                    <div className="font-semibold text-emerald-700 flex items-center gap-1.5">
                      <Lightbulb className="w-3.5 h-3.5" /> Panduan & Rekomendasi Jawaban:
                    </div>
                    <p className="leading-relaxed pl-5">{item.a}</p>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center border-dashed border-2 border-slate-300">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Latihan Pertanyaan Interview
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Masukkan posisi yang ingin Anda latih lalu klik tombol generate di atas.
              </p>
            </Card>
          )}
        </div>
      </main>

      <Footer />

      <PaywallModal
        isOpen={isPaywallOpen}
        onClose={() => setIsPaywallOpen(false)}
        featureName="Interview Preparation"
        featureDescription="Fitur simulasi Interview Preparation eksklusif untuk pelanggan CVPintar Pro."
      />
    </div>
  );
}
