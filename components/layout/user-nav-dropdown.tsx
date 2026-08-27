'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Badge } from '@/components/ui/badge';
import {
  Settings,
  LayoutDashboard,
  FileText,
  Palette,
  Sparkles,
  CreditCard,
  LogOut,
  ChevronDown,
  Target,
  Mail,
} from 'lucide-react';

import { UserPlan } from '@/types';

interface UserNavDropdownProps {
  email: string;
  plan?: UserPlan | null;
  name?: string | null;
  avatarUrl?: string | null;
  onLogout?: () => void;
}

export function UserNavDropdown({
  email,
  plan = 'free',
  name,
  avatarUrl,
  onLogout,
}: UserNavDropdownProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isPro = plan === 'pro';

  // Compute display name and initials
  const displayName = name || email.split('@')[0] || 'Pengguna';
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleLogoutClick = async () => {
    setIsOpen(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('kerjaai_user_email');
      localStorage.removeItem('kerjaai_user_plan');
      localStorage.removeItem('kerjaai_user_name');
      localStorage.removeItem('kerjaai_user_avatar');
    }

    if (onLogout) {
      onLogout();
      return;
    }

    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push('/');
      router.refresh();
    } catch {
      router.push('/');
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 p-1 sm:pl-2 sm:pr-3 py-1 rounded-full border border-slate-200/80 bg-white hover:bg-slate-50 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-2xs"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {/* Avatar Headshot / Initials */}
        <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0">
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
          ) : (
            <span>{initials}</span>
          )}
          {isPro && (
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-amber-400 border-2 border-white rounded-full" />
          )}
        </div>

        {/* User Info Label */}
        <div className="hidden sm:flex flex-col text-left">
          <span className="text-xs font-bold text-slate-800 leading-tight truncate max-w-[110px]">
            {displayName}
          </span>
          <span className="text-[10px] text-slate-500 font-medium leading-none">
            {isPro ? (
              <span className="text-blue-600 font-semibold">Pro Member</span>
            ) : (
              'Free Plan'
            )}
          </span>
        </div>

        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-blue-600' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu Modal */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200/80 py-2 z-50 animate-in fade-in zoom-in-95 duration-150 divide-y divide-slate-100">
          {/* User Profile Card */}
          <div className="px-4 py-3 bg-gradient-to-b from-slate-50/80 to-white">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-xs font-bold text-slate-900 truncate">
                {displayName}
              </span>
              {isPro ? (
                <Badge variant="pro" className="text-[9px] px-1.5 py-0">
                  <Sparkles className="w-2.5 h-2.5 mr-0.5" /> PRO
                </Badge>
              ) : (
                <Badge variant="outline" className="text-[9px] text-slate-600 bg-white">
                  FREE
                </Badge>
              )}
            </div>
            <p className="text-[11px] text-slate-500 truncate">{email}</p>

            {/* Quick Upgrade Callout if Free */}
            {!isPro && (
              <div className="mt-2.5 p-2 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200/60 flex items-center justify-between gap-2">
                <div className="text-[10px] text-amber-900 font-medium leading-tight">
                  Akses 230+ Template & Semua Fitur AI
                </div>
                <Link
                  href="/pricing"
                  onClick={() => setIsOpen(false)}
                  className="px-2 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-[10px] font-bold shrink-0 transition-colors shadow-xs"
                >
                  Upgrade
                </Link>
              </div>
            )}
          </div>

          {/* Quick Nav Section */}
          <div className="py-1.5 px-1 space-y-0.5">
            <Link
              href="/dashboard"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-colors"
            >
              <LayoutDashboard className="w-4 h-4 text-blue-600" />
              <span>Dashboard Saya</span>
            </Link>

            <Link
              href="/settings#my-cvs"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-colors"
            >
              <FileText className="w-4 h-4 text-orange-600" />
              <span>CV Saya</span>
            </Link>

            <Link
              href="/cv/new"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-colors"
            >
              <FileText className="w-4 h-4 text-emerald-600" />
              <span>Buat CV Baru</span>
            </Link>

            <Link
              href="/templates"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-colors"
            >
              <Palette className="w-4 h-4 text-purple-600" />
              <div className="flex items-center justify-between flex-1">
                <span>Pustaka Template</span>
                <span className="text-[10px] text-purple-600 font-bold bg-purple-50 px-1.5 py-0.2 rounded-md">
                  230+
                </span>
              </div>
            </Link>

            <Link
              href="/ats"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-colors"
            >
              <Target className="w-4 h-4 text-rose-600" />
              <span>Cek Skor ATS CV</span>
            </Link>

            <Link
              href="/cover-letter"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-colors"
            >
              <Mail className="w-4 h-4 text-indigo-600" />
              <span>Cover Letter Generator</span>
            </Link>
          </div>


          {/* Account & Settings Section */}
          <div className="py-1.5 px-1 space-y-0.5">
            <Link
              href="/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-colors"
            >
              <Settings className="w-4 h-4 text-slate-500" />
              <span>Pengaturan Akun & Profil</span>
            </Link>

            <Link
              href="/settings#billing"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-colors"
            >
              <CreditCard className="w-4 h-4 text-slate-500" />
              <span>Langganan & Tagihan</span>
            </Link>
          </div>

          {/* Sign Out Section */}
          <div className="py-1.5 px-1">
            <button
              type="button"
              onClick={handleLogoutClick}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors text-left"
            >
              <LogOut className="w-4 h-4" />
              <span>Keluar dari Akun</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
