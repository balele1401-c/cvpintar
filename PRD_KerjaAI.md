# PRD --- KerjaAI

## AI CV & Job Application SaaS

**Version:** 1.0.0\
**Status:** MVP / Vibe Coding\
**Target:** Mahasiswa, fresh graduate, job seeker Indonesia\
**Business Model:** Freemium → Pro\
**Payment Gateway:** DOKU\
**Primary Goal:** Mendapatkan user dan validasi pembayaran pertama
dengan produk SaaS yang sederhana.

------------------------------------------------------------------------

## 1. Product Overview

### Product Name

**KerjaAI**

### Tagline

**"Bikin CV yang lebih siap kerja dalam hitungan menit."**

### Problem

Banyak mahasiswa dan pencari kerja mengalami kesulitan: - membuat CV
yang profesional; - menyesuaikan CV dengan lowongan tertentu; - menulis
pengalaman kerja agar terdengar profesional; - memahami apakah CV mereka
ATS-friendly; - membuat cover letter; - mempersiapkan diri untuk
interview.

### Solution

KerjaAI adalah SaaS berbasis AI yang membantu pengguna membuat dan
mengoptimalkan CV serta dokumen lamaran kerja.

Pengguna dapat menggunakan fitur dasar secara gratis dan melakukan
upgrade ke paket Pro untuk mendapatkan fitur AI dan template yang lebih
lengkap.

------------------------------------------------------------------------

# 2. Target Users

## Primary User

### Mahasiswa

-   mahasiswa semester akhir;
-   mahasiswa yang mencari internship;
-   mahasiswa yang mencari kerja part-time;
-   mahasiswa yang baru mulai membuat CV.

### Fresh Graduate

-   belum memiliki banyak pengalaman;
-   membutuhkan CV profesional;
-   membutuhkan bantuan menulis pengalaman dan skill.

### Job Seeker

-   ingin menyesuaikan CV dengan lowongan;
-   ingin meningkatkan ATS score;
-   ingin membuat cover letter.

------------------------------------------------------------------------

# 3. Product Goals

## MVP Goals

1.  User dapat membuat akun.
2.  User dapat membuat CV.
3.  User dapat menggunakan AI untuk membantu mengisi CV.
4.  User dapat memilih template CV.
5.  User dapat melihat preview CV.
6.  User dapat export CV ke PDF.
7.  User memiliki batas penggunaan pada Free Plan.
8.  User dapat melihat fitur Pro.
9.  User dapat melakukan pembayaran melalui DOKU.
10. Setelah pembayaran berhasil dan terverifikasi, akun otomatis
    mendapatkan akses Pro.

## Success Metrics

Target validasi awal:

-   100 registered users;
-   30 users membuat CV;
-   10 users mencoba fitur AI;
-   minimal 1 user melakukan pembayaran;
-   conversion awal Free → Pro mulai terukur.

**Target terpenting MVP: mendapatkan pembayaran pertama.**

------------------------------------------------------------------------

# 4. Business Model

## Freemium

### Free --- Rp0

Fitur: - membuat 1 CV; - 2 template dasar; - AI generation terbatas; -
basic CV editor; - preview CV; - export PDF terbatas; - basic profile.

### Pro --- Rp29.000/bulan

Fitur: - unlimited CV; - semua template; - AI CV Writer; - AI Rewrite; -
ATS Checker; - Job Description Analyzer; - AI CV Optimization; - Cover
Letter Generator; - interview question generator; - PDF tanpa
watermark; - riwayat CV; - priority AI usage.

### Future Plan

Harga dapat diubah setelah validasi pasar.

Kemungkinan paket: - Pro Monthly; - Pro Yearly; - Student Plan; -
Lifetime Deal.

------------------------------------------------------------------------

# 5. Core User Flow

## Registration

``` text
Landing Page
    ↓
Daftar / Login
    ↓
Dashboard
    ↓
Create CV
```

## Create CV

``` text
Create CV
    ↓
Input Personal Information
    ↓
Education
    ↓
Experience
    ↓
Skills
    ↓
Projects
    ↓
AI Enhancement
    ↓
Choose Template
    ↓
Preview
    ↓
Export PDF
```

## Upgrade

