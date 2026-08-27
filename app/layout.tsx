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
  title: 'CVPintar — Buat CV Profesional dengan AI dalam Hitungan Menit',
  description:
    'Platform AI CV & Lamaran Kerja untuk mahasiswa, fresh graduate, dan job seeker di Indonesia. Buat CV ATS-friendly, optimasi dengan AI, dan siap kerja.',
  keywords: ['CV ATS', 'Bikin CV', 'AI CV Generator', 'CVPintar', 'Lamaran Kerja Indonesia', 'Resume Builder'],
  authors: [{ name: 'CVPintar' }],
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
