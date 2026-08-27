import React from 'react';
import { CVContent } from '@/types';

export function AcademicTemplate({ data }: { data: CVContent }) {
  const { personalInfo, education, experience, skills, projects } = data;


  return (
    <div className="w-full bg-white text-slate-900 p-8 sm:p-12 font-serif text-xs leading-relaxed">
      {/* Formal Academic Header */}
      <div className="text-center pb-5 mb-5 border-b border-slate-400">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          {personalInfo.fullName || 'Nama Lengkap'}
        </h1>
        <p className="italic text-xs text-slate-700 mt-0.5">
          {personalInfo.professionalTitle || 'Academic Researcher & Educator'}
        </p>
        <div className="text-[10px] text-slate-600 space-x-2 mt-2">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>• {personalInfo.phone}</span>}
          {personalInfo.location && <span>• {personalInfo.location}</span>}
          {personalInfo.portfolio && <span>• {personalInfo.portfolio}</span>}
        </div>
      </div>

      {/* Research Summary */}
      {personalInfo.summary && (
        <section className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5">
            Research Interests & Focus
          </h2>
          <p className="text-slate-800 leading-relaxed text-justify text-xs">{personalInfo.summary}</p>
        </section>
      )}

      {/* Education First in Academic CV */}
      {education && education.length > 0 && (
        <section className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-2">
            Academic Background
          </h2>
          <div className="space-y-2.5">
            {education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-slate-900">{edu.degree} in {edu.fieldOfStudy}</span>
                  <span className="text-[10px] text-slate-600">{edu.startDate} – {edu.current ? 'Present' : edu.endDate}</span>
                </div>
                <div className="italic text-slate-700 text-[11px]">{edu.institution}</div>
                {edu.description && <p className="text-[10px] text-slate-600 mt-0.5">{edu.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Academic & Teaching Experience */}
      {experience && experience.length > 0 && (
        <section className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-2.5">
            Teaching & Academic Appointments
          </h2>
          <div className="space-y-3.5">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-slate-900">{exp.position}</span>
                  <span className="text-[10px] text-slate-600">{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
                </div>
                <div className="italic text-slate-700 text-[11px] mb-1">{exp.company} {exp.location && `(${exp.location})`}</div>
                {exp.description && <p className="text-slate-800 text-xs">{exp.description}</p>}
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

      {/* Research Projects & Publications */}
      {projects && projects.length > 0 && (
        <section className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-2">
            Publications & Grants
          </h2>
          <div className="space-y-2">
            {projects.map((proj) => (
              <div key={proj.id}>
                <span className="font-bold text-slate-900">{proj.name}: </span>
                <span className="text-slate-800">{proj.description}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Academic Skills & Languages */}
      {skills && skills.length > 0 && (
        <section>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5">
            Methodologies & Technical Tools
          </h2>
          <p className="text-slate-800 text-[11px] leading-relaxed">
            {skills.map((s) => s.name).join(' • ')}
          </p>
        </section>
      )}
    </div>
  );
}
