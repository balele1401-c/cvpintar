import React from 'react';
import { CVContent } from '@/types';
import { Mail, Phone, MapPin, Globe, Award, Briefcase, GraduationCap, Code } from 'lucide-react';

export function CreativeTemplate({ data }: { data: CVContent }) {
  const { personalInfo, education, experience, skills, projects, organizations } = data;

  return (
    <div className="w-full bg-white text-slate-800 font-sans text-xs flex flex-col md:flex-row min-h-[1100px]">
      {/* Left Accent Sidebar */}
      <aside className="w-full md:w-1/3 bg-slate-900 text-white p-6 sm:p-8 space-y-6 shrink-0">
        <div>
          <h1 className="text-xl font-extrabold text-white leading-tight">
            {personalInfo.fullName || 'Nama Lengkap'}
          </h1>
          <p className="text-blue-400 font-semibold text-xs mt-1">
            {personalInfo.professionalTitle || 'Creative Specialist'}
          </p>
        </div>

        {/* Contact Info */}
        <div className="space-y-2 text-[11px] text-slate-300 pt-4 border-t border-slate-800">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Kontak</h3>
          {personalInfo.email && (
            <div className="flex items-center gap-2 break-all">
              <Mail className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span>{personalInfo.email}</span>
            </div>
          )}
          {personalInfo.phone && (
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span>{personalInfo.phone}</span>
            </div>
          )}
          {personalInfo.location && (
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span>{personalInfo.location}</span>
            </div>
          )}
          {personalInfo.portfolio && (
            <div className="flex items-center gap-2 break-all">
              <Globe className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span className="text-blue-300 underline">{personalInfo.portfolio}</span>
            </div>
          )}
        </div>

        {/* Skills */}
        {skills && skills.length > 0 && (
          <div className="space-y-2.5 pt-4 border-t border-slate-800">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Keahlian</h3>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((s) => (
                <span key={s.id} className="px-2 py-0.5 bg-slate-800 text-blue-300 text-[10px] font-medium rounded border border-slate-700">
                  {s.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Education in Sidebar */}
        {education && education.length > 0 && (
          <div className="space-y-2.5 pt-4 border-t border-slate-800">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Pendidikan</h3>
            {education.map((edu) => (
              <div key={edu.id} className="space-y-0.5">
                <div className="font-bold text-white text-xs">{edu.institution}</div>
                <div className="text-blue-300 text-[11px]">{edu.degree}</div>
                <div className="text-[10px] text-slate-400">{edu.startDate} – {edu.current ? 'Sekarang' : edu.endDate}</div>
              </div>
            ))}
          </div>
        )}
      </aside>

      {/* Main Right Content */}
      <main className="flex-1 p-6 sm:p-8 space-y-6">
        {/* Summary */}
        {personalInfo.summary && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5 border-b pb-1 mb-2">
              <Award className="w-3.5 h-3.5 text-blue-600" /> Tentang Saya
            </h2>
            <p className="text-slate-700 leading-relaxed text-xs">{personalInfo.summary}</p>
          </section>
        )}

        {/* Work Experience */}
        {experience && experience.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5 border-b pb-1 mb-3">
              <Briefcase className="w-3.5 h-3.5 text-blue-600" /> Pengalaman Kerja
            </h2>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id} className="space-y-1">
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-slate-900 text-xs">{exp.position}</span>
                    <span className="text-[10px] text-slate-500 font-semibold">{exp.startDate} – {exp.current ? 'Sekarang' : exp.endDate}</span>
                  </div>
                  <div className="text-blue-700 font-semibold text-[11px]">{exp.company}</div>
                  {exp.description && <p className="text-slate-700 text-xs leading-relaxed">{exp.description}</p>}
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

        {/* Projects */}
        {projects && projects.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5 border-b pb-1 mb-2.5">
              <Code className="w-3.5 h-3.5 text-blue-600" /> Portofolio & Proyek
            </h2>
            <div className="space-y-2.5">
              {projects.map((proj) => (
                <div key={proj.id} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
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

        {/* Organizations */}
        {organizations && organizations.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5 border-b pb-1 mb-2">
              <GraduationCap className="w-3.5 h-3.5 text-blue-600" /> Organisasi
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
      </main>
    </div>
  );
}
