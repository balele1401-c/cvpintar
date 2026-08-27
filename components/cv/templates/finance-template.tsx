import React from 'react';
import { CVContent } from '@/types';
import { Mail, Phone, MapPin } from 'lucide-react';

export function FinanceTemplate({ data }: { data: CVContent }) {
  const { personalInfo, education, experience, skills } = data;


  return (
    <div className="w-full bg-white text-slate-800 p-8 sm:p-10 font-sans text-xs leading-relaxed">
      {/* Finance Header with Dark Green Accent */}
      <header className="border-b-2 border-emerald-800 pb-4 mb-5 flex flex-col sm:flex-row justify-between items-start sm:items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {personalInfo.fullName || 'Nama Lengkap'}
          </h1>
          <p className="text-emerald-800 font-semibold text-xs mt-0.5">
            {personalInfo.professionalTitle || 'Financial Analyst & Quantitative Specialist'}
          </p>
        </div>

        <div className="text-right text-[11px] text-slate-600 space-y-0.5 mt-2 sm:mt-0 font-medium">
          {personalInfo.email && <div className="flex items-center sm:justify-end gap-1"><Mail className="w-3 h-3 text-emerald-800" /> {personalInfo.email}</div>}
          {personalInfo.phone && <div className="flex items-center sm:justify-end gap-1"><Phone className="w-3 h-3 text-emerald-800" /> {personalInfo.phone}</div>}
          {personalInfo.location && <div className="flex items-center sm:justify-end gap-1"><MapPin className="w-3 h-3 text-emerald-800" /> {personalInfo.location}</div>}
        </div>
      </header>

      {/* Professional Summary */}
      {personalInfo.summary && (
        <section className="mb-5">
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded border-l-4 border-emerald-800 mb-1.5">
            Professional Overview
          </h2>
          <p className="text-slate-700 leading-relaxed text-justify text-xs">{personalInfo.summary}</p>
        </section>
      )}

      {/* Professional Experience */}
      {experience && experience.length > 0 && (
        <section className="mb-5">
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded border-l-4 border-emerald-800 mb-2.5">
            Work Experience & Quantitative Impact
          </h2>
          <div className="space-y-3.5">
            {experience.map((exp) => (
              <div key={exp.id} className="space-y-1">
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-slate-900 text-xs">{exp.position}</span>
                  <span className="text-[10px] text-slate-500 font-semibold">{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
                </div>
                <div className="text-emerald-800 font-semibold text-[11px]">{exp.company} {exp.location && `• ${exp.location}`}</div>
                {exp.description && <p className="text-slate-700 text-xs">{exp.description}</p>}
                {exp.achievements && exp.achievements.length > 0 && (
                  <ul className="list-disc list-inside space-y-0.5 text-slate-700 text-[11px] pl-1">
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

      {/* Education & Credentials */}
      {education && education.length > 0 && (
        <section className="mb-5">
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded border-l-4 border-emerald-800 mb-2">
            Education & Certifications
          </h2>
          <div className="space-y-2">
            {education.map((edu) => (
              <div key={edu.id} className="flex justify-between items-baseline">
                <div>
                  <span className="font-bold text-slate-900 text-xs">{edu.institution}</span> —{' '}
                  <span className="text-slate-700 text-xs">{edu.degree} {edu.fieldOfStudy && `(${edu.fieldOfStudy})`}</span>
                </div>
                <span className="text-[10px] text-slate-500 font-medium">{edu.startDate} – {edu.current ? 'Present' : edu.endDate}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Financial & Technical Skills */}
      {skills && skills.length > 0 && (
        <section>
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded border-l-4 border-emerald-800 mb-2">
            Core Competencies & Tooling
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {skills.map((s) => (
              <span key={s.id} className="px-2 py-0.5 bg-slate-100 text-slate-800 text-[10px] font-medium rounded border border-slate-200">
                {s.name}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
