'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  CheckCircle2,
  Clock,
  XCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  CreditCard,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface SuccessProps {
  searchParams: Promise<{ invoice?: string }>;
}

export default function PaymentSuccessPage({ searchParams }: SuccessProps) {
  const resolvedParams = use(searchParams);
  const invoiceNumber = resolvedParams.invoice;

  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userPlan, setUserPlan] = useState<'free' | 'pro'>('free');
  const [paymentStatus, setPaymentStatus] = useState<'LOADING' | 'SUCCESS' | 'PENDING' | 'FAILED'>('LOADING');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const checkStatus = async () => {
    setIsRefreshing(true);
    try {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        setUserEmail(session.user.email || null);
      }

      if (invoiceNumber) {
        const res = await fetch(`/api/payments/status?invoice=${encodeURIComponent(invoiceNumber)}`);
        const data = await res.json();

        if (data.status === 'SUCCESS' || data.plan === 'pro') {
          setPaymentStatus('SUCCESS');
          setUserPlan('pro');
        } else if (data.status === 'FAILED') {
          setPaymentStatus('FAILED');
          setUserPlan(data.plan || 'free');
        } else {
          setPaymentStatus('PENDING');
          setUserPlan(data.plan || 'free');
        }
      } else {
        // No invoice provided, check profile plan directly
        if (session) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('plan')
            .eq('user_id', session.user.id)
            .single();

          if (profile?.plan === 'pro') {
            setPaymentStatus('SUCCESS');
            setUserPlan('pro');
          } else {
            setPaymentStatus('PENDING');
          }
        } else {
          setPaymentStatus('PENDING');
        }
      }
    } catch (err) {
      console.error('Error checking payment status:', err);
      setPaymentStatus('PENDING');
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    checkStatus();
  }, [invoiceNumber]);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar userEmail={userEmail} userPlan={userPlan} />

      <main className="flex-1 max-w-lg w-full mx-auto px-4 py-16 flex flex-col items-center justify-center">
        {paymentStatus === 'LOADING' && (
          <Card className="p-8 text-center bg-white shadow-xl rounded-2xl border border-slate-200 w-full space-y-5">
            <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto animate-spin">
              <RefreshCw className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Memverifikasi Status Pembayaran...</h2>
            <p className="text-xs text-slate-500">Mohon tunggu sebentar, kami sedang memeriksa status transaksi Anda ke sistem DOKU.</p>
          </Card>
        )}

        {paymentStatus === 'SUCCESS' && (
          <Card className="p-8 text-center bg-white shadow-xl rounded-2xl border border-slate-200 w-full space-y-5">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md shadow-emerald-500/20">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <Badge variant="pro" className="px-3 py-1">
              <Sparkles className="w-3.5 h-3.5 mr-1" /> PRO ACTIVATED
            </Badge>

            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Pembayaran Berhasil!
            </h1>

            <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
              Terima kasih! Akun Anda kini telah resmi aktif sebagai pelanggan <strong>CVPintar Pro</strong>. Semua fitur premium dan AI tanpa batas kini dapat Anda akses langsung.
            </p>

            {invoiceNumber && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500 font-mono">
                Invoice ID: <span className="font-bold text-slate-800">{invoiceNumber}</span>
              </div>
            )}

            <div className="pt-2 space-y-2">
              <Link href="/dashboard" className="w-full">
                <Button
                  variant="accent"
                  size="lg"
                  className="w-full justify-center bg-blue-600 hover:bg-blue-700 font-semibold shadow-md shadow-blue-500/25"
                  rightIcon={<ArrowRight className="w-4 h-4 ml-1" />}
                >
                  Buka Dashboard Pro Anda
                </Button>
              </Link>
            </div>

            <div className="pt-2 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Transaksi terverifikasi secara aman melalui DOKU</span>
            </div>
          </Card>
        )}

        {paymentStatus === 'PENDING' && (
          <Card className="p-8 text-center bg-white shadow-xl rounded-2xl border border-amber-200 w-full space-y-5">
            <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto shadow-md shadow-amber-500/10">
              <Clock className="w-9 h-9" />
            </div>

            <Badge variant="warning" className="px-3 py-1 bg-amber-100 text-amber-800 border-amber-300">
              MENUNGGU PEMBAYARAN
            </Badge>

            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Pembayaran Belum Selesai
            </h1>

            <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
              Kami belum menerima konfirmasi pembayaran untuk transaksi ini. Jika Anda baru saja menyelesaikan transfer via Virtual Account / QRIS, silakan klik tombol cek status di bawah.
            </p>

            {invoiceNumber && (
              <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200 text-xs text-amber-900 font-mono">
                Invoice ID: <span className="font-bold">{invoiceNumber}</span>
              </div>
            )}

            <div className="pt-2 space-y-2.5">
              <Button
                variant="secondary"
                size="lg"
                onClick={checkStatus}
                disabled={isRefreshing}
                className="w-full justify-center border-slate-300 font-semibold"
                leftIcon={<RefreshCw className={`w-4 h-4 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />}
              >
                {isRefreshing ? 'Memeriksa Status...' : 'Cek Ulang Status Pembayaran'}
              </Button>

              <Link href="/checkout" className="w-full block">
                <Button
                  variant="accent"
                  size="lg"
                  className="w-full justify-center bg-blue-600 hover:bg-blue-700 font-semibold shadow-md shadow-blue-500/25"
                  leftIcon={<CreditCard className="w-4 h-4 mr-1" />}
                >
                  Buka Ulang Halaman Pembayaran
                </Button>
              </Link>

              <Link href="/dashboard" className="w-full block">
                <Button variant="ghost" size="sm" className="w-full text-slate-500 hover:text-slate-700 text-xs">
                  Kembali ke Dashboard
                </Button>
              </Link>
            </div>

            <div className="pt-2 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
              <span>Sistem otomatis mengaktifkan paket Pro setelah dana masuk</span>
            </div>
          </Card>
        )}

        {paymentStatus === 'FAILED' && (
          <Card className="p-8 text-center bg-white shadow-xl rounded-2xl border border-red-200 w-full space-y-5">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto shadow-md shadow-red-500/10">
              <XCircle className="w-9 h-9" />
            </div>

            <Badge variant="danger" className="px-3 py-1">
              PEMBAYARAN DIBATALKAN
            </Badge>

            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Transaksi Tidak Berhasil
            </h1>

            <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
              Transaksi ini telah kedaluwarsa atau dibatalkan. Silakan ulangi proses checkout untuk berlangganan CVPintar Pro.
            </p>

            <div className="pt-2 space-y-2">
              <Link href="/checkout" className="w-full">
                <Button
                  variant="accent"
                  size="lg"
                  className="w-full justify-center bg-blue-600 hover:bg-blue-700 font-semibold shadow-md shadow-blue-500/25"
                  rightIcon={<ArrowRight className="w-4 h-4 ml-1" />}
                >
                  Coba Bayar Ulang
                </Button>
              </Link>
            </div>
          </Card>
        )}
      </main>

      <Footer />
    </div>
  );
}
