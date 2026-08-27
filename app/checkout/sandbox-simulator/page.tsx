'use client';

import React, { useState, use } from 'react';
import { useRouter, notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatRupiah } from '@/lib/utils';
import { PRO_PRICE_IDR } from '@/lib/constants';
import { CheckCircle2, XCircle, Clock, ShieldAlert } from 'lucide-react';

interface SandboxProps {
  searchParams: Promise<{ invoice?: string; amount?: string }>;
}

export default function DokuSandboxSimulatorPage({ searchParams }: SandboxProps) {
  // Production security guard: Never expose simulator in production environment
  if (process.env.NODE_ENV === 'production') {
    notFound();
  }

  const resolvedParams = use(searchParams);
  const router = useRouter();
  const invoiceNumber = resolvedParams.invoice || 'INV-SANDBOX-DEMO';
  const amount = Number(resolvedParams.amount) || PRO_PRICE_IDR;


  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const simulatePayment = async (status: 'SUCCESS' | 'FAILED' | 'EXPIRED') => {
    setIsLoading(true);
    setStatusMessage(null);

    try {
      // Send mock webhook with local development bypass token
      const res = await fetch('/api/webhooks/doku', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Client-Id': 'SANDBOX_CLIENT_ID',
          'Request-Id': `REQ-SIM-${Date.now()}`,
          'Request-Timestamp': new Date().toISOString(),
          'x-doku-dev-simulator': 'KERJAAI_DEV_SANDBOX_BYPASS',
        },
        body: JSON.stringify({
          order: {
            invoice_number: invoiceNumber,
            amount,
            currency: 'IDR',
          },
          transaction: {
            status,
            invoice_number: invoiceNumber,
            amount,
          },
        }),
      });

      if (res.ok) {
        if (status === 'SUCCESS') {
          router.push(`/checkout/success?invoice=${invoiceNumber}`);
        } else {
          setStatusMessage(`Status pembayaran: ${status}. Akun tetap berada di Free Plan.`);
          setIsLoading(false);
        }
      } else {
        const errData = await res.json().catch(() => ({}));
        setStatusMessage(errData.error || 'Gagal memproses webhook simulasi.');
        setIsLoading(false);
      }
    } catch {
      setStatusMessage('Terjadi kesalahan jaringan.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <Badge variant="warning" className="px-3 py-1">
            <ShieldAlert className="w-3.5 h-3.5 mr-1" /> DOKU Sandbox Simulator (Dev Only)
          </Badge>
          <h1 className="text-2xl font-bold tracking-tight">Simulasi Pembayaran DOKU</h1>
          <p className="text-xs text-slate-400">
            Gunakan antarmuka ini untuk menguji verifikasi webhook dan aktivasi status Pro secara instan di lokal.
          </p>
        </div>

        <Card className="bg-slate-800 border-slate-700 p-6 text-slate-100 space-y-4 shadow-2xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-700 text-xs">
            <span className="text-slate-400">No. Invoice</span>
            <span className="font-mono font-bold text-white">{invoiceNumber}</span>
          </div>

          <div className="flex items-center justify-between pb-3 border-b border-slate-700 text-xs">
            <span className="text-slate-400">Total Tagihan</span>
            <span className="text-lg font-extrabold text-blue-400">
              {formatRupiah(amount)}
            </span>
          </div>

          {statusMessage && (
            <div className="p-3 bg-red-900/40 border border-red-700 text-red-200 text-xs rounded-lg">
              {statusMessage}
            </div>
          )}

          <div className="space-y-2.5 pt-2">
            <p className="text-xs font-semibold text-slate-300">
              Pilih Skenario Pembayaran:
            </p>

            <Button
              variant="accent"
              className="w-full justify-center bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2.5 text-xs"
              onClick={() => simulatePayment('SUCCESS')}
              isLoading={isLoading}
              leftIcon={<CheckCircle2 className="w-4 h-4" />}
            >
              Simulasikan Pembayaran Berhasil (SUCCESS)
            </Button>

            <Button
              variant="secondary"
              className="w-full justify-center bg-slate-700 hover:bg-slate-600 text-white border-slate-600 text-xs"
              onClick={() => simulatePayment('FAILED')}
              isLoading={isLoading}
              leftIcon={<XCircle className="w-4 h-4 text-red-400" />}
            >
              Simulasikan Gagal Bayar (FAILED)
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-center text-slate-400 hover:text-white text-xs"
              onClick={() => simulatePayment('EXPIRED')}
              isLoading={isLoading}
              leftIcon={<Clock className="w-4 h-4" />}
            >
              Simulasikan Kadaluarsa (EXPIRED)
            </Button>
          </div>
        </Card>

        <div className="text-center">
          <button
            onClick={() => router.push('/dashboard')}
            className="text-xs text-slate-400 hover:text-slate-200 underline"
          >
            Batalkan dan Kembali ke Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
