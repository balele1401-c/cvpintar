'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sparkles, Menu, X, FileText, Settings, LayoutDashboard, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

import { createClient } from '@/lib/supabase/client';
import { UserNavDropdown } from './user-nav-dropdown';
import { Badge } from '@/components/ui/badge';

export interface NavbarProps {
  userEmail?: string | null;
  userPlan?: 'free' | 'pro' | null;
  userName?: string | null;
  userAvatar?: string | null;
  onLogout?: () => void;
}

export function Navbar({
  userEmail,
  userPlan,
  userName,
  userAvatar,
  onLogout,
}: NavbarProps) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [fetchedEmail, setFetchedEmail] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('kerjaai_user_email') || null;
    }
    return null;
  });
  const [fetchedPlan, setFetchedPlan] = useState<'free' | 'pro' | null>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('kerjaai_user_plan') as 'free' | 'pro') || null;
    }
    return null;
  });
  const [fetchedName, setFetchedName] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('kerjaai_user_name') || null;
    }
    return null;
  });
  const [fetchedAvatar, setFetchedAvatar] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('kerjaai_user_avatar') || null;
    }
    return null;
  });
  const pathname = usePathname();

  useEffect(() => {
    let isMounted = true;
    async function checkAuth() {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!isMounted) return;

        if (user) {
          const email = user.email || null;
          setFetchedEmail(email);
          if (email && typeof window !== 'undefined') {
            localStorage.setItem('kerjaai_user_email', email);
          }
          const { data: profile } = await supabase
            .from('profiles')
            .select('plan, full_name, avatar_url')
            .eq('user_id', user.id)
            .maybeSingle();

          if (isMounted && profile) {
            const plan = (profile.plan as 'free' | 'pro') || 'free';
            const name = profile.full_name || null;
            const avatar = profile.avatar_url || null;
            setFetchedPlan(plan);
            setFetchedName(name);
            setFetchedAvatar(avatar);
            if (typeof window !== 'undefined') {
              localStorage.setItem('kerjaai_user_plan', plan);
              if (name) localStorage.setItem('kerjaai_user_name', name);
              if (avatar) localStorage.setItem('kerjaai_user_avatar', avatar);
            }
          }
        } else {
          setFetchedEmail(null);
          setFetchedPlan(null);
          setFetchedName(null);
          setFetchedAvatar(null);
          if (typeof window !== 'undefined') {
            localStorage.removeItem('kerjaai_user_email');
            localStorage.removeItem('kerjaai_user_plan');
            localStorage.removeItem('kerjaai_user_name');
            localStorage.removeItem('kerjaai_user_avatar');
          }
        }
      } catch {
        // Ignore background auth error
      }
    }

    checkAuth();
    return () => {
      isMounted = false;
    };
  }, [userEmail]);

  const activeEmail = userEmail || fetchedEmail;
  const activePlan = userPlan || fetchedPlan || 'free';
  const activeName = userName || fetchedName;
  const activeAvatar = userAvatar || fetchedAvatar;

  const isAuthPage =
    pathname?.startsWith('/login') ||
    pathname?.startsWith('/register') ||
    pathname?.startsWith('/forgot-password');

  const brandHref = activeEmail ? '/dashboard' : '/';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href={brandHref} className="flex items-center gap-2 group">
          <Image
            src="/logo.png"
            alt="CVPintar"
            width={126}
            height={42}
            className="h-9 w-auto object-contain group-hover:opacity-95 transition-opacity"
            priority
          />
          {activePlan === 'pro' && (
            <span className="text-[9px] bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold px-1.5 py-0.5 rounded-sm shadow-xs self-center">
              PRO
            </span>
          )}
        </Link>

        {/* Desktop Navigation */}
        {!isAuthPage && (
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            {activeEmail ? (
              <>
                <Link
                  href="/dashboard"
                  className={cn(
                    'hover:text-slate-900 transition-colors',
                    pathname === '/dashboard' && 'text-blue-600 font-semibold'
                  )}
                >
                  Dashboard
                </Link>
                <Link
                  href="/templates"
                  className={cn(
                    'hover:text-slate-900 transition-colors',
                    pathname === '/templates' && 'text-blue-600 font-semibold'
                  )}
                >
                  Template CV
                </Link>
                <Link
                  href="/cv/new"
                  className={cn(
                    'hover:text-slate-900 transition-colors',
                    pathname?.startsWith('/cv') && 'text-blue-600 font-semibold'
                  )}
                >
                  Buat CV
                </Link>
                <Link
                  href="/ats"
                  className={cn(
                    'hover:text-slate-900 transition-colors flex items-center gap-1',
                    pathname === '/ats' && 'text-blue-600 font-semibold'
                  )}
                >
                  ATS Checker
                  {activePlan !== 'pro' && <Sparkles className="w-3.5 h-3.5 text-blue-500" />}
                </Link>
                {activePlan !== 'pro' && (
                  <Link
                    href="/pricing"
                    className={cn(
                      'hover:text-slate-900 transition-colors',
                      pathname === '/pricing' && 'text-blue-600 font-semibold'
                    )}
                  >
                    Pricing
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link href="/templates" className="hover:text-slate-900 transition-colors">
                  Template CV
                </Link>
                <Link href="/#fitur" className="hover:text-slate-900 transition-colors">
                  Fitur AI
                </Link>
                <Link href="/#cara-kerja" className="hover:text-slate-900 transition-colors">
                  Cara Kerja
                </Link>
                <Link
                  href="/pricing"
                  className={cn(
                    'hover:text-slate-900 transition-colors',
                    pathname === '/pricing' && 'text-blue-600 font-semibold'
                  )}
                >
                  Harga
                </Link>
              </>
            )}
          </nav>
        )}

        {/* Action Buttons / User Menu Dropdown */}
        <div className="hidden md:flex items-center gap-3">
          {activeEmail ? (
            <div className="flex items-center gap-3">
              {activePlan !== 'pro' && (
                <Link href="/pricing">
                  <Button
                    variant="accent"
                    size="sm"
                    leftIcon={<Sparkles className="w-3.5 h-3.5" />}
                    className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-xs font-semibold"
                  >
                    Upgrade Pro
                  </Button>
                </Link>
              )}

              {/* User Profile Dropdown Menu */}
              <UserNavDropdown
                email={activeEmail}
                plan={activePlan}
                name={activeName}
                avatarUrl={activeAvatar}
                onLogout={onLogout}
              />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Masuk
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="primary" size="sm">
                  Buat CV Gratis
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-5 space-y-3 shadow-lg">
          {/* Mobile Profile Card */}
          {activeEmail && (
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                  {activeAvatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={activeAvatar} alt="Avatar" className="w-full h-full object-cover rounded-full" />
                  ) : (
                    <span>{(activeName || activeEmail)[0].toUpperCase()}</span>
                  )}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 truncate max-w-[150px]">
                    {activeName || activeEmail.split('@')[0]}
                  </div>
                  <div className="text-[10px] text-slate-500 truncate max-w-[150px]">{activeEmail}</div>
                </div>
              </div>
              <div>
                {activePlan === 'pro' ? (
                  <Badge variant="pro" className="text-[9px]">
                    PRO
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-[9px] bg-white">
                    FREE
                  </Badge>
                )}
              </div>
            </div>
          )}

          <nav className="flex flex-col space-y-1 text-sm font-medium text-slate-700">
            {activeEmail ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl hover:bg-slate-100 flex items-center gap-2"
                >
                  <LayoutDashboard className="w-4 h-4 text-blue-600" />
                  Dashboard Saya
                </Link>
                <Link
                  href="/templates"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl hover:bg-slate-100 flex items-center gap-2"
                >
                  <FileText className="w-4 h-4 text-purple-600" />
                  Template CV (230+)
                </Link>
                <Link
                  href="/cv/new"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl hover:bg-slate-100 flex items-center gap-2"
                >
                  <FileText className="w-4 h-4 text-emerald-600" />
                  Buat CV Baru
                </Link>
                <Link
                  href="/ats"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl hover:bg-slate-100 flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-rose-600" />
                  ATS Checker
                </Link>
                <Link
                  href="/settings"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-xl hover:bg-slate-100 flex items-center gap-2"
                >
                  <Settings className="w-4 h-4 text-slate-500" />
                  Pengaturan Akun & Profil
                </Link>
                {activePlan !== 'pro' && (
                  <Link
                    href="/pricing"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-2 rounded-xl bg-amber-50 text-amber-900 font-semibold flex items-center gap-2 mt-1"
                  >
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    Upgrade ke Pro
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link
                  href="/templates"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg hover:bg-slate-100"
                >
                  Template CV
                </Link>
                <Link
                  href="/#fitur"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg hover:bg-slate-100"
                >
                  Fitur AI
                </Link>
                <Link
                  href="/#cara-kerja"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg hover:bg-slate-100"
                >
                  Cara Kerja
                </Link>
                <Link
                  href="/pricing"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg hover:bg-slate-100"
                >
                  Harga
                </Link>
              </>
            )}
          </nav>

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            {activeEmail ? (
              <button
                type="button"
                onClick={async () => {
                  setMobileMenuOpen(false);
                  if (typeof window !== 'undefined') {
                    localStorage.removeItem('kerjaai_user_email');
                    localStorage.removeItem('kerjaai_user_plan');
                    localStorage.removeItem('kerjaai_user_name');
                    localStorage.removeItem('kerjaai_user_avatar');
                  }
                  if (onLogout) onLogout();
                  else {
                    const supabase = createClient();
                    await supabase.auth.signOut();
                    router.push('/');
                  }
                }}

                className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Keluar dari Akun
              </button>
            ) : (
              <>
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="secondary" className="w-full justify-center">
                    Masuk
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" className="w-full justify-center">
                    Buat CV Gratis
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
