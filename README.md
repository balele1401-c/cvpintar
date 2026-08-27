# KerjaAI — AI CV & Job Application SaaS MVP

> **"Bikin CV yang lebih siap kerja dalam hitungan menit."**

Platform SaaS berbasis AI yang dirancang khusus untuk mahasiswa, fresh graduate, dan pencari kerja di Indonesia dalam membuat CV profesional berstandar ATS, cover letter, dan optimasi lamaran kerja.

---

## 🚀 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS v4 & Lucide Icons
- **Database & Auth**: Supabase (PostgreSQL, Row Level Security, Supabase Auth)
- **AI Abstraction**: Server-side AI Provider (`lib/ai/` supporting Gemini, OpenAI, Anthropic)
- **Payment Gateway**: DOKU Payment Gateway (Sandbox & Production)
- **Document Export**: Native A4 Print & PDF Rendering

---

## 📁 Struktur Folder

```text
kerjaai/
├── app/                  # Next.js App Router (Marketing, Auth, Dashboard, CV Builder, API)
├── components/           # Reusable UI & Feature components
│   ├── ui/               # Base UI (Button, Input, Card, Modal, Badge, Toast)
│   ├── layout/           # Navbar, Footer, Sidebar
│   ├── cv/               # CV Stepper, Preview & Templates
│   ├── dashboard/        # Dashboard stats & CV cards
│   ├── pricing/          # Pricing comparison tables
│   └── paywall/          # Pro Feature Paywall Modal
├── lib/                  # Server-side & shared business logic
│   ├── ai/               # AI Provider Abstraction
│   ├── doku/             # DOKU API & Webhook verification
│   ├── supabase/         # Supabase client & server instances
│   ├── constants.ts      # Feature matrix & pricing config
│   └── utils.ts          # Formatting & helper utilities
├── supabase/
│   └── migrations/       # PostgreSQL schema & RLS policies
├── types/                # Strict TypeScript interfaces
├── .env.example          # Environment variables template (No secrets!)
└── PRD_KerjaAI.md        # Product Requirements Document (Source of Truth)
```

---

## 🛠️ Panduan Menjalankan Project (Local Development)

### 1. Prasyarat
- Node.js 20+
- npm / pnpm / yarn

### 2. Instalasi Dependensi
```bash
npm install
```

### 3. Setup Environment Variables
Salin file `.env.example` menjadi `.env.local`:
```bash
cp .env.example .env.local
```
Lengkapi nilai konfigurasi sesuai kebutuhan:
- `NEXT_PUBLIC_SUPABASE_URL` & `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `AI_API_KEY` (Gemini / OpenAI API Key)
- `DOKU_CLIENT_ID` & `DOKU_SECRET_KEY` (DOKU Sandbox)

### 4. Menjalankan Dev Server
```bash
npm run dev
```
Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

---

## 🔒 Aturan Keamanan Penting

1. **Rahasia di Server**: Kunci API DOKU, Service Role Key Supabase, dan Kunci API AI **TIDAK BOLEH** terekspos ke browser / client-side code.
2. **Tidak Ada Kredensial di Git**: Jangan pernah melakukan commit file `.env.local` atau kredensial nyata ke repositori.
3. **Database Authorization**: Semua akses data diverifikasi menggunakan Supabase Row Level Security (RLS).
4. **Idempotent Webhooks**: Pembayaran DOKU diverifikasi secara ketat melalui signature server-to-server sebelum mengaktifkan status Pro.

---

## 📊 Matriks Fitur (Free vs Pro)

| Fitur | Free (Rp0) | Pro (Rp29.000 / bln) |
| :--- | :--- | :--- |
| **Batas CV** | 1 CV | Unlimited |
| **Template CV** | 2 Template Dasar (Classic & Modern) | Semua Template Premium |
| **AI CV Writer & Rewrite** | 5x per hari | 100x per hari (Fair-use) |
| **ATS Score & Checker** | 🔒 Fitur Pro | ✅ Ya |
| **Job Description Analyzer** | 🔒 Fitur Pro | ✅ Ya |
| **Cover Letter Generator** | 🔒 Fitur Pro | ✅ Ya |
| **Watermark PDF** | Terdapat Watermark | Bebas Watermark |

---

## 🧪 Validasi & Pengujian

- Linting: `npm run lint`
- Type checking: `npx tsc --noEmit`
- Production build: `npm run build`
