'use client';

import React, { useState, useEffect } from 'react';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Sparkles,
  X,
  Copy,
  Check,
  ArrowRight,
  Gift,
} from 'lucide-react';


export function PromoPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const promoCode = 'CVPINTAR50';

  useEffect(() => {
    // Check if user previously dismissed promo in this session
    const dismissed = sessionStorage.getItem('cvpintar_promo_dismissed');
    if (!dismissed) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem('cvpintar_promo_dismissed', 'true');
  };

  const handleCopyCode = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(promoCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {/* Floating Minimized Widget when Modal is closed */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-3.5 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center gap-2 group animate-bounce duration-1000"
          aria-label="Klaim Promo Diskon 50%"
        >
          <Gift className="w-5 h-5 text-amber-300 group-hover:rotate-12 transition-transform" />
          <span className="text-xs font-bold pr-1 hidden sm:inline">Diskon 50%</span>
        </button>
      )}

      {/* Main Promo Modal Popup */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200/80 animate-in zoom-in-95 duration-200">
            {/* Top Decorative Gradient Header */}
            <div className="relative p-6 sm:p-8 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white text-center overflow-hidden">
              {/* Background glowing shapes */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />

              {/* Close Button */}
              <button
                type="button"
                onClick={handleClose}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-colors focus:outline-none"
                aria-label="Tutup Promo"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 border border-white/25 text-amber-300 text-xs font-bold mb-3 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>PROMO SPESIAL TERBATAS</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
                Diskon <span className="text-amber-300">50%</span> CVPintar PRO!
              </h2>

              <p className="text-xs sm:text-sm text-blue-100 mt-2 max-w-xs mx-auto leading-relaxed">
                Buka akses ke 230+ Template Desain Eksklusif, Unlimited AI Writer, & ATS Score Checker.
              </p>

              {/* Visual Mini Template Showcase */}
              <div className="mt-4 flex items-center justify-center gap-2 relative h-28 overflow-hidden py-1">
                <div className="w-20 h-28 bg-white rounded-lg shadow-lg border border-white/30 transform -rotate-6 scale-90 opacity-80 overflow-hidden flex flex-col p-1">
                  <div className="h-4 bg-slate-800 rounded-xs mb-1" />
                  <div className="h-1.5 bg-slate-300 rounded-xs w-3/4 mb-1" />
                  <div className="h-1.5 bg-slate-200 rounded-xs w-1/2 mb-2" />
                  <div className="space-y-1">
                    <div className="h-1 bg-slate-100 rounded-xs w-full" />
                    <div className="h-1 bg-slate-100 rounded-xs w-5/6" />
                    <div className="h-1 bg-slate-100 rounded-xs w-4/6" />
                  </div>
                </div>
                <div className="w-24 h-32 bg-white rounded-xl shadow-2xl border-2 border-amber-300 transform scale-100 z-10 overflow-hidden flex flex-col p-1.5 text-slate-800">
                  <div className="flex items-center gap-1 mb-1.5">
                    <div className="w-4 h-4 rounded-full bg-blue-600" />
                    <div className="space-y-0.5">
                      <div className="h-1.5 bg-blue-900 rounded-xs w-10" />
                      <div className="h-1 bg-slate-400 rounded-xs w-7" />
                    </div>
                  </div>
                  <div className="h-1 bg-slate-200 rounded-xs w-full mb-1" />
                  <div className="space-y-1">
                    <div className="h-1 bg-slate-100 rounded-xs w-full" />
                    <div className="h-1 bg-slate-100 rounded-xs w-11/12" />
                    <div className="h-1 bg-slate-100 rounded-xs w-4/5" />
                  </div>
                  <div className="mt-auto flex justify-between items-center text-[7px] text-amber-600 font-bold bg-amber-50 px-1 py-0.5 rounded">
                    <span>PRO TEMPLATE</span>
                    <Sparkles className="w-2 h-2 text-amber-500" />
                  </div>
                </div>
                <div className="w-20 h-28 bg-white rounded-lg shadow-lg border border-white/30 transform rotate-6 scale-90 opacity-80 overflow-hidden flex flex-col p-1">
                  <div className="h-4 bg-emerald-700 rounded-xs mb-1" />
                  <div className="h-1.5 bg-slate-300 rounded-xs w-3/4 mb-1" />
                  <div className="h-1.5 bg-slate-200 rounded-xs w-1/2 mb-2" />
                  <div className="space-y-1">
                    <div className="h-1 bg-slate-100 rounded-xs w-full" />
                    <div className="h-1 bg-slate-100 rounded-xs w-5/6" />
                    <div className="h-1 bg-slate-100 rounded-xs w-4/6" />
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Body & Coupon Box */}
            <div className="p-6 sm:p-8 space-y-5 bg-white text-slate-800">
              <div className="p-4 bg-slate-50 rounded-2xl border-2 border-dashed border-blue-300 flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400">
                    Kode Promo Anda:
                  </span>
                  <div className="font-mono font-black text-lg text-blue-700 tracking-wider">
                    {promoCode}
                  </div>
                </div>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleCopyCode}
                  leftIcon={
                    copied ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-slate-600" />
                    )
                  }
                  className="text-xs font-bold shrink-0 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 shadow-2xs"
                >
                  {copied ? 'Tersalin!' : 'Salin Kode'}
                </Button>
              </div>

              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5" />
                  </div>
                  <span>Berlaku untuk semua metode pembayaran (QRIS, VA, E-Wallet).</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5" />
                  </div>
                  <span>Kode langsung otomatis terpasang saat klik tombol di bawah.</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-1">
                <Link
                  href={`/checkout?promo=${promoCode}`}
                  onClick={() => setIsOpen(false)}
                  className="block w-full"
                >
                  <Button
                    variant="accent"
                    size="lg"
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                    className="w-full justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 text-sm shadow-md shadow-blue-500/25"
                  >
                    Klaim Diskon & Upgrade Sekarang
                  </Button>
                </Link>

                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full text-center text-xs font-semibold text-slate-400 hover:text-slate-600 py-1 transition-colors"
                >
                  Nanti Saja
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
