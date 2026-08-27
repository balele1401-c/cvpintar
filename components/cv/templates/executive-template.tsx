import React from 'react';
import { CVContent } from '@/types';

export function ExecutiveTemplate({ data }: { data: CVContent }) {
  const { personalInfo, education, experience, skills, organizations } = data;


  return (
    <div className="w-full bg-white text-slate-900 p-8 sm:p-12 font-serif text-xs leading-relaxed">
      {/* Header with double border */}
      <header className="text-center pb-6 mb-6 border-b-2 border-slate-900">
        <h1 className="text-3xl font-bold uppercase tracking-widest text-slate-900">
          {personalInfo.fullName || 'NAMA LENGKAP'}
        </h1>
        <p className="font-sans font-semibold text-xs tracking-wider uppercase text-slate-600 mt-1">
          {personalInfo.professionalTitle || 'Senior Executive & Leader'}
        </p>

        <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-1 font-sans text-[11px] text-slate-600 mt-3">
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.phone && <span>• {personalInfo.phone}</span>}
          {personalInfo.email && <span>• {personalInfo.email}</span>}
          {personalInfo.linkedIn && <span>• {personalInfo.linkedIn}</span>}
        </div>
      </header>

      {/* Executive Overview */}
      {personalInfo.summary && (
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-widest font-sans text-slate-900 border-b border-slate-300 pb-1 mb-2">
            Executive Summary
          </h2>
          <p className="text-justify text-slate-800 leading-relaxed">{personalInfo.summary}</p>
        </section>
      )}

      {/* Core Competencies */}
      {skills && skills.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-widest font-sans text-slate-900 border-b border-slate-300 pb-1 mb-2">
            Areas of Expertise & Key Competencies
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 font-sans text-[11px] text-slate-800">
            {skills.map((s) => (
              <div key={s.id} className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-slate-900 rounded-full shrink-0" />
                <span className="font-medium">{s.name}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Professional Leadership Experience */}
      {experience && experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-widest font-sans text-slate-900 border-b border-slate-300 pb-1 mb-3">
            Professional Experience & Leadership
          </h2>
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id} className="space-y-1">
                <div className="flex justify-between items-baseline font-sans">
                  <span className="font-bold text-slate-900 text-xs uppercase">{exp.position}</span>
                  <span className="text-[10px] text-slate-500 font-semibold">{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
                </div>
                <div className="font-sans font-bold text-[11px] text-slate-700">{exp.company} {exp.location && `| ${exp.location}`}</div>
                {exp.description && <p className="text-slate-800 text-xs">{exp.description}</p>}
                {exp.achievements && exp.achievements.length > 0 && (
                  <ul className="list-disc list-inside space-y-0.5 text-slate-800 text-[11px] pl-1 font-sans">
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

      {/* Education */}
      {education && education.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-widest font-sans text-slate-900 border-b border-slate-300 pb-1 mb-2">
            Education & Academic Credentials
          </h2>
          <div className="space-y-2 font-sans">
            {education.map((edu) => (
              <div key={edu.id} className="flex justify-between items-baseline">
                <div>
                  <span className="font-bold text-slate-900 text-xs">{edu.institution}</span> —{' '}
                  <span className="text-slate-700 text-xs">{edu.degree} {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}</span>
                </div>
                <span className="text-[10px] text-slate-500">{edu.startDate} – {edu.current ? 'Present' : edu.endDate}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Strategic Projects / Board Memberships */}
      {organizations && organizations.length > 0 && (
        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest font-sans text-slate-900 border-b border-slate-300 pb-1 mb-2">
            Board Memberships & Affiliations
          </h2>
          <div className="space-y-1.5 font-sans">
            {organizations.map((org) => (
              <div key={org.id} className="flex justify-between items-baseline">
                <div>
                  <span className="font-bold text-xs">{org.organization}</span> — <span className="italic text-xs">{org.position}</span>
                </div>
                <span className="text-[10px] text-slate-500">{org.period}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
