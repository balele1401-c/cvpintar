import React from 'react';
import { CVContent } from '@/types';

export function MinimalistTemplate({ data }: { data: CVContent }) {
  const { personalInfo, education, experience, skills, projects } = data;


  return (
    <div className="w-full bg-white text-slate-900 font-sans p-8 sm:p-12 leading-relaxed text-sm">
      {/* Header Minimalist Swiss Style */}
      <div className="mb-6 pb-4 border-b border-slate-200">
        <h1 className="text-3xl font-light tracking-tight text-slate-900">
          <strong className="font-extrabold">{personalInfo.fullName?.split(' ')[0] || 'Nama'}</strong>{' '}
          {personalInfo.fullName?.split(' ').slice(1).join(' ') || 'Lengkap'}
        </h1>
        {personalInfo.professionalTitle && (
          <p className="text-sm text-slate-500 font-medium tracking-wide mt-0.5">
            {personalInfo.professionalTitle}
          </p>
        )}
        <div className="flex flex-wrap gap-x-4 text-xs text-slate-400 mt-2 font-mono">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.linkedIn && <span>{personalInfo.linkedIn}</span>}
        </div>
      </div>

      {/* Summary */}
      {personalInfo.summary && (
        <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-2">
          <div className="text-xs font-bold uppercase tracking-widest text-slate-400">
            Profil
          </div>
          <div className="md:col-span-3 text-xs text-slate-700 leading-relaxed">
            {personalInfo.summary}
          </div>
        </div>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-2">
          <div className="text-xs font-bold uppercase tracking-widest text-slate-400">
            Pengalaman
          </div>
          <div className="md:col-span-3 space-y-4 text-xs">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between font-semibold text-slate-900">
                  <span>{exp.position}</span>
                  <span className="font-mono text-[11px] text-slate-400">
                    {exp.startDate} – {exp.current ? 'Kini' : exp.endDate}
                  </span>
                </div>
                <div className="text-slate-500 text-xs font-medium">{exp.company}</div>
                {exp.description && (
                  <p className="text-slate-600 mt-1 leading-relaxed whitespace-pre-line">
                    {exp.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-2">
          <div className="text-xs font-bold uppercase tracking-widest text-slate-400">
            Pendidikan
          </div>
          <div className="md:col-span-3 space-y-3 text-xs">
            {education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between font-semibold text-slate-900">
                  <span>{edu.institution}</span>
                  <span className="font-mono text-[11px] text-slate-400">
                    {edu.startDate} – {edu.current ? 'Kini' : edu.endDate}
                  </span>
                </div>
                <div className="text-slate-600">
                  {edu.degree} {edu.fieldOfStudy ? `dalam ${edu.fieldOfStudy}` : ''}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {skills && skills.length > 0 && (
        <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-2">
          <div className="text-xs font-bold uppercase tracking-widest text-slate-400">
            Keahlian
          </div>
          <div className="md:col-span-3 text-xs text-slate-700">
            {skills.map((s) => s.name).join('  /  ')}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <div className="mb-4 grid grid-cols-1 md:grid-cols-4 gap-2">
          <div className="text-xs font-bold uppercase tracking-widest text-slate-400">
            Proyek
          </div>
          <div className="md:col-span-3 space-y-3 text-xs">
            {projects.map((proj) => (
              <div key={proj.id}>
                <div className="flex justify-between font-semibold text-slate-900">
                  <span>{proj.name}</span>
                  {proj.url && (
                    <span className="font-mono text-[11px] text-blue-600">{proj.url}</span>
                  )}
                </div>
                {proj.description && (
                  <p className="text-slate-600 mt-0.5">{proj.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
