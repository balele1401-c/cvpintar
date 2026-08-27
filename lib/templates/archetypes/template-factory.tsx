import React from 'react';
import { CVContent } from '@/types';
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  Briefcase,
  GraduationCap,
  Sparkles,
  Award,
  Users,
  Code,
  User,
} from 'lucide-react';

export type TemplateLayoutType =
  | 'sidebar-left'
  | 'sidebar-right'
  | 'header-banner'
  | 'split-modern'
  | 'boxed-cards'
  | 'clean-ats'
  | 'executive-serif'
  | 'compact-grid';

export interface TemplateFactoryConfig {
  id: string;
  name: string;
  layout: TemplateLayoutType;
  accentColor: string;
  secondaryColor?: string;
  sidebarBg?: string;
  sidebarTextColor?: 'light' | 'dark';
  bodyBg?: string;
  hasPhoto?: boolean;
  photoShape?: 'circle' | 'rounded-xl' | 'rounded-2xl' | 'square';
  fontFamily?: 'sans' | 'serif' | 'mono';
}

/**
 * Reusable Photo Headshot Component with graceful avatar fallback
 */
function PhotoHeadshot({
  photoUrl,
  name,
  shape = 'circle',
  borderColor = '#3b82f6',
  className = '',
}: {
  photoUrl?: string;
  name: string;
  shape?: 'circle' | 'rounded-xl' | 'rounded-2xl' | 'square';
  borderColor?: string;
  className?: string;
}) {
  const shapeClass =
    shape === 'circle'
      ? 'rounded-full'
      : shape === 'rounded-xl'
      ? 'rounded-xl'
      : shape === 'rounded-2xl'
      ? 'rounded-2xl'
      : 'rounded-none';

  return (
    <div
      className={`relative overflow-hidden w-24 h-24 sm:w-28 sm:h-28 shrink-0 border-2 shadow-sm flex items-center justify-center bg-slate-200 ${shapeClass} ${className}`}
      style={{ borderColor }}
    >
      {photoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={photoUrl}
          alt={name || 'Foto Profil'}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="flex flex-col items-center justify-center text-slate-400">
          <User className="w-10 h-10" />
          <span className="text-[9px] font-bold uppercase mt-0.5 tracking-wider">Foto</span>
        </div>
      )}
    </div>
  );
}

/**
 * Universal Template Component Creator
 */