``` text
User mencoba fitur Pro
    ↓
Upgrade Modal
    ↓
Pilih Pro
    ↓
Checkout DOKU
    ↓
Payment
    ↓
DOKU Callback / Notification
    ↓
Backend Verify
    ↓
Update Subscription
    ↓
User menjadi PRO
```

------------------------------------------------------------------------

# 6. MVP Features

## 6.1 Authentication

### Features

-   Register;
-   Login;
-   Logout;
-   Forgot password;
-   Session management.

### User Data

``` text
users
- id
- email
- name
- avatar_url
- plan
- created_at
- updated_at
```

Default:

``` text
plan = "free"
```

------------------------------------------------------------------------

# 7. Dashboard

Dashboard harus menampilkan:

-   greeting user;
-   current plan;
-   jumlah CV;
-   penggunaan AI;
-   CV terakhir;
-   tombol Create CV;
-   tombol Upgrade Pro;
-   recent activity.

Contoh:

``` text
Welcome back, Iqbal 👋

Plan
FREE

CV Created
1 / 1

AI Usage
4 / 5

[ Create New CV ]

Recent CV
Frontend Developer CV
Updated 2 hours ago
```

------------------------------------------------------------------------

# 8. CV Builder

## Personal Information

Fields:

-   full name;
-   professional title;
-   email;
-   phone;
-   location;
-   LinkedIn;
-   GitHub;
-   portfolio;
-   profile summary.

## Education

Fields:

-   institution;
-   degree;
-   field of study;
-   start date;
-   end date;
-   description.

## Experience

Fields:

-   company;
-   position;
-   location;
-   start date;
-   end date;
-   description.

## Skills

-   skill name;
-   proficiency level.

## Projects

-   project name;
-   description;
-   technologies;
-   URL.

## Organizations

-   organization;
-   position;
-   description;
-   period.

------------------------------------------------------------------------

# 9. AI Features

## AI CV Writer

User memasukkan informasi sederhana.

Example:

``` text
Saya pernah membuat aplikasi laundry
menggunakan Flutter dan Firebase.
```

AI menghasilkan:

``` text
Developed a laundry management application using
Flutter and Firebase, implementing user authentication,
transaction management, and cloud-based data storage.
```

------------------------------------------------------------------------

## AI Rewrite

User memilih text.

AI memberikan:

-   professional version;
-   concise version;
-   achievement-focused version.

------------------------------------------------------------------------

## AI Summary Generator

Input: - education; - experience; - skills; - target role.

Output: - professional summary.

------------------------------------------------------------------------

# 10. ATS Checker

User memasukkan atau memilih target job.

System menganalisis:

-   keywords;
-   skills;
-   job title;
-   experience relevance;
-   missing keywords;
-   readability;
-   structure.

Example:

``` text
ATS SCORE

78 / 100

Strengths
✓ Relevant technical skills
✓ Clear education section
✓ Good keyword coverage

Missing
! REST API
! Git
! Agile

Recommendation
Add relevant experience involving
REST API and Git if applicable.
```

**Catatan:** Sistem tidak boleh menyuruh user memalsukan pengalaman atau
skill.

------------------------------------------------------------------------

# 11. Job Description Analyzer

User paste job description.

System menghasilkan:

-   required skills;
-   preferred skills;
-   keywords;
-   role summary;
-   CV recommendations.

Example:

``` text
Target Role:
Junior Software Developer

Important Keywords:
- JavaScript
- React
- Git
- REST API
- SQL

Recommended CV Focus:
1. Project experience
2. Git/GitHub
3. API development
```

------------------------------------------------------------------------

# 12. Cover Letter Generator

Input:

-   CV;
-   job description;
-   company;
-   target position.

Output:

-   professional cover letter.

Free user: - limited generations.

Pro: - unlimited within reasonable fair-use limits.

------------------------------------------------------------------------

# 13. Interview Preparation

AI generates:

-   interview questions;
-   technical questions;
-   HR questions;
-   suggested answers;
-   improvement feedback.

Future feature: - AI mock interview with voice.

------------------------------------------------------------------------

# 14. Templates

## Free Templates

Minimum MVP: 1. Classic; 2. Modern.

## Pro Templates

Future: 1. Professional; 2. Minimal; 3. Tech; 4. Corporate; 5. Creative.

Templates harus ATS-friendly dan tidak terlalu bergantung pada elemen
grafis.

------------------------------------------------------------------------

# 15. PDF Export

Requirements:

