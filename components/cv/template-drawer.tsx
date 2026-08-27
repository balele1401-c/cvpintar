'use client';

import React, { useState, useMemo } from 'react';
import { templateRegistry } from '@/lib/templates/registry';
import { CVTemplateMetadata, TemplateCategory } from '@/lib/templates/types';
import { TemplateCard } from './template-card';
import { TemplatePreviewModal } from './template-preview-modal';
import { PaywallModal } from '@/components/paywall/paywall-modal';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Search, Sparkles, LayoutGrid } from 'lucide-react';
import { UserPlan } from '@/types';

interface TemplateDrawerProps {
  isOpen: boolean;
  currentTemplateId: string;
  userPlan: UserPlan;
  onClose: () => void;
  onSelectTemplate: (templateId: string) => void;
}

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

export function TemplateDrawer({
  isOpen,
  currentTemplateId,
  userPlan,
  onClose,
  onSelectTemplate,
}: TemplateDrawerProps) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory | 'ALL'>('ALL');
  const [accessFilter, setAccessFilter] = useState<'all' | 'free' | 'pro'>('all');
  const [photoFilter, setPhotoFilter] = useState<'all' | 'with-photo' | 'without-photo'>('all');
  const [previewTemplate, setPreviewTemplate] = useState<CVTemplateMetadata | null>(null);
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const [paywallFeature, setPaywallFeature] = useState({ name: '', description: '' });

  const templates = useMemo(() => {
    return templateRegistry.filter({
      search,
      category: selectedCategory,
      access: accessFilter,
      photoFilter,
    });
  }, [search, selectedCategory, accessFilter, photoFilter]);


  if (!isOpen) return null;

  const handleLockedClick = (template: CVTemplateMetadata) => {
    setPaywallFeature({
      name: `Template ${template.name}`,
      description: `Gunakan template premium "${template.name}" dan semua koleksi template profesional lainnya tanpa batas dengan berlangganan CVPintar Pro.`,
    });
    setIsPaywallOpen(true);
  };

  const handleSelect = (template: CVTemplateMetadata) => {
    onSelectTemplate(template.id);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="relative w-full max-w-6xl max-h-[90vh] bg-slate-50 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200 shrink-0">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <LayoutGrid className="w-4 h-4" />
                </div>
                <h2 className="text-lg font-bold text-slate-900">
                  Ganti Desain Template CV
                </h2>
                <Badge variant="outline" className="text-slate-600">
                  {templates.length} Pilihan Desain
                </Badge>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Pilih desain yang paling cocok untuk industri target Anda. Isi data CV Anda 100% aman dan tidak akan hilang.
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Filter & Search Bar */}
          <div className="p-4 bg-white border-b border-slate-200 space-y-3 shrink-0">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <Input
                  placeholder="Cari template (contoh: ATS, Tech, Executive, Fresh Graduate)..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  leftIcon={<Search className="w-4 h-4 text-slate-400" />}
                />
              </div>

              {/* Free / Pro Switch */}
              <div className="flex bg-slate-100 p-1 rounded-xl shrink-0 self-start sm:self-auto">
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

              {/* Photo Filter Toggle */}
              <div className="flex bg-slate-100 p-1 rounded-xl shrink-0 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setPhotoFilter('all')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    photoFilter === 'all'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Semua
                </button>
                <button
                  type="button"
                  onClick={() => setPhotoFilter('with-photo')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                    photoFilter === 'with-photo'
                      ? 'bg-white text-purple-700 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>📷</span>
                  <span>Dengan Foto</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPhotoFilter('without-photo')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                    photoFilter === 'without-photo'
                      ? 'bg-white text-blue-700 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>📄</span>
                  <span>Tanpa Foto (ATS)</span>
                </button>
              </div>
            </div>


            {/* Category Pills */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap transition-colors ${
                    selectedCategory === cat
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  {cat === 'ALL' ? 'Semua Kategori' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Template Grid */}
          <div className="flex-1 overflow-y-auto p-6">
            {templates.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {templates.map((tpl) => (
                  <TemplateCard
                    key={tpl.id}
                    template={tpl}
                    userPlan={userPlan}
                    isSelected={tpl.id === currentTemplateId}
                    onSelect={handleSelect}
                    onPreview={(t) => setPreviewTemplate(t)}
                    onLockedClick={handleLockedClick}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-slate-500 text-sm">
                  Tidak ditemukan template yang sesuai dengan pencarian Anda.
                </p>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setSearch('');
                    setSelectedCategory('ALL');
                    setAccessFilter('all');
                  }}
                  className="mt-3"
                >
                  Reset Filter
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* HD Preview Modal */}
      <TemplatePreviewModal
        isOpen={Boolean(previewTemplate)}
        template={previewTemplate}
        userPlan={userPlan}
        onClose={() => setPreviewTemplate(null)}
        onSelectTemplate={handleSelect}
        onLockedClick={handleLockedClick}
      />

      {/* Paywall Modal */}
      <PaywallModal
        isOpen={isPaywallOpen}
        onClose={() => setIsPaywallOpen(false)}
        featureName={paywallFeature.name}
        featureDescription={paywallFeature.description}
      />
    </>
  );
}
