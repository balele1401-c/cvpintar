'use client';

import React from 'react';
import { CVTemplateMetadata } from '@/lib/templates/types';
import { SAMPLE_CV_DATA } from '@/lib/templates/sample-data';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Lock, Sparkles, CheckCircle2, Eye } from 'lucide-react';
import { UserPlan } from '@/types';

interface TemplateCardProps {
  template: CVTemplateMetadata;
  userPlan: UserPlan;
  isSelected?: boolean;
  onSelect: (template: CVTemplateMetadata) => void;
  onPreview: (template: CVTemplateMetadata) => void;
  onLockedClick: (template: CVTemplateMetadata) => void;
}

export function TemplateCard({
  template,
  userPlan,
  isSelected = false,
  onSelect,
  onPreview,
  onLockedClick,
}: TemplateCardProps) {
  const isLocked = template.isPro && userPlan !== 'pro';
  const TemplateComponent = template.component;

  const handleUseClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLocked) {
      onLockedClick(template);
    } else {
      onSelect(template);
    }
  };

  const handleCardClick = () => {
    if (isLocked) {
      onLockedClick(template);
    } else {
      onPreview(template);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className={`group relative flex flex-col bg-white rounded-2xl border transition-all duration-300 overflow-hidden cursor-pointer hover:shadow-xl hover:-translate-y-1 ${
        isSelected
          ? 'border-blue-600 ring-2 ring-blue-600/20 shadow-lg'
          : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      {/* Thumbnail Container (Scaled Real A4 Render) */}
      <div className="relative w-full aspect-[1/1.35] bg-slate-100 overflow-hidden border-b border-slate-100 flex items-start justify-center">
        {/* Scaled A4 Preview */}
        <div className="w-[794px] h-[1123px] origin-top scale-[0.34] sm:scale-[0.38] md:scale-[0.32] lg:scale-[0.35] pointer-events-none select-none shadow-sm bg-white shrink-0 mt-2">
          <TemplateComponent data={SAMPLE_CV_DATA} />
        </div>

        {/* Hover Overlay with Quick Action Buttons */}
        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2.5 p-4 backdrop-blur-[2px]">
          <Button
            size="sm"
            variant="secondary"
            className="w-36 text-xs bg-white hover:bg-slate-50 text-slate-900 font-semibold shadow-md"
            onClick={(e) => {
              e.stopPropagation();
              onPreview(template);
            }}
            leftIcon={<Eye className="w-3.5 h-3.5" />}
          >
            Pratinjau HD
          </Button>

          <Button
            size="sm"
            variant="accent"
            className={`w-36 text-xs font-semibold shadow-md ${

              isLocked
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
            onClick={handleUseClick}
            leftIcon={
              isLocked ? (
                <Lock className="w-3.5 h-3.5" />
              ) : (
                <CheckCircle2 className="w-3.5 h-3.5" />
              )
            }
          >
            {isLocked ? 'Buka Kunci Pro' : isSelected ? 'Sedang Dipakai' : 'Gunakan Template'}
          </Button>
        </div>

        {/* Floating Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {template.isPro ? (
            <Badge variant="pro" className="shadow-sm">
              <Sparkles className="w-3 h-3 mr-1" /> PRO
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-white/95 text-emerald-700 border-emerald-300 font-bold shadow-sm">
              FREE
            </Badge>
          )}

          {template.isATS && (
            <Badge variant="primary" className="bg-slate-900/90 text-white text-[9px] shadow-sm">
              ATS-FRIENDLY
            </Badge>
          )}

          {template.hasPhoto && (
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-[9px] font-bold shadow-sm">
              📷 FOTO
            </Badge>
          )}
        </div>


        {isLocked && (
          <div className="absolute top-3 right-3 z-10 pointer-events-none">
            <div className="w-7 h-7 rounded-full bg-slate-900/80 text-amber-400 flex items-center justify-center shadow-md">
              <Lock className="w-3.5 h-3.5" />
            </div>
          </div>
        )}
      </div>

      {/* Card Info Details */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
        <div>
          <div className="flex items-center justify-between gap-1 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
              {template.category}
            </span>
            <span className="text-[10px] text-slate-400 font-medium">
              Popularitas: {template.popularity}%
            </span>
          </div>

          <h3 className="font-bold text-slate-900 text-sm leading-snug group-hover:text-blue-600 transition-colors">
            {template.name}
          </h3>

          <p className="text-slate-500 text-xs line-clamp-2 mt-1 leading-relaxed">
            {template.description}
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 pt-2 border-t border-slate-100">
          {template.tags.slice(0, 3).map((tag, idx) => (
            <span
              key={idx}
              className="text-[9px] px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded font-medium"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
