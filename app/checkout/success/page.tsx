'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface SuccessProps {
  searchParams: Promise<{ invoice?: string }>;
}

export default function PaymentSuccessPage({ searchParams }: SuccessProps) {
  const resolvedParams = use(searchParams);
  const invoiceNumber = resolvedParams.invoice;
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    async function checkUser() {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        setUserEmail(session.user.email || null);
      }
    }
    checkUser();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar userEmail={userEmail} userPlan="pro" />

      <main className="flex-1 max-w-lg w-full mx-auto px-4 py-16 flex flex-col items-center justify-center">
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
            Terima kasih! Akun Anda kini telah resmi terdaftar sebagai pelanggan <strong>CVPintar Pro</strong>. Semua fitur premium dan AI tanpa batas kini dapat Anda akses langsung.
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
      </main>

      <Footer />
    </div>
  );
}