-   A4;
-   selectable text;
-   clean layout;
-   consistent typography;
-   page break handling;
-   no broken sections;
-   no unnecessary graphics.

Free: - basic export; - optional watermark.

Pro: - no watermark; - premium templates.

------------------------------------------------------------------------

# 16. Subscription System

## Subscription States

``` text
free
active
expired
cancelled
```

Database:

``` text
subscriptions
- id
- user_id
- plan
- status
- provider
- provider_reference
- started_at
- expires_at
- created_at
- updated_at
```

------------------------------------------------------------------------

# 17. DOKU Payment Integration

## Payment Flow

``` text
Frontend
   ↓
Request Checkout
   ↓
Backend
   ↓
Create DOKU Payment
   ↓
Return Checkout URL / Payment Data
   ↓
User Pays
   ↓
DOKU
   ↓
Notification / Callback
   ↓
Backend
   ↓
Verify Payment
   ↓
Update Subscription
```

## Security Requirements

-   DOKU secret credentials hanya di server;
-   jangan expose secret key ke browser;
-   jangan commit credentials ke Git;
-   gunakan environment variables;
-   validasi callback;
-   idempotent payment processing;
-   jangan mengaktifkan Pro hanya berdasarkan data frontend;
-   simpan transaction/reference ID;
-   log payment status.

### Example Environment Variables

``` env
DOKU_CLIENT_ID=
DOKU_SECRET_KEY=
DOKU_ENVIRONMENT=sandbox

NEXT_PUBLIC_APP_URL=
```

**Jangan memasukkan nilai credential asli ke repository.**

------------------------------------------------------------------------

# 18. Payment States

``` text
PENDING
SUCCESS
FAILED
EXPIRED
CANCELLED
```

Jika:

``` text
SUCCESS
```

maka:

``` text
subscriptions.status = active
users.plan = pro
```

Jika pembayaran gagal:

``` text
users.plan tetap free
```

------------------------------------------------------------------------

# 19. Usage Limiting

## Free

Contoh:

``` text
CV_LIMIT = 1
AI_GENERATION_LIMIT = 5 / day
TEMPLATE_LIMIT = 2
COVER_LETTER = locked
ATS_CHECKER = locked
```

## Pro

``` text
CV_LIMIT = unlimited
AI_GENERATION = generous fair-use limit
TEMPLATE = all
ATS_CHECKER = enabled
COVER_LETTER = enabled
```

Limit harus configurable, bukan hard-coded di banyak file.

------------------------------------------------------------------------

# 20. Paywall UX

Jika user mengakses fitur Pro:

``` text
┌─────────────────────────────┐
│ 🔒 Fitur Pro                │
│                             │
│ ATS Checker tersedia        │
│ untuk pengguna Pro.         │
│                             │
│ ✓ Analisis CV               │
│ ✓ ATS Score                 │
│ ✓ Keyword recommendations   │
│                             │
│ [ Upgrade ke Pro ]          │
└─────────────────────────────┘
```

Paywall harus jelas tetapi tidak mengganggu pengalaman user.

------------------------------------------------------------------------

# 21. Landing Page

Sections:

1.  Hero;
2.  Problem;
3.  How It Works;
4.  Features;
5.  AI Demo;
6.  Templates;
7.  Pricing;
8.  FAQ;
9.  CTA.

Hero:

``` text
Bikin CV yang Lebih Siap Kerja
dengan Bantuan AI.

Buat, optimalkan, dan cek CV kamu
dalam hitungan menit.

[ Buat CV Gratis ]
```

------------------------------------------------------------------------

# 22. Pricing Page

### FREE

``` text
Rp0

✓ 1 CV
✓ Basic templates
✓ Limited AI
✓ PDF export
```

### PRO

``` text
Rp29.000 / bulan

✓ Unlimited CV
✓ All templates
✓ AI Writer
✓ ATS Checker
✓ Job Analyzer
✓ Cover Letter
✓ Interview Prep
✓ No watermark

[ Upgrade ke Pro ]
```

------------------------------------------------------------------------

# 23. Admin Dashboard

MVP admin:

-   total users;
-   free users;
-   pro users;
-   revenue;
-   transactions;
-   failed payments;
-   AI usage;
-   recent registrations.

Admin tidak boleh melihat data sensitif user tanpa kebutuhan yang jelas.

------------------------------------------------------------------------

