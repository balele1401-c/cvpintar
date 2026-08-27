import React from 'react';
import { CVContent } from '@/types';
import { Mail, Phone, MapPin, Globe, Briefcase, GraduationCap, Award } from 'lucide-react';

export function BurgundyEliteTemplate({ data }: { data: CVContent }) {
  const { personalInfo, education, experience, skills, projects } = data;


  return (
    <div className="w-full bg-white text-slate-900 font-serif text-xs leading-relaxed p-8 sm:p-12 min-h-[1100px]">
      {/* Burgundy Header Card */}
      <header className="border-b-2 border-rose-900 pb-5 mb-6 text-center">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-rose-950 uppercase tracking-widest">
          {personalInfo.fullName || 'NAMA LENGKAP'}
        </h1>
        <p className="font-sans text-rose-800 font-bold text-xs sm:text-sm tracking-wider uppercase mt-1">
          {personalInfo.professionalTitle || 'Senior Legal Consultant & Executive'}
        </p>

        <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-1 font-sans text-[11px] text-slate-600 mt-3 pt-2 border-t border-rose-100">
          {personalInfo.email && (
            <span className="flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-rose-800" /> {personalInfo.email}
            </span>
          )}
          {personalInfo.phone && (
            <span className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-rose-800" /> {personalInfo.phone}
            </span>
          )}
          {personalInfo.location && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-rose-800" /> {personalInfo.location}
            </span>
          )}
          {personalInfo.portfolio && (
            <span className="flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-rose-800" /> {personalInfo.portfolio}
            </span>
          )}
        </div>
      </header>

      <div className="space-y-6">
        {/* Executive Summary */}
        {personalInfo.summary && (
          <section className="bg-rose-50/40 p-4 rounded-xl border border-rose-200/80">
            <h2 className="text-xs font-bold uppercase tracking-widest text-rose-950 font-sans mb-1">
              Executive Profile
            </h2>
            <p className="text-slate-800 text-xs leading-relaxed text-justify">{personalInfo.summary}</p>
          </section>
        )}

        {/* Experience */}
        {experience && experience.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-rose-950 font-sans border-b border-rose-900 pb-1 mb-3 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-rose-900" /> Professional Experience
            </h2>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id} className="space-y-1 font-sans">
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-slate-900 text-xs uppercase">{exp.position}</span>
                    <span className="text-[10px] text-rose-900 font-bold bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                      {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  <div className="text-rose-900 font-semibold text-[11px]">{exp.company} {exp.location && `• ${exp.location}`}</div>
                  {exp.description && (
                    <p className="text-slate-800 text-xs leading-relaxed">{exp.description}</p>
                  )}
                  {exp.achievements && exp.achievements.length > 0 && (
                    <ul className="list-disc list-inside space-y-0.5 text-slate-800 text-[11px] mt-1 pl-1">
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

        {/* Education & Competencies */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-slate-200">
          {education && education.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-widest text-rose-950 font-sans border-b border-rose-900 pb-1 mb-3 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-rose-900" /> Academic Credentials
              </h2>
              <div className="space-y-3 font-sans">
                {education.map((edu) => (
                  <div key={edu.id}>
                    <div className="font-bold text-slate-900 text-xs">{edu.institution}</div>
                    <div className="text-rose-900 text-[11px] font-medium">
                      {edu.degree} {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}
                    </div>
                    <div className="text-[10px] text-slate-500">{edu.startDate} – {edu.current ? 'Present' : edu.endDate}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {skills && skills.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-widest text-rose-950 font-sans border-b border-rose-900 pb-1 mb-3">
                Core Competencies
              </h2>
              <div className="flex flex-wrap gap-1.5 font-sans">
                {skills.map((s) => (
                  <span
                    key={s.id}
                    className="px-2.5 py-1 bg-rose-50 text-rose-950 text-[10px] font-bold rounded border border-rose-200"
                  >
                    {s.name}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Projects / Organizations */}
        {projects && projects.length > 0 && (
          <section className="pt-2 border-t border-slate-200 font-sans">
            <h2 className="text-xs font-bold uppercase tracking-widest text-rose-950 border-b border-rose-900 pb-1 mb-3 flex items-center gap-2">
              <Award className="w-4 h-4 text-rose-900" /> Key Engagements & Projects
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
