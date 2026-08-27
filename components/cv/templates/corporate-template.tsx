import React from 'react';
import { CVContent } from '@/types';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';

export function CorporateTemplate({ data }: { data: CVContent }) {
  const { personalInfo, education, experience, skills, projects } = data;


  return (
    <div className="w-full bg-white text-slate-800 font-sans text-xs leading-relaxed">
      {/* Corporate Deep Navy Header Banner */}
      <header className="bg-slate-900 text-white p-8 sm:p-10 border-b-4 border-amber-500">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white uppercase">
              {personalInfo.fullName || 'Nama Lengkap'}
            </h1>
            <p className="text-amber-400 font-semibold text-sm tracking-wide mt-1">
              {personalInfo.professionalTitle || 'Executive / Professional'}
            </p>
          </div>

          <div className="space-y-1 text-[11px] text-slate-300 font-medium">
            {personalInfo.email && (
              <div className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-amber-400" /> {personalInfo.email}
              </div>
            )}
            {personalInfo.phone && (
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-amber-400" /> {personalInfo.phone}
              </div>
            )}
            {personalInfo.location && (
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400" /> {personalInfo.location}
              </div>
            )}
            {personalInfo.linkedIn && (
              <div className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-amber-400" /> {personalInfo.linkedIn}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Body */}
      <div className="p-8 sm:p-10 space-y-6">
        {/* Executive Summary */}
        {personalInfo.summary && (
          <section>
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 border-l-4 border-slate-900 pl-2.5 mb-2">
              Executive Summary
            </h2>
            <p className="text-slate-700 leading-relaxed text-justify">{personalInfo.summary}</p>
          </section>
        )}

        {/* Professional Experience */}
        {experience && experience.length > 0 && (
          <section>
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 border-l-4 border-slate-900 pl-2.5 mb-3">
              Riwayat Karir & Pengalaman
            </h2>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id} className="space-y-1">
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-slate-900 text-xs uppercase">{exp.position}</span>
                    <span className="text-[10px] text-slate-500 font-semibold">
                      {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  <div className="text-amber-700 font-bold text-[11px]">{exp.company} {exp.location && `| ${exp.location}`}</div>
                  {exp.description && <p className="text-slate-700 text-xs">{exp.description}</p>}
                  {exp.achievements && exp.achievements.length > 0 && (
                    <ul className="list-disc list-inside space-y-0.5 text-slate-700 text-[11px] mt-1 pl-1">
                      {exp.achievements.map((ach, idx) => (
                        <li key={idx}>{ach}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Grid for Education & Skills */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 border-t border-slate-200">
          {/* Education */}
          {education && education.length > 0 && (
            <section>
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 border-l-4 border-slate-900 pl-2.5 mb-2.5">
                Pendidikan Formal
              </h2>
              <div className="space-y-2.5">
                {education.map((edu) => (
                  <div key={edu.id}>
                    <div className="font-bold text-slate-900 text-xs">{edu.institution}</div>
                    <div className="text-slate-600 text-[11px]">
                      {edu.degree} {edu.fieldOfStudy && `• ${edu.fieldOfStudy}`}
                    </div>
                    <div className="text-[10px] text-slate-500 font-medium">{edu.startDate} – {edu.current ? 'Sekarang' : edu.endDate}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Core Competencies / Skills */}
          {skills && skills.length > 0 && (
            <section>
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 border-l-4 border-slate-900 pl-2.5 mb-2.5">
                Core Competencies
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((s) => (
                  <span key={s.id} className="px-2 py-1 bg-slate-100 text-slate-800 text-[10px] font-semibold rounded border border-slate-300">
                    {s.name}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Projects / Deals */}
        {projects && projects.length > 0 && (
          <section className="pt-2 border-t border-slate-200">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 border-l-4 border-slate-900 pl-2.5 mb-2.5">
              Key Projects & Initiatives
            </h2>
            <div className="space-y-2">
              {projects.map((proj) => (
                <div key={proj.id}>
                  <span className="font-bold text-slate-900 text-xs">{proj.name}: </span>
                  <span className="text-slate-700 text-xs">{proj.description}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
