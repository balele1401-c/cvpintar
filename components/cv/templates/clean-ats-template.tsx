import React from 'react';
import { CVContent } from '@/types';

export function CleanATSTemplate({ data }: { data: CVContent }) {
  const { personalInfo, education, experience, skills, projects, organizations } = data;

  return (
    <div className="w-full bg-white text-black p-8 sm:p-12 font-serif leading-normal text-[11px]">
      {/* Centered Classic Standard ATS Header */}
      <div className="text-center pb-4 mb-4 border-b border-black">
        <h1 className="text-xl font-bold uppercase tracking-wider text-black">
          {personalInfo.fullName || 'NAMA LENGKAP'}
        </h1>
        <p className="font-semibold text-xs mt-0.5">{personalInfo.professionalTitle}</p>
        <p className="text-[10px] mt-1.5 space-x-2 text-slate-800">
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.phone && <span>| {personalInfo.phone}</span>}
          {personalInfo.email && <span>| {personalInfo.email}</span>}
          {personalInfo.linkedIn && <span>| {personalInfo.linkedIn}</span>}
        </p>
      </div>

      {/* Summary */}
      {personalInfo.summary && (
        <section className="mb-4">
          <h2 className="text-[11px] font-bold uppercase tracking-widest border-b border-black pb-0.5 mb-1.5">
            Ringkasan Profesional
          </h2>
          <p className="text-justify leading-relaxed">{personalInfo.summary}</p>
        </section>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <section className="mb-4">
          <h2 className="text-[11px] font-bold uppercase tracking-widest border-b border-black pb-0.5 mb-2">
            Pengalaman Kerja
          </h2>
          <div className="space-y-3">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline font-bold text-[11px]">
                  <span>{exp.company} {exp.location ? `— ${exp.location}` : ''}</span>
                  <span className="font-normal text-[10px]">{exp.startDate} – {exp.current ? 'Sekarang' : exp.endDate}</span>
                </div>
                <div className="italic text-[10px] font-semibold mb-1">{exp.position}</div>
                {exp.description && <p className="mb-1 text-slate-900">{exp.description}</p>}
                {exp.achievements && exp.achievements.length > 0 && (
                  <ul className="list-disc list-inside space-y-0.5 text-slate-900 pl-1">
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
        <section className="mb-4">
          <h2 className="text-[11px] font-bold uppercase tracking-widest border-b border-black pb-0.5 mb-2">
            Pendidikan
          </h2>
          <div className="space-y-2">
            {education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline font-bold text-[11px]">
                  <span>{edu.institution}</span>
                  <span className="font-normal text-[10px]">{edu.startDate} – {edu.current ? 'Sekarang' : edu.endDate}</span>
                </div>
                <div className="italic text-[10px]">{edu.degree} {edu.fieldOfStudy && `— ${edu.fieldOfStudy}`}</div>
                {edu.description && <p className="text-[10px] text-slate-800 mt-0.5">{edu.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skills && skills.length > 0 && (
        <section className="mb-4">
          <h2 className="text-[11px] font-bold uppercase tracking-widest border-b border-black pb-0.5 mb-1.5">
            Keahlian Teknis & Bahasa
          </h2>
          <p className="leading-relaxed">
            {skills.map((s) => s.name).join(' • ')}
          </p>
        </section>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <section className="mb-4">
          <h2 className="text-[11px] font-bold uppercase tracking-widest border-b border-black pb-0.5 mb-2">
            Proyek
          </h2>
          <div className="space-y-2">
            {projects.map((proj) => (
              <div key={proj.id}>
                <div className="flex justify-between items-baseline font-bold">
                  <span>{proj.name}</span>
                  {proj.url && <span className="font-normal text-[10px]">{proj.url}</span>}
                </div>
                <p className="text-slate-900">{proj.description}</p>
                {proj.technologies && (
                  <p className="italic text-[10px] text-slate-700">Teknologi: {proj.technologies.join(', ')}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Organizations */}
      {organizations && organizations.length > 0 && (
        <section>
          <h2 className="text-[11px] font-bold uppercase tracking-widest border-b border-black pb-0.5 mb-1.5">
            Pengalaman Organisasi
          </h2>
          <div className="space-y-1.5">
            {organizations.map((org) => (
              <div key={org.id} className="flex justify-between items-baseline">
                <div>
                  <span className="font-bold">{org.organization}</span> — <span className="italic">{org.position}</span>
                </div>
                <span className="text-[10px]">{org.period}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
