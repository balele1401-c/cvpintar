'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  Users,
  CreditCard,
  TrendingUp,
  FileText,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { formatRupiah, formatDate } from '@/lib/utils';
import { Payment, Profile } from '@/types';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Metrics
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [proUsers, setProUsers] = useState<number>(0);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [totalCVs, setTotalCVs] = useState<number>(0);
  const [recentProfiles, setRecentProfiles] = useState<Profile[]>([]);
  const [recentPayments, setRecentPayments] = useState<Payment[]>([]);

  useEffect(() => {
    async function loadAdminMetrics() {
      try {
        const supabase = createClient();
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          router.push('/login?next=/admin');
          return;
        }

        setUserEmail(session.user.email || null);

        // Fetch securely from server-side admin endpoint
        const res = await fetch('/api/admin/metrics');
        if (!res.ok) {
          setIsAdmin(false);
          setIsLoading(false);
          return;
        }

        const data = await res.json();
        setIsAdmin(true);
        setTotalUsers(data.metrics.totalUsers);
        setProUsers(data.metrics.proUsers);
        setTotalRevenue(data.metrics.totalRevenue);
        setTotalCVs(data.metrics.totalCVs);
        setRecentProfiles(data.recentProfiles || []);
        setRecentPayments(data.recentPayments || []);
      } catch (err) {
        console.error('Error fetching admin metrics:', err);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    }

    loadAdminMetrics();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-slate-50 p-4">
        <Card className="p-8 max-w-md text-center space-y-4 shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Akses Ditolak (403)</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Halaman ini hanya dapat diakses oleh administrator resmi yang terdaftar di konfigurasi sistem CVPintar.
          </p>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold"
          >
            Kembali ke Dashboard
          </button>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar userEmail={userEmail} userPlan="pro" />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Admin & Business Metrics
            </h1>
            <Badge variant="pro">ADMIN SECURED</Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Monitoring performa produk, konversi pengguna Free ke Pro, dan total pendapatan transaksi DOKU.
          </p>
        </div>

        {/* Top KPIs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5 bg-white">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>Total Pengguna Terdaftar</span>
              <Users className="w-4 h-4 text-blue-600" />
            </div>
            <div className="mt-3 text-3xl font-extrabold text-slate-900">
              {totalUsers}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Mahasiswa & Job Seeker</p>
          </Card>

          <Card className="p-5 bg-white">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>Pelanggan Aktif Pro</span>
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="mt-3 text-3xl font-extrabold text-emerald-600">
              {proUsers}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Konversi: {totalUsers > 0 ? `${((proUsers / totalUsers) * 100).toFixed(1)}%` : '0%'}
            </p>
          </Card>

          <Card className="p-5 bg-white">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>Total Pendapatan (Gross)</span>
              <CreditCard className="w-4 h-4 text-purple-600" />
            </div>
            <div className="mt-3 text-2xl font-extrabold text-slate-900">
              {formatRupiah(totalRevenue)}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">DOKU Gateway Terverifikasi</p>
          </Card>

          <Card className="p-5 bg-white">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>Total CV Dibuat</span>
              <FileText className="w-4 h-4 text-amber-500" />
            </div>
            <div className="mt-3 text-3xl font-extrabold text-slate-900">
              {totalCVs}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Dokumen Standar ATS</p>
          </Card>
        </div>

        {/* Recent Data Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Users */}
          <Card className="p-6 bg-white space-y-4">
            <h2 className="text-sm font-bold text-slate-900 flex items-center justify-between">
              <span>Pendaftaran Terbaru</span>
              <Badge variant="outline">{recentProfiles.length} Pengguna</Badge>
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-100">
                    <th className="py-2 px-2 font-medium">Nama</th>
                    <th className="py-2 px-2 font-medium">Paket</th>
                    <th className="py-2 px-2 font-medium text-right">Tanggal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {recentProfiles.map((p) => (
                    <tr key={p.id}>
                      <td className="py-2.5 px-2 font-medium text-slate-900">
                        {p.full_name || 'Job Seeker'}
                      </td>
                      <td className="py-2.5 px-2">
                        <Badge
                          variant={p.plan === 'pro' ? 'pro' : 'default'}
                          className="text-[9px] uppercase"
                        >
                          {p.plan}
                        </Badge>
                      </td>
                      <td className="py-2.5 px-2 text-right text-slate-500">
                        {formatDate(p.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Recent Transactions */}
          <Card className="p-6 bg-white space-y-4">
            <h2 className="text-sm font-bold text-slate-900 flex items-center justify-between">
              <span>Transaksi DOKU Terbaru</span>
              <Badge variant="outline">{recentPayments.length} Transaksi</Badge>
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-100">
                    <th className="py-2 px-2 font-medium">Invoice</th>
                    <th className="py-2 px-2 font-medium">Nominal</th>
                    <th className="py-2 px-2 font-medium text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {recentPayments.map((p) => (
                    <tr key={p.id}>
                      <td className="py-2.5 px-2 font-mono font-medium">
                        {p.provider_reference}
                      </td>
                      <td className="py-2.5 px-2 font-semibold">
                        {formatRupiah(p.amount)}
                      </td>
                      <td className="py-2.5 px-2 text-right">
                        <Badge
                          variant={
                            p.status === 'SUCCESS'
                              ? 'success'
                              : p.status === 'PENDING'
                              ? 'warning'
                              : 'danger'
                          }
                          className="text-[9px]"
                        >
                          {p.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