# 24. Database Schema

## profiles

``` text
id
user_id
full_name
avatar_url
plan
created_at
updated_at
```

## cvs

``` text
id
user_id
title
template_id
content_json
created_at
updated_at
```

## subscriptions

``` text
id
user_id
plan
status
provider
provider_reference
started_at
expires_at
created_at
updated_at
```

## payments

``` text
id
user_id
subscription_id
provider
provider_reference
amount
currency
status
paid_at
created_at
updated_at
```

## ai_usage

``` text
id
user_id
feature
usage_count
usage_date
created_at
```

------------------------------------------------------------------------

# 25. Recommended Tech Stack

## Frontend

``` text
Next.js
TypeScript
Tailwind CSS
shadcn/ui
```

## Backend

``` text
Next.js API Routes / Server Actions
```

## Database

``` text
Supabase PostgreSQL
Supabase Auth
```

## AI

Use an AI provider with an available developer/free tier for MVP.

Create an abstraction:

``` text
lib/ai/
```

Do not tightly couple the entire application to one model provider.

## Payment

``` text
DOKU
```

Start with sandbox/testing before production.

## PDF

``` text
react-pdf
```

or another maintained PDF generation library compatible with the
selected architecture.

## Deployment

``` text
Vercel
Supabase
```

------------------------------------------------------------------------

# 26. Project Structure

Recommended:

``` text
kerjaai/
├── app/
│   ├── (marketing)/
│   ├── auth/
│   ├── dashboard/
│   ├── cv/
│   ├── pricing/
│   ├── checkout/
│   ├── api/
│   │   ├── ai/
│   │   ├── payments/
│   │   └── webhooks/
│   └── admin/
│
├── components/
│   ├── ui/
│   ├── cv/
│   ├── dashboard/
│   ├── pricing/
│   └── paywall/
│
├── lib/
│   ├── ai/
│   ├── doku/
│   ├── supabase/
│   ├── pdf/
│   └── utils/
│
├── types/
├── public/
├── supabase/
│   └── migrations/
│
├── .env.local
├── .env.example
├── README.md
└── package.json
```

------------------------------------------------------------------------

# 27. Security

Requirements:

-   Row Level Security pada database;
-   user hanya dapat mengakses CV miliknya;
-   server-side authorization;
-   validate input;
-   rate limiting untuk AI;
-   payment webhook verification;
-   idempotency untuk payment;
-   secret credentials hanya di environment variables;
-   jangan commit `.env.local`;
-   jangan commit API keys;
-   sanitize user-generated content;
-   audit payment events.

### `.gitignore`

``` text
.env
.env.local
.env.*.local
```

------------------------------------------------------------------------

# 28. AI Safety & Quality

AI tidak boleh:

-   mengarang pengalaman kerja;
-   mengarang pendidikan;
-   mengarang sertifikasi;
-   mengarang skill yang tidak dimiliki user;
-   menyarankan user memalsukan informasi.

Jika user tidak memiliki pengalaman tertentu, AI harus membantu
**menyusun informasi yang benar**, bukan membuat pengalaman palsu.

------------------------------------------------------------------------

# 29. MVP Scope

## WAJIB

-   [ ] Landing page
-   [ ] Authentication
-   [ ] Dashboard
-   [ ] CV builder
-   [ ] CV storage
-   [ ] 2 templates
-   [ ] AI CV Writer
-   [ ] AI Rewrite
-   [ ] PDF export
-   [ ] Free usage limits
-   [ ] Pricing page
-   [ ] Pro paywall
-   [ ] DOKU sandbox
-   [ ] Payment webhook
-   [ ] Subscription activation
-   [ ] Basic admin dashboard

## JANGAN DULU

-   [ ] Mobile app
-   [ ] Voice interview
-   [ ] Team collaboration
-   [ ] Marketplace
-   [ ] Social network
-   [ ] Complex analytics
-   [ ] Multi-language
-   [ ] Enterprise SSO
-   [ ] Complex referral system

------------------------------------------------------------------------

# 30. Vibe Coding Development Strategy

Build in small vertical slices.

## Sprint 1 --- Foundation

``` text
Project setup
Supabase
Auth
Database
Dashboard
```

## Sprint 2 --- CV Builder

``` text
CV schema
CV editor
CV autosave
CV preview
Templates
```

## Sprint 3 --- AI

