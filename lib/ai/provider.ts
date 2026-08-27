// ====================================================================
// KERJAAI CENTRALIZED AI PROVIDER ABSTRACTION (SERVER-SIDE ONLY)
// ====================================================================
// Uses AIRouter with automatic multi-provider failover:
// Gemini (Primary) -> DeepSeek (Fallback 1) -> Groq (Fallback 2) -> Deterministic Fallback

import {
  GenerateTextOptions,
  ATSAnalysisResult,
  JobAnalysisResult,
  InterviewQA,
  ProviderExecutionResult,
} from './types';
import { aiRouter, AIRouter } from './router';

export class AIProvider {
  private router: AIRouter;

  constructor(routerInstance: AIRouter = aiRouter) {
    this.router = routerInstance;
  }

  /**
   * Helper to clean JSON strings from Markdown code blocks
   */
  private cleanJsonString(raw: string): string {
    return raw
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/```$/i, '')
      .trim();
  }

  /**
   * Universal text generation method with multi-provider failover
   */
  async generateText(options: GenerateTextOptions): Promise<string> {
    const result: ProviderExecutionResult = await this.router.generateText(options);
    return result.text;
  }

  /**
   * AI CV Writer: Refines simple experiences into STAR formula achievements
   */
  async rewriteExperience(rawText: string): Promise<string> {
    const systemPrompt = `Anda adalah pakar penulisan CV berstandar ATS untuk pasar kerja Indonesia.
Tugas Anda:
1. Ubah catatan kerja sederhana user menjadi poin-poin pencapaian yang rapi menggunakan kata kerja aktif (Action Verbs) dan pola STAR (Situation, Task, Action, Result).
2. JANGAN mengarang pengalaman fiktif atau keahlian yang tidak disebutkan.
3. Berikan output langsung berupa bullet point deskripsi profesional tanpa basa-basi pembuka/penutup.`;

    return this.generateText({
      systemPrompt,
      prompt: `Optimalkan deskripsi pengalaman berikut:\n"${rawText}"`,
      temperature: 0.6,
    });
  }

  /**
   * AI Summary Generator: Generates 2-3 concise profile sentences
   */
  async generateSummary(
    role: string,
    experiences: string,
    skills: string
  ): Promise<string> {
    const systemPrompt = `Anda adalah konsultan karir profesional.
Tugas Anda: Tuliskan 2-3 kalimat ringkasan profil (Professional Summary) yang padat, persuasif, dan ATS-friendly.
Fokus pada kompetensi utama dan target role. Jangan membuat klaim berlebihan yang tidak sesuai fakta.`;

    return this.generateText({
      systemPrompt,
      prompt: `Target Role: ${role}\nPengalaman: ${experiences}\nSkills: ${skills}`,
      temperature: 0.6,
    });
  }

  /**
   * ATS Checker: Analyzes CV against standard ATS criteria & target role
   */
  async checkATS(cvText: string, targetJob?: string): Promise<ATSAnalysisResult> {
    const systemPrompt = `Anda adalah ATS Screening Algorithm Simulator.
Analisis teks CV terhadap kriteria keterbacaan mesin ATS dan relevansi kata kunci.
Kembalikan HANYA format JSON murni:
{
  "score": number (0-100),
  "strengths": ["string", "string"],
  "missingKeywords": ["string", "string"],
  "recommendations": ["string", "string"],
  "summary": "string"
}`;

    const prompt = `Data CV:\n${cvText}\n\nTarget Lowongan:\n${targetJob || 'Umum / Standard ATS'}`;

    try {
      const response = await this.generateText({
        systemPrompt,
        prompt: `${prompt}\n\nPENTING: Kembalikan HANYA format JSON yang valid.`,
        temperature: 0.2,
      });

      const cleaned = this.cleanJsonString(response);
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (typeof parsed.score === 'number' && Array.isArray(parsed.strengths)) {
          return {
            score: Math.min(100, Math.max(0, parsed.score)),
            strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
            missingKeywords: Array.isArray(parsed.missingKeywords) ? parsed.missingKeywords : [],
            recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations : [],
            summary: parsed.summary || 'Analisis ATS selesai.',
          };
        }
      }
    } catch (err) {
      console.warn('[AI] checkATS structured parsing fallback:', err);
    }

    // Heuristic deterministic fallback parser
    const hasEmail = cvText.includes('@');
    const hasPhone = /\d{8,}/.test(cvText);
    const wordCount = cvText.split(/\s+/).length;

    let score = 70;
    const strengths: string[] = ['Format struktur teks dapat diekstrak oleh parser'];
    const missing: string[] = [];
    const recommendations: string[] = [];

    if (hasEmail && hasPhone) {
      score += 10;
      strengths.push('Informasi kontak lengkap dan jelas');
    }
    if (wordCount > 150) {
      score += 10;
      strengths.push('Kepadatan informasi pengalaman cukup memadai');
    } else {
      missing.push('Deskripsi detail tanggung jawab kerja');
      recommendations.push('Perbanyak rincian tugas dan dampak kuantitatif pada pengalaman kerja');
    }

    if (!cvText.toLowerCase().includes('skill') && !cvText.toLowerCase().includes('keahlian')) {
      missing.push('Bagian Khusus Keahlian Teknis');
      recommendations.push('Tambahkan daftar skill terstruktur agar mudah diindeks kata kuncinya');
    } else {
      score += 5;
    }

    return {
      score: Math.min(95, score),
      strengths,
      missingKeywords: missing.length > 0 ? missing : ['Sertifikasi Terkait', 'Metrik Kuantitatif (%)'],
      recommendations:
        recommendations.length > 0
          ? recommendations
          : [
              'Gunakan kata kerja aktif di setiap awal bullet point pengalaman',
              'Pastikan nama institusi dan tahun kelulusan tertulis jelas',
            ],
      summary: `CV Anda memiliki format dasar yang baik dengan skor ATS ${score}/100. Beberapa optimasi kata kunci akan meningkatkan peluang lolos skrining awal.`,
    };
  }

  /**
   * Job Description Analyzer: Real extraction of requirements and keywords
   */
  async analyzeJobDescription(jobDesc: string): Promise<JobAnalysisResult> {
    const systemPrompt = `Anda adalah Job Market Intelligence Analyzer.
Analisis deskripsi lowongan kerja dan ekstrak informasinya ke dalam format JSON murni:
{
  "role": "string",
  "requiredSkills": ["string", "string"],
  "preferredSkills": ["string", "string"],
  "importantKeywords": ["string", "string"],
  "cvRecommendations": ["string", "string"]
}`;

    try {
      const response = await this.generateText({
        systemPrompt,
        prompt: `Deskripsi Lowongan:\n${jobDesc}\n\nKembalikan HANYA JSON.`,
        temperature: 0.2,
      });

      const cleaned = this.cleanJsonString(response);
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (parsed.role && Array.isArray(parsed.requiredSkills)) {
          return {
            role: String(parsed.role),
            requiredSkills: Array.isArray(parsed.requiredSkills) ? parsed.requiredSkills : [],
            preferredSkills: Array.isArray(parsed.preferredSkills) ? parsed.preferredSkills : [],
            importantKeywords: Array.isArray(parsed.importantKeywords) ? parsed.importantKeywords : [],
            cvRecommendations: Array.isArray(parsed.cvRecommendations) ? parsed.cvRecommendations : [],
          };
        }
      }
    } catch (err) {
      console.warn('[AI] analyzeJobDescription structured parsing fallback:', err);
    }

    // Heuristic keyword extractor from actual job posting text
    const lines = jobDesc.split('\n').map((l) => l.trim()).filter(Boolean);
    const inferredRole = lines[0]?.slice(0, 45) || 'Posisi Pekerjaan Target';

    const words = jobDesc.split(/[\s,.;:()]+/).filter((w) => w.length > 3);
    const uniqueKeywords = Array.from(new Set(words.slice(0, 8)));

    return {
      role: inferredRole,
      requiredSkills: ['Problem Solving', 'Komunikasi Terstruktur', 'Kerja Sama Tim', 'Kemandirian Kerja'],
      preferredSkills: ['Pengalaman Terkait', 'Kemampuan Analisis Data', 'Bahasa Inggris Profesional'],
      importantKeywords: uniqueKeywords.length > 0 ? uniqueKeywords : ['Kualifikasi', 'Tanggung Jawab', 'Kompetensi'],
      cvRecommendations: [
        `Cantumkan keahlian yang secara eksplisit diminta untuk posisi "${inferredRole}"`,
        'Gunakan terminologi teknis yang sama persis dengan yang ada pada deskripsi lowongan',
        'Fokuskan 3 bullet point teratas pengalaman Anda pada tanggung jawab utama pekerjaan ini',
      ],
    };
  }

  /**
   * Cover Letter Generator: Real personalized letter creation
   */
  async generateCoverLetter(
    company: string,
    position: string,
    skills: string,
    applicantName = 'Pelamar CVPintar'
  ): Promise<string> {
    const systemPrompt = `Anda adalah konsultan rekrutmen profesional dan pakar korespondensi karir di Indonesia.
Tugas Anda: Buatlah Surat Lamaran Kerja (Cover Letter) resmi, lengkap, persuasif, dan elegan dalam Bahasa Indonesia baku yang siap dikirimkan kepada HRD perusahaan.

STRUKTUR WAJIB SURAT LAMARAN:
1. Tempat & Tanggal pembuatan surat
2. Perihal & Lampiran
3. Tujuan Penerima (Yth. Tim Rekrutmen / HRD [Nama Perusahaan])
4. Salam Pembuka resmi ("Dengan hormat,")
5. Paragraf Pembuka (Menyatakan posisi yang dilamar dengan antusias)
6. Paragraf Kualifikasi (Menjelaskan relevansi keahlian utama yang ditekankan, nilai tambah, dan etos kerja)
7. Paragraf Keselarasan (Mengapa tertarik bergabung dengan perusahaan tersebut)
8. Paragraf Penutup & Permohonan Wawancara
9. Salam Penutup ("Hormat saya,") dan Nama Lengkap Pelamar.

Tuliskan dalam format teks rapi dengan jeda paragraf yang nyaman dibaca tanpa boilerplate pendahuluan.`;

    const prompt = `Perusahaan: ${company}\nPosisi: ${position}\nKeahlian Utama: ${skills}\nNama Pelamar: ${applicantName}`;

    return this.generateText({
      systemPrompt,
      prompt,
      temperature: 0.6,
    });
  }


  /**
   * Interview Preparation Questions Generator
   */
  async generateInterviewQuestions(role: string): Promise<InterviewQA[]> {
    const systemPrompt = `Anda adalah Senior HR Interviewer.
Tugas Anda: Berikan 4 pertanyaan wawancara kerja yang paling sering muncul untuk posisi yang diminta, lengkap dengan panduan jawaban berstruktur STAR.
Format JSON murni:
[
  {
    "category": "string (HR / Behavioral / Teknis / Pertanyaan Balik)",
    "q": "string",
    "a": "string"
  }
]`;

    try {
      const response = await this.generateText({
        systemPrompt,
        prompt: `Posisi: ${role}\n\nKembalikan HANYA array JSON valid.`,
        temperature: 0.3,
      });

      const cleaned = this.cleanJsonString(response);
      const jsonMatch = cleaned.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].q) {
          return parsed as InterviewQA[];
        }
      }
    } catch (err) {
      console.warn('[AI] generateInterviewQuestions structured parsing fallback:', err);
    }

    return [
      {
        category: 'Pertanyaan HR & Behavioral',
        q: `Ceritakan tentang diri Anda dan motivasi Anda melamar sebagai ${role}?`,
        a: 'Gunakan formula Elevator Pitch (1-2 menit): 1) Latar belakang keahlian terkini, 2) Portofolio atau pencapaian utama yang relevan, 3) Alasan antusiasme Anda terhadap peran ini.',
      },
      {
        category: 'Situasi & Problem Solving (STAR)',
        q: 'Ceritakan kendala terberat yang pernah Anda temui saat mengerjakan proyek dan bagaimana Anda menyelesaikannya?',
        a: 'Uraikan metode STAR: Jelaskan situasinya secara singkat, sebutkan tugas Anda (Task), jelaskan aksi konkrit penyelesaian (Action), dan buktikan hasilnya (Result).',
      },
      {
        category: 'Keahlian Teknis & Best Practice',
        q: `Bagaimana alur kerja (workflow) Anda dalam menjaga kualitas hasil pekerjaan untuk posisi ${role}?`,
        a: 'Jelaskan tahapan kerja Anda: mulai dari riset kebutuhan, eksekusi terstruktur, pengujian mandiri, dokumentasi rapi, hingga komunikasi proaktif dengan rekan tim.',
      },
      {
        category: 'Pertanyaan Balik ke Tim Rekruter',
        q: 'Apakah ada pertanyaan yang ingin Anda tanyakan kepada kami?',
        a: 'Tunjukkan minat tinggi: "Bagaimana kriteria keberhasilan untuk peran ini dalam 3 bulan pertama?" atau "Tantangan apa yang paling diprioritaskan tim saat ini?"',
      },
    ];
  }
}

export const aiProvider = new AIProvider();
export * from './types';
export * from './cooldown';
export * from './router';
