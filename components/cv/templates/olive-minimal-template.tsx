import React from 'react';
import { CVContent } from '@/types';
import { Mail, Phone, MapPin, Globe, Briefcase, GraduationCap, Sparkles } from 'lucide-react';

export function OliveMinimalTemplate({ data }: { data: CVContent }) {
  const { personalInfo, education, experience, skills, projects, organizations } = data;

  return (
    <div className="w-full bg-white text-slate-800 font-sans text-xs flex flex-col md:flex-row min-h-[1100px]">
      {/* Olive Green Sidebar */}
      <aside className="w-full md:w-72 bg-emerald-950 text-emerald-100 p-6 sm:p-7 space-y-6 shrink-0">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            {personalInfo.fullName || 'Nama Lengkap'}
          </h1>
          <p className="text-emerald-400 font-semibold text-xs mt-1">
            {personalInfo.professionalTitle || 'Spesialis & Profesional'}
          </p>
        </div>

        {/* Data Pribadi / Kontak */}
        <div className="space-y-2 pt-4 border-t border-emerald-900 text-[11px]">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-emerald-300">
            Data Kontak
          </h3>
          {personalInfo.email && (
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="truncate">{personalInfo.email}</span>
            </div>
          )}
          {personalInfo.phone && (
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>{personalInfo.phone}</span>
            </div>
          )}
          {personalInfo.location && (
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>{personalInfo.location}</span>
            </div>
          )}
          {personalInfo.portfolio && (
            <div className="flex items-center gap-2">
              <Globe className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="truncate text-emerald-300 underline">{personalInfo.portfolio}</span>
            </div>
          )}
        </div>

        {/* Keahlian */}
        {skills && skills.length > 0 && (
          <div className="space-y-2.5 pt-4 border-t border-emerald-900">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-emerald-300">
              Keahlian Utama
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((s) => (
                <span
                  key={s.id}
                  className="px-2 py-0.5 bg-emerald-900/80 text-emerald-200 text-[10px] font-medium rounded border border-emerald-800"
                >
                  {s.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Organisasi di Sidebar */}
        {organizations && organizations.length > 0 && (
          <div className="space-y-2 pt-4 border-t border-emerald-900 text-xs">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-emerald-300">
              Organisasi
            </h3>
            {organizations.map((org) => (
              <div key={org.id}>
                <div className="font-bold text-white text-xs">{org.organization}</div>
                <div className="text-emerald-300 text-[11px]">{org.position}</div>
                <div className="text-emerald-400/80 text-[10px]">{org.period}</div>
              </div>
            ))}
          </div>
        )}
      </aside>

      {/* Main Right Content */}
      <main className="flex-1 p-6 sm:p-8 space-y-6">
        {/* Profil */}
        {personalInfo.summary && (
          <section className="bg-emerald-50/40 p-4 rounded-xl border border-emerald-200/70">
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-950 mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-700" /> Profil Pribadi
            </h2>
            <p className="text-slate-700 text-xs leading-relaxed text-justify">{personalInfo.summary}</p>
          </section>
        )}

        {/* Riwayat Pekerjaan */}
        {experience && experience.length > 0 && (
          <section>
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 border-b-2 border-emerald-800 pb-1.5 mb-3 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-emerald-700" /> Riwayat Pekerjaan
            </h2>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id} className="space-y-1">
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-slate-900 text-xs uppercase">{exp.position}</span>
                    <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {exp.startDate} – {exp.current ? 'Sekarang' : exp.endDate}
                    </span>
                  </div>
                  <div className="text-emerald-900 font-semibold text-[11px]">{exp.company} {exp.location && `• ${exp.location}`}</div>
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

        {/* Riwayat Pendidikan */}
        {education && education.length > 0 && (
          <section>
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 border-b-2 border-emerald-800 pb-1.5 mb-3 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-emerald-700" /> Riwayat Pendidikan
            </h2>
            <div className="space-y-3">
              {education.map((edu) => (
                <div key={edu.id} className="space-y-0.5">
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-slate-900 text-xs">{edu.institution}</span>
                    <span className="text-[10px] text-slate-500 font-semibold">{edu.startDate} – {edu.current ? 'Sekarang' : edu.endDate}</span>
                  </div>
                  <div className="text-emerald-800 font-medium text-[11px]">
                    {edu.degree} {edu.fieldOfStudy && `— ${edu.fieldOfStudy}`}
                  </div>
                  {edu.description && (
                    <p className="text-slate-600 text-[11px]">{edu.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Proyek */}
        {projects && projects.length > 0 && (
          <section>
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 border-b-2 border-emerald-800 pb-1.5 mb-3">
              Proyek Portofolio
            </h2>
            <div className="space-y-2">
              {projects.map((proj) => (
                <div key={proj.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-slate-900 text-xs">{proj.name}</span>
                    {proj.url && <span className="text-[10px] text-emerald-700 underline">{proj.url}</span>}
                  </div>
                  <p className="text-slate-600 text-xs mt-0.5">{proj.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
