import React from 'react';
import {
  BookOpen,
  Sparkles,
  Lightbulb,
  CheckCircle2,
  HelpCircle,
  Download,
  GraduationCap,
  Globe,
  ExternalLink,
  Target,
  Smile,
  BrainCircuit,
} from 'lucide-react';

export const GuideView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Title */}
      <div className="text-center sm:text-left space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Panduan Guru: Penyusunan LKPD & Rubrik Penilaian SD
        </h1>
        <p className="text-sm text-slate-600">
          Pedoman praktis menyusun instrumen pembelajaran berorientasi Kurikulum Merdeka dan Pembelajaran Mendalam (Deep Learning).
        </p>
      </div>

      {/* 1. Pembagian Fase di SD */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
          <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
            1
          </div>
          <h2 className="text-lg font-bold text-slate-900">
            Karakteristik Fase Peserta Didik SD (Kurikulum Merdeka)
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm">
          <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 space-y-2">
            <span className="font-extrabold text-amber-900 block text-sm">
              Fase A (Kelas 1 & 2 SD)
            </span>
            <p className="text-slate-700 leading-relaxed">
              Fokus pada tahap berpikir <strong>konkret</strong>, visual, permainan edukatif, dan instruksi sederhana. Perbanyak aktivitas mengamati gambar, mencocokkan, mewarnai, serta stimulasi literasi awal (bunyi suku kata) dan numerasi konkret.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 space-y-2">
            <span className="font-extrabold text-blue-900 block text-sm">
              Fase B (Kelas 3 & 4 SD)
            </span>
            <p className="text-slate-700 leading-relaxed">
              Peralihan berpikir semi-konkret menuju logis. Mulai diajak bereksperimen sederhana, membaca teks informatif pendek, diskusi kelompok kecil, serta menyelesaikan soal pemecahan masalah (Problem Solving) kontekstual.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-2">
            <span className="font-extrabold text-emerald-900 block text-sm">
              Fase C (Kelas 5 & 6 SD)
            </span>
            <p className="text-slate-700 leading-relaxed">
              Kesiapan berpikir abstrak dan analitis. Menekankan pertanyaan <strong>HOTS</strong> (analisis, evaluasi, kreasi), proyek investigasi mandiri/kelompok, riset lingkungan sekitar, serta presentasi hasil karya.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Pendekatan Deep Learning */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
            2
          </div>
          <h2 className="text-lg font-bold text-slate-900">
            Pendekatan Pembelajaran Mendalam (Deep Learning) di SD
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Deep Learning di Sekolah Dasar bertujuan agar peserta didik tidak sekadar menghafal fakta, melainkan memahami makna esensial konsep dan mampu menerapkannya dalam kehidupan sehari-hari melalui 3 pilar:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm pt-1">
          <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-200 space-y-1.5">
            <div className="flex items-center gap-2 text-indigo-800 font-bold">
              <BrainCircuit className="w-4 h-4 text-indigo-600" />
              <span>Mindful Learning</span>
            </div>
            <p className="text-slate-600">
              Siswa diajak fokus, sadar penuh, memahami tujuan belajarnya, dan aktif merefleksikan proses belajar sendiri.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 space-y-1.5">
            <div className="flex items-center gap-2 text-blue-800 font-bold">
              <Target className="w-4 h-4 text-blue-600" />
              <span>Meaningful Learning</span>
            </div>
            <p className="text-slate-600">
              Materi selalu dikaitkan dengan pengalaman nyata siswa, fenomena lingkungan hidup, dan masalah di sekitar mereka.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200 space-y-1.5">
            <div className="flex items-center gap-2 text-rose-800 font-bold">
              <Smile className="w-4 h-4 text-rose-600" />
              <span>Joyful Learning</span>
            </div>
            <p className="text-slate-600">
              Suasana belajar menggembirakan, menantang rasa ingin tahu anak secara positif tanpa tekanan atau kebosanan.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Struktur Dokumen Word (.docx) */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            3
          </div>
          <h2 className="text-lg font-bold text-slate-900">
            Panduan Ekspor Microsoft Word (.docx)
          </h2>
        </div>

        <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>Dokumen yang diunduh berformat <strong>.docx asli</strong> (standar ISO OpenXML) yang dapat dibuka langsung di Microsoft Word, WPS Office, LibreOffice, maupun Google Docs tanpa peringatan file rusak.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>Format kertas otomatis <strong>A4</strong> dengan margin standar, font formal rapi (Calibri/Arial), tabel proporsional dengan kolom deskriptif, dan footer pengembang resmi.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>Guru dapat mengunduh <strong>LKPD saja</strong>, <strong>Rubrik saja</strong>, atau dokumen <strong>LKPD + Rubrik Terpadu</strong> dalam satu file Word sekaligus.</span>
          </li>
        </ul>
      </section>

      {/* Profil Pengembang */}
      <section className="bg-gradient-to-r from-slate-900 to-blue-950 text-white rounded-2xl p-6 sm:p-8 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left">
          <span className="text-xs uppercase tracking-wider text-blue-300 font-bold">
            Pengembang Aplikasi
          </span>
          <h3 className="text-xl sm:text-2xl font-bold">Susilo Fitri Yatmoko, M.Pd</h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Praktisi dan pemerhati pendidikan dasar. Menghadirkan berbagai ragam materi, modul ajar, dan media pembelajaran bermakna untuk kemajuan guru Indonesia di portal Gurumerangkum.
          </p>
        </div>

        <a
          href="https://www.gurumerangkum.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 text-white font-bold text-xs sm:text-sm hover:bg-blue-500 transition-colors shadow-md"
        >
          <Globe className="w-4 h-4" />
          <span>www.gurumerangkum.com</span>
          <ExternalLink className="w-3.5 h-3.5 text-blue-200" />
        </a>
      </section>
    </div>
  );
};
