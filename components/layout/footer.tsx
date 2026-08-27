import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-slate-200/80 bg-white text-slate-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <Image
                src="/logo.png"
                alt="CVPintar Logo"
                width={138}
                height={46}
                className="h-10 w-auto object-contain"
              />
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Platform AI CV & Lamaran Kerja untuk mahasiswa, fresh graduate, dan job seeker di Indonesia.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Privasi data & keamanan terjamin</span>
            </div>
          </div>

          {/* Col 2: Produk */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              Produk
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/cv/new" className="hover:text-slate-900 transition-colors">
                  Buat CV ATS
                </Link>
              </li>
              <li>
                <Link href="/#template" className="hover:text-slate-900 transition-colors">
                  Template CV Gratis
                </Link>
              </li>
              <li>
                <Link href="/ats" className="hover:text-slate-900 transition-colors">
                  ATS Score Checker
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-slate-900 transition-colors">
                  Paket Pro
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Solusi */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              Solusi Karir
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/register" className="hover:text-slate-900 transition-colors">
                  Mahasiswa Magang (Internship)
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-slate-900 transition-colors">
                  Fresh Graduate CV
                </Link>
              </li>
              <li>
                <Link href="/job-analyzer" className="hover:text-slate-900 transition-colors">
                  Analisis Job Description
                </Link>
              </li>
              <li>
                <Link href="/cover-letter" className="hover:text-slate-900 transition-colors">
                  Cover Letter Generator
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Keamanan & Pembayaran */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              Pembayaran Aman
            </h4>
            <p className="text-xs text-slate-500 mb-3 leading-relaxed">
              Didukung oleh DOKU Payment Gateway dengan enkripsi SSL 256-bit standar perbankan.
            </p>
            <div className="flex flex-wrap gap-2 text-[10px] font-semibold text-slate-600">
              <span className="px-2 py-1 bg-slate-100 rounded-md border border-slate-200">QRIS</span>
              <span className="px-2 py-1 bg-slate-100 rounded-md border border-slate-200">BCA Virtual Account</span>
              <span className="px-2 py-1 bg-slate-100 rounded-md border border-slate-200">Mandiri</span>
              <span className="px-2 py-1 bg-slate-100 rounded-md border border-slate-200">E-Wallet</span>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200/80 mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} CVPintar Indonesia. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Dibuat dengan</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span className="font-medium text-slate-700">oleh Iqbal Ardiansyah</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
