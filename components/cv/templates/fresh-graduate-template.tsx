import React from 'react';
import { CVContent } from '@/types';
import { Mail, Phone, MapPin, Globe, GraduationCap, Briefcase, Award, Sparkles } from 'lucide-react';

export function FreshGraduateTemplate({ data }: { data: CVContent }) {
  const { personalInfo, education, experience, skills, projects, organizations } = data;

  return (
    <div className="w-full bg-white text-slate-800 p-8 sm:p-10 font-sans leading-relaxed text-xs">
      {/* Header with Emerald accent */}
      <header className="border-b-2 border-emerald-600 pb-5 mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {personalInfo.fullName || 'Nama Lengkap'}
        </h1>
        <p className="text-emerald-700 font-semibold text-sm mt-1">
          {personalInfo.professionalTitle || 'Fresh Graduate / Entry Level'}
        </p>

        <div className="flex flex-wrap items-center gap-y-1.5 gap-x-4 text-[11px] text-slate-600 mt-3 font-medium">
          {personalInfo.email && (
            <span className="flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-emerald-600" /> {personalInfo.email}
            </span>
          )}
          {personalInfo.phone && (
            <span className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-emerald-600" /> {personalInfo.phone}
            </span>
          )}
          {personalInfo.location && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" /> {personalInfo.location}
            </span>
          )}
          {personalInfo.portfolio && (
            <span className="flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-emerald-600" /> {personalInfo.portfolio}
            </span>
          )}
        </div>
      </header>

      {/* Summary */}
      {personalInfo.summary && (
        <section className="mb-6 bg-emerald-50/50 p-3.5 rounded-lg border border-emerald-100">
          <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5 mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Profil Profesional
          </h2>
          <p className="text-slate-700 text-xs leading-relaxed">{personalInfo.summary}</p>
        </section>
      )}

      {/* Education First for Fresh Graduates */}
      {education && education.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1.5 mb-3 flex items-center gap-1.5">
            <GraduationCap className="w-3.5 h-3.5 text-emerald-600" /> Riwayat Pendidikan
          </h2>
          <div className="space-y-3">
            {education.map((edu) => (
              <div key={edu.id} className="space-y-1">
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-slate-900 text-xs">{edu.institution}</span>
                  <span className="text-[10px] text-slate-500 font-semibold">
                    {edu.startDate} – {edu.current ? 'Sekarang' : edu.endDate}
                  </span>
                </div>
                <div className="text-emerald-700 font-medium text-xs">
                  {edu.degree} {edu.fieldOfStudy && `• ${edu.fieldOfStudy}`}
                </div>
                {edu.description && <p className="text-slate-600 text-[11px]">{edu.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects & Portfolio */}
      {projects && projects.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1.5 mb-3 flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-emerald-600" /> Proyek Akademik & Portofolio
          </h2>
          <div className="space-y-3">
            {projects.map((proj) => (
              <div key={proj.id} className="space-y-1">
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-slate-900 text-xs">{proj.name}</span>
                  {proj.url && <span className="text-[10px] text-emerald-600 underline">{proj.url}</span>}
                </div>
                <p className="text-slate-700 text-xs leading-relaxed">{proj.description}</p>
                {proj.technologies && proj.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {proj.technologies.map((tech, idx) => (
                      <span key={idx} className="px-1.5 py-0.5 bg-slate-100 text-slate-700 text-[9px] rounded font-medium">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Experience / Internship */}
      {experience && experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1.5 mb-3 flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-emerald-600" /> Pengalaman Magang & Kerja
          </h2>
          <div className="space-y-3.5">
            {experience.map((exp) => (
              <div key={exp.id} className="space-y-1">
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-slate-900 text-xs">{exp.position}</span>
                  <span className="text-[10px] text-slate-500 font-semibold">
                    {exp.startDate} – {exp.current ? 'Sekarang' : exp.endDate}
                  </span>
                </div>
                <div className="text-slate-600 font-medium text-[11px]">{exp.company}</div>
                {exp.description && <p className="text-slate-700 text-xs leading-relaxed">{exp.description}</p>}
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

      {/* Skills */}
      {skills && skills.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1.5 mb-2.5">
            Keahlian & Kompetensi
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {skills.map((s) => (
              <span key={s.id} className="px-2.5 py-1 bg-emerald-50 text-emerald-800 text-[10px] font-semibold rounded-md border border-emerald-200">
                {s.name} {s.level ? `(${s.level})` : ''}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Organizations */}
      {organizations && organizations.length > 0 && (
        <section>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1.5 mb-2.5">
            Organisasi & Kepanitiaan
          </h2>
          <div className="space-y-2">
            {organizations.map((org) => (
              <div key={org.id} className="flex justify-between items-baseline">
                <div>
                  <span className="font-bold text-slate-900 text-xs">{org.position}</span> —{' '}
                  <span className="text-slate-600 text-xs">{org.organization}</span>
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
