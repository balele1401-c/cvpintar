'use client';

import React from 'react';
import { CVContent, TemplateId, UserPlan } from '@/types';
import { templateRegistry } from '@/lib/templates/registry';

export interface CVPreviewRendererProps {
  data: CVContent;
  templateId: TemplateId;
  plan?: UserPlan;
}

export function CVPreviewRenderer({
  data,
  templateId,
  plan = 'free',
}: CVPreviewRendererProps) {
  // Query dynamic template component from the scalable registry
  const templateMeta = templateRegistry.get(templateId);
  const TemplateComponent = templateMeta.component;

  return (
    <div id="cv-printable-area" className="relative w-full bg-white rounded-lg shadow-md print:shadow-none print:m-0 overflow-hidden border border-slate-200 print:border-none min-h-[1100px] flex flex-col justify-between">
      {/* Dynamic Template Component Render */}
      <div className="flex-1">
        <TemplateComponent data={data} />
      </div>

      {/* Free Tier Watermark Footer (Disabled for Pro) */}
      {plan === 'free' && (
        <div className="w-full py-3 px-8 text-center border-t border-slate-200 bg-slate-50 text-[10px] text-slate-400 print:bg-transparent font-medium">
          Dibuat secara gratis dengan <strong>CVPintar</strong> (cvpintar.id) • Upgrade ke Pro untuk menghapus watermark ini
        </div>
      )}
    </div>
  );
}
