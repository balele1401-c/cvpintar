'use client';

import React from 'react';
import { CVTemplateMetadata } from '@/lib/templates/types';
import { SAMPLE_CV_DATA } from '@/lib/templates/sample-data';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Sparkles, Lock, CheckCircle2, FileCheck2 } from 'lucide-react';
import { UserPlan } from '@/types';

interface TemplatePreviewModalProps {
  isOpen: boolean;
  template: CVTemplateMetadata | null;
  userPlan: UserPlan;
  onClose: () => void;
  onSelectTemplate: (template: CVTemplateMetadata) => void;
  onLockedClick: (template: CVTemplateMetadata) => void;
}

export function TemplatePreviewModal({
  isOpen,
  template,
  userPlan,
  onClose,
  onSelectTemplate,
  onLockedClick,
}: TemplatePreviewModalProps) {
  if (!isOpen || !template) return null;

  const isLocked = template.isPro && userPlan !== 'pro';
  const TemplateComponent = template.component;

  const handleUse = () => {
    if (isLocked) {
      onLockedClick(template);
    } else {
      onSelectTemplate(template);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl max-h-[90vh] bg-slate-900 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-700">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold tracking-tight text-white">
                  {template.name}
                </h2>
                {template.isPro ? (
                  <Badge variant="pro">
                    <Sparkles className="w-3 h-3 mr-1" /> PRO
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-white/10 text-emerald-400 border-emerald-500/40">
                    FREE
                  </Badge>
                )}
                {template.isATS && (
                  <Badge variant="primary" className="text-[10px]">
                    <FileCheck2 className="w-3 h-3 mr-1" /> ATS 100%
                  </Badge>
                )}
                {template.hasPhoto && (
                  <Badge variant="outline" className="bg-blue-500/20 text-blue-300 border-blue-400/40 text-[10px]">
                    📷 FOTO PROFIL
                  </Badge>
                )}
              </div>

              <p className="text-xs text-slate-400 mt-0.5">{template.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="accent"
              size="sm"

              onClick={handleUse}
              leftIcon={
                isLocked ? (
                  <Lock className="w-3.5 h-3.5" />
                ) : (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                )
              }
              className={
                isLocked
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold'
                  : 'bg-blue-600 hover:bg-blue-700 text-white font-semibold'
              }
            >
              {isLocked ? 'Upgrade Pro untuk Pakai' : 'Gunakan Template Ini'}
            </Button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable A4 Document Viewport */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-950 flex justify-center items-start">
          <div className="w-full max-w-[794px] min-h-[1123px] bg-white shadow-2xl rounded-sm overflow-hidden text-slate-900 border border-slate-200 print:border-none">
            <TemplateComponent data={SAMPLE_CV_DATA} />
          </div>
        </div>
      </div>
    </div>
  );
}