export function createTemplateComponent(config: TemplateFactoryConfig) {
  const {
    layout,
    accentColor,
    secondaryColor = accentColor,
    sidebarBg = '#0f172a',
    sidebarTextColor = 'light',
    bodyBg = '#ffffff',
    hasPhoto = false,
    photoShape = 'circle',
    fontFamily = 'sans',
  } = config;

  const fontClass =
    fontFamily === 'serif'
      ? 'font-serif'
      : fontFamily === 'mono'
      ? 'font-mono'
      : 'font-sans';

  const isLightSidebar = sidebarTextColor === 'dark';
  const sidebarText = isLightSidebar ? 'text-slate-800' : 'text-white';
  const sidebarMuted = isLightSidebar ? 'text-slate-600' : 'text-slate-300';
  const sidebarBorder = isLightSidebar ? 'border-slate-300' : 'border-white/15';

  return function UniversalTemplate({ data }: { data: CVContent }) {
    const { personalInfo, education, experience, skills, projects, organizations } = data;

    // ----------------------------------------------------
    // LAYOUT 1: SIDEBAR LEFT
    // ----------------------------------------------------
    if (layout === 'sidebar-left') {
      return (
        <div
          className={`w-full text-slate-900 ${fontClass} text-xs flex flex-col md:flex-row min-h-[1100px]`}
          style={{ backgroundColor: bodyBg }}
        >
          {/* Left Sidebar */}
          <aside
            className={`w-full md:w-72 p-6 sm:p-8 space-y-6 shrink-0 ${sidebarText}`}
            style={{ backgroundColor: sidebarBg }}
          >
            {hasPhoto && (
              <div className="flex justify-center mb-2">
                <PhotoHeadshot
                  photoUrl={personalInfo.photoUrl}
                  name={personalInfo.fullName}
                  shape={photoShape}
                  borderColor={accentColor}
                />
              </div>
            )}

            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight uppercase">
                {personalInfo.fullName || 'Nama Lengkap'}
              </h1>
              <p
                className="font-bold text-xs mt-1 uppercase tracking-wider"
                style={{ color: accentColor }}
              >
                {personalInfo.professionalTitle || 'Profesi / Keahlian'}
              </p>
            </div>

            {/* Kontak */}
            <div className={`space-y-2 pt-4 border-t ${sidebarBorder} text-[11px]`}>
              <h2
                className="text-[10px] font-extrabold uppercase tracking-widest"
                style={{ color: accentColor }}
              >
                Kontak
              </h2>
              {personalInfo.email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 shrink-0" style={{ color: accentColor }} />
                  <span className="truncate">{personalInfo.email}</span>
                </div>
              )}
              {personalInfo.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 shrink-0" style={{ color: accentColor }} />
                  <span>{personalInfo.phone}</span>
                </div>
              )}
              {personalInfo.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: accentColor }} />
                  <span>{personalInfo.location}</span>
                </div>
              )}
              {personalInfo.portfolio && (
                <div className="flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5 shrink-0" style={{ color: accentColor }} />
                  <span className="truncate underline">{personalInfo.portfolio}</span>
                </div>
              )}
            </div>

            {/* Keahlian */}
            {skills && skills.length > 0 && (
              <div className={`space-y-2.5 pt-4 border-t ${sidebarBorder}`}>
                <h2
                  className="text-[10px] font-extrabold uppercase tracking-widest"
                  style={{ color: accentColor }}
                >
                  Keahlian
                </h2>
                <div className="flex flex-wrap gap-1.5">
                  {skills.map((s) => (
                    <span
                      key={s.id}
                      className="px-2 py-0.5 rounded text-[10px] font-medium border"
                      style={{
                        backgroundColor: isLightSidebar ? '#f1f5f9' : 'rgba(255,255,255,0.08)',
                        borderColor: isLightSidebar ? '#cbd5e1' : 'rgba(255,255,255,0.15)',
                        color: isLightSidebar ? '#0f172a' : '#ffffff',
                      }}
                    >
                      {s.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Pendidikan di Sidebar */}
            {education && education.length > 0 && (
              <div className={`space-y-3 pt-4 border-t ${sidebarBorder}`}>
                <h2
                  className="text-[10px] font-extrabold uppercase tracking-widest"
                  style={{ color: accentColor }}
                >
                  Pendidikan
                </h2>
                {education.map((edu) => (
                  <div key={edu.id} className="space-y-0.5">
                    <div className="font-bold text-xs">{edu.institution}</div>
                    <div className="text-[11px]" style={{ color: accentColor }}>
                      {edu.degree}
                    </div>
                    <div className={`text-[10px] ${sidebarMuted}`}>{edu.startDate} – {edu.endDate}</div>
                  </div>
                ))}
              </div>
            )}
          </aside>

          {/* Right Main Content */}
          <main className="flex-1 p-6 sm:p-8 space-y-6">
            {/* Profil Summary */}
            {personalInfo.summary && (
              <section className="space-y-1.5">
                <h2
                  className="text-xs font-extrabold uppercase tracking-wider pb-1 border-b-2"
                  style={{ borderColor: accentColor, color: accentColor }}
                >
                  Profil Singkat
                </h2>
                <p className="text-slate-700 text-xs leading-relaxed text-justify">
                  {personalInfo.summary}
                </p>
              </section>
            )}

            {/* Pengalaman Kerja */}
            {experience && experience.length > 0 && (
              <section className="space-y-3">
                <h2
                  className="text-xs font-extrabold uppercase tracking-wider pb-1 border-b-2 flex items-center gap-1.5"
                  style={{ borderColor: accentColor, color: accentColor }}
                >
                  <Briefcase className="w-4 h-4" /> Pengalaman Kerja
                </h2>
                <div className="space-y-4">
                  {experience.map((exp) => (
                    <div key={exp.id} className="space-y-1">
                      <div className="flex justify-between items-baseline">
                        <span className="font-bold text-slate-900 text-xs uppercase">
                          {exp.position}
                        </span>
                        <span
                          className="text-[10px] font-bold px-2 py-0.5 rounded border"
                          style={{
                            backgroundColor: `${accentColor}15`,
                            color: accentColor,
                            borderColor: `${accentColor}30`,
                          }}
                        >
                          {exp.startDate} – {exp.current ? 'Sekarang' : exp.endDate}
                        </span>
                      </div>
                      <div className="font-semibold text-[11px]" style={{ color: accentColor }}>
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

            {/* Proyek */}
            {projects && projects.length > 0 && (
              <section className="space-y-2.5">
                <h2
                  className="text-xs font-extrabold uppercase tracking-wider pb-1 border-b-2 flex items-center gap-1.5"
                  style={{ borderColor: accentColor, color: accentColor }}
                >
                  <Award className="w-4 h-4" /> Proyek & Portofolio
                </h2>
                <div className="space-y-2">
                  {projects.map((proj) => (
                    <div key={proj.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="font-bold text-slate-900 text-xs">{proj.name}</div>
                      <p className="text-slate-600 text-xs mt-0.5">{proj.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Organisasi */}
            {organizations && organizations.length > 0 && (
              <section className="space-y-2">
                <h2
                  className="text-xs font-extrabold uppercase tracking-wider pb-1 border-b-2 flex items-center gap-1.5"
                  style={{ borderColor: accentColor, color: accentColor }}
                >
                  <Users className="w-4 h-4" /> Organisasi
                </h2>
                <div className="space-y-1.5">
                  {organizations.map((org) => (
                    <div key={org.id} className="flex justify-between items-baseline text-xs">
                      <span className="font-bold text-slate-900">{org.organization} — {org.position}</span>
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

    // ----------------------------------------------------
    // LAYOUT 2: HEADER BANNER (Full Width Modern)
    // ----------------------------------------------------
    if (layout === 'header-banner') {
      return (
        <div
          className={`w-full text-slate-800 ${fontClass} text-xs flex flex-col min-h-[1100px]`}
          style={{ backgroundColor: bodyBg }}
        >
          {/* Header Banner */}
          <header
            className="p-8 sm:p-10 border-b-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6"
            style={{
              backgroundColor: sidebarBg,
              borderColor: accentColor,
              color: isLightSidebar ? '#0f172a' : '#ffffff',
            }}
          >
            <div className="flex items-center gap-5">
              {hasPhoto && (
                <PhotoHeadshot
                  photoUrl={personalInfo.photoUrl}
                  name={personalInfo.fullName}
                  shape={photoShape}
                  borderColor={accentColor}
                />
              )}
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight uppercase">
                  {personalInfo.fullName || 'Nama Lengkap'}
                </h1>
                <p
                  className="font-bold text-xs sm:text-sm tracking-wide mt-1 uppercase"
                  style={{ color: accentColor }}
                >
                  {personalInfo.professionalTitle || 'Profesi / Keahlian'}
                </p>
              </div>
            </div>

            <div className="space-y-1.5 text-[11px] sm:text-right font-medium">
              {personalInfo.email && (
                <div className="flex items-center sm:justify-end gap-1.5">
                  <span>{personalInfo.email}</span>
                  <Mail className="w-3.5 h-3.5" style={{ color: accentColor }} />
                </div>
              )}
              {personalInfo.phone && (
                <div className="flex items-center sm:justify-end gap-1.5">
                  <span>{personalInfo.phone}</span>
                  <Phone className="w-3.5 h-3.5" style={{ color: accentColor }} />
                </div>
              )}
              {personalInfo.location && (
                <div className="flex items-center sm:justify-end gap-1.5">
                  <span>{personalInfo.location}</span>
                  <MapPin className="w-3.5 h-3.5" style={{ color: accentColor }} />
                </div>
              )}
              {personalInfo.portfolio && (
                <div className="flex items-center sm:justify-end gap-1.5">
                  <span className="underline">{personalInfo.portfolio}</span>
                  <Globe className="w-3.5 h-3.5" style={{ color: accentColor }} />
                </div>
              )}
            </div>
          </header>

          {/* Main Body */}
          <main className="p-8 sm:p-10 space-y-6">
            {personalInfo.summary && (
              <section
                className="p-4 rounded-xl border"
                style={{
                  backgroundColor: `${accentColor}08`,
                  borderColor: `${accentColor}25`,
                }}
              >
                <h2
                  className="text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5"
                  style={{ color: accentColor }}
                >
                  <Sparkles className="w-3.5 h-3.5" /> Profil Profesional
                </h2>
                <p className="text-slate-700 text-xs leading-relaxed text-justify">
                  {personalInfo.summary}
                </p>
              </section>
            )}

            {experience && experience.length > 0 && (
              <section className="space-y-3">
                <h2
                  className="text-xs font-extrabold uppercase tracking-wider pb-1.5 border-b-2 flex items-center gap-2"
                  style={{ borderColor: accentColor, color: '#0f172a' }}
                >
                  <Briefcase className="w-4 h-4" style={{ color: accentColor }} /> Pengalaman Karir
                </h2>
                <div className="space-y-4">
                  {experience.map((exp) => (
                    <div key={exp.id} className="space-y-1">
                      <div className="flex justify-between items-baseline">
                        <span className="font-bold text-slate-900 text-xs uppercase">{exp.position}</span>
                        <span
                          className="text-[10px] font-bold px-2 py-0.5 rounded border"
                          style={{
                            backgroundColor: `${accentColor}12`,
                            color: accentColor,
                            borderColor: `${accentColor}25`,
                          }}
                        >
                          {exp.startDate} – {exp.current ? 'Sekarang' : exp.endDate}
                        </span>
                      </div>
                      <div className="font-semibold text-[11px]" style={{ color: accentColor }}>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-slate-200">
              {education && education.length > 0 && (
                <section className="space-y-3">
                  <h2
                    className="text-xs font-extrabold uppercase tracking-wider pb-1.5 border-b-2 flex items-center gap-2"
                    style={{ borderColor: accentColor, color: '#0f172a' }}
                  >
                    <GraduationCap className="w-4 h-4" style={{ color: accentColor }} /> Pendidikan
                  </h2>
                  <div className="space-y-3">
                    {education.map((edu) => (
                      <div key={edu.id}>
                        <div className="font-bold text-slate-900 text-xs">{edu.institution}</div>
                        <div className="text-[11px] font-medium" style={{ color: accentColor }}>
                          {edu.degree} {edu.fieldOfStudy && `— ${edu.fieldOfStudy}`}
                        </div>
                        <div className="text-[10px] text-slate-500">{edu.startDate} – {edu.endDate}</div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {skills && skills.length > 0 && (
                <section className="space-y-3">
                  <h2
                    className="text-xs font-extrabold uppercase tracking-wider pb-1.5 border-b-2 flex items-center gap-2"
                    style={{ borderColor: accentColor, color: '#0f172a' }}
                  >
                    <Code className="w-4 h-4" style={{ color: accentColor }} /> Keahlian Utama
                  </h2>
                  <div className="flex flex-wrap gap-1.5">
                    {skills.map((s) => (
                      <span
                        key={s.id}
                        className="px-2.5 py-1 text-[10px] font-bold rounded-lg border"
                        style={{
                          backgroundColor: `${accentColor}10`,
                          color: accentColor,
                          borderColor: `${accentColor}30`,
                        }}
                      >
                        {s.name}
                      </span>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </main>
        </div>
      );
    }

    // ----------------------------------------------------
    // LAYOUT 3: BOXED CARDS / CANVA TIMELINE
    // ----------------------------------------------------
    if (layout === 'boxed-cards') {
      return (
        <div
          className={`w-full text-slate-800 ${fontClass} text-xs p-8 sm:p-12 leading-relaxed min-h-[1100px]`}
          style={{ backgroundColor: bodyBg }}
        >
          {/* Header Card */}
          <header className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs mb-6 flex flex-col sm:flex-row items-center gap-5">
            {hasPhoto && (
              <PhotoHeadshot
                photoUrl={personalInfo.photoUrl}
                name={personalInfo.fullName}
                shape={photoShape}
                borderColor={accentColor}
              />
            )}
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                {personalInfo.fullName || 'Nama Lengkap'}
              </h1>
              <p
                className="font-bold text-xs sm:text-sm tracking-wide uppercase mt-1"
                style={{ color: accentColor }}
              >
                {personalInfo.professionalTitle || 'Profesi & Spesialisasi'}
              </p>
              <div className="flex flex-wrap justify-center sm:justify-start items-center gap-x-4 gap-y-1 text-[11px] text-slate-600 font-medium mt-3 pt-2 border-t border-slate-100">
                {personalInfo.email && <span>{personalInfo.email}</span>}
                {personalInfo.phone && <span>• {personalInfo.phone}</span>}
                {personalInfo.location && <span>• {personalInfo.location}</span>}
              </div>
            </div>
          </header>

          <div className="space-y-5">
            {personalInfo.summary && (
              <section className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
                <h2
                  className="text-xs font-bold uppercase tracking-wider flex items-center gap-2 mb-2 pb-1.5 border-b border-slate-100"
                  style={{ color: accentColor }}
                >
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: accentColor }} />
                  Profil Pribadi
                </h2>
                <p className="text-slate-700 text-xs leading-relaxed text-justify">{personalInfo.summary}</p>
              </section>
            )}

            {experience && experience.length > 0 && (
              <section className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
                <h2
                  className="text-xs font-bold uppercase tracking-wider flex items-center gap-2 mb-3 pb-1.5 border-b border-slate-100"
                  style={{ color: accentColor }}
                >
                  <Briefcase className="w-3.5 h-3.5" style={{ color: accentColor }} />
                  Riwayat Pekerjaan
                </h2>
                <div className="space-y-4">
                  {experience.map((exp) => (
                    <div key={exp.id} className="relative pl-4 border-l-2 space-y-1" style={{ borderColor: `${accentColor}40` }}>
                      <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
                      <div className="flex justify-between items-baseline">
                        <span className="font-bold text-slate-900 text-xs">{exp.position}</span>
                        <span className="text-[10px] font-semibold" style={{ color: accentColor }}>
                          {exp.startDate} – {exp.current ? 'Sekarang' : exp.endDate}
                        </span>
                      </div>
                      <div className="text-[11px] font-semibold text-slate-700">{exp.company}</div>
                      {exp.description && <p className="text-slate-600 text-xs">{exp.description}</p>}
                    </div>
                  ))}
                </div>
              </section>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {education && education.length > 0 && (
                <section className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
                  <h2
                    className="text-xs font-bold uppercase tracking-wider flex items-center gap-2 mb-3 pb-1.5 border-b border-slate-100"
                    style={{ color: accentColor }}
                  >
                    <GraduationCap className="w-3.5 h-3.5" style={{ color: accentColor }} />
                    Pendidikan
                  </h2>
                  <div className="space-y-3">
                    {education.map((edu) => (
                      <div key={edu.id} className="relative pl-4 border-l-2" style={{ borderColor: `${accentColor}40` }}>
                        <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
                        <div className="font-bold text-slate-900 text-xs">{edu.institution}</div>
                        <div className="text-[11px]" style={{ color: accentColor }}>{edu.degree}</div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {skills && skills.length > 0 && (
                <section className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
                  <h2
                    className="text-xs font-bold uppercase tracking-wider flex items-center gap-2 mb-3 pb-1.5 border-b border-slate-100"
                    style={{ color: accentColor }}
                  >
                    <Sparkles className="w-3.5 h-3.5" style={{ color: accentColor }} />
                    Keahlian
                  </h2>
                  <div className="flex flex-wrap gap-1.5">
                    {skills.map((s) => (
                      <span
                        key={s.id}
                        className="px-2.5 py-1 text-[10px] font-bold rounded-lg border"
                        style={{
                          backgroundColor: `${accentColor}10`,
                          color: accentColor,
                          borderColor: `${accentColor}25`,
                        }}
                      >
                        {s.name}
                      </span>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>
      );
    }

    // ----------------------------------------------------
    // LAYOUT 4: CLEAN ATS & COMPACT
    // ----------------------------------------------------
    return (
      <div
        className={`w-full text-slate-900 ${fontClass} text-xs p-8 sm:p-12 leading-relaxed min-h-[1100px]`}
        style={{ backgroundColor: bodyBg }}
      >
        <header className="border-b-2 pb-4 mb-6" style={{ borderColor: accentColor }}>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight uppercase" style={{ color: accentColor }}>
                {personalInfo.fullName || 'NAMA LENGKAP'}
              </h1>
              <p className="font-bold text-xs sm:text-sm tracking-wide text-slate-700 uppercase mt-0.5">
                {personalInfo.professionalTitle || 'Profesi Target'}
              </p>
            </div>
            {hasPhoto && (
              <PhotoHeadshot
                photoUrl={personalInfo.photoUrl}
                name={personalInfo.fullName}
                shape={photoShape}
                borderColor={accentColor}
                className="w-20 h-20 sm:w-24 sm:h-24"
              />
            )}
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-600 mt-2.5 pt-2 border-t border-slate-200">
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>• {personalInfo.phone}</span>}
            {personalInfo.location && <span>• {personalInfo.location}</span>}
            {personalInfo.portfolio && <span>• {personalInfo.portfolio}</span>}
          </div>
        </header>

        <div className="space-y-6">
          {personalInfo.summary && (
            <section>
              <h2
                className="text-xs font-bold uppercase tracking-widest border-b pb-1 mb-2"
                style={{ borderColor: secondaryColor, color: accentColor }}
              >
                Ringkasan Profesional
              </h2>
              <p className="text-slate-800 text-xs leading-relaxed text-justify">{personalInfo.summary}</p>
            </section>
          )}

          {experience && experience.length > 0 && (
            <section>
              <h2
                className="text-xs font-bold uppercase tracking-widest border-b pb-1 mb-3"
                style={{ borderColor: secondaryColor, color: accentColor }}
              >
                Pengalaman Kerja
              </h2>
              <div className="space-y-4">
                {experience.map((exp) => (
                  <div key={exp.id} className="space-y-1">
                    <div className="flex justify-between items-baseline">
                      <span className="font-bold text-slate-900 text-xs uppercase">{exp.position}</span>
                      <span className="text-[10px] text-slate-600 font-semibold">
                        {exp.startDate} – {exp.current ? 'Sekarang' : exp.endDate}
                      </span>
                    </div>
                    <div className="text-[11px] font-semibold" style={{ color: accentColor }}>
                      {exp.company} {exp.location && `• ${exp.location}`}
                    </div>
                    {exp.description && <p className="text-slate-700 text-xs">{exp.description}</p>}
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

          {education && education.length > 0 && (
            <section>
              <h2
                className="text-xs font-bold uppercase tracking-widest border-b pb-1 mb-3"
                style={{ borderColor: secondaryColor, color: accentColor }}
              >
                Pendidikan
              </h2>
              <div className="space-y-3">
                {education.map((edu) => (
                  <div key={edu.id}>
                    <div className="flex justify-between items-baseline">
                      <span className="font-bold text-slate-900 text-xs">{edu.institution}</span>
                      <span className="text-[10px] text-slate-500">{edu.startDate} – {edu.endDate}</span>
                    </div>
                    <div className="text-[11px] font-medium" style={{ color: accentColor }}>
                      {edu.degree} {edu.fieldOfStudy && `— ${edu.fieldOfStudy}`}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {skills && skills.length > 0 && (
            <section>
              <h2
                className="text-xs font-bold uppercase tracking-widest border-b pb-1 mb-2"
                style={{ borderColor: secondaryColor, color: accentColor }}
              >
                Keahlian
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((s) => (
                  <span
                    key={s.id}
                    className="px-2.5 py-0.5 text-[10px] font-semibold rounded border"
                    style={{
                      backgroundColor: `${accentColor}08`,
                      borderColor: `${accentColor}25`,
                      color: accentColor,
                    }}
                  >
                    {s.name}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    );
  };
}
