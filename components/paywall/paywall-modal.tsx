'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Sparkles, Lock, ArrowRight } from 'lucide-react';
import { PRO_PRICE_LABEL } from '@/lib/constants';

export interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureName?: string;
  featureDescription?: string;
}

export function PaywallModal({
  isOpen,
  onClose,
  featureName = 'Fitur Pro',
  featureDescription = 'Fitur ini eksklusif untuk pelanggan CVPintar Pro.',
}: PaywallModalProps) {
  const router = useRouter();

  const handleUpgrade = () => {
    onClose();
    router.push('/pricing');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="md">
      <div className="text-center pt-2">
        <div className="w-14 h-14 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/25">
          <Lock className="w-7 h-7 text-white" />
        </div>

        <Badge variant="pro" className="mb-2">
          <Sparkles className="w-3.5 h-3.5 mr-1" /> CVPintar Pro
        </Badge>

        <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
          Buka Akses {featureName}
        </h3>
        <p className="text-sm text-slate-600 mt-2 px-2">
          {featureDescription}
        </p>

        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 my-6 text-left space-y-2.5">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Semua keuntungan Paket Pro:
          </p>
          <div className="flex items-center text-sm text-slate-700">
            <Check className="w-4 h-4 text-emerald-600 mr-2 shrink-0" />
            <span>Unlimited CV & Semua Template Premium</span>
          </div>
          <div className="flex items-center text-sm text-slate-700">
            <Check className="w-4 h-4 text-emerald-600 mr-2 shrink-0" />
            <span>AI CV Writer & AI Rewrite Tanpa Batas</span>
          </div>
          <div className="flex items-center text-sm text-slate-700">
            <Check className="w-4 h-4 text-emerald-600 mr-2 shrink-0" />
            <span>ATS Score Checker & Job Description Analyzer</span>
          </div>
          <div className="flex items-center text-sm text-slate-700">
            <Check className="w-4 h-4 text-emerald-600 mr-2 shrink-0" />
            <span>Export PDF Bersih Tanpa Watermark</span>
          </div>
        </div>

        <div className="flex flex-col gap-2.5">
          <Button
            variant="accent"
            size="lg"
            className="w-full justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 text-base shadow-md"
            onClick={handleUpgrade}
            rightIcon={<ArrowRight className="w-4 h-4 ml-1" />}
          >
            Upgrade ke Pro — {PRO_PRICE_LABEL}
          </Button>
          <Button
            variant="ghost"
            size="md"
            className="w-full text-slate-500 hover:text-slate-700"
            onClick={onClose}
          >
            Nanti Saja
          </Button>
        </div>
      </div>
    </Modal>
  );
}
