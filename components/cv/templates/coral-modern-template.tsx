import React from 'react';
import { CVContent } from '@/types';
import { Mail, Phone, MapPin, Globe, Briefcase, GraduationCap, Sparkles, Award } from 'lucide-react';

export function CoralModernTemplate({ data }: { data: CVContent }) {
  const { personalInfo, education, experience, skills, projects, organizations } = data;

  return (
    <div className="w-full bg-white text-slate-800 font-sans text-xs leading-relaxed min-h-[1100px]">
      {/* Top Banner Header: Warm Coral / Peach Accent */}
      <header className="bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400 text-white p-8 sm:p-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white uppercase">
              {personalInfo.fullName || 'Nama Lengkap'}
            </h1>
            <p className="text-rose-100 font-semibold text-xs sm:text-sm tracking-wide mt-1">
              {personalInfo.professionalTitle || 'Modern Professional Specialist'}
            </p>
          </div>

          <div className="space-y-1 text-[11px] text-rose-50 font-medium">
            {personalInfo.email && (
              <div className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-white" /> {personalInfo.email}
              </div>
            )}
            {personalInfo.phone && (
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-white" /> {personalInfo.phone}
              </div>
            )}
            {personalInfo.location && (
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-white" /> {personalInfo.location}
              </div>
            )}
            {personalInfo.portfolio && (
              <div className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-white" /> {personalInfo.portfolio}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 2-Column Body Layout */}
      <div className="p-8 sm:p-10 grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Column (4 cols): Summary & Skills */}
        <aside className="md:col-span-4 space-y-6">
          {/* Summary */}
          {personalInfo.summary && (
            <div className="bg-rose-50/50 p-4 rounded-xl border border-rose-100">
              <h2 className="text-xs font-bold uppercase tracking-wider text-rose-900 mb-1.5 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-rose-600" /> Ringkasan
              </h2>
              <p className="text-slate-700 text-xs leading-relaxed">{personalInfo.summary}</p>
            </div>
          )}

          {/* Skills */}
          {skills && skills.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-rose-200 pb-1.5 mb-2.5">
                Keahlian & Kemampuan
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((s) => (
                  <span
                    key={s.id}
                    className="px-2.5 py-1 bg-rose-50 text-rose-900 text-[10px] font-semibold rounded-md border border-rose-200"
                  >
                    {s.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Education in Left Column */}
          {education && education.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-rose-200 pb-1.5 mb-2.5">
                Pendidikan
              </h2>
              <div className="space-y-3">
                {education.map((edu) => (
                  <div key={edu.id}>
                    <div className="font-bold text-slate-900 text-xs">{edu.institution}</div>
                    <div className="text-rose-700 text-[11px] font-medium">{edu.degree}</div>
                    <div className="text-[10px] text-slate-500">{edu.startDate} – {edu.current ? 'Sekarang' : edu.endDate}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>

        {/* Right Column (8 cols): Experience & Projects */}
        <main className="md:col-span-8 space-y-6">
          {/* Experience */}
          {experience && experience.length > 0 && (
            <section>
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 border-b-2 border-rose-500 pb-1.5 mb-3 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-rose-500" /> Pengalaman Kerja
              </h2>
              <div className="space-y-4">
                {experience.map((exp) => (
                  <div key={exp.id} className="space-y-1">
                    <div className="flex justify-between items-baseline">
                      <span className="font-bold text-slate-900 text-xs uppercase">{exp.position}</span>
                      <span className="text-[10px] text-slate-500 font-semibold">{exp.startDate} – {exp.current ? 'Sekarang' : exp.endDate}</span>
                    </div>
                    <div className="text-rose-700 font-semibold text-[11px]">{exp.company} {exp.location && `• ${exp.location}`}</div>
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

          {/* Projects */}
          {projects && projects.length > 0 && (
            <section>
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 border-b-2 border-rose-500 pb-1.5 mb-3 flex items-center gap-2">
                <Award className="w-4 h-4 text-rose-500" /> Proyek & Portofolio
              </h2>
              <div className="space-y-2.5">
                {projects.map((proj) => (
                  <div key={proj.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="flex justify-between items-baseline">
                      <span className="font-bold text-slate-900 text-xs">{proj.name}</span>
                      {proj.url && <span className="text-[10px] text-rose-600 underline">{proj.url}</span>}
                    </div>
                    <p className="text-slate-600 text-xs mt-0.5">{proj.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Organizations */}
          {organizations && organizations.length > 0 && (
            <section>
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 border-b-2 border-rose-500 pb-1.5 mb-3 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-rose-500" /> Organisasi
              </h2>
              <div className="space-y-1.5">
                {organizations.map((org) => (
                  <div key={org.id} className="flex justify-between items-baseline">
                    <span className="font-bold text-slate-900 text-xs">{org.organization} — {org.position}</span>
                    <span className="text-[10px] text-slate-500">{org.period}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
