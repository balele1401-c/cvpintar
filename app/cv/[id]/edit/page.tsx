'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { CVPreviewRenderer } from '@/components/cv/cv-preview-renderer';
import { PaywallModal } from '@/components/paywall/paywall-modal';
import { TemplateDrawer } from '@/components/cv/template-drawer';
import { TemplateCard } from '@/components/cv/template-card';
import { TemplatePreviewModal } from '@/components/cv/template-preview-modal';
import { templateRegistry } from '@/lib/templates/registry';
import { CVTemplateMetadata, TemplateCategory } from '@/lib/templates/types';
import {
  Sparkles,
  Save,
  Eye,
  ArrowLeft,
  Plus,
  Trash2,
  FileText,
  Briefcase,
  GraduationCap,
  Award,
  Layers,
  LayoutGrid,
  Download,
  Search,
} from 'lucide-react';
import { downloadCvAsPdf } from '@/lib/pdf';

import {
  CV,
  CVContent,
  Education,
  Experience,
  Project,
  Skill,
  Organization,
  TemplateId,
  UserPlan,
} from '@/types';



const CATEGORIES: (TemplateCategory | 'ALL')[] = [
  'ALL',
  'ATS',
  'Modern',
  'Fresh Graduate',
  'Technology',
  'Corporate',
  'Executive',
  'Creative',
  'Finance',
  'Academic',
  'Minimal',
];

interface EditCVPageProps {
  params: Promise<{ id: string }>;
}

