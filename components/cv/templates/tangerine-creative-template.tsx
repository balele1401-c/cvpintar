import React from 'react';
import { CVContent } from '@/types';
import { Mail, Phone, MapPin, Globe, Briefcase, GraduationCap, Sparkles } from 'lucide-react';

export function TangerineCreativeTemplate({ data }: { data: CVContent }) {
  const { personalInfo, education, experience, skills, projects, organizations } = data;

  return (
    <div className="w-full bg-white text-slate-800 font-sans text-xs flex flex-col min-h-[1100px]">
      {/* Top Banner Header: Vibrant Tangerine Orange Card */}
      <header className="bg-gradient-to-r from-orange-500 to-amber-500 text-white p-8 sm:p-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white uppercase">
            {personalInfo.fullName || 'Nama Lengkap'}
          </h1>
          <p className="text-orange-100 font-bold text-xs sm:text-sm tracking-wider uppercase mt-1">
            {personalInfo.professionalTitle || 'Art Director & Visual Designer'}
          </p>
        </div>

        <div className="flex flex-col sm:items-end gap-1 text-[11px] text-orange-50 font-medium">
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
        </div>
      </header>

      {/* Main Body */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Left Column: Education & Skills with Orange Accents */}
        <aside className="w-full md:w-72 bg-zinc-900 text-white p-6 sm:p-7 space-y-6 shrink-0">
          {/* Summary */}
          {personalInfo.summary && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-orange-400 border-b border-zinc-750 pb-1 mb-2.5">
                About Me
              </h2>
              <p className="text-zinc-300 text-xs leading-relaxed text-justify">
                {personalInfo.summary}
              </p>
            </div>
          )}

          {/* Education */}
          {education && education.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-orange-400 border-b border-zinc-750 pb-1 mb-3">
                Education
              </h2>
              <div className="space-y-3">
                {education.map((edu) => (
                  <div key={edu.id} className="space-y-0.5">
                    <div className="font-bold text-white text-xs">{edu.institution}</div>
                    <div className="text-orange-300 text-[11px]">{edu.degree}</div>
                    <div className="text-[10px] text-zinc-400 font-semibold">
                      {edu.startDate} – {edu.current ? 'Present' : edu.endDate}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {skills && skills.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-orange-400 border-b border-zinc-750 pb-1 mb-3">
                Expertise
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((s) => (
                  <span
                    key={s.id}
                    className="px-2 py-0.5 bg-zinc-800 text-orange-200 text-[10px] font-medium rounded border border-zinc-700"
                  >
                    {s.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Portfolio & Links */}
          {personalInfo.portfolio && (
            <div className="pt-2 border-t border-zinc-800">
              <h2 className="text-[10px] font-bold uppercase tracking-wider text-orange-400 mb-1">
                Portfolio
              </h2>
              <a
                href={`https://${personalInfo.portfolio}`}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-orange-300 underline break-all flex items-center gap-1"
              >
                <Globe className="w-3.5 h-3.5 shrink-0" /> {personalInfo.portfolio}
              </a>
            </div>
          )}
        </aside>

        {/* Right Main Body: Experience & Projects */}
        <main className="flex-1 p-6 sm:p-8 space-y-6">
          {/* Experience */}
          {experience && experience.length > 0 && (
            <section>
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-orange-600 border-b-2 border-orange-500 pb-1 mb-3 flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-orange-500" /> Work Experience
              </h2>
              <div className="space-y-4">
                {experience.map((exp) => (
                  <div key={exp.id} className="space-y-1">
                    <div className="flex justify-between items-baseline">
                      <span className="font-bold text-slate-900 text-xs uppercase">{exp.position}</span>
                      <span className="text-[10px] text-orange-700 font-bold bg-orange-50 px-2 py-0.5 rounded">
                        {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
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

          {/* Projects */}
          {projects && projects.length > 0 && (
            <section>
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-orange-600 border-b-2 border-orange-500 pb-1 mb-3 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-orange-500" /> Featured Projects
              </h2>
              <div className="space-y-2.5">
                {projects.map((proj) => (
                  <div key={proj.id} className="p-3 bg-orange-50/50 rounded-xl border border-orange-200">
                    <div className="flex justify-between items-baseline">
                      <span className="font-bold text-slate-900 text-xs">{proj.name}</span>
                      {proj.url && <span className="text-[10px] text-orange-600 underline">{proj.url}</span>}
                    </div>
                    <p className="text-slate-700 text-xs mt-0.5">{proj.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Organizations */}
          {organizations && organizations.length > 0 && (
            <section>
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-orange-600 border-b-2 border-orange-500 pb-1 mb-3 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-orange-500" /> Organizations & Activities
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
