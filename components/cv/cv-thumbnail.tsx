'use client';

import React, { useRef, useState, useEffect } from 'react';
import { CVContent, TemplateId } from '@/types';
import { templateRegistry } from '@/lib/templates/registry';

interface CVThumbnailProps {
  data: CVContent;
  templateId: TemplateId;
  className?: string;
}

/**
 * Renders a perfectly proportioned mini thumbnail preview of a CV template.
 * Dynamically computes transform scale so the A4 CV (794px width) fits 100% of the container.
 */
export function CVThumbnail({ data, templateId, className = '' }: CVThumbnailProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number>(0.32);

  const templateMeta = templateRegistry.get(templateId);
  const TemplateComponent = templateMeta.component;

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth;
        if (width > 0) {
          setScale(width / 794);
        }
      }
    };

    updateScale();

    // Use ResizeObserver for responsive scaling
    if (typeof ResizeObserver !== 'undefined' && containerRef.current) {
      const observer = new ResizeObserver(() => {
        updateScale();
      });
      observer.observe(containerRef.current);
      return () => observer.disconnect();
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden bg-white rounded-xl border border-slate-200 shadow-xs ${className}`}
      style={{
        width: '100%',
        aspectRatio: '210 / 297',
      }}
    >
      {/* Dynamic perfectly scaled full CV render */}
      <div
        className="origin-top-left pointer-events-none select-none"
        style={{
          width: '794px',
          minHeight: '1123px',
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        }}
      >
        <TemplateComponent data={data} />
      </div>

      {/* Subtle border overlay for crisp frame */}
      <div className="absolute inset-0 rounded-xl border border-slate-900/5 pointer-events-none" />
    </div>
  );
}
