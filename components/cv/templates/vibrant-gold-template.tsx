import React from 'react';
import { CVContent } from '@/types';
import { Mail, Phone, MapPin, Globe, Briefcase, GraduationCap, Code } from 'lucide-react';

export function VibrantGoldTemplate({ data }: { data: CVContent }) {
  const { personalInfo, education, experience, skills, projects, organizations } = data;

  return (
    <div className="w-full bg-white text-slate-800 font-sans text-xs flex flex-col min-h-[1100px]">
      {/* Top Banner Split Header */}
      <header className="flex flex-col sm:flex-row w-full border-b-4 border-amber-500">
        {/* Dark Navy Box for Name & Title */}
        <div className="bg-slate-900 text-white p-6 sm:p-8 flex-1 flex flex-col justify-center">
          <span className="text-amber-400 font-extrabold text-[11px] uppercase tracking-widest mb-1">
            Curriculum Vitae
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white uppercase">
            {personalInfo.fullName || 'Nama Lengkap'}
          </h1>
          <p className="text-slate-300 font-medium text-xs sm:text-sm mt-1">
            {personalInfo.professionalTitle || 'Data Analytics & Specialist'}
          </p>
        </div>

        {/* Vibrant Gold Accent Box with Contacts */}
        <div className="bg-amber-500 text-slate-950 p-6 sm:p-8 sm:w-72 flex flex-col justify-center space-y-1.5 text-[11px] font-semibold">
          {personalInfo.email && (
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-slate-950 shrink-0" />
              <span className="truncate">{personalInfo.email}</span>
            </div>
          )}
          {personalInfo.phone && (
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-slate-950 shrink-0" />
              <span>{personalInfo.phone}</span>
            </div>
          )}
          {personalInfo.location && (
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-slate-950 shrink-0" />
              <span>{personalInfo.location}</span>
            </div>
          )}
          {personalInfo.portfolio && (
            <div className="flex items-center gap-2">
              <Globe className="w-3.5 h-3.5 text-slate-950 shrink-0" />
              <span className="truncate">{personalInfo.portfolio}</span>
            </div>
          )}
        </div>
      </header>

      {/* 2-Column Split Body */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Left Navy Column */}
        <aside className="w-full md:w-72 bg-slate-900 text-white p-6 sm:p-7 space-y-6 shrink-0">
          {/* Summary */}
          {personalInfo.summary && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-amber-400 border-b border-slate-800 pb-1.5 mb-2.5">
                Summary
              </h2>
              <p className="text-slate-300 text-xs leading-relaxed text-justify">
                {personalInfo.summary}
              </p>
            </div>
          )}

          {/* Skills with modern rating chips */}
          {skills && skills.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-amber-400 border-b border-slate-800 pb-1.5 mb-3">
                Skills & Tools
              </h2>
              <div className="space-y-2">
                {skills.map((s) => (
                  <div key={s.id} className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="font-semibold text-slate-200">{s.name}</span>
                      <span className="text-amber-400 text-[10px]">{s.level || 'Expert'}</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-400 rounded-full"
                        style={{
                          width:
                            s.level === 'Beginner'
                              ? '40%'
                              : s.level === 'Intermediate'
                              ? '65%'
                              : s.level === 'Advanced'
                              ? '85%'
                              : '95%',
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Organizations in Sidebar */}
          {organizations && organizations.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-amber-400 border-b border-slate-800 pb-1.5 mb-2.5">
                Organizations
              </h2>
              <div className="space-y-2 text-xs">
                {organizations.map((org) => (
                  <div key={org.id}>
                    <div className="font-bold text-white text-xs">{org.organization}</div>
                    <div className="text-amber-300 text-[11px]">{org.position}</div>
                    <div className="text-slate-400 text-[10px]">{org.period}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>

        {/* Right Main Body */}
        <main className="flex-1 p-6 sm:p-8 space-y-6">
          {/* Work Experience */}
          {experience && experience.length > 0 && (
            <section>
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2 border-b-2 border-slate-900 pb-1.5 mb-4">
                <Briefcase className="w-4 h-4 text-amber-600" /> Work Experience
              </h2>
              <div className="space-y-4">
                {experience.map((exp) => (
                  <div key={exp.id} className="space-y-1">
                    <div className="flex justify-between items-baseline">
                      <span className="font-bold text-slate-900 text-xs uppercase">{exp.position}</span>
                      <span className="text-[10px] text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded">
                        {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                      </span>
                    </div>
                    <div className="text-slate-600 font-semibold text-[11px]">
                      {exp.company} {exp.location && `• ${exp.location}`}
                    </div>
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

          {/* Education */}
          {education && education.length > 0 && (
            <section>
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2 border-b-2 border-slate-900 pb-1.5 mb-3">
                <GraduationCap className="w-4 h-4 text-amber-600" /> Education & Qualifications
              </h2>
              <div className="space-y-3">
                {education.map((edu) => (
                  <div key={edu.id} className="space-y-0.5">
                    <div className="flex justify-between items-baseline">
                      <span className="font-bold text-slate-900 text-xs">{edu.institution}</span>
                      <span className="text-[10px] text-slate-500 font-semibold">
                        {edu.startDate} – {edu.current ? 'Present' : edu.endDate}
                      </span>
                    </div>
                    <div className="text-amber-800 font-medium text-[11px]">
                      {edu.degree} {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}
                    </div>
                    {edu.description && (
                      <p className="text-slate-600 text-[11px]">{edu.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {projects && projects.length > 0 && (
            <section>
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2 border-b-2 border-slate-900 pb-1.5 mb-3">
                <Code className="w-4 h-4 text-amber-600" /> Key Projects
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
        </main>
      </div>
    </div>
  );
}
