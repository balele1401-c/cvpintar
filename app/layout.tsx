import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#1e293b',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://cvpintarku.my.id'),
  title: {
    default: 'CVPintar — Buat CV Profesional dengan AI dalam Hitungan Menit',
    template: '%s | CVPintar',
  },
  description:
    'Platform AI CV & Lamaran Kerja untuk mahasiswa, fresh graduate, dan job seeker di Indonesia. Buat CV ATS-friendly, optimasi dengan AI, dan siap kerja.',
  keywords: [
    'CV ATS',
    'Bikin CV',
    'AI CV Generator',
    'CVPintar',
    'Lamaran Kerja Indonesia',
    'Resume Builder',
    'Format Standar HRD',
    'Cek Skor ATS',
  ],
  authors: [{ name: 'CVPintar', url: 'https://cvpintarku.my.id' }],
  creator: 'CVPintar',
  publisher: 'CVPintar',
  alternates: {
    canonical: 'https://cvpintarku.my.id/',
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: 'https://cvpintarku.my.id/',
    siteName: 'CVPintar',
    title: 'CVPintar — Buat CV Profesional dengan AI dalam Hitungan Menit',
    description:
      'Platform AI CV & Lamaran Kerja untuk mahasiswa, fresh graduate, dan job seeker di Indonesia. Buat CV ATS-friendly, optimasi dengan AI, dan siap kerja.',
    images: [
      {
        url: 'https://cvpintarku.my.id/logo.png',
        width: 1200,
        height: 630,
        alt: 'CVPintar AI CV Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CVPintar — Buat CV Profesional dengan AI dalam Hitungan Menit',
    description:
      'Platform AI CV & Lamaran Kerja untuk mahasiswa, fresh graduate, dan job seeker di Indonesia. Buat CV ATS-friendly, optimasi dengan AI, dan siap kerja.',
    images: ['https://cvpintarku.my.id/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 selection:bg-blue-100 selection:text-blue-900">
        {children}
      </body>
    </html>
  );
}
