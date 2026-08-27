import React from 'react';
import { CVContent } from '@/types';

export function ClassicTemplate({ data }: { data: CVContent }) {
  const { personalInfo, education, experience, skills, projects, organizations } = data;

  return (
    <div className="w-full bg-white text-slate-900 font-sans p-8 sm:p-12 leading-relaxed text-sm">
      {/* Header */}
      <div className="text-center pb-4 border-b border-slate-900/80 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold uppercase tracking-wide text-slate-900">
          {personalInfo.fullName || 'Nama Lengkap'}
        </h1>
        {personalInfo.professionalTitle && (
          <p className="text-sm font-semibold text-slate-700 mt-1 uppercase tracking-wider">
            {personalInfo.professionalTitle}
          </p>
        )}
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-slate-600 mt-2">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>• {personalInfo.phone}</span>}
          {personalInfo.location && <span>• {personalInfo.location}</span>}
          {personalInfo.linkedIn && <span>• {personalInfo.linkedIn}</span>}
          {personalInfo.portfolio && <span>• {personalInfo.portfolio}</span>}
        </div>
      </div>

      {/* Summary */}
      {personalInfo.summary && (
        <div className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">
            Ringkasan Profil
          </h2>
          <p className="text-xs text-slate-700 leading-relaxed text-justify">
            {personalInfo.summary}
          </p>
        </div>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <div className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">
            Pengalaman Kerja
          </h2>
          <div className="space-y-3">
            {experience.map((exp) => (
              <div key={exp.id} className="text-xs">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>{exp.position} — {exp.company}</span>
                  <span className="font-normal text-slate-600">
                    {exp.startDate} - {exp.current ? 'Sekarang' : exp.endDate}
                  </span>
                </div>
                {exp.location && (
                  <p className="text-[11px] text-slate-500 italic mb-1">{exp.location}</p>
                )}
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

      {/* Education */}
      {education && education.length > 0 && (
        <div className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">
            Pendidikan
          </h2>
          <div className="space-y-3">
            {education.map((edu) => (
              <div key={edu.id} className="text-xs">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>{edu.institution}</span>
                  <span className="font-normal text-slate-600">
                    {edu.startDate} - {edu.current ? 'Sekarang' : edu.endDate}
                  </span>
                </div>
                <div className="text-slate-700">
                  {edu.degree} {edu.fieldOfStudy ? `dalam ${edu.fieldOfStudy}` : ''}
                </div>
                {edu.description && (
                  <p className="text-[11px] text-slate-600 mt-0.5">{edu.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <div className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">
            Proyek & Portofolio
          </h2>
          <div className="space-y-2.5">
            {projects.map((proj) => (
              <div key={proj.id} className="text-xs">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>
                    {proj.name}{' '}
                    {proj.technologies?.length > 0 && (
                      <span className="font-normal text-slate-500 text-[11px]">
                        ({proj.technologies.join(', ')})
                      </span>
                    )}
                  </span>
                  {proj.url && (
                    <span className="text-[11px] font-normal text-blue-700">{proj.url}</span>
                  )}
                </div>
                {proj.description && (
                  <p className="text-slate-700 mt-0.5 leading-relaxed">{proj.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {skills && skills.length > 0 && (
        <div className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">
            Keahlian (Skills)
          </h2>
          <p className="text-xs text-slate-700 leading-relaxed">
            {skills.map((s) => s.name).join(' • ')}
          </p>
        </div>
      )}

      {/* Organizations */}
      {organizations && organizations.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">
            Organisasi & Kepanitiaan
          </h2>
          <div className="space-y-2">
            {organizations.map((org) => (
              <div key={org.id} className="text-xs">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>{org.organization} — {org.position}</span>
                  <span className="font-normal text-slate-600">{org.period}</span>
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