``` text
AI service
AI CV Writer
AI Rewrite
Usage limits
```

## Sprint 4 --- PDF

``` text
PDF renderer
A4 layout
Export
Watermark
```

## Sprint 5 --- Monetization

``` text
Pricing
Paywall
Subscription
DOKU sandbox
Payment callback
Payment verification
```

## Sprint 6 --- Polish

``` text
Responsive UI
Error states
Loading states
Empty states
Security
Testing
Deployment
```

------------------------------------------------------------------------

# 31. Definition of Done

MVP dianggap selesai jika:

-   user dapat register;
-   user dapat login;
-   user dapat membuat CV;
-   user dapat menyimpan CV;
-   AI dapat membantu menulis CV;
-   user dapat preview CV;
-   user dapat export PDF;
-   free limits bekerja;
-   Pro features terkunci untuk Free;
-   user dapat masuk ke checkout DOKU sandbox;
-   payment notification dapat diproses;
-   payment berhasil mengubah subscription menjadi Pro;
-   refresh/logout/login tetap mempertahankan status Pro;
-   credentials tidak masuk GitHub;
-   aplikasi dapat di-deploy;
-   tidak ada critical error pada core flow.

------------------------------------------------------------------------

# 32. First Revenue Strategy

Target pertama bukan 1.000 user.

Target:

``` text
1 user
↓
1 payment
↓
Rp29.000 pertama
```

Strategi awal:

1.  Deploy MVP.
2.  Berikan akses Free.
3.  Cari mahasiswa/fresh graduate.
4.  Minta mereka membuat CV.
5.  Amati fitur yang paling sering digunakan.
6.  Perbaiki UX.
7.  Tawarkan Pro.
8.  Targetkan pembayaran pertama.

Setelah pembayaran pertama:

``` text
1 → 10 → 50 → 100 users
```

Jangan scale sebelum menemukan bukti bahwa orang benar-benar mau
membayar.

------------------------------------------------------------------------

# 33. Product Principle

> **Build small. Launch fast. Get one paying user. Then improve.**

KerjaAI bukan bertujuan menjadi platform karier lengkap pada versi
pertama.

Fokus MVP:

**Create CV → Improve CV with AI → Export → Upgrade → Pay with DOKU.**

Jika core flow tersebut berhasil menghasilkan pembayaran, fitur
berikutnya baru dibangun berdasarkan feedback user.

------------------------------------------------------------------------

# 34. Vibe Coding Prompt

Gunakan PRD ini sebagai source of truth.

Saat melakukan vibe coding:

``` text
You are building KerjaAI, a production-oriented MVP SaaS.

Read PRD.md before implementing anything.

Rules:
1. Do not build features outside the current MVP scope unless required.
2. Prefer simple architecture over premature abstraction.
3. Use TypeScript strictly.
4. Keep secrets server-side.
5. Never expose DOKU secret credentials to the client.
6. Use environment variables.
7. Implement authorization on the server.
8. Use Supabase Row Level Security.
9. Keep payment processing idempotent.
10. Never trust frontend payment status.
11. Validate DOKU webhook/payment notifications before activating Pro.
12. Keep Free/Pro limits configurable.
13. Build one complete vertical slice at a time.
14. Do not leave fake payment success logic in production code.
15. Use clear loading, error, empty, and success states.
16. Keep the UI responsive.
17. Write reusable components only when reuse is actually needed.
18. Do not over-engineer the MVP.
19. Before adding a dependency, verify whether the existing stack can solve the problem.
20. After each feature, test the complete user flow.

Current priority:

AUTH → CV BUILDER → AI → PDF → PAYWALL → DOKU → PRO ACTIVATION.

The first business objective is to obtain the first real paying user.
```

------------------------------------------------------------------------

# 35. Final MVP Flow

``` text
LANDING
   ↓
REGISTER
   ↓
DASHBOARD
   ↓
CREATE CV
   ↓
AI HELP
   ↓
SELECT TEMPLATE
   ↓
PREVIEW
   ↓
EXPORT PDF
   ↓
USER HITS PRO FEATURE
   ↓
PAYWALL
   ↓
DOKU
   ↓
PAYMENT
   ↓
WEBHOOK
   ↓
VERIFY
   ↓
PRO ACTIVATED
   ↓
USER USES PREMIUM FEATURES
```

## Core KPI

**First paying customer.**
