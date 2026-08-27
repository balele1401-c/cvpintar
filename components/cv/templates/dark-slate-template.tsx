import React from 'react';
import { CVContent } from '@/types';
import { Mail, Phone, MapPin, Globe, Briefcase, GraduationCap, Award } from 'lucide-react';

export function DarkSlateTemplate({ data }: { data: CVContent }) {
  const { personalInfo, education, experience, skills, projects, organizations } = data;

  return (
    <div className="w-full bg-white text-slate-900 font-sans text-xs flex flex-col md:flex-row min-h-[1100px]">
      {/* Dark Sidebar Column */}
      <aside className="w-full md:w-80 bg-slate-950 text-slate-100 p-6 sm:p-8 space-y-6 shrink-0">
        {/* Name & Title in Sidebar */}
        <div className="border-b border-slate-800 pb-5">
          <h1 className="text-2xl font-extrabold text-white uppercase tracking-tight">
            {personalInfo.fullName || 'Nama Lengkap'}
          </h1>
          <p className="text-blue-400 font-semibold text-xs tracking-wider uppercase mt-1">
            {personalInfo.professionalTitle || 'Profesi & Keahlian'}
          </p>
        </div>

        {/* Tentang Saya */}
        {personalInfo.summary && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-300 border-b border-slate-800 pb-1 mb-2">
              Tentang Saya
            </h2>
            <p className="text-slate-400 text-xs leading-relaxed text-justify">
              {personalInfo.summary}
            </p>
          </div>
        )}

        {/* Kontak */}
        <div className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-300 border-b border-slate-800 pb-1 mb-2.5">
            Kontak Pribadi
          </h2>
          {personalInfo.email && (
            <div className="flex items-center gap-2 text-[11px] text-slate-300">
              <Mail className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span className="truncate">{personalInfo.email}</span>
            </div>
          )}
          {personalInfo.phone && (
            <div className="flex items-center gap-2 text-[11px] text-slate-300">
              <Phone className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span>{personalInfo.phone}</span>
            </div>
          )}
          {personalInfo.location && (
            <div className="flex items-center gap-2 text-[11px] text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span>{personalInfo.location}</span>
            </div>
          )}
          {personalInfo.portfolio && (
            <div className="flex items-center gap-2 text-[11px] text-slate-300">
              <Globe className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span className="truncate text-blue-300 underline">{personalInfo.portfolio}</span>
            </div>
          )}
        </div>

        {/* Keahlian with dot skill bars */}
        {skills && skills.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-300 border-b border-slate-800 pb-1 mb-3">
              Keahlian
            </h2>
            <div className="space-y-2.5">
              {skills.map((s) => (
                <div key={s.id} className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-300 font-medium">{s.name}</span>
                    <span className="text-blue-400 text-[10px]">{s.level || 'Mahir'}</span>
                  </div>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((dot) => (
                      <div
                        key={dot}
                        className={`h-1.5 flex-1 rounded-full ${
                          dot <=
                          (s.level === 'Beginner'
                            ? 2
                            : s.level === 'Intermediate'
                            ? 3
                            : s.level === 'Advanced'
                            ? 4
                            : 5)
                            ? 'bg-blue-500'
                            : 'bg-slate-800'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </aside>

      {/* White Main Right Column */}
      <main className="flex-1 p-6 sm:p-8 space-y-6">
        {/* Riwayat Pendidikan */}
        {education && education.length > 0 && (
          <section>
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 border-b-2 border-slate-900 pb-1.5 mb-3 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-blue-600" /> Riwayat Pendidikan
            </h2>
            <div className="space-y-3">
              {education.map((edu) => (
                <div key={edu.id} className="space-y-0.5">
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-slate-900 text-xs">{edu.institution}</span>
                    <span className="text-[10px] text-slate-500 font-semibold">
                      {edu.startDate} – {edu.current ? 'Sekarang' : edu.endDate}
                    </span>
                  </div>
                  <div className="text-blue-700 font-medium text-[11px]">
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

        {/* Pengalaman Kerja */}
        {experience && experience.length > 0 && (
          <section>
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 border-b-2 border-slate-900 pb-1.5 mb-3 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-blue-600" /> Pengalaman Kerja
            </h2>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id} className="space-y-1">
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-slate-900 text-xs uppercase">{exp.position}</span>
                    <span className="text-[10px] text-slate-500 font-semibold">
                      {exp.startDate} – {exp.current ? 'Sekarang' : exp.endDate}
                    </span>
                  </div>
                  <div className="text-slate-600 font-semibold text-[11px]">{exp.company} {exp.location && `• ${exp.location}`}</div>
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

        {/* Proyek & Portofolio */}
        {projects && projects.length > 0 && (
          <section>
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 border-b-2 border-slate-900 pb-1.5 mb-3 flex items-center gap-2">
              <Award className="w-4 h-4 text-blue-600" /> Proyek & Portofolio
            </h2>
            <div className="space-y-2.5">
              {projects.map((proj) => (
                <div key={proj.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-slate-900 text-xs">{proj.name}</span>
                    {proj.url && <span className="text-[10px] text-blue-600 underline">{proj.url}</span>}
                  </div>
                  <p className="text-slate-600 text-xs mt-0.5">{proj.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Organisasi */}
        {organizations && organizations.length > 0 && (
          <section>
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 border-b-2 border-slate-900 pb-1.5 mb-3 flex items-center gap-2">
              Organisasi & Kepanitiaan
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
  );
}
