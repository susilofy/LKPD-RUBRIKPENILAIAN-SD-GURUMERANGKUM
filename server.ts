import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import {
  generateFallbackLkpd,
  generateFallbackRubrik,
  regenerateFallbackLkpd,
} from './src/utils/fallbackAi';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;

// Lazy initialization of GoogleGenAI client with required header
let aiClient: GoogleGenAI | null = null;
function getAi(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

/**
 * Safely call Gemini models with fallback from primary to lightweight model,
 * and gracefully handle 429 quota exhaustion without crashing.
 */
async function generateWithGemini(prompt: string): Promise<string | null> {
  const ai = getAi();
  if (!ai) return null;

  const models = ['gemini-3.8-flash', 'gemini-3.1-flash-lite'];

  for (const model of models) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.7,
        },
      });

      if (response.text) {
        return response.text;
      }
    } catch (err: any) {
      const isQuotaError =
        err?.status === 'RESOURCE_EXHAUSTED' ||
        err?.code === 429 ||
        err?.message?.includes('429') ||
        err?.message?.includes('quota') ||
        err?.message?.includes('RESOURCE_EXHAUSTED');

      if (isQuotaError) {
        console.warn(`[Quota Notice] Kuota model ${model} tercapai, beralih ke alternatif...`);
      } else {
        console.warn(`[Model Notice] Kendala pada ${model}: ${err?.message || 'Gagal'}`);
      }
    }
  }

  return null;
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '10mb' }));

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      hasApiKey: Boolean(process.env.GEMINI_API_KEY),
      model: 'gemini-3.8-flash',
    });
  });

  // Generate LKPD Endpoint
  app.post('/api/generate-lkpd', async (req, res) => {
    const input = req.body;
    try {
      if (!input.kelas || !input.mataPelajaran || !input.topik) {
        return res.status(400).json({ error: 'Silakan lengkapi data pembelajaran terlebih dahulu.' });
      }

      const prompt = `Anda adalah ahli kurikulum Sekolah Dasar (SD) Indonesia spesialis Kurikulum Merdeka dan pendekatan Pembelajaran Mendalam (Deep Learning).
Buatlah dokumen Lembar Kerja Peserta Didik (LKPD) yang sangat berkualitas, mendalam, dan relevan dengan data berikut:
- Nama Sekolah: ${input.namaSekolah || 'SD Negeri'}
- Guru: ${input.namaGuru || 'Guru Kelas'}
- Kelas: ${input.kelas}
- Fase: ${input.fase}
- Mata Pelajaran: ${input.mataPelajaran}
- Semester: ${input.semester}
- Topik/Materi: ${input.topik}
- Alokasi Waktu: ${input.alokasiWaktu || '2 x 35 Menit'}
- Capaian Pembelajaran: ${input.capaianPembelajaran || 'Sesuai kurikulum fase ' + input.fase}
- Tujuan Pembelajaran: ${input.tujuanPembelajaran || 'Memahami dan mengaplikasikan konsep'}
- Indikator Ketercapaian: ${input.indikatorKetercapaian || 'Mampu mengidentifikasi dan memecahkan soal'}
- Model/Metode: ${input.modelPembelajaran || 'Problem-Based Learning'}
- Profil Pelajar Pancasila: ${input.profilKarakter || 'Mandiri, Bernalar Kritis, Gotong Royong'}
- Sumber Belajar: ${input.sumberBelajar || 'Buku Siswa Kemendikbudristek'}
- Alat dan Bahan: ${input.alatDanBahan || 'Alat tulis dan bahan pengamatan'}
- Pilihan Aktivitas: ${input.jenisAktivitas?.join(', ') || 'Literasi, HOTS, Eksperimen'}
- Jumlah Soal/Aktivitas: ${input.jumlahSoal || 4}
- Tingkat Kesulitan: ${input.tingkatKesulitan || 'Sedang'}
- Karakter LKPD: ${input.karakterLkpd || 'Individu dan kelompok'}

Pedoman Bahasa & Tingkat Perkembangan:
- Jika Kelas 1–3: Gunakan kosakata sederhana, kalimat pendek, instruksi ramah anak, tugas konkret, dan visual.
- Jika Kelas 4–6: Gunakan pertanyaan tingkat tinggi (HOTS), analisis kritis, pemecahan masalah nyata kontekstual, keterkaitan literasi dan numerasi, dan deep learning.

Output harus berupa format JSON murni dengan struktur:
{
  "judul": "LKPD [Mata Pelajaran] - [Topik]",
  "tujuanPembelajaran": ["string", "string"],
  "petunjukMengerjakan": ["string", "string", "string", "string"],
  "alatDanBahan": ["string", "string"],
  "kegiatanPembelajaran": "Penjelasan pengantar kontekstual atau stimulus cerita/fenomena yang ramah anak",
  "langkahAktivitas": [
    { "langkah": 1, "instruksi": "string ringkas", "deskripsi": "string penjelasan" }
  ],
  "pertanyaan": [
    {
      "nomor": 1,
      "tipe": "Pilihan Ganda / Isian / HOTS / dll",
      "pertanyaan": "teks soal",
      "pilihan": ["A...", "B...", "C..."],
      "skorMaksimal": 2
    }
  ],
  "kesimpulan": "Panduan kesimpulan pembelajaran",
  "refleksi": {
    "yangDipelajari": "pertanyaan refleksi apa yang dipelajari",
    "yangDisukai": "pertanyaan refleksi apa yang disukai",
    "yangBelumDipahami": "pertanyaan refleksi apa yang belum dipahami"
  }
}`;

      const responseText = await generateWithGemini(prompt);

      if (responseText) {
        try {
          const parsed = JSON.parse(responseText);
          return res.json({
            success: true,
            data: {
              id: `lkpd-${Date.now()}`,
              judul: parsed.judul || `LKPD ${input.mataPelajaran} - ${input.topik}`,
              identitas: {
                namaSekolah: input.namaSekolah || 'SD Negeri',
                namaGuru: input.namaGuru || 'Guru Pengampu',
                kelas: input.kelas,
                fase: input.fase,
                mataPelajaran: input.mataPelajaran,
                semester: input.semester,
                topik: input.topik,
                alokasiWaktu: input.alokasiWaktu || '2 x 35 Menit',
              },
              tujuanPembelajaran: parsed.tujuanPembelajaran || [input.tujuanPembelajaran],
              petunjukMengerjakan: parsed.petunjukMengerjakan || [
                'Berdoalah sebelum mengerjakan.',
                'Tulis nama dan kelas dengan rapi.',
                'Kerjakan soal secara cermat.',
              ],
              alatDanBahan: parsed.alatDanBahan || ['Alat tulis', 'Buku siswa'],
              kegiatanPembelajaran: parsed.kegiatanPembelajaran || '',
              langkahAktivitas: (parsed.langkahAktivitas || []).map((step: any, idx: number) => ({
                id: `step-${idx + 1}`,
                langkah: step.langkah || idx + 1,
                instruksi: step.instruksi || `Langkah ${idx + 1}`,
                deskripsi: step.deskripsi || '',
              })),
              pertanyaan: (parsed.pertanyaan || []).map((q: any, idx: number) => ({
                id: `q-${idx + 1}`,
                nomor: q.nomor || idx + 1,
                tipe: q.tipe || 'Pertanyaan',
                pertanyaan: q.pertanyaan || '',
                pilihan: q.pilihan || undefined,
                skorMaksimal: q.skorMaksimal || 2,
              })),
              kesimpulan: parsed.kesimpulan || 'Tuliskan kesimpulan kegiatan belajarmu hari ini.',
              refleksi: parsed.refleksi || {
                yangDipelajari: 'Hal penting yang kamu pahami hari ini.',
                yangDisukai: 'Aktivitas yang paling kamu senangi.',
                yangBelumDipahami: 'Bagian yang ingin kamu tanyakan pada guru.',
              },
              tanggalDibuat: new Date().toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              }),
            },
          });
        } catch (jsonErr) {
          console.warn('JSON parse error from AI, using curriculum engine fallback');
        }
      }

      // Seamless fallback to curriculum engine
      const fallbackData = generateFallbackLkpd(input);
      return res.json({
        success: true,
        data: fallbackData,
        source: 'kurikulum_engine',
        notice: 'Disusun otomatis dengan Kurikulum Merdeka Deep Learning Engine.',
      });
    } catch (error: any) {
      console.warn('Fallback applied for LKPD:', error?.message || error);
      const fallbackData = generateFallbackLkpd(input);
      return res.json({
        success: true,
        data: fallbackData,
        source: 'kurikulum_engine',
      });
    }
  });

  // Generate Rubrik Endpoint
  app.post('/api/generate-rubrik', async (req, res) => {
    const { kelas, fase, mataPelajaran, topik, tujuanPembelajaran, jenisTugas, jumlahKriteria, skala, referensiLkpd } = req.body;
    try {
      if (!kelas || !mataPelajaran || !topik) {
        return res.status(400).json({ error: 'Silakan lengkapi data pembelajaran terlebih dahulu.' });
      }

      const prompt = `Anda adalah pakar asesmen dan penilaian Kurikulum Merdeka Sekolah Dasar (SD).
Buatlah Rubrik Penilaian Pembelajaran otentik yang komprehensif, terperinci, dan sangat cocok dengan data ini:
- Kelas: ${kelas} (${fase})
- Mata Pelajaran: ${mataPelajaran}
- Materi/Topik: ${topik}
- Tujuan Pembelajaran: ${tujuanPembelajaran || 'Penguasaan materi'}
- Jenis Tugas: ${jenisTugas || 'LKPD'}
- Jumlah Kriteria: ${jumlahKriteria || 4}
- Skala Penilaian: ${skala || '1–4'}
${referensiLkpd ? `- Konteks Aktivitas LKPD: ${JSON.stringify(referensiLkpd.langkahAktivitas || '')} dan Soal: ${JSON.stringify(referensiLkpd.pertanyaan || '')}` : ''}

Perhatian: Kriteria penilaian harus SANGAT SPESIFIK dan relevan dengan mata pelajaran ${mataPelajaran} dan topik "${topik}".
Jangan gunakan kriteria generik yang selalu sama. Rancang kriteria unik (misalnya jika poster: kesesuaian isi, kreativitas visual, kerapian, pesan; jika matematika: pemahaman konsep, ketepatan berhitung, strategi penyelesaian; jika sains/IPAS: keterampilan mengamati, penalaran logis, penarikan kesimpulan).

Buat deskriptor jelas untuk setiap level (Skor 4 = Sangat Baik, Skor 3 = Baik, Skor 2 = Cukup, Skor 1 = Perlu Bimbingan).

Output berupa JSON dengan format:
{
  "judul": "Rubrik Penilaian [Mata Pelajaran] - [Topik]",
  "kriteriaList": [
    {
      "namaKriteria": "string",
      "deskripsi": "penjelasan aspek yang dinilai",
      "skor4": "deskripsi performa sangat baik",
      "skor3": "deskripsi performa baik",
      "skor2": "deskripsi performa cukup",
      "skor1": "deskripsi performa perlu bimbingan"
    }
  ],
  "kategoriPredikat": {
    "skor4": "Sangat Baik (A)",
    "skor3": "Baik (B)",
    "skor2": "Cukup (C)",
    "skor1": "Perlu Bimbingan (D)"
  }
}`;

      const responseText = await generateWithGemini(prompt);

      if (responseText) {
        try {
          const parsed = JSON.parse(responseText);
          return res.json({
            success: true,
            data: {
              id: `rubrik-${Date.now()}`,
              judul: parsed.judul || `Rubrik Penilaian ${mataPelajaran} - ${topik}`,
              identitas: {
                namaSekolah: 'SD Negeri',
                mataPelajaran,
                kelas,
                fase,
                topik,
                tujuanPembelajaran: tujuanPembelajaran || `Penilaian performa materi "${topik}"`,
                jenisTugas: jenisTugas || 'LKPD',
                skala: skala || '1–4',
              },
              kriteriaList: (parsed.kriteriaList || []).map((k: any, idx: number) => ({
                id: `crit-${idx + 1}`,
                namaKriteria: k.namaKriteria || `Kriteria ${idx + 1}`,
                deskripsi: k.deskripsi || '',
                skor4: k.skor4 || 'Sangat Baik',
                skor3: k.skor3 || 'Baik',
                skor2: k.skor2 || 'Cukup',
                skor1: k.skor1 || 'Perlu Bimbingan',
                skorMaksimal: 4,
              })),
              kategoriPredikat: parsed.kategoriPredikat || {
                skor4: 'Sangat Baik (A)',
                skor3: 'Baik (B)',
                skor2: 'Cukup (C)',
                skor1: 'Perlu Bimbingan (D)',
              },
              tanggalDibuat: new Date().toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              }),
            },
          });
        } catch (jsonErr) {
          console.warn('JSON parse error from AI Rubrik, using curriculum engine fallback');
        }
      }

      // Seamless fallback
      const fallback = generateFallbackRubrik(req.body);
      return res.json({
        success: true,
        data: fallback,
        source: 'kurikulum_engine',
        notice: 'Disusun otomatis dengan Kurikulum Merdeka Deep Learning Engine.',
      });
    } catch (error: any) {
      console.warn('Fallback applied for Rubrik:', error?.message || error);
      const fallback = generateFallbackRubrik(req.body);
      return res.json({
        success: true,
        data: fallback,
        source: 'kurikulum_engine',
      });
    }
  });

  // Regenerate part endpoint
  app.post('/api/regenerate-lkpd', async (req, res) => {
    const { lkpd, reason } = req.body;
    try {
      if (!lkpd || !reason) {
        return res.status(400).json({ error: 'Parameter tidak lengkap' });
      }

      const prompt = `Anda adalah asisten kurikulum SD. Perbarui dokumen LKPD berikut berdasarkan alasan regenerasi: "${reason}".
Dokumen saat ini:
Kelas: ${lkpd.identitas.kelas}
Mata Pelajaran: ${lkpd.identitas.mataPelajaran}
Topik: ${lkpd.identitas.topik}
Petunjuk: ${JSON.stringify(lkpd.petunjukMengerjakan)}
Langkah: ${JSON.stringify(lkpd.langkahAktivitas)}
Pertanyaan: ${JSON.stringify(lkpd.pertanyaan)}

Instruksi perubahan:
Sesuaikan konten agar benar-benar mencerminkan: "${reason}".
Misalnya jika "Lebih HOTS", buat pertanyaan pemecahan masalah kritis yang lebih menantang. Jika "Lebih sederhana", buat bahasa lebih mudah dipahami siswa. Jika "Lebih kontekstual", hubungkan dengan keseharian siswa SD.

Kembalikan dokumen lengkap dalam format JSON yang sama seperti struktur LKPD:
{
  "judul": "...",
  "tujuanPembelajaran": [...],
  "petunjukMengerjakan": [...],
  "alatDanBahan": [...],
  "kegiatanPembelajaran": "...",
  "langkahAktivitas": [{ "langkah": 1, "instruksi": "...", "deskripsi": "..." }],
  "pertanyaan": [{ "nomor": 1, "tipe": "...", "pertanyaan": "...", "pilihan": [...], "skorMaksimal": 2 }],
  "kesimpulan": "...",
  "refleksi": { "yangDipelajari": "...", "yangDisukai": "...", "yangBelumDipahami": "..." }
}`;

      const responseText = await generateWithGemini(prompt);

      if (responseText) {
        try {
          const parsed = JSON.parse(responseText);
          return res.json({
            success: true,
            data: {
              ...lkpd,
              ...parsed,
              identitas: lkpd.identitas,
            },
          });
        } catch (jsonErr) {
          console.warn('JSON parse error from regenerate AI, applying algorithmic regeneration');
        }
      }

      const updated = regenerateFallbackLkpd(lkpd, reason);
      return res.json({
        success: true,
        data: updated,
        source: 'kurikulum_engine',
      });
    } catch (error: any) {
      console.warn('Fallback applied for regenerate-lkpd:', error?.message || error);
      const updated = regenerateFallbackLkpd(lkpd, reason);
      return res.json({
        success: true,
        data: updated,
        source: 'kurikulum_engine',
      });
    }
  });

  // Vite development middleware vs production static
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server Generator LKPD & Rubrik running on http://localhost:${PORT}`);
  });
}

startServer();
