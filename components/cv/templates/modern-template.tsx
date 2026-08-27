import React from 'react';
import { CVContent } from '@/types';

export function ModernTemplate({ data }: { data: CVContent }) {
  const { personalInfo, education, experience, skills, projects, organizations } = data;

  return (
    <div className="w-full bg-white text-slate-900 font-sans p-8 sm:p-12 leading-relaxed text-sm">
      {/* Header with Blue Left Border Accent */}
      <div className="border-l-4 border-blue-600 pl-4 py-1 mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {personalInfo.fullName || 'Nama Lengkap'}
        </h1>
        {personalInfo.professionalTitle && (
          <p className="text-sm font-semibold text-blue-600 mt-0.5">
            {personalInfo.professionalTitle}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 mt-2">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.linkedIn && <span>{personalInfo.linkedIn}</span>}
          {personalInfo.portfolio && <span>{personalInfo.portfolio}</span>}
        </div>
      </div>

      {/* Summary */}
      {personalInfo.summary && (
        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 bg-slate-100 px-2.5 py-1 rounded mb-2">
            Tentang Saya
          </h2>
          <p className="text-xs text-slate-700 leading-relaxed">
            {personalInfo.summary}
          </p>
        </div>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 bg-slate-100 px-2.5 py-1 rounded mb-3">
            Pengalaman Profesional
          </h2>
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id} className="text-xs">
                <div className="flex justify-between items-baseline font-bold text-slate-900">
                  <span className="text-sm text-slate-900">{exp.position}</span>
                  <span className="text-xs font-normal text-slate-500">
                    {exp.startDate} - {exp.current ? 'Sekarang' : exp.endDate}
                  </span>
                </div>
                <div className="text-blue-700 font-medium mb-1">
                  {exp.company} {exp.location ? `• ${exp.location}` : ''}
                </div>
                {exp.description && (
                  <p className="text-slate-700 leading-relaxed whitespace-pre-line">
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
        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 bg-slate-100 px-2.5 py-1 rounded mb-3">
            Riwayat Pendidikan
          </h2>
          <div className="space-y-3">
            {education.map((edu) => (
              <div key={edu.id} className="text-xs">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>{edu.institution}</span>
                  <span className="font-normal text-slate-500">
                    {edu.startDate} - {edu.current ? 'Sekarang' : edu.endDate}
                  </span>
                </div>
                <div className="text-slate-700">
                  {edu.degree} {edu.fieldOfStudy ? `— Jurusan ${edu.fieldOfStudy}` : ''}
                </div>
                {edu.description && (
                  <p className="text-slate-500 mt-0.5">{edu.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {skills && skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 bg-slate-100 px-2.5 py-1 rounded mb-2.5">
            Keahlian & Kompetensi
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {skills.map((skill) => (
              <span
                key={skill.id}
                className="text-xs px-2.5 py-0.5 rounded bg-slate-100 text-slate-800 font-medium border border-slate-200"
              >
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 bg-slate-100 px-2.5 py-1 rounded mb-3">
            Proyek & Karya
          </h2>
          <div className="space-y-3">
            {projects.map((proj) => (
              <div key={proj.id} className="text-xs">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>{proj.name}</span>
                  {proj.url && (
                    <span className="font-normal text-blue-600 underline text-[11px]">{proj.url}</span>
                  )}
                </div>
                {proj.technologies?.length > 0 && (
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Teknologi: {proj.technologies.join(', ')}
                  </p>
                )}
                {proj.description && (
                  <p className="text-slate-700 mt-1">{proj.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Organizations */}
      {organizations && organizations.length > 0 && (
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 bg-slate-100 px-2.5 py-1 rounded mb-3">
            Pengalaman Organisasi
          </h2>
          <div className="space-y-2">
            {organizations.map((org) => (
              <div key={org.id} className="text-xs">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>{org.organization} — {org.position}</span>
                  <span className="font-normal text-slate-500">{org.period}</span>
                </div>
                {org.description && (
                  <p className="text-slate-700 mt-0.5">{org.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
