import { CVContent } from '@/types';

export const SAMPLE_CV_DATA: CVContent = {
  personalInfo: {
    fullName: 'Dimas Wicaksono, S.Kom.',
    professionalTitle: 'Senior Software Engineer & Tech Lead',
    email: 'dimas.wicaksono@email.com',
    phone: '+62 812-3456-7890',
    location: 'Jakarta Selatan, Indonesia',
    linkedIn: 'linkedin.com/in/dimas-wicaksono',
    github: 'github.com/dimas-w',
    portfolio: 'dimaswicaksono.dev',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    summary:
      'Software Engineer dengan 5+ tahun pengalaman dalam membangun aplikasi berskala tinggi menggunakan TypeScript, React, Next.js, dan Go. Terbukti memimpin tim lintas fungsi yang meningkatkan performa sistem sebesar 40% dan mengurangi latency transaksi perbankan.',

  },
  experience: [
    {
      id: 'exp-1',
      company: 'PT Fintek Karya Nusantara (LinkAja)',
      position: 'Senior Software Engineer (Lead)',
      location: 'Jakarta',
      startDate: '2022-01',
      endDate: '2024-05',
      current: true,
      description:
        'Memimpin arsitektur frontend web portal mitra merchant dengan lebih dari 2.5 juta pengguna aktif bulanan.',
      achievements: [
        'Merancang arsitektur micro-frontend yang mempercepat rilis modul baru sebesar 35%.',
        'Mengurangi bundle size aplikasi sebesar 45% dan meningkatkan skor Core Web Vitals ke 98/100.',
        'Membimbing 6 junior engineer dalam penerapan automated testing (Jest, Cypress) hingga coverage mencapai 85%.',
      ],
    },
    {
      id: 'exp-2',
      company: 'Bukalapak',
      position: 'Frontend Engineer',
      location: 'Jakarta',
      startDate: '2020-03',
      endDate: '2021-12',
      current: false,
      description:
        'Mengembangkan modul checkout dan integrasi payment gateway untuk platform e-commerce.',
      achievements: [
        'Mengembangkan fitur 1-click checkout yang meningkatkan conversion rate transaksi sebesar 12%.',
        'Mengintegrasikan 5 metode pembayaran baru (QRIS, VA Bank, E-Wallet) tanpa downtime.',
      ],
    },
  ],
  education: [
    {
      id: 'edu-1',
      institution: 'Universitas Indonesia',
      degree: 'Sarjana Komputer (S.Kom.)',
      fieldOfStudy: 'Ilmu Komputer (IPK 3.84 / 4.00)',
      startDate: '2016-08',
      endDate: '2020-02',
      description: 'Lulus dengan predikat Cum Laude. Ketua Tim Lab Rekayasa Perangkat Lunak.',
    },
  ],
  skills: [
    { id: 'sk-1', name: 'TypeScript / JavaScript', category: 'technical', level: 'Expert' },
    { id: 'sk-2', name: 'React / Next.js', category: 'technical', level: 'Expert' },
    { id: 'sk-3', name: 'Node.js / Express / Go', category: 'technical', level: 'Advanced' },
    { id: 'sk-4', name: 'PostgreSQL / Supabase / Redis', category: 'technical', level: 'Advanced' },
    { id: 'sk-5', name: 'CI/CD & Docker', category: 'technical', level: 'Intermediate' },
    { id: 'sk-6', name: 'Technical Leadership & Mentoring', category: 'soft', level: 'Expert' },
    { id: 'sk-7', name: 'Bahasa Indonesia (Native) & Inggris (Fluent)', category: 'language', level: 'Expert' },
  ],
  projects: [
    {
      id: 'proj-1',
      name: 'Omnichannel Merchant Portal',
      description:
        'Dashboard terpadu analytics transaksi UMKM dengan real-time WebSocket reporting.',
      technologies: ['Next.js', 'TailwindCSS', 'Go', 'Redis', 'PostgreSQL'],
      url: 'https://github.com/dimas-w/merchant-portal',
      startDate: '2023-02',
      endDate: '2023-08',
    },
  ],
  organizations: [
    {
      id: 'org-1',
      organization: 'Google Developer Student Clubs (GDSC) UI',
      position: 'Lead Organizer & Speaker',
      period: '2019 - 2020',
      description:
        'Menyelenggarakan 14 workshop teknologi web dan mobile untuk 1.200+ mahasiswa se-Jabodetabek.',
    },
  ],
};
