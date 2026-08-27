import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  Sparkles,
  CheckCircle2,
  FileCheck2,
  Zap,
  Target,
  ArrowRight,
  Award,
  TrendingUp,
  FileText,
} from 'lucide-react';
import { PromoPopup } from '@/components/marketing/promo-popup';
import { PRO_PRICE_RAW_LABEL } from '@/lib/constants';


export default function HomePage() {

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />

      <main className="flex-1">
        {/* ==================================================== */}
        {/* 1. HERO SECTION */}
        {/* ==================================================== */}
        <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-28 bg-gradient-to-b from-white via-slate-50 to-slate-100 border-b border-slate-200/70">
          {/* Subtle background glow */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-400/10 blur-[120px] rounded-full pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold mb-6 shadow-xs animate-in fade-in slide-in-from-bottom-3 duration-500">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>AI CV Builder Pertama Khusus Job Seeker Indonesia</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15] max-w-4xl mx-auto">
              Bikin CV yang Lebih Siap Kerja dalam{' '}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Hitungan Menit.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto mt-6 leading-relaxed">
              Buat CV ATS-friendly, optimalkan deskripsi pengalaman dengan AI profesional, dan cek skor kecocokan lowongan tanpa ribet.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto">
              <Link href="/register" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="accent"
                  className="w-full sm:w-auto text-base py-3 px-8 shadow-md shadow-blue-500/20"
                  rightIcon={<ArrowRight className="w-4 h-4 ml-1" />}
                >
                  Buat CV Gratis Sekarang
                </Button>
              </Link>
              <Link href="/pricing" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="secondary"
                  className="w-full sm:w-auto text-base py-3 px-6"
                >
                  Lihat Paket & Harga
                </Button>
              </Link>
            </div>

            {/* Social proof trust points */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>100% ATS Friendly</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Format Standar HRD & Recruiter</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Download PDF Instan</span>
              </div>
            </div>

            {/* Hero Interactive CV Preview Mockup */}
            <div className="mt-12 max-w-4xl mx-auto bg-white rounded-2xl p-4 sm:p-6 border border-slate-200/90 shadow-xl shadow-slate-200/50 text-left">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  <span className="font-semibold text-slate-700 ml-2">Preview Editor CV • CVPintar</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="success" className="gap-1">
                    <CheckCircle2 className="w-3 h-3" /> ATS Score: 92/100
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-7 space-y-3">
                  <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-3.5">
                    <div className="flex items-center justify-between text-xs font-semibold text-blue-900 mb-1.5">
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-blue-600" /> AI CV Writer Result
                      </span>
                      <span className="text-[10px] bg-blue-200/60 text-blue-800 px-1.5 py-0.5 rounded font-bold">
                        STAR Formula
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed font-mono bg-white p-2.5 rounded-lg border border-blue-100/80">
                      &quot;Merancang dan mengembangkan modul sistem inventaris toko menggunakan Next.js dan PostgreSQL, berhasil memangkas waktu pencatatan stok hingga 40% dan mengurangi kesalahan input data barang.&quot;
                    </p>
                  </div>
                  <p className="text-xs text-slate-500 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    AI otomatis menyusun kalimat pasif & action verbs yang dicari recruiter.
                  </p>
                </div>

                <div className="md:col-span-5 bg-slate-50 rounded-xl p-4 border border-slate-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">Ringkasan Profil</span>
                    <span className="text-[10px] text-emerald-600 font-semibold">ATS Verified</span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-[92%]" />
                  </div>
                  <div className="space-y-1 text-[11px] text-slate-600">
                    <div className="flex items-center justify-between">
                      <span>Kata Kunci Industri</span>
                      <span className="font-semibold text-slate-900">14 Ditemukan</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Kerapian Tata Bahasa</span>
                      <span className="font-semibold text-slate-900">Sangat Baik</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Format Tata Letak</span>
                      <span className="font-semibold text-slate-900">Standard A4</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================== */}
        {/* 2. PROBLEM & SOLUTION SECTION */}
        {/* ==================================================== */}
        <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2">
              Tantangan Job Seeker Indonesia
            </h2>
            <p className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              Kenapa Banyak CV Bagus Tidak Pernah Dipanggil Interview?
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 border-slate-200/90 hover:border-slate-300">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold mb-4">
                1
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                Format Grafis Tidak Terbaca Sistem ATS
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Banyak kandidat memakai template kanvas visual yang penuh kolom gambar, ikon, dan tabel rumit sehingga gagal diekstrak oleh sistem ATS perusahaan besar.
              </p>
            </Card>

            <Card className="p-6 border-slate-200/90 hover:border-slate-300">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold mb-4">
                2
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                Deskripsi Pengalaman Kurang &quot;Menjual&quot;
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Menulis pekerjaan hanya sekadar &quot;mengerjakan tugas harian&quot;, tanpa metrik pencapaian (action verbs & angka dampak) yang dicari oleh user & HRD.
              </p>
            </Card>

            <Card className="p-6 border-slate-200/90 hover:border-slate-300">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold mb-4">
                3
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">
                Tidak Sesuai dengan Kata Kunci Lowongan
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Mengirim 1 CV generik untuk 50 lowongan berbeda tanpa mencocokkan kata kunci penting yang diminta dalam job description lowongan tersebut.
              </p>
            </Card>
          </div>
        </section>

        {/* ==================================================== */}
        {/* 3. HOW IT WORKS SECTION */}
        {/* ==================================================== */}
        <section id="cara-kerja" className="py-16 md:py-20 bg-slate-100/70 border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2">
                3 Langkah Sederhana
              </h2>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Cara Membuat CV Siap Kerja di CVPintar
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs text-center flex flex-col items-center">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg mb-4 shadow-sm">
                  1
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">Isi Data & Pengalaman</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Masukkan data diri, riwayat pendidikan, dan pengalaman kerja atau proyek organisasi yang pernah Anda ikuti.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs text-center flex flex-col items-center">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg mb-4 shadow-sm">
                  2
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">Optimasi dengan Asisten AI</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Gunakan tombol AI CV Writer untuk mengubah kalimat sederhana menjadi poin pencapaian berstandar profesional industri.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs text-center flex flex-col items-center">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg mb-4 shadow-sm">
                  3
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">Pilih Template & Export PDF</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Pilih template ATS favorit, periksa skor preview, dan langsung unduh dokumen PDF siap kirim ke portal karir.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================== */}
        {/* 3.5. CANVA-STYLE TEMPLATE SHOWCASE */}
        {/* ==================================================== */}
        <section id="template" className="py-16 md:py-24 bg-white border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" /> Desain Standar Industri
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                  Koleksi Template Desain CV Profesional
                </h2>
                <p className="text-sm text-slate-600 mt-2 max-w-xl">
                  Pilih dari puluhan desain ATS-friendly, Modern, Tech, Executive, Fresh Graduate, dan Creative yang siap disesuaikan untuk kebutuhan Anda.
                </p>
              </div>

              <Link href="/templates">
                <Button variant="accent" size="sm" rightIcon={<ArrowRight className="w-4 h-4 ml-1" />}>
                  Lihat Semua Template di Marketplace
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  name: 'Classic ATS Standard',
                  cat: 'ATS Friendly',
                  badge: 'FREE',
                  desc: 'Tata letak 1 kolom standar BUMN & multinasional.',
                  color: 'bg-slate-900',
                },
                {
                  name: 'Modern Professional',
                  cat: 'Modern',
                  badge: 'FREE',
                  desc: 'Header biru kontemporer untuk profesional muda.',
                  color: 'bg-blue-600',
                },
                {
                  name: 'Fresh Graduate Emerald',
                  cat: 'Fresh Graduate',
                  badge: 'FREE',
                  desc: 'Menonjolkan riwayat pendidikan, proyek, & organisasi.',
                  color: 'bg-emerald-600',
                },
                {
                  name: 'Tech & Software Engineer',
                  cat: 'Technology',
                  badge: 'PRO',
                  desc: 'Format monospace dengan GitHub & tech stack chips.',
                  color: 'bg-sky-600',
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="group bg-slate-50 rounded-2xl border border-slate-200 p-5 flex flex-col justify-between hover:shadow-lg hover:border-blue-300 transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                        {item.cat}
                      </span>
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                          item.badge === 'PRO'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {item.badge}
                      </span>
                    </div>

                    <div className="aspect-[3/4] bg-white rounded-xl border border-slate-200 shadow-xs mb-4 flex flex-col p-4 justify-between overflow-hidden relative group-hover:scale-[1.02] transition-transform">
                      <div className="space-y-1.5">
                        <div className={`w-1/2 h-3 rounded ${item.color}`} />
                        <div className="w-1/3 h-2 bg-slate-200 rounded" />
                        <div className="w-full h-1.5 bg-slate-100 rounded mt-3" />
                        <div className="w-4/5 h-1.5 bg-slate-100 rounded" />
                        <div className="w-full h-1.5 bg-slate-100 rounded mt-3" />
                        <div className="w-3/4 h-1.5 bg-slate-100 rounded" />
                      </div>
                      <div className="pt-2 border-t border-slate-100 flex gap-1">
                        <div className="w-8 h-2 bg-slate-200 rounded" />
                        <div className="w-8 h-2 bg-slate-200 rounded" />
                      </div>
                    </div>

                    <h3 className="font-bold text-slate-900 text-sm">{item.name}</h3>
                    <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
                  </div>

                  <Link href="/templates" className="mt-4 block">
                    <Button variant="secondary" size="sm" className="w-full text-xs font-semibold">
                      Lihat Template
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ==================================================== */}
        {/* 4. KEY FEATURES SHOWCASE */}
        {/* ==================================================== */}

        <section id="fitur" className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2">
              Fitur Lengkap
            </h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Semua yang Anda Butuhkan untuk Lolos Skrining CV
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Fitur 1 */}
            <Card className="p-6">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">AI CV Writer & STAR Formula</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Tulis deskripsi pengalaman sederhana Anda, AI CVPintar akan mengubahnya menjadi bullet point berbobot dengan metrik kuantitatif.
              </p>
            </Card>

            {/* Fitur 2 */}
            <Card className="p-6">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">ATS Score Checker</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Ketahui skor keterbacaan CV Anda sebelum dikirim ke HRD. Dapatkan rekomendasi kata kunci yang masih terlewat.
              </p>
            </Card>

            {/* Fitur 3 */}
            <Card className="p-6">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Job Description Analyzer</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Cukup paste lowongan kerja idaman Anda, AI akan mengekstrak kata kunci wajib dan keahlian yang harus ditonjolkan.
              </p>
            </Card>

            {/* Fitur 4 */}
            <Card className="p-6">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-4">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Template Standar HRD</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Koleksi template minimalis yang dirancang khusus agar mudah dipindai oleh software ATS Jobstreet, Glints, LinkedIn, maupun Workday.
              </p>
            </Card>

            {/* Fitur 5 */}
            <Card className="p-6">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-4">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Cover Letter Generator</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Buat surat lamaran kerja yang relevan dan menyatu dengan pengalaman di CV Anda hanya dalam satu kali klik.
              </p>
            </Card>

            {/* Fitur 6 */}
            <Card className="p-6">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Ekspor PDF Selektif Presisi</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Hasil PDF format A4 dengan teks murni yang bisa di-copy-paste sempurna oleh parser HR tanpa font rusak.
              </p>
            </Card>
          </div>
        </section>

        {/* ==================================================== */}
        {/* 5. PRICING TEASER */}
        {/* ==================================================== */}
        <section id="pricing" className="py-16 md:py-24 bg-white border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2">
              Harga Terjangkau
            </h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Investasi Terbaik untuk Langkah Awal Karir Anda
            </p>
            <p className="text-sm text-slate-600 mt-3 max-w-xl mx-auto">
              Mulai gratis hari ini. Upgrade ke paket Pro kapan saja dengan harga setara satu kali ngopi.
            </p>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
              {/* Free Card */}
              <div className="bg-slate-50 rounded-2xl border border-slate-200 p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-slate-900">Free Plan</h3>
                    <Badge variant="outline">Selamanya</Badge>
                  </div>
                  <div className="text-3xl font-extrabold text-slate-900 mb-4">Rp0</div>
                  <p className="text-xs text-slate-500 mb-6">
                    Sempurna untuk mahasiswa yang baru mulai membuat CV pertamanya.
                  </p>
                  <ul className="space-y-3 text-xs text-slate-700 mb-8">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>1 Dokumen CV</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>2 Template Dasar ATS (Classic & Modern)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>5x Asistensi AI CV Writer per hari</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Download PDF Standar (Watermark)</span>
                    </li>
                  </ul>
                </div>
                <Link href="/register" className="w-full">
                  <Button variant="secondary" className="w-full justify-center">
                    Mulai Gratis
                  </Button>
                </Link>
              </div>

              {/* Pro Card */}
              <div className="bg-gradient-to-b from-slate-900 to-slate-850 text-white rounded-2xl border border-slate-800 p-8 flex flex-col justify-between relative shadow-xl">
                <div className="absolute -top-3 right-6">
                  <Badge variant="pro" className="px-3 py-1">
                    Paling Populer
                  </Badge>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-white">CVPintar Pro</h3>
                    <Sparkles className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-3xl font-extrabold text-white">{PRO_PRICE_RAW_LABEL}</span>
                    <span className="text-xs text-slate-400">/ bulan</span>
                  </div>

                  <p className="text-xs text-slate-300 mb-6">
                    Akses tanpa batas ke semua fitur AI cerdas & lolos ATS lebih cepat.
                  </p>
                  <ul className="space-y-3 text-xs text-slate-200 mb-8">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                      <span><strong>Unlimited CV</strong> & Riwayat Tanpa Batas</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                      <span><strong>Semua Template Premium</strong> ATS</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                      <span><strong>AI Writer & Rewrite</strong> Prioritas (100x/hari)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                      <span><strong>ATS Score Checker & Job Analyzer</strong></span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                      <span><strong>Cover Letter Generator</strong> Otomatis</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                      <span><strong>PDF Bersih Tanpa Watermark</strong></span>
                    </li>
                  </ul>
                </div>
                <Link href="/pricing" className="w-full">
                  <Button variant="accent" className="w-full justify-center bg-blue-600 hover:bg-blue-500 py-2.5">
                    Upgrade ke Pro Sekarang
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================== */}
        {/* 6. FAQ SECTION */}
        {/* ==================================================== */}
        <section className="py-16 md:py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2">
              FAQ
            </h2>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Pertanyaan yang Sering Diajukan
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 mb-1">
                Apakah template di CVPintar benar-benar ATS-friendly?
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Ya! Template CVPintar dirancang dengan hierarki satu kolom/standar baku, font universal, dan struktur teks murni yang terbaca jelas oleh algoritma parser ATS perusahaan.
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 mb-1">
                Apakah AI akan mengarang pengalaman kerja palsu?
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Tidak. Asisten AI CVPintar memegang teguh prinsip kebenaran (No Hallucination). AI hanya bertugas menyempurnakan tata bahasa, struktur kalimat STAR, dan kata kerja aktif berdasarkan data fakta yang Anda masukkan.
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 mb-1">
                Metode pembayaran apa saja yang didukung?
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Kami mendukung pembayaran instan melalui DOKU Payment Gateway: QRIS (GoPay, OVO, Dana, ShopeePay), Virtual Account BCA, Mandiri, BNI, BRI, dan metode lainnya.
              </p>
            </div>
          </div>
        </section>

        {/* ==================================================== */}
        {/* 7. FINAL CTA */}
        {/* ==================================================== */}
        <section className="py-16 bg-slate-900 text-white text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Siap Raih Undangan Interview Kerja Pertama Anda?
            </h2>
            <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
              Gabung dengan ribuan job seeker Indonesia lainnya dan buat CV ATS profesional dalam 5 menit.
            </p>
            <div>
              <Link href="/register">
                <Button size="lg" variant="accent" className="bg-blue-600 hover:bg-blue-500 text-base py-3 px-8">
                  Buat CV Gratis Sekarang
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Promotional Popup Notification Modal & Widget */}
      <PromoPopup />
    </div>
  );
}

