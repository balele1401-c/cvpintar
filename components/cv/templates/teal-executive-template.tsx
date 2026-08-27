import React from 'react';
import { CVContent } from '@/types';
import { Mail, Phone, MapPin, Globe, Briefcase, GraduationCap, Sparkles } from 'lucide-react';

export function TealExecutiveTemplate({ data }: { data: CVContent }) {
  const { personalInfo, education, experience, skills, projects } = data;


  return (
    <div className="w-full bg-white text-slate-800 font-sans text-xs flex flex-col min-h-[1100px]">
      {/* Deep Teal Banner Header */}
      <header className="bg-teal-900 text-white p-8 sm:p-10 border-b-4 border-teal-500">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white uppercase">
              {personalInfo.fullName || 'Nama Lengkap'}
            </h1>
            <p className="text-teal-300 font-semibold text-xs sm:text-sm tracking-wide mt-1">
              {personalInfo.professionalTitle || 'Executive & Business Leader'}
            </p>
          </div>

          <div className="space-y-1.5 text-[11px] text-teal-100 font-medium">
            {personalInfo.email && (
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-teal-300 shrink-0" /> {personalInfo.email}
              </div>
            )}
            {personalInfo.phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-teal-300 shrink-0" /> {personalInfo.phone}
              </div>
            )}
            {personalInfo.location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-teal-300 shrink-0" /> {personalInfo.location}
              </div>
            )}
            {personalInfo.portfolio && (
              <div className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-teal-300 shrink-0" /> {personalInfo.portfolio}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-8 sm:p-10 space-y-6">
        {/* Executive Summary */}
        {personalInfo.summary && (
          <section className="bg-teal-50/50 p-4 rounded-xl border border-teal-100">
            <h2 className="text-xs font-bold uppercase tracking-wider text-teal-900 mb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-teal-700" /> Profil Eksekutif
            </h2>
            <p className="text-slate-700 text-xs leading-relaxed text-justify">
              {personalInfo.summary}
            </p>
          </section>
        )}

        {/* Experience */}
        {experience && experience.length > 0 && (
          <section>
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 border-b-2 border-teal-800 pb-1.5 mb-3 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-teal-700" /> Pengalaman Karir
            </h2>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id} className="space-y-1">
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-slate-900 text-xs uppercase">{exp.position}</span>
                    <span className="text-[10px] text-teal-800 font-bold bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                      {exp.startDate} – {exp.current ? 'Sekarang' : exp.endDate}
                    </span>
                  </div>
                  <div className="text-teal-800 font-semibold text-[11px]">{exp.company} {exp.location && `• ${exp.location}`}</div>
                  {exp.description && (
                    <p className="text-slate-700 text-xs leading-relaxed">{exp.description}</p>
                  )}
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

        {/* 2-Column Row for Education & Skills */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-slate-200">
          {/* Education */}
          {education && education.length > 0 && (
            <section>
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 border-b-2 border-teal-800 pb-1.5 mb-3 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-teal-700" /> Pendidikan
              </h2>
              <div className="space-y-3">
                {education.map((edu) => (
                  <div key={edu.id}>
                    <div className="font-bold text-slate-900 text-xs">{edu.institution}</div>
                    <div className="text-teal-800 text-[11px] font-medium">
                      {edu.degree} {edu.fieldOfStudy && `— ${edu.fieldOfStudy}`}
                    </div>
                    <div className="text-[10px] text-slate-500">{edu.startDate} – {edu.current ? 'Sekarang' : edu.endDate}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Skills */}
          {skills && skills.length > 0 && (
            <section>
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 border-b-2 border-teal-800 pb-1.5 mb-3 flex items-center gap-2">
                Kompetensi Utama
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((s) => (
                  <span
                    key={s.id}
                    className="px-2.5 py-1 bg-teal-50 text-teal-900 text-[10px] font-bold rounded-lg border border-teal-200"
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
          <section className="pt-2 border-t border-slate-200">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 border-b-2 border-teal-800 pb-1.5 mb-3">
              Proyek Strategis
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
