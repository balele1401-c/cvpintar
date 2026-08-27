'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  ShieldCheck,
  Sparkles,
  Check,
  CreditCard,
  Lock,
  ArrowRight,
  Tag,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { PRO_PRICE_IDR } from '@/lib/constants';
import { formatRupiah } from '@/lib/utils';
import { Profile } from '@/types';
import { validatePromoCode, calculateDiscountedPrice, PromoCodeDetails } from '@/lib/promo';

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Promo code states initialized with URL parameter if present
  const initialPromo = searchParams.get('promo') || '';
  const [promoInput, setPromoInput] = useState<string>(initialPromo);
  const [appliedPromo, setAppliedPromo] = useState<PromoCodeDetails | null>(() =>
    initialPromo ? validatePromoCode(initialPromo) : null
  );
  const [promoError, setPromoError] = useState<string>('');

  useEffect(() => {
    async function loadUser() {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push('/login?next=/checkout');
        return;
      }

      setUserEmail(session.user.email || null);

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', session.user.id)
        .single();

      if (profileData) {
        setProfile(profileData as Profile);
      }
    }

    loadUser();
  }, [router]);


  const handleApplyPromo = () => {
    setPromoError('');
    if (!promoInput.trim()) {
      setPromoError('Masukkan kode promo terlebih dahulu.');
      return;
    }

    const validated = validatePromoCode(promoInput);
    if (validated) {
      setAppliedPromo(validated);
      setPromoError('');
    } else {
      setAppliedPromo(null);
      setPromoError('Kode promo tidak valid atau telah kedaluwarsa.');
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoInput('');
    setPromoError('');
  };

  const { originalPrice, discountAmount, finalPrice, discountPercentage } =
    calculateDiscountedPrice(PRO_PRICE_IDR, appliedPromo);

  const handleProceedPayment = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/payments/doku/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          promoCode: appliedPromo?.code || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Gagal memulai checkout.');
        setIsLoading(false);
        return;
      }

      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      }
    } catch {
      alert('Terjadi kesalahan koneksi ke Payment Gateway.');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar userEmail={userEmail} userPlan={profile?.plan} />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <div className="text-center max-w-xl mx-auto mb-10">
          <Badge variant="pro" className="mb-2">
            <Sparkles className="w-3.5 h-3.5 mr-1" /> Checkout Langganan
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Ringkasan Pesanan CVPintar Pro
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Tingkatkan akun Anda dan nikmati fitur AI cerdas tanpa batasan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Order Summary */}
          <div className="md:col-span-7 space-y-4">
            <Card className="p-6 bg-white shadow-xs border border-slate-200">
              <h2 className="text-sm font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
                Item Pembelian
              </h2>

              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-base text-slate-900">
                    Paket CVPintar Pro (1 Bulan)
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Akses 30 hari penuh ke 230+ template & AI tanpa batas
                  </p>
                </div>
                <div className="text-right">
                  {appliedPromo && (
                    <span className="text-xs text-slate-400 line-through block">
                      {formatRupiah(originalPrice)}
                    </span>
                  )}
                  <span className="font-extrabold text-base text-slate-900">
                    {formatRupiah(finalPrice)}
                  </span>
                </div>
              </div>

              {/* Promo Code Input Box */}
              <div className="my-5 pt-4 border-t border-slate-100 space-y-2.5">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-blue-600" /> Punya Kode Promo?
                </label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Contoh: KERJAHEMAT50"
                    value={promoInput}
                    onChange={(e) => {
                      setPromoInput(e.target.value.toUpperCase());
                      setPromoError('');
                    }}
                    disabled={appliedPromo !== null}
                    className="font-mono text-xs uppercase"
                  />
                  {appliedPromo ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRemovePromo}
                      className="shrink-0 text-xs text-red-600 border-red-200 hover:bg-red-50"
                    >
                      Hapus
                    </Button>
                  ) : (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={handleApplyPromo}
                      className="shrink-0 text-xs font-semibold"
                    >
                      Terapkan
                    </Button>
                  )}
                </div>

                {appliedPromo && (
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 flex items-center justify-between gap-2 animate-in fade-in">
                    <div className="flex items-center gap-1.5 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>
                        Kode <strong>{appliedPromo.code}</strong> aktif! ({appliedPromo.label})
                      </span>
                    </div>
                  </div>
                )}

                {promoError && (
                  <div className="text-xs text-red-600 flex items-center gap-1 font-medium animate-in fade-in">
                    <XCircle className="w-3.5 h-3.5" />
                    <span>{promoError}</span>
                  </div>
                )}
              </div>

              <div className="my-4 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-2">
                <div className="font-semibold text-slate-900 mb-1">
                  Keuntungan yang Langsung Aktif:
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Akses Penuh 230+ Template CV Canva & Pinterest</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Cover Letter Generator & AI CV Writer Prioritas</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>ATS Score Checker & Job Match Analyzer</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Download PDF Bebas Watermark Resolusi Tinggi</span>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4 space-y-2 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal</span>
                  <span>{formatRupiah(originalPrice)}</span>
                </div>
                {appliedPromo && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Potongan Promo ({discountPercentage}%)</span>
                    <span>-{formatRupiah(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-500">
                  <span>Biaya Layanan Gateway</span>
                  <span className="text-emerald-600 font-semibold">Gratis (Rp0)</span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-2 border-t border-slate-100">
                  <span>Total Pembayaran</span>
                  <span className="text-blue-600 text-base">{formatRupiah(finalPrice)}</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Payment Action Box */}
          <div className="md:col-span-5 space-y-4">
            <Card className="p-6 bg-white space-y-4 shadow-xs border border-slate-200">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-blue-600" />
                Metode Pembayaran
              </h2>

              <p className="text-xs text-slate-600 leading-relaxed">
                Pembayaran diproses secara instan melalui <strong>DOKU Payment Gateway</strong>.
              </p>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1.5">
                <div className="font-semibold text-slate-800">Mendukung:</div>
                <div className="flex flex-wrap gap-1 text-[11px] text-slate-600 font-mono">
                  <span className="px-2 py-0.5 bg-white rounded border border-slate-200">QRIS</span>
                  <span className="px-2 py-0.5 bg-white rounded border border-slate-200">BCA VA</span>
                  <span className="px-2 py-0.5 bg-white rounded border border-slate-200">Mandiri</span>
                  <span className="px-2 py-0.5 bg-white rounded border border-slate-200">GoPay / OVO</span>
                </div>
              </div>

              <Button
                variant="accent"
                size="lg"
                onClick={handleProceedPayment}
                isLoading={isLoading}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="w-full justify-center bg-blue-600 hover:bg-blue-700 py-3 text-base shadow-md shadow-blue-500/25 font-semibold text-white"
              >
                Bayar Sekarang ({formatRupiah(finalPrice)})
              </Button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 text-center pt-2">
                <Lock className="w-3.5 h-3.5 text-emerald-500" />
                <span>Enkripsi 256-bit SSL & Sertifikasi DOKU</span>
              </div>
            </Card>

            <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-100 flex items-start gap-2.5 text-xs text-blue-900">
              <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>
                Status Pro akan langsung aktif secara otomatis setelah pembayaran terverifikasi.
              </span>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
