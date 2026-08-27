'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  CreditCard,
  User,
  Sparkles,
  Save,
  CheckCircle2,
  Camera,
  Trash2,
  ShieldCheck,
  Zap,
  FileText,
  Plus,
  Edit3,
  Eye,
  Clock,
  LayoutGrid,
} from 'lucide-react';
import { Payment, Profile, Subscription, UserPlan, CV } from '@/types';
import { formatDate, formatRupiah } from '@/lib/utils';
import { PRO_PRICE_LABEL } from '@/lib/constants';
import { CVThumbnail } from '@/components/cv/cv-thumbnail';

export default function SettingsPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [cvs, setCvs] = useState<CV[]>([]);
  const [fullName, setFullName] = useState<string>('');
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('kerjaai_user_email') || null;
    }
    return null;
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [deletingCvId, setDeletingCvId] = useState<string | null>(null);

  const plan: UserPlan = profile?.plan || 'free';

  useEffect(() => {
    async function loadSettings() {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          router.push('/login');
          return;
        }

        setUserEmail(user.email || null);

        // 1. Profile
        const { data: prof } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (prof) {
          setProfile(prof as Profile);
          setFullName(prof.full_name || '');
          setAvatarUrl(prof.avatar_url || '');
        }

        // 2. CVs List
        const { data: cvsData } = await supabase
          .from('cvs')
          .select('*')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false });

        if (cvsData) {
          setCvs(cvsData as CV[]);
        }

        // 3. Subscription
        const { data: sub } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (sub) {
          setSubscription(sub as Subscription);
        }

        // 4. Payments history
        const { data: payHistory } = await supabase
          .from('payments')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (payHistory) {
          setPayments(payHistory as Payment[]);
        }
      } catch (err) {
        console.error('Error loading settings:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadSettings();
  }, [router]);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        if (base64) {
          setAvatarUrl(base64);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setIsUpdating(true);
    setSavedSuccess(false);

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          avatar_url: avatarUrl || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', profile.id);

      if (error) throw error;

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch {
      alert('Gagal memperbarui profil.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteCV = async (cvId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus CV ini secara permanen?')) return;
    setDeletingCvId(cvId);

    try {
      const supabase = createClient();
      const { error } = await supabase.from('cvs').delete().eq('id', cvId);
      if (error) throw error;

      setCvs((prev) => prev.filter((c) => c.id !== cvId));
    } catch {
      alert('Gagal menghapus CV.');
    } finally {
      setDeletingCvId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const initials = (fullName || userEmail || 'U')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar
        userEmail={userEmail}
        userPlan={plan}
        userName={fullName}
        userAvatar={avatarUrl}
      />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <User className="w-5 h-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Profil & Pengaturan Akun
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Kelola data diri, koleksi CV yang telah dibuat, status paket langganan, dan riwayat tagihan akun CVPintar Anda.
          </p>
        </div>

        {/* Section 1: Created CVs (CV Saya) */}
        <Card id="my-cvs" className="p-6 bg-white space-y-5 shadow-xs border border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Koleksi CV Saya ({cvs.length})
                </h2>
                <p className="text-[11px] text-slate-500">
                  Daftar seluruh CV yang pernah Anda buat dan simpan di CVPintar.
                </p>
              </div>
            </div>

            <Link href="/cv/new">
              <Button
                variant="primary"
                size="sm"
                leftIcon={<Plus className="w-3.5 h-3.5" />}
                className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs text-xs font-semibold"
              >
                Buat CV Baru
              </Button>
            </Link>
          </div>

          {cvs.length === 0 ? (
            <div className="text-center py-10 bg-slate-50/70 rounded-2xl border border-dashed border-slate-200 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center">
                <LayoutGrid className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800">Belum Ada CV Dibuat</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-0.5">
                  Mulai buat CV profesional pertama Anda dengan pilihan 230+ template modern & bantuan AI.
                </p>
              </div>
              <Link href="/cv/new">
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<Plus className="w-3.5 h-3.5" />}
                  className="bg-blue-600 hover:bg-blue-700 text-white mt-1"
                >
                  Buat CV Pertama
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {cvs.map((cv) => {
                const cvTitle = cv.title || 'Curriculum Vitae';
                const templateId = cv.template_id || 'classic';
                const lastUpdated = cv.updated_at ? formatDate(cv.updated_at) : '-';
                const cvData = cv.content_json;

                return (
                  <div
                    key={cv.id}
                    className="group bg-white hover:bg-slate-50/50 rounded-2xl border border-slate-200/80 hover:border-blue-300 hover:shadow-md transition-all overflow-hidden flex flex-col"
                  >
                    {/* CV Thumbnail Visual Preview */}
                    <Link href={`/cv/${cv.id}/preview`} className="block relative">
                      <div className="p-3 pb-0">
                        <CVThumbnail
                          data={cvData}
                          templateId={templateId}
                          className="group-hover:shadow-sm transition-shadow"
                        />
                      </div>
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/5 transition-colors rounded-t-2xl flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <span className="px-3 py-1.5 bg-white/95 backdrop-blur-sm text-xs font-bold text-blue-700 rounded-full shadow-md border border-blue-200">
                          <Eye className="w-3 h-3 inline mr-1" />
                          Lihat Preview
                        </span>
                      </div>
                    </Link>

                    {/* CV Info & Actions */}
                    <div className="p-3.5 pt-2.5 space-y-2.5 flex-1 flex flex-col justify-between">
                      <div className="space-y-1">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-xs font-bold text-slate-900 leading-snug truncate">
                            {cvTitle}
                          </h3>
                          <Badge variant="outline" className="text-[9px] uppercase font-mono shrink-0 px-1.5">
                            {templateId.length > 12 ? templateId.substring(0, 12) + '…' : templateId}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                          <Clock className="w-3 h-3" />
                          <span>{lastUpdated}</span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1.5">
                        <div className="flex items-center gap-1.5">
                          <Link href={`/cv/${cv.id}/edit`}>
                            <Button
                              variant="secondary"
                              size="sm"
                              leftIcon={<Edit3 className="w-3 h-3" />}
                              className="text-[11px] px-2 py-1 bg-white hover:bg-blue-50 text-slate-700 border border-slate-200 hover:border-blue-300 hover:text-blue-700"
                            >
                              Edit
                            </Button>
                          </Link>
                          <Link href={`/cv/${cv.id}/preview`}>
                            <Button
                              variant="outline"
                              size="sm"
                              leftIcon={<Eye className="w-3 h-3" />}
                              className="text-[11px] px-2 py-1 text-slate-600 hover:bg-blue-50 hover:text-blue-700"
                            >
                              Preview
                            </Button>
                          </Link>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleDeleteCV(cv.id)}
                          disabled={deletingCvId === cv.id}
                          className="p-1.5 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Hapus CV"
                          aria-label="Hapus CV"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* Section 2: Profile & Avatar */}
        <Card className="p-6 bg-white space-y-6 shadow-xs border border-slate-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <User className="w-4 h-4 text-blue-600" /> Informasi Data Diri
            </h2>
            <Badge variant={plan === 'pro' ? 'pro' : 'outline'} className="text-[10px]">
              {plan === 'pro' ? 'PRO MEMBER' : 'FREE USER'}
            </Badge>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-6">
            {/* Avatar Upload Container */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80">
              <div className="relative w-20 h-20 rounded-full overflow-hidden bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xl shadow-md shrink-0 border-2 border-white">
                {avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span>{initials}</span>
                )}
              </div>

              <div className="flex-1 text-center sm:text-left space-y-2">
                <div>
                  <h3 className="text-xs font-bold text-slate-900">Foto Profil Akun</h3>
                  <p className="text-[11px] text-slate-500">
                    Foto ini akan ditampilkan di navbar akun Anda. Format yang didukung: JPG, PNG, WEBP.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                  <label className="cursor-pointer">
                    <span className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 shadow-2xs transition-colors">
                      <Camera className="w-3.5 h-3.5 text-blue-600" />
                      Ganti Foto
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarUpload}
                    />
                  </label>

                  {avatarUrl && (
                    <button
                      type="button"
                      onClick={() => setAvatarUrl('')}
                      className="px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-lg font-medium inline-flex items-center gap-1 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Hapus
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Nama Lengkap"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Contoh: Dimas Wicaksono"
              />
              <Input
                label="Alamat Email Terdaftar"
                value={userEmail || ''}
                disabled
                helperText="Email dikelola aman oleh autentikasi Supabase."
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button
                type="submit"
                variant="primary"
                size="sm"
                isLoading={isUpdating}
                leftIcon={<Save className="w-3.5 h-3.5" />}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-xs"
              >
                Simpan Perubahan
              </Button>
              {savedSuccess && (
                <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Profil berhasil diperbarui!
                </span>
              )}
            </div>
          </form>
        </Card>

        {/* Section 3: Subscription Status */}
        <Card id="billing" className="p-6 bg-white space-y-4 shadow-xs border border-slate-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" /> Paket & Akses Fitur
            </h2>
            <Badge variant={plan === 'pro' ? 'pro' : 'default'} className="uppercase">
              {plan} Plan
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-700">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1.5">
              <span className="text-slate-400 font-medium flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" /> Paket Saat Ini:
              </span>
              <p className="text-base font-extrabold text-slate-900">
                {plan === 'pro' ? 'CVPintar PRO Unlimited' : 'CVPintar Free Tier'}
              </p>
              <p className="text-[11px] text-slate-500">
                {plan === 'pro'
                  ? 'Akses ke 230+ template desain profesional & seluruh fitur AI tanpa batas.'
                  : 'Akses 30 template Free & 5 generasi AI per hari.'}
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1.5">
              <span className="text-slate-400 font-medium flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-500" /> Masa Berlaku:
              </span>
              <p className="text-base font-extrabold text-slate-900">
                {subscription?.expires_at ? formatDate(subscription.expires_at) : 'Masa Aktif Aktif'}
              </p>
              <p className="text-[11px] text-slate-500">
                Status:{' '}
                <span className="font-semibold text-emerald-600 capitalize">
                  {subscription?.status || 'Aktif'}
                </span>
              </p>
            </div>
          </div>

          {plan !== 'pro' && (
            <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <h3 className="text-xs font-bold text-blue-950">Tingkatkan ke CVPintar PRO</h3>
                <p className="text-[11px] text-blue-700">
                  Hanya {PRO_PRICE_LABEL} untuk akses 230+ template eksklusif & fitur AI tanpa batas.
                </p>
              </div>
              <Link href="/pricing" className="shrink-0">
                <Button
                  variant="accent"
                  size="sm"
                  leftIcon={<Sparkles className="w-3.5 h-3.5" />}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm"
                >
                  Upgrade PRO Sekarang
                </Button>
              </Link>
            </div>
          )}
        </Card>

        {/* Section 4: Payment History */}
        <Card className="p-6 bg-white space-y-4 shadow-xs border border-slate-200">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
            <CreditCard className="w-4 h-4 text-blue-600" /> Riwayat Transaksi Pembayaran (DOKU)
          </h2>

          {payments.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400">
              Belum ada riwayat transaksi pembayaran.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-100">
                    <th className="py-2.5 px-3 font-medium">No. Invoice / Reff</th>
                    <th className="py-2.5 px-3 font-medium">Tanggal</th>
                    <th className="py-2.5 px-3 font-medium">Nominal</th>
                    <th className="py-2.5 px-3 font-medium">Gateway</th>
                    <th className="py-2.5 px-3 font-medium text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {payments.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/50">
                      <td className="py-3 px-3 font-mono font-medium">{p.provider_reference}</td>
                      <td className="py-3 px-3">{formatDate(p.created_at)}</td>
                      <td className="py-3 px-3 font-semibold">{formatRupiah(p.amount)}</td>
                      <td className="py-3 px-3 uppercase text-slate-500">{p.provider}</td>
                      <td className="py-3 px-3 text-right">
                        <Badge
                          variant={
                            p.status === 'SUCCESS'
                              ? 'success'
                              : p.status === 'PENDING'
                              ? 'warning'
                              : 'danger'
                          }
                          className="text-[10px]"
                        >
                          {p.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </main>

      <Footer />
    </div>
  );
}
