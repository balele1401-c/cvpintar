'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { templateRegistry } from '@/lib/templates/registry';
import { CVTemplateMetadata, TemplateCategory } from '@/lib/templates/types';
import { TemplateCard } from '@/components/cv/template-card';
import { TemplatePreviewModal } from '@/components/cv/template-preview-modal';
import { PaywallModal } from '@/components/paywall/paywall-modal';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  Sparkles,
  LayoutGrid,
  FileCheck2,
  SlidersHorizontal,
} from 'lucide-react';

import { UserPlan } from '@/types';

const CATEGORIES: (TemplateCategory | 'ALL')[] = [
  'ALL',
  'ATS',
  'Modern',
  'Fresh Graduate',
  'Technology',
  'Corporate',
  'Executive',
  'Creative',
  'Finance',
  'Academic',
  'Minimal',
];

export default function TemplateLibraryPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('kerjaai_user_email') || null;
    }
    return null;
  });
  const [userPlan, setUserPlan] = useState<UserPlan>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('kerjaai_user_plan') as UserPlan) || 'free';
    }
    return 'free';
  });

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory | 'ALL'>('ALL');
  const [accessFilter, setAccessFilter] = useState<'all' | 'free' | 'pro'>('all');
  const [isATSOnly, setIsATSOnly] = useState(false);
  const [hasPhotoOnly, setHasPhotoOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'popularity' | 'newest' | 'name'>('popularity');

  const [previewTemplate, setPreviewTemplate] = useState<CVTemplateMetadata | null>(null);
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const [paywallFeature, setPaywallFeature] = useState({ name: '', description: '' });

  useEffect(() => {
    async function loadUser() {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        setUserEmail(session.user.email || null);
        const { data: profile } = await supabase
          .from('profiles')
          .select('plan')
          .eq('user_id', session.user.id)
          .single();

        if (profile) {
          setUserPlan(profile.plan as UserPlan);
        }
      }
    }

    loadUser();
  }, []);

  const filteredTemplates = useMemo(() => {
    return templateRegistry.filter({
      search,
      category: selectedCategory,
      access: accessFilter,
      isATSOnly,
      hasPhotoOnly,
      sortBy,
    });
  }, [search, selectedCategory, accessFilter, isATSOnly, hasPhotoOnly, sortBy]);


  const handleSelectTemplate = (template: CVTemplateMetadata) => {
    router.push(`/cv/new?template=${template.id}`);
  };

  const handleLockedClick = (template: CVTemplateMetadata) => {
    setPaywallFeature({
      name: `Template ${template.name}`,
      description: `Gunakan template premium "${template.name}" dan semua koleksi template profesional lainnya tanpa batas dengan berlangganan CVPintar Pro.`,
    });
    setIsPaywallOpen(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar userEmail={userEmail} userPlan={userPlan} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-10">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Badge variant="outline" className="px-3.5 py-1 text-blue-700 bg-blue-50 border-blue-200">
            <LayoutGrid className="w-3.5 h-3.5 mr-1.5" /> Perpustakaan Template Desain CV
          </Badge>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Pilih Desain CV yang Sesuai dengan Target Karir Anda
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Jelajahi koleksi desain CV standar ATS, Modern, Tech, Executive, dan Creative. Dirancang oleh pakar HRD untuk meningkatkan peluang panggilan interview.
          </p>
        </div>

        {/* Filter & Search Toolbar */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            {/* Search Input */}
            <div className="flex-1">
              <Input
                placeholder="Cari template berdasarkan nama, keahlian, atau industri (contoh: ATS, Tech, Executive)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                leftIcon={<Search className="w-4 h-4 text-slate-400" />}
              />
            </div>

            {/* Access Filter (All, Free, Pro) & ATS Toggle */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex bg-slate-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setAccessFilter('all')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    accessFilter === 'all'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Semua ({templateRegistry.getAll().length})
                </button>
                <button
                  type="button"
                  onClick={() => setAccessFilter('free')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    accessFilter === 'free'
                      ? 'bg-white text-emerald-700 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Gratis
                </button>
                <button
                  type="button"
                  onClick={() => setAccessFilter('pro')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 ${
                    accessFilter === 'pro'
                      ? 'bg-white text-amber-700 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Sparkles className="w-3 h-3 text-amber-500" /> Pro
                </button>
              </div>

              {/* ATS Toggle */}
              <button
                type="button"
                onClick={() => setIsATSOnly(!isATSOnly)}
                className={`px-3 py-2 text-xs font-semibold rounded-xl border flex items-center gap-1.5 transition-colors ${
                  isATSOnly
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <FileCheck2 className="w-3.5 h-3.5" />
                <span>Khusus ATS</span>
              </button>

              {/* Has Photo Toggle */}
              <button
                type="button"
                onClick={() => setHasPhotoOnly(!hasPhotoOnly)}
                className={`px-3 py-2 text-xs font-semibold rounded-xl border flex items-center gap-1.5 transition-colors ${
                  hasPhotoOnly
                    ? 'bg-purple-600 text-white border-purple-600'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span>📷</span>
                <span>Dengan Foto</span>
              </button>


              {/* Sort By Dropdown */}
              <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-700">
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'popularity' | 'newest' | 'name')}
                  className="bg-transparent border-none outline-none font-semibold text-slate-900 cursor-pointer"
                >
                  <option value="popularity">Terpopuler</option>
                  <option value="newest">Desain Terbaru</option>
                  <option value="name">Nama (A-Z)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Categories Horizontal Pills */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none pt-2 border-t border-slate-100">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {cat === 'ALL' ? 'Semua Kategori' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results Counter & Catalog Grid */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-bold text-slate-900">
              Menampilkan {filteredTemplates.length} Desain Template
            </h2>
            {userPlan === 'free' && (
              <p className="text-xs text-slate-500">
                Paket Free: Dapat menggunakan template berlabel <strong className="text-emerald-600">FREE</strong>.
              </p>
            )}
          </div>

          {filteredTemplates.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredTemplates.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  userPlan={userPlan}
                  onSelect={handleSelectTemplate}
                  onPreview={(t) => setPreviewTemplate(t)}
                  onLockedClick={handleLockedClick}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Tidak ada template yang cocok
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Coba ubah kata kunci pencarian atau reset filter untuk melihat semua koleksi template yang tersedia.
              </p>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setSearch('');
                  setSelectedCategory('ALL');
                  setAccessFilter('all');
                  setIsATSOnly(false);
                }}
              >
                Reset Semua Filter
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* HD Preview Modal */}
      <TemplatePreviewModal
        isOpen={Boolean(previewTemplate)}
        template={previewTemplate}
        userPlan={userPlan}
        onClose={() => setPreviewTemplate(null)}
        onSelectTemplate={handleSelectTemplate}
        onLockedClick={handleLockedClick}
      />

      {/* Paywall Modal */}
      <PaywallModal
        isOpen={isPaywallOpen}
        onClose={() => setIsPaywallOpen(false)}
        featureName={paywallFeature.name}
        featureDescription={paywallFeature.description}
      />
    </div>
  );
}
