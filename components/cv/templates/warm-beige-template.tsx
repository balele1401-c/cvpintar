import React from 'react';
import { CVContent } from '@/types';
import { Mail, Phone, MapPin, Globe, Sparkles, GraduationCap, Briefcase, Award, Users } from 'lucide-react';

export function WarmBeigeTemplate({ data }: { data: CVContent }) {
  const { personalInfo, education, experience, skills, projects, organizations } = data;

  return (
    <div className="w-full bg-[#FAF7F2] text-[#422006] p-8 sm:p-12 font-sans text-xs leading-relaxed min-h-[1100px]">
      {/* Top Header Card */}
      <header className="bg-white/80 backdrop-blur-xs rounded-2xl p-6 sm:p-8 border border-[#E7DEC8] shadow-xs mb-6 text-center">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#78350F] tracking-tight">
          {personalInfo.fullName || 'Nama Lengkap'}
        </h1>
        <p className="text-[#B45309] font-bold text-xs sm:text-sm tracking-wide uppercase mt-1">
          {personalInfo.professionalTitle || 'Profesi & Spesialisasi'}
        </p>

        <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-1.5 text-[11px] text-[#78350F]/80 font-medium mt-3.5 pt-3 border-t border-[#E7DEC8]">
          {personalInfo.email && (
            <span className="flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-[#B45309]" /> {personalInfo.email}
            </span>
          )}
          {personalInfo.phone && (
            <span className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-[#B45309]" /> {personalInfo.phone}
            </span>
          )}
          {personalInfo.location && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#B45309]" /> {personalInfo.location}
            </span>
          )}
          {personalInfo.portfolio && (
            <span className="flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-[#B45309]" /> {personalInfo.portfolio}
            </span>
          )}
        </div>
      </header>

      {/* Boxed Timeline Grid */}
      <div className="space-y-5">
        {/* Section 1: Profil Pribadi / Summary */}
        {personalInfo.summary && (
          <section className="bg-white/90 rounded-2xl p-5 border border-[#E7DEC8] shadow-xs">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#78350F] flex items-center gap-2 mb-2 pb-1.5 border-b border-[#F3EAD8]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#B45309]" />
              Profil Pribadi
            </h2>
            <p className="text-[#5C3D2E] text-xs leading-relaxed text-justify">
              {personalInfo.summary}
            </p>
          </section>
        )}

        {/* Section 2: Riwayat Pekerjaan / Experience */}
        {experience && experience.length > 0 && (
          <section className="bg-white/90 rounded-2xl p-5 border border-[#E7DEC8] shadow-xs">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#78350F] flex items-center gap-2 mb-3 pb-1.5 border-b border-[#F3EAD8]">
              <Briefcase className="w-3.5 h-3.5 text-[#B45309]" />
              Riwayat Pekerjaan & Karir
            </h2>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id} className="relative pl-4 border-l-2 border-[#D4C3A3] space-y-1">
                  <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-[#B45309]" />
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-[#78350F] text-xs">{exp.position}</span>
                    <span className="text-[10px] text-[#A16207] font-semibold">
                      {exp.startDate} – {exp.current ? 'Sekarang' : exp.endDate}
                    </span>
                  </div>
                  <div className="text-[#9A3412] font-semibold text-[11px]">
                    {exp.company} {exp.location && `• ${exp.location}`}
                  </div>
                  {exp.description && (
                    <p className="text-[#5C3D2E] text-xs leading-relaxed">{exp.description}</p>
                  )}
                  {exp.achievements && exp.achievements.length > 0 && (
                    <ul className="list-disc list-inside space-y-0.5 text-[#5C3D2E] text-[11px] mt-1 pl-1">
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

        {/* Section 3: Pendidikan / Education */}
        {education && education.length > 0 && (
          <section className="bg-white/90 rounded-2xl p-5 border border-[#E7DEC8] shadow-xs">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#78350F] flex items-center gap-2 mb-3 pb-1.5 border-b border-[#F3EAD8]">
              <GraduationCap className="w-3.5 h-3.5 text-[#B45309]" />
              Pendidikan
            </h2>
            <div className="space-y-3">
              {education.map((edu) => (
                <div key={edu.id} className="relative pl-4 border-l-2 border-[#D4C3A3]">
                  <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-[#B45309]" />
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-[#78350F] text-xs">{edu.institution}</span>
                    <span className="text-[10px] text-[#A16207] font-semibold">
                      {edu.startDate} – {edu.current ? 'Sekarang' : edu.endDate}
                    </span>
                  </div>
                  <div className="text-[#9A3412] text-[11px] font-medium">
                    {edu.degree} {edu.fieldOfStudy && `— ${edu.fieldOfStudy}`}
                  </div>
                  {edu.description && (
                    <p className="text-[#5C3D2E] text-[11px] mt-0.5">{edu.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 2-Column Row for Skills & Projects / Organizations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Skills */}
          {skills && skills.length > 0 && (
            <section className="bg-white/90 rounded-2xl p-5 border border-[#E7DEC8] shadow-xs">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#78350F] flex items-center gap-2 mb-3 pb-1.5 border-b border-[#F3EAD8]">
                <Sparkles className="w-3.5 h-3.5 text-[#B45309]" />
                Keahlian
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((s) => (
                  <span
                    key={s.id}
                    className="px-2.5 py-1 bg-[#F5EFE6] text-[#78350F] text-[10px] font-bold rounded-lg border border-[#E7DEC8]"
                  >
                    {s.name}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Projects / Organizations */}
          {projects && projects.length > 0 ? (
            <section className="bg-white/90 rounded-2xl p-5 border border-[#E7DEC8] shadow-xs">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#78350F] flex items-center gap-2 mb-3 pb-1.5 border-b border-[#F3EAD8]">
                <Award className="w-3.5 h-3.5 text-[#B45309]" />
                Proyek & Portofolio
              </h2>
              <div className="space-y-2">
                {projects.map((proj) => (
                  <div key={proj.id}>
                    <div className="font-bold text-[#78350F] text-xs">{proj.name}</div>
                    <p className="text-[#5C3D2E] text-[11px]">{proj.description}</p>
                  </div>
                ))}
              </div>
            </section>
          ) : organizations && organizations.length > 0 ? (
            <section className="bg-white/90 rounded-2xl p-5 border border-[#E7DEC8] shadow-xs">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#78350F] flex items-center gap-2 mb-3 pb-1.5 border-b border-[#F3EAD8]">
                <Users className="w-3.5 h-3.5 text-[#B45309]" />
                Organisasi
              </h2>
              <div className="space-y-2">
                {organizations.map((org) => (
                  <div key={org.id} className="flex justify-between items-baseline">
                    <span className="font-bold text-[#78350F] text-xs">{org.organization}</span>
                    <span className="text-[10px] text-[#A16207]">{org.position}</span>
                  </div>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </div>
    </div>
  );
}
