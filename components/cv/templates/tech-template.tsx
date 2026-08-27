import React from 'react';
import { CVContent } from '@/types';

export function TechTemplate({ data }: { data: CVContent }) {
  const { personalInfo, education, experience, skills, projects } = data;


  return (
    <div className="w-full bg-white text-slate-900 font-sans p-8 sm:p-12 leading-relaxed text-sm">
      {/* Header with Tech Aesthetic */}
      <div className="pb-4 border-b-2 border-slate-900 mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-mono">
            {personalInfo.fullName || 'Nama Lengkap'}
          </h1>
          {personalInfo.professionalTitle && (
            <p className="text-sm font-semibold text-blue-700 font-mono mt-0.5">
              &gt; {personalInfo.professionalTitle}
            </p>
          )}
        </div>
        <div className="text-xs text-slate-600 font-mono space-y-0.5 text-left sm:text-right">
          {personalInfo.email && <div>{personalInfo.email}</div>}
          {personalInfo.phone && <div>{personalInfo.phone}</div>}
          {personalInfo.location && <div>{personalInfo.location}</div>}
          {personalInfo.github && <div className="text-slate-800">{personalInfo.github}</div>}
          {personalInfo.linkedIn && <div className="text-slate-800">{personalInfo.linkedIn}</div>}
        </div>
      </div>

      {/* Summary */}
      {personalInfo.summary && (
        <div className="mb-5">
          <h2 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-900 mb-1.5 flex items-center gap-1.5">
            <span className="text-blue-600 font-bold">#</span> Ringkasan Profesional
          </h2>
          <p className="text-xs text-slate-700 leading-relaxed">
            {personalInfo.summary}
          </p>
        </div>
      )}

      {/* Technical Skills Highlight */}
      {skills && skills.length > 0 && (
        <div className="mb-5">
          <h2 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-900 mb-1.5 flex items-center gap-1.5">
            <span className="text-blue-600 font-bold">#</span> Keahlian Teknis & Tools
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {skills.map((s) => (
              <span
                key={s.id}
                className="text-[11px] font-mono px-2 py-0.5 bg-slate-100 border border-slate-300 rounded text-slate-800"
              >
                {s.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <div className="mb-5">
          <h2 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-900 mb-2 flex items-center gap-1.5">
            <span className="text-blue-600 font-bold">#</span> Pengalaman Kerja
          </h2>
          <div className="space-y-3.5">
            {experience.map((exp) => (
              <div key={exp.id} className="text-xs">
                <div className="flex justify-between font-bold text-slate-900">
                  <span className="text-slate-900 font-mono">
                    {exp.position} <span className="font-sans font-normal text-slate-600">@ {exp.company}</span>
                  </span>
                  <span className="font-mono text-[11px] text-slate-500">
                    [{exp.startDate} - {exp.current ? 'Now' : exp.endDate}]
                  </span>
                </div>
                {exp.description && (
                  <p className="text-slate-700 leading-relaxed whitespace-pre-line mt-1">
                    {exp.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <div className="mb-5">
          <h2 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-900 mb-2 flex items-center gap-1.5">
            <span className="text-blue-600 font-bold">#</span> Proyek Rekayasa & Portofolio
          </h2>
          <div className="space-y-3">
            {projects.map((proj) => (
              <div key={proj.id} className="text-xs">
                <div className="flex justify-between font-bold text-slate-900">
                  <span className="font-mono">{proj.name}</span>
                  {proj.url && (
                    <span className="font-mono text-[11px] text-blue-600">{proj.url}</span>
                  )}
                </div>
                {proj.technologies?.length > 0 && (
                  <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                    Tech Stack: {proj.technologies.join(', ')}
                  </div>
                )}
                {proj.description && (
                  <p className="text-slate-700 mt-1 leading-relaxed">{proj.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-900 mb-2 flex items-center gap-1.5">
            <span className="text-blue-600 font-bold">#</span> Pendidikan
          </h2>
          <div className="space-y-2.5">
            {education.map((edu) => (
              <div key={edu.id} className="text-xs">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>{edu.institution}</span>
                  <span className="font-mono text-[11px] text-slate-500">
                    {edu.startDate} - {edu.current ? 'Now' : edu.endDate}
                  </span>
                </div>
                <div className="text-slate-700">
                  {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