export default function EditCVPage({ params }: EditCVPageProps) {
  const resolvedParams = use(params);
  const cvId = resolvedParams.id;
  const router = useRouter();

  const [cv, setCv] = useState<CV | null>(null);
  const [content, setContent] = useState<CVContent | null>(null);
  const [templateId, setTemplateId] = useState<TemplateId>('classic');
  const [title, setTitle] = useState<string>('CV Saya');
  const [activeStep, setActiveStep] = useState<number>(1);
  const [plan, setPlan] = useState<UserPlan>('free');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [isPaywallOpen, setIsPaywallOpen] = useState<boolean>(false);
  const [isTemplateDrawerOpen, setIsTemplateDrawerOpen] = useState<boolean>(false);
  const [paywallFeature, setPaywallFeature] = useState<string>('');
  const [paywallDesc, setPaywallDesc] = useState<string>('');
  const [isDownloadingPdf, setIsDownloadingPdf] = useState<boolean>(false);
  const [step5Search, setStep5Search] = useState<string>('');
  const [step5Category, setStep5Category] = useState<TemplateCategory | 'ALL'>('ALL');
  const [step5AccessFilter, setStep5AccessFilter] = useState<'all' | 'free' | 'pro'>('all');
  const [step5PhotoFilter, setStep5PhotoFilter] = useState<'all' | 'with-photo' | 'without-photo'>('all');
  const [previewTemplate, setPreviewTemplate] = useState<CVTemplateMetadata | null>(null);

  // Direct PDF Download Handler
  const handleDirectDownloadPdf = async () => {
    try {
      setIsDownloadingPdf(true);
      await saveCV();
      const safeTitle = (title || 'CV').replace(/[^a-zA-Z0-9_-]/g, '_');
      const safeName = (content?.personalInfo?.fullName || 'CVPintar').replace(/[^a-zA-Z0-9_-]/g, '_');
      await downloadCvAsPdf({
        filename: `${safeTitle}_${safeName}.pdf`,
        elementId: 'cv-printable-area',
      });
    } catch (err) {
      console.error('Error downloading CV PDF:', err);
      alert('Terjadi kesalahan saat memproses file PDF. Silakan coba kembali.');
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  // 1. Fetch existing CV
  useEffect(() => {
    async function loadCV() {
      try {
        const supabase = createClient();
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          router.push('/login');
          return;
        }

        // Fetch profile plan
        const { data: profileData } = await supabase
          .from('profiles')
          .select('plan')
          .eq('user_id', session.user.id)
          .single();

        if (profileData) {
          setPlan(profileData.plan as UserPlan);
        }

        // Fetch CV record
        const { data: cvData, error } = await supabase
          .from('cvs')
          .select('*')
          .eq('id', cvId)
          .eq('user_id', session.user.id)
          .single();

        if (error || !cvData) {
          router.push('/dashboard');
          return;
        }

        setCv(cvData as CV);
        setTitle(cvData.title);
        setTemplateId(cvData.template_id as TemplateId);
        setContent(cvData.content_json as CVContent);
      } catch (err) {
        console.error('Error loading CV:', err);
      }
    }

    loadCV();
  }, [cvId, router]);

  // 2. Save CV to Supabase
  const saveCV = async (updatedContent = content, updatedTemplate = templateId, updatedTitle = title) => {
    if (!cv || !updatedContent) return;
    setIsSaving(true);

    try {
      // Server-side authorization check before saving
      let finalTemplate = updatedTemplate;
      if (!templateRegistry.canUserAccess(plan, updatedTemplate)) {
        finalTemplate = 'classic';
      }

      const supabase = createClient();
      await supabase
        .from('cvs')
        .update({
          title: updatedTitle,
          template_id: finalTemplate,
          content_json: updatedContent,
          updated_at: new Date().toISOString(),
        })
        .eq('id', cv.id);
    } catch (err) {
      console.error('Error saving CV:', err);
    } finally {
      setIsSaving(false);
    }
  };


  // State modification helpers
  const updatePersonalInfo = (field: string, value: string) => {
    if (!content) return;
    const updated = {
      ...content,
      personalInfo: { ...content.personalInfo, [field]: value },
    };
    setContent(updated);
  };

  const addExperience = () => {
    if (!content) return;
    const newExp: Experience = {
      id: `exp-${Date.now()}`,
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
    };
    setContent({ ...content, experience: [...content.experience, newExp] });
  };

  const updateExperience = (id: string, field: string, value: string | boolean) => {
    if (!content) return;
    const updatedExp = content.experience.map((exp) =>
      exp.id === id ? { ...exp, [field]: value } : exp
    );
    setContent({ ...content, experience: updatedExp });
  };

  const removeExperience = (id: string) => {
    if (!content) return;
    setContent({
      ...content,
      experience: content.experience.filter((exp) => exp.id !== id),
    });
  };

  const addEducation = () => {
    if (!content) return;
    const newEdu: Education = {
      id: `edu-${Date.now()}`,
      institution: '',
      degree: 'Sarjana (S1)',
      fieldOfStudy: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
    };
    setContent({ ...content, education: [...content.education, newEdu] });
  };

  const updateEducation = (id: string, field: string, value: string | boolean) => {
    if (!content) return;
    const updatedEdu = content.education.map((edu) =>
      edu.id === id ? { ...edu, [field]: value } : edu
    );
    setContent({ ...content, education: updatedEdu });
  };

  const removeEducation = (id: string) => {
    if (!content) return;
    setContent({
      ...content,
      education: content.education.filter((edu) => edu.id !== id),
    });
  };

  const addSkill = (name: string) => {
    if (!content || !name.trim()) return;
    const newSkill: Skill = { id: `skill-${Date.now()}`, name: name.trim() };
    setContent({ ...content, skills: [...content.skills, newSkill] });
  };

  const removeSkill = (id: string) => {
    if (!content) return;
    setContent({
      ...content,
      skills: content.skills.filter((s) => s.id !== id),
    });
  };

  const addProject = () => {
    if (!content) return;
    const newProj: Project = {
      id: `proj-${Date.now()}`,
      name: '',
      description: '',
      technologies: [],
      url: '',
    };
    setContent({ ...content, projects: [...content.projects, newProj] });
  };

  const updateProject = (id: string, field: string, value: string | string[]) => {
    if (!content) return;
    const updated = content.projects.map((p) =>
      p.id === id ? { ...p, [field]: value } : p
    );
    setContent({ ...content, projects: updated });
  };

  const removeProject = (id: string) => {
    if (!content) return;
    setContent({
      ...content,
      projects: content.projects.filter((p) => p.id !== id),
    });
  };

  const addOrganization = () => {
    if (!content) return;
    const newOrg: Organization = {
      id: `org-${Date.now()}`,
      organization: '',
      position: '',
      period: '',
      description: '',
    };
    setContent({ ...content, organizations: [...content.organizations, newOrg] });
  };

  const updateOrganization = (id: string, field: string, value: string) => {
    if (!content) return;
    const updated = content.organizations.map((o) =>
      o.id === id ? { ...o, [field]: value } : o
    );
    setContent({ ...content, organizations: updated });
  };

  const removeOrganization = (id: string) => {
    if (!content) return;
    setContent({
      ...content,
      organizations: content.organizations.filter((o) => o.id !== id),
    });
  };

  // AI Assistance Actions
  const handleAIOptimizeExperience = async (expId: string, currentDesc: string) => {
    if (!currentDesc.trim()) {
      alert('Tuliskan beberapa patah kata pengalaman kerja Anda terlebih dahulu.');
      return;
    }
    setIsAiLoading(true);
    try {
      const res = await fetch('/api/ai/writer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawText: currentDesc }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.isLimitReached) {
          setPaywallFeature('AI CV Writer Tanpa Batas');
          setPaywallDesc(data.error);
          setIsPaywallOpen(true);
        } else {
          alert(data.error || 'Gagal memproses dengan AI.');
        }
        return;
      }
      updateExperience(expId, 'description', data.result);
    } catch {
      alert('Terjadi kesalahan koneksi AI.');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleAIGenerateSummary = async () => {
    if (!content) return;
    setIsAiLoading(true);
    try {
      const expList = content.experience
        .map((e) => `${e.position} di ${e.company}`)
        .join(', ');
      const skillList = content.skills.map((s) => s.name).join(', ');

      const res = await fetch('/api/ai/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: content.personalInfo.professionalTitle,
          experiences: expList,
          skills: skillList,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.isLimitReached) {
          setPaywallFeature('AI Summary Generator');
          setPaywallDesc(data.error);
          setIsPaywallOpen(true);
        } else {
          alert(data.error || 'Gagal menghasilkan ringkasan.');
        }
        return;
      }
      updatePersonalInfo('summary', data.result);
    } catch {
      alert('Terjadi kesalahan koneksi AI.');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSelectTemplate = (id: TemplateId) => {
    if (!templateRegistry.canUserAccess(plan, id)) {
      const templateMeta = templateRegistry.get(id);
      setPaywallFeature(`Template ${templateMeta.name}`);
      setPaywallDesc(
        `Template "${templateMeta.name}" adalah template premium CVPintar Pro. Dapatkan akses ke seluruh ${templateRegistry.getAll().length}+ template profesional tanpa batas.`
      );
      setIsPaywallOpen(true);
      return;
    }
    setTemplateId(id);
    saveCV(content, id, title);
  };

  if (!content) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      {/* Sticky Header Bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="text-slate-600">
              <ArrowLeft className="w-4 h-4 mr-1" /> Dashboard
            </Button>
          </Link>
          <div className="h-5 w-px bg-slate-200 hidden sm:block" />
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
            className="font-bold text-sm text-slate-900 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-600 focus:outline-none px-1 py-0.5"
            placeholder="Judul Dokumen CV"
          />
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Template Switcher Button */}
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsTemplateDrawerOpen(true)}
            leftIcon={<LayoutGrid className="w-3.5 h-3.5 text-blue-600" />}
            className="hidden md:inline-flex"
          >
            Ganti Desain
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => saveCV()}
            isLoading={isSaving}
            leftIcon={<Save className="w-3.5 h-3.5" />}
          >
            Simpan
          </Button>

          <Button
            variant="accent"
            size="sm"
            onClick={handleDirectDownloadPdf}
            isLoading={isDownloadingPdf}
            leftIcon={<Download className="w-3.5 h-3.5" />}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-xs"
          >
            {isDownloadingPdf ? 'Mengunduh PDF...' : 'Download PDF'}
          </Button>
        </div>
      </header>


      {/* Main Builder Content Area */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Multi-step Editor Form */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col overflow-hidden">
          {/* Stepper Tabs */}
          <div className="flex border-b border-slate-200 overflow-x-auto bg-slate-50 text-xs font-semibold">
            {[
              { num: 1, label: 'Data Diri', icon: FileText },
              { num: 2, label: 'Pendidikan', icon: GraduationCap },
              { num: 3, label: 'Pengalaman', icon: Briefcase },
              { num: 4, label: 'Keahlian & Proyek', icon: Award },
              { num: 5, label: 'Template', icon: Layers },
            ].map((step) => {
              const Icon = step.icon;
              const isActive = activeStep === step.num;
              return (
                <button
                  key={step.num}
                  onClick={() => setActiveStep(step.num)}
                  className={`flex-1 py-3 px-3.5 flex items-center justify-center gap-1.5 border-b-2 whitespace-nowrap transition-colors ${
                    isActive
                      ? 'border-blue-600 text-blue-600 bg-white'
                      : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{step.label}</span>
                </button>
              );
            })}
          </div>

          {/* Form Step Body */}
          <div className="p-6 flex-1 overflow-y-auto max-h-[75vh] space-y-6">
            {/* STEP 1: DATA DIRI & SUMMARY */}
            {activeStep === 1 && (
              <div className="space-y-5">
                {/* Conditional Photo Upload Card */}
                {(() => {
                  const currentTemplateMeta = templateRegistry.get(templateId);
                  const supportsPhoto = !!currentTemplateMeta.hasPhoto;

                  if (!supportsPhoto) return null;

                  return (
                    <div className="p-4 bg-purple-50/70 rounded-2xl border border-purple-200/80 flex flex-col sm:flex-row items-center gap-4">
                      <div className="relative w-20 h-20 rounded-full overflow-hidden bg-white border-2 border-purple-500 shadow-sm shrink-0 flex items-center justify-center">
                        {content.personalInfo.photoUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={content.personalInfo.photoUrl}
                            alt="Foto Profil"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-2xl">👤</span>
                        )}
                      </div>
                      <div className="flex-1 space-y-2 text-center sm:text-left">
                        <div>
                          <div className="flex items-center justify-center sm:justify-start gap-2">
                            <label className="text-xs font-bold text-slate-900">Foto Profil CV</label>
                            <Badge variant="outline" className="text-[10px] text-purple-700 bg-purple-100 border-purple-300">
                              📷 Template Mendukung Foto
                            </Badge>
                          </div>
                          <p className="text-[11px] text-slate-600 mt-0.5">
                            Unggah foto formal Anda. Foto ini akan tampil di template <strong>{currentTemplateMeta.name}</strong>.
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                          <label className="cursor-pointer">
                            <span className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-medium inline-flex items-center gap-1.5 shadow-sm">
                              📷 Unggah Foto
                            </span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onload = (uploadEvent) => {
                                    const base64 = uploadEvent.target?.result as string;
                                    if (base64) {
                                      updatePersonalInfo('photoUrl', base64);
                                    }
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                          </label>
                          {content.personalInfo.photoUrl && (
                            <button
                              type="button"
                              onClick={() => updatePersonalInfo('photoUrl', '')}
                              className="px-2.5 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-lg font-medium"
                            >
                              Hapus Foto
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })()}

                <h2 className="text-base font-bold text-slate-900">
                  Informasi Pribadi & Kontak
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Nama Lengkap *"
                    value={content.personalInfo.fullName}
                    onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                    placeholder="Budi Pratama"
                  />

                  <Input
                    label="Profesi / Target Posisi *"
                    value={content.personalInfo.professionalTitle}
                    onChange={(e) =>
                      updatePersonalInfo('professionalTitle', e.target.value)
                    }
                    placeholder="Frontend Developer"
                  />
                  <Input
                    label="Email *"
                    type="email"
                    value={content.personalInfo.email}
                    onChange={(e) => updatePersonalInfo('email', e.target.value)}
                    placeholder="budi@email.com"
                  />
                  <Input
                    label="Nomor WhatsApp / HP *"
                    value={content.personalInfo.phone}
                    onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                    placeholder="+62 812 3456 7890"
                  />
                  <Input
                    label="Domisili / Kota *"
                    value={content.personalInfo.location}
                    onChange={(e) => updatePersonalInfo('location', e.target.value)}
                    placeholder="Jakarta Selatan, Indonesia"
                  />
                  <Input
                    label="URL LinkedIn"
                    value={content.personalInfo.linkedIn || ''}
                    onChange={(e) => updatePersonalInfo('linkedIn', e.target.value)}
                    placeholder="linkedin.com/in/budipratama"
                  />
                  <Input
                    label="GitHub / Portofolio"
                    value={content.personalInfo.github || ''}
                    onChange={(e) => updatePersonalInfo('github', e.target.value)}
                    placeholder="github.com/budipratama"
                  />
                  <Input
                    label="Website Portofolio"
                    value={content.personalInfo.portfolio || ''}
                    onChange={(e) => updatePersonalInfo('portfolio', e.target.value)}
                    placeholder="budipratama.dev"
                  />
                </div>

                <div className="pt-2">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-sm font-medium text-slate-700">
                      Ringkasan Profil (Professional Summary)
                    </label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleAIGenerateSummary}
                      isLoading={isAiLoading}
                      leftIcon={<Sparkles className="w-3.5 h-3.5 text-blue-600" />}
                      className="text-xs text-blue-600 hover:text-blue-700 h-7"
                    >
                      Bantu Tulis AI
                    </Button>
                  </div>
                  <Textarea
                    rows={4}
                    value={content.personalInfo.summary}
                    onChange={(e) => updatePersonalInfo('summary', e.target.value)}
                    placeholder="Jelaskan secara singkat latar belakang profesional, minat karir, dan keunggulan utama Anda..."
                  />
                </div>
              </div>
            )}

            {/* STEP 2: PENDIDIKAN */}
            {activeStep === 2 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold text-slate-900">
                    Riwayat Pendidikan
                  </h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addEducation}
                    leftIcon={<Plus className="w-3.5 h-3.5" />}
                  >
                    Tambah Pendidikan
                  </Button>
                </div>

                {content.education.map((edu, idx) => (
                  <div
                    key={edu.id}
                    className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 relative"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-700">
                        Pendidikan #{idx + 1}
                      </span>
                      <button
                        onClick={() => removeEducation(edu.id)}
                        className="text-slate-400 hover:text-red-600 p-1"
                        aria-label="Hapus"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Input
                        label="Nama Institusi / Universitas *"
                        value={edu.institution}
                        onChange={(e) =>
                          updateEducation(edu.id, 'institution', e.target.value)
                        }
                        placeholder="Universitas Indonesia"
                      />
                      <Input
                        label="Gelar / Jenjang *"
                        value={edu.degree}
                        onChange={(e) =>
                          updateEducation(edu.id, 'degree', e.target.value)
                        }
                        placeholder="Sarjana (S1)"
                      />
                      <Input
                        label="Jurusan / Bidang Studi"
                        value={edu.fieldOfStudy}
                        onChange={(e) =>
                          updateEducation(edu.id, 'fieldOfStudy', e.target.value)
                        }
                        placeholder="Teknik Informatika"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          label="Tahun Mulai"
                          value={edu.startDate}
                          onChange={(e) =>
                            updateEducation(edu.id, 'startDate', e.target.value)
                          }
                          placeholder="2020"
                        />
                        <Input
                          label="Tahun Selesai"
                          value={edu.endDate}
                          onChange={(e) =>
                            updateEducation(edu.id, 'endDate', e.target.value)
                          }
                          placeholder="2024"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* STEP 3: PENGALAMAN KERJA */}
            {activeStep === 3 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-bold text-slate-900">
                      Pengalaman Kerja & Magang
                    </h2>
                    <p className="text-xs text-slate-500">
                      Gunakan tombol AI CV Writer untuk mengubah poin biasa menjadi kalimat pencapaian STAR.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addExperience}
                    leftIcon={<Plus className="w-3.5 h-3.5" />}
                  >
                    Tambah
                  </Button>
                </div>

                {content.experience.map((exp, idx) => (
                  <div
                    key={exp.id}
                    className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 relative"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-700">
                        Pengalaman #{idx + 1}
                      </span>
                      <button
                        onClick={() => removeExperience(exp.id)}
                        className="text-slate-400 hover:text-red-600 p-1"
                        aria-label="Hapus"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Input
                        label="Posisi / Jabatan *"
                        value={exp.position}
                        onChange={(e) =>
                          updateExperience(exp.id, 'position', e.target.value)
                        }
                        placeholder="Frontend Engineer Intern"
                      />
                      <Input
                        label="Nama Perusahaan *"
                        value={exp.company}
                        onChange={(e) =>
                          updateExperience(exp.id, 'company', e.target.value)
                        }
                        placeholder="PT Teknologi Unggul"
                      />
                      <Input
                        label="Lokasi"
                        value={exp.location || ''}
                        onChange={(e) =>
                          updateExperience(exp.id, 'location', e.target.value)
                        }
                        placeholder="Jakarta / Remote"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          label="Mulai"
                          value={exp.startDate}
                          onChange={(e) =>
                            updateExperience(exp.id, 'startDate', e.target.value)
                          }
                          placeholder="Jan 2023"
                        />
                        <Input
                          label="Selesai"
                          value={exp.endDate}
                          onChange={(e) =>
                            updateExperience(exp.id, 'endDate', e.target.value)
                          }
                          placeholder="Des 2023"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-medium text-slate-700">
                          Rincian Pekerjaan & Pencapaian
                        </label>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleAIOptimizeExperience(exp.id, exp.description)
                          }
                          isLoading={isAiLoading}
                          leftIcon={<Sparkles className="w-3.5 h-3.5 text-blue-600" />}
                          className="text-xs text-blue-600 hover:text-blue-700 h-6 px-2"
                        >
                          Optimalkan Kalimat (STAR AI)
                        </Button>
                      </div>
                      <Textarea
                        rows={3}
                        value={exp.description}
                        onChange={(e) =>
                          updateExperience(exp.id, 'description', e.target.value)
                        }
                        placeholder="• Tuliskan tugas utama dan pencapaian Anda..."
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* STEP 4: KEAHLIAN & PROYEK */}
            {activeStep === 4 && (
              <div className="space-y-6">
                {/* Skills section */}
                <div className="space-y-3">
                  <h2 className="text-base font-bold text-slate-900">
                    Keahlian (Skills)
                  </h2>
                  <div className="flex gap-2">
                    <input
                      id="skill-input"
                      type="text"
                      placeholder="Ketik skill (misal: React.js, SQL, Public Speaking) lalu Enter"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const val = (e.target as HTMLInputElement).value;
                          if (val) {
                            addSkill(val);
                            (e.target as HTMLInputElement).value = '';
                          }
                        }
                      }}
                      className="flex-1 rounded-lg border border-slate-300 px-3 py-1.5 text-xs focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {content.skills.map((s) => (
                      <Badge
                        key={s.id}
                        variant="default"
                        className="pl-2.5 pr-1 py-1 gap-1 text-xs"
                      >
                        <span>{s.name}</span>
                        <button
                          onClick={() => removeSkill(s.id)}
                          className="p-0.5 text-slate-400 hover:text-red-600 rounded"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Projects section */}
                <div className="space-y-3 pt-4 border-t border-slate-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-base font-bold text-slate-900">
                      Proyek & Portofolio
                    </h2>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={addProject}
                      leftIcon={<Plus className="w-3.5 h-3.5" />}
                    >
                      Tambah Proyek
                    </Button>
                  </div>

                  {content.projects.map((proj) => (
                    <div
                      key={proj.id}
                      className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 relative"
                    >
                      <div className="flex justify-between items-center">
                        <Input
                          label="Nama Proyek *"
                          value={proj.name}
                          onChange={(e) =>
                            updateProject(proj.id, 'name', e.target.value)
                          }
                          placeholder="Aplikasi E-Commerce KasirKu"
                        />
                        <button
                          onClick={() => removeProject(proj.id)}
                          className="text-slate-400 hover:text-red-600 p-1 ml-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <Input
                        label="URL Proyek / GitHub"
                        value={proj.url || ''}
                        onChange={(e) =>
                          updateProject(proj.id, 'url', e.target.value)
                        }
                        placeholder="github.com/user/kasirku"
                      />
                      <Textarea
                        label="Deskripsi Proyek"
                        rows={2}
                        value={proj.description}
                        onChange={(e) =>
                          updateProject(proj.id, 'description', e.target.value)
                        }
                        placeholder="Jelaskan fitur utama dan hasil proyek..."
                      />
                    </div>
                  ))}
                </div>

                {/* Organization section */}
                <div className="space-y-3 pt-4 border-t border-slate-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-base font-bold text-slate-900">
                      Pengalaman Organisasi
                    </h2>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={addOrganization}
                      leftIcon={<Plus className="w-3.5 h-3.5" />}
                    >
                      Tambah Organisasi
                    </Button>
                  </div>

                  {content.organizations.map((org) => (
                    <div
                      key={org.id}
                      className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 relative"
                    >
                      <div className="flex justify-between items-center">
                        <Input
                          label="Nama Organisasi / Lembaga"
                          value={org.organization}
                          onChange={(e) =>
                            updateOrganization(org.id, 'organization', e.target.value)
                          }
                          placeholder="BEM Fakultas Ilmu Komputer"
                        />
                        <button
                          onClick={() => removeOrganization(org.id)}
                          className="text-slate-400 hover:text-red-600 p-1 ml-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          label="Posisi / Jabatan"
                          value={org.position}
                          onChange={(e) =>
                            updateOrganization(org.id, 'position', e.target.value)
                          }
                          placeholder="Ketua Divisi Humas"
                        />
                        <Input
                          label="Periode"
                          value={org.period}
                          onChange={(e) =>
                            updateOrganization(org.id, 'period', e.target.value)
                          }
                          placeholder="2022 - 2023"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 5: PILIH TEMPLATE */}
            {activeStep === 5 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-bold text-slate-900">
                        Pilih Desain Template CV
                      </h2>
                      <Badge variant="outline" className="text-slate-600 font-semibold text-[10px]">
                        {templateRegistry.getAll().length} Pilihan Desain
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Pilih desain yang paling cocok untuk industri target Anda. Isi data CV Anda 100% aman dan tidak akan hilang.
                    </p>
                  </div>
                </div>

                {/* Filter & Search Bar */}
                <div className="space-y-3 pb-1">
                  <div className="flex flex-col sm:flex-row gap-2.5">
                    <div className="flex-1">
                      <Input
                        placeholder="Cari template (contoh: ATS, Tech, Executive, Fresh Graduate)..."
                        value={step5Search}
                        onChange={(e) => setStep5Search(e.target.value)}
                        leftIcon={<Search className="w-4 h-4 text-slate-400" />}
                      />
                    </div>

                    {/* Free / Pro Switch */}
                    <div className="flex bg-slate-100 p-1 rounded-xl shrink-0 self-start sm:self-auto">
                      <button
                        type="button"
                        onClick={() => setStep5AccessFilter('all')}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                          step5AccessFilter === 'all'
                            ? 'bg-white text-slate-900 shadow-sm'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Semua ({templateRegistry.getAll().length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setStep5AccessFilter('free')}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                          step5AccessFilter === 'free'
                            ? 'bg-white text-emerald-700 shadow-sm'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Gratis
                      </button>
                      <button
                        type="button"
                        onClick={() => setStep5AccessFilter('pro')}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 ${
                          step5AccessFilter === 'pro'
                            ? 'bg-white text-amber-700 shadow-sm'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <Sparkles className="w-3 h-3 text-amber-500" /> Pro
                      </button>
                    </div>

                    {/* Photo Filter Toggle */}
                    <div className="flex bg-slate-100 p-1 rounded-xl shrink-0 self-start sm:self-auto">
                      <button
                        type="button"
                        onClick={() => setStep5PhotoFilter('all')}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                          step5PhotoFilter === 'all'
                            ? 'bg-white text-slate-900 shadow-sm'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Semua
                      </button>
                      <button
                        type="button"
                        onClick={() => setStep5PhotoFilter('with-photo')}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                          step5PhotoFilter === 'with-photo'
                            ? 'bg-white text-purple-700 shadow-sm'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <span>📷</span>
                        <span>Dengan Foto</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setStep5PhotoFilter('without-photo')}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                          step5PhotoFilter === 'without-photo'
                            ? 'bg-white text-blue-700 shadow-sm'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <span>📄</span>
                        <span>Tanpa Foto (ATS)</span>
                      </button>
                    </div>
                  </div>

                  {/* Category Pills */}
                  <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setStep5Category(cat)}
                        className={`px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap transition-colors ${
                          step5Category === cat
                            ? 'bg-slate-900 text-white'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                        }`}
                      >
                        {cat === 'ALL' ? 'Semua Kategori' : cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Template Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[55vh] overflow-y-auto pr-1">
                  {(() => {
                    const filtered = templateRegistry.filter({
                      search: step5Search,
                      category: step5Category,
                      access: step5AccessFilter,
                      photoFilter: step5PhotoFilter,
                    });

                    if (filtered.length === 0) {
                      return (
                        <div className="col-span-full py-10 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                          <p className="text-xs text-slate-500 font-medium">Tidak ada desain template yang cocok dengan filter.</p>
                          <button
                            type="button"
                            onClick={() => {
                              setStep5Search('');
                              setStep5Category('ALL');
                              setStep5AccessFilter('all');
                              setStep5PhotoFilter('all');
                            }}
                            className="text-xs text-blue-600 font-bold hover:underline mt-1.5"
                          >
                            Reset Filter
                          </button>
                        </div>
                      );
                    }

                    return filtered.map((tpl) => (
                      <TemplateCard
                        key={tpl.id}
                        template={tpl}
                        userPlan={plan}
                        isSelected={tpl.id === templateId}
                        onSelect={(t) => handleSelectTemplate(t.id)}
                        onPreview={(t) => setPreviewTemplate(t)}
                        onLockedClick={(t) => {
                          setPaywallFeature(`Template ${t.name}`);
                          setPaywallDesc(
                            `Gunakan template premium "${t.name}" dan semua koleksi template profesional lainnya tanpa batas dengan berlangganan CVPintar Pro.`
                          );
                          setIsPaywallOpen(true);
                        }}
                      />
                    ));
                  })()}
                </div>
              </div>
            )}
          </div>

          {/* Stepper Navigation Footer */}
          <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
            <Button
              variant="secondary"
              size="sm"
              disabled={activeStep === 1}
              onClick={() => setActiveStep((prev) => Math.max(1, prev - 1))}
            >
              Sebelumnya
            </Button>
            <span className="text-xs font-semibold text-slate-500">
              Langkah {activeStep} dari 5
            </span>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                if (activeStep < 5) {
                  setActiveStep((prev) => prev + 1);
                } else {
                  router.push(`/cv/${cvId}/preview`);
                }
              }}
            >
              {activeStep === 5 ? 'Selesai & Preview' : 'Selanjutnya'}
            </Button>
          </div>
        </div>

        {/* Right Side: Live A4 Preview */}
        <div className="lg:col-span-6 sticky top-20 max-h-[85vh] overflow-y-auto rounded-2xl border border-slate-200 bg-slate-300/60 p-4 shadow-inner">
          <div className="mb-2 flex items-center justify-between text-xs text-slate-700 font-semibold">
            <span className="flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-blue-600" /> Live Preview (Format A4)
            </span>
            <button
              type="button"
              onClick={() => setIsTemplateDrawerOpen(true)}
              className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 bg-white px-2 py-0.5 rounded-lg border border-slate-200 hover:border-blue-300 transition-colors shadow-xs"
            >
              <LayoutGrid className="w-3 h-3" /> Ganti Desain
            </button>
          </div>

          {/* CV Renderer */}
          <div className="transform scale-95 origin-top">
            <CVPreviewRenderer
              data={content}
              templateId={templateId}
              plan={plan}
            />
          </div>
        </div>
      </div>

      {/* Template Preview Modal */}
      <TemplatePreviewModal
        isOpen={!!previewTemplate}
        template={previewTemplate}
        userPlan={plan}
        onClose={() => setPreviewTemplate(null)}
        onSelectTemplate={(t) => {
          handleSelectTemplate(t.id);
          setPreviewTemplate(null);
        }}
        onLockedClick={(t) => {
          setPreviewTemplate(null);
          setPaywallFeature(`Template ${t.name}`);
          setPaywallDesc(
            `Gunakan template premium "${t.name}" dan semua koleksi template profesional lainnya tanpa batas dengan berlangganan CVPintar Pro.`
          );
          setIsPaywallOpen(true);
        }}
      />

      {/* Template Switcher Drawer / Modal */}
      <TemplateDrawer
        isOpen={isTemplateDrawerOpen}
        currentTemplateId={templateId}
        userPlan={plan}
        onClose={() => setIsTemplateDrawerOpen(false)}
        onSelectTemplate={(id) => handleSelectTemplate(id)}
      />

      {/* Paywall Modal */}
      <PaywallModal
        isOpen={isPaywallOpen}
        onClose={() => setIsPaywallOpen(false)}
        featureName={paywallFeature}
        featureDescription={paywallDesc}
      />
    </div>
  );
}

