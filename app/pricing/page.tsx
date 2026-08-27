'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Check,
  X,
  Sparkles,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import { PRO_PRICE_RAW_LABEL } from '@/lib/constants';

export default function PricingPage() {

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />

      <main className="flex-1 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="primary" className="mb-3">
              Pilihan Paket & Investasi Karir
            </Badge>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
              Pilih Paket Sesuai Kebutuhan Karir Anda
            </h1>
            <p className="text-base sm:text-lg text-slate-600 mt-4 leading-relaxed">
              Mulai gratis untuk mencoba membuat CV standar ATS, atau upgrade ke Pro untuk membuka semua fitur AI cerdas tanpa batas.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900">Free</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Untuk mahasiswa & pemula
                    </p>
                  </div>
                  <Badge variant="outline">Gratis Selamanya</Badge>
                </div>

                <div className="flex items-baseline gap-1 my-6">
                  <span className="text-4xl font-extrabold text-slate-900">Rp0</span>
                  <span className="text-xs text-slate-500">/ bulan</span>
                </div>

                <p className="text-xs text-slate-600 mb-6 pb-6 border-b border-slate-100">
                  Semua fitur esensial untuk membuat 1 dokumen CV ATS pertama Anda.
                </p>

                <ul className="space-y-3.5 text-xs text-slate-700">
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Maksimal <strong>1 Dokumen CV</strong></span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>2 Template Dasar ATS (Classic & Modern)</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>5x AI CV Writer per hari</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Download PDF dengan Watermark</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-slate-400">
                    <X className="w-4 h-4 text-slate-300 shrink-0" />
                    <span>ATS Score Checker</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-slate-400">
                    <X className="w-4 h-4 text-slate-300 shrink-0" />
                    <span>Job Description Analyzer</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-slate-400">
                    <X className="w-4 h-4 text-slate-300 shrink-0" />
                    <span>Cover Letter Generator</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8">
                <Link href="/register" className="w-full">
                  <Button variant="secondary" size="lg" className="w-full justify-center">
                    Mulai Gratis
                  </Button>
                </Link>
              </div>
            </div>

            {/* Pro Plan */}
            <div className="bg-gradient-to-b from-slate-900 to-slate-850 text-white rounded-2xl border border-slate-800 p-8 shadow-xl flex flex-col justify-between relative">
              <div className="absolute -top-3.5 right-6">
                <Badge variant="pro" className="px-3.5 py-1 text-xs shadow-md">
                  <Sparkles className="w-3.5 h-3.5 mr-1" /> Rekomendasi
                </Badge>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white">CVPintar Pro</h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Untuk pelamar aktif & job seeker serius
                    </p>
                  </div>
                </div>

                <div className="flex items-baseline gap-1 my-6">
                  <span className="text-4xl font-extrabold text-white">{PRO_PRICE_RAW_LABEL}</span>
                  <span className="text-xs text-slate-400">/ bulan</span>
                </div>


                <p className="text-xs text-slate-300 mb-6 pb-6 border-b border-slate-800">
                  Buka potensi maksimal dokumen lamaran Anda dengan fitur AI terlengkap.
                </p>

                <ul className="space-y-3.5 text-xs text-slate-200">
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-blue-400 shrink-0" />
                    <span><strong>Unlimited CV</strong> (Simpan & Edit banyak versi)</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-blue-400 shrink-0" />
                    <span><strong>Semua Template Premium</strong> (Tech, Minimalist, Corporate)</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-blue-400 shrink-0" />
                    <span><strong>AI CV Writer & Rewrite</strong> (100x per hari)</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-blue-400 shrink-0" />
                    <span><strong>ATS Score & Keyword Checker</strong></span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-blue-400 shrink-0" />
                    <span><strong>Job Description Analyzer</strong> (Match lowongan)</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-blue-400 shrink-0" />
                    <span><strong>Cover Letter Generator</strong> Instan</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-blue-400 shrink-0" />
                    <span><strong>PDF Bersih Bebas Watermark</strong></span>
                  </li>
                </ul>
              </div>

              <div className="mt-8">
                <Link href="/checkout" className="w-full">
                  <Button
                    variant="accent"
                    size="lg"
                    className="w-full justify-center bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 text-base shadow-lg shadow-blue-500/25"
                    rightIcon={<ArrowRight className="w-4 h-4 ml-1" />}
                  >
                    Upgrade ke Pro Sekarang
                  </Button>
                </Link>
                <p className="text-[11px] text-center text-slate-400 mt-2.5 flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Pembayaran aman via DOKU (QRIS, VA, E-Wallet)
                </p>
              </div>
            </div>
          </div>

          {/* Feature Matrix Table */}
          <div className="mt-20 max-w-4xl mx-auto bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-xs">
            <h3 className="text-lg font-bold text-slate-900 mb-6 text-center">
              Perbandingan Detail Fitur
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="py-3 px-4 font-semibold">Fitur</th>
                    <th className="py-3 px-4 font-semibold text-center w-32">Free</th>
                    <th className="py-3 px-4 font-semibold text-center w-32 text-blue-600">Pro</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr>
                    <td className="py-3 px-4 font-medium">Batas Dokumen CV</td>
                    <td className="py-3 px-4 text-center">1 CV</td>
                    <td className="py-3 px-4 text-center font-bold text-blue-600">Unlimited</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium">Pilihan Template</td>
                    <td className="py-3 px-4 text-center">2 Dasar</td>
                    <td className="py-3 px-4 text-center font-bold text-blue-600">Semua (5+)</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium">AI CV Writer Assistance</td>
                    <td className="py-3 px-4 text-center">5x / hari</td>
                    <td className="py-3 px-4 text-center font-bold text-blue-600">100x / hari</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium">Ekspor PDF A4</td>
                    <td className="py-3 px-4 text-center">Dengan Watermark</td>
                    <td className="py-3 px-4 text-center font-bold text-emerald-600">Tanpa Watermark</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium">ATS Score & Keyword Checker</td>
                    <td className="py-3 px-4 text-center"><X className="w-4 h-4 mx-auto text-slate-300" /></td>
                    <td className="py-3 px-4 text-center"><Check className="w-4 h-4 mx-auto text-emerald-600" /></td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium">Job Description Match Analyzer</td>
                    <td className="py-3 px-4 text-center"><X className="w-4 h-4 mx-auto text-slate-300" /></td>
                    <td className="py-3 px-4 text-center"><Check className="w-4 h-4 mx-auto text-emerald-600" /></td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium">Cover Letter Generator</td>
                    <td className="py-3 px-4 text-center"><X className="w-4 h-4 mx-auto text-slate-300" /></td>
                    <td className="py-3 px-4 text-center"><Check className="w-4 h-4 mx-auto text-emerald-600" /></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
