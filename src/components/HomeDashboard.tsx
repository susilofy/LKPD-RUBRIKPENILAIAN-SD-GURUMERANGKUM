import React from 'react';
import {
  FileText,
  CheckSquare,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Download,
  BookOpen,
  Layers,
  GraduationCap,
  Globe,
  ExternalLink,
  Zap,
} from 'lucide-react';

interface HomeDashboardProps {
  onNavigate: (tab: 'beranda' | 'lkpd' | 'rubrik' | 'riwayat' | 'panduan') => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 text-white p-6 sm:p-10 lg:p-14 shadow-xl shadow-blue-900/10">
        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 border border-blue-400/30 text-xs sm:text-sm font-semibold">
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span>Kurikulum Merdeka & Pendekatan Deep Learning</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
            Generator LKPD & Rubrik Penilaian SD
          </h1>

          <p className="text-base sm:text-lg lg:text-xl text-blue-100 font-normal leading-relaxed">
            Solusi praktis untuk guru SD kelas 1–6 dalam membuat LKPD dan rubrik penilaian berbantuan AI. Buat dokumen pembelajaran rapi, kontekstual, dan langsung dapat diunduh ke format Microsoft Word (.docx).
          </p>

          {/* 3 Keunggulan (Checklist) */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-2">
            <div className="flex items-center gap-2 text-white font-medium text-sm sm:text-base">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>Semua Kelas 1–6</span>
            </div>
            <div className="flex items-center gap-2 text-white font-medium text-sm sm:text-base">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>Semua Mata Pelajaran</span>
            </div>
            <div className="flex items-center gap-2 text-white font-medium text-sm sm:text-base">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>Download Word (.docx)</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="pt-4 flex flex-wrap gap-4">
            <button
              id="hero-start-lkpd-btn"
              onClick={() => onNavigate('lkpd')}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-white text-blue-800 font-bold text-base hover:bg-blue-50 hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <span>Mulai Membuat LKPD</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              id="hero-start-rubrik-btn"
              onClick={() => onNavigate('rubrik')}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-blue-600/60 hover:bg-blue-600/80 border border-blue-400/40 text-white font-bold text-base transition-all cursor-pointer"
            >
              <span>Buat Rubrik Penilaian</span>
              <CheckSquare className="w-5 h-5 text-blue-200" />
            </button>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-12 translate-y-12">
          <GraduationCap className="w-96 h-96" />
        </div>
      </section>

      {/* 2 Main Action Cards */}
      <section className="space-y-4">
        <div className="text-center sm:text-left">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Pilihan Menu Utama
          </h2>
          <p className="text-sm text-slate-500">
            Pilih jenis dokumen yang ingin Anda buat untuk pembelajaran hari ini.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card A: Buat LKPD */}
          <div
            id="card-action-lkpd"
            onClick={() => onNavigate('lkpd')}
            className="group relative bg-white rounded-2xl border-2 border-blue-100 hover:border-blue-500 p-6 sm:p-8 transition-all hover:shadow-xl cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors shadow-sm">
                <FileText className="w-7 h-7" />
              </div>
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
                  Menu A
                </span>
                <h3 className="text-2xl font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                  BUAT LKPD
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Susun Lembar Kerja Peserta Didik lengkap dengan Capaian Pembelajaran (CP), Tujuan Pembelajaran (TP), aktivitas konkret, pertanyaan HOTS, literasi, numerasi, dan refleksi siswa.
                </p>
              </div>

              <div className="pt-2 flex flex-wrap gap-2 text-xs font-semibold text-slate-500">
                <span className="px-2.5 py-1 bg-slate-100 rounded-md">Kelas 1–6</span>
                <span className="px-2.5 py-1 bg-slate-100 rounded-md">17+ Jenis Aktivitas</span>
                <span className="px-2.5 py-1 bg-slate-100 rounded-md">Editor & Word Export</span>
              </div>
            </div>

            <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between text-blue-700 font-bold text-sm">
              <span>Buka Generator LKPD</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </div>

          {/* Card B: Buat Rubrik Penilaian */}
          <div
            id="card-action-rubrik"
            onClick={() => onNavigate('rubrik')}
            className="group relative bg-white rounded-2xl border-2 border-indigo-100 hover:border-indigo-500 p-6 sm:p-8 transition-all hover:shadow-xl cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors shadow-sm">
                <CheckSquare className="w-7 h-7" />
              </div>
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">
                  Menu B
                </span>
                <h3 className="text-2xl font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">
                  BUAT RUBRIK PENILAIAN
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Rancang rubrik penilaian otentik dengan skala 1–4 atau skala kustom, indikator deskriptif per level, dan kalkulator nilai otomatis untuk kemudahan asesmen formatif maupun sumatif.
                </p>
              </div>

              <div className="pt-2 flex flex-wrap gap-2 text-xs font-semibold text-slate-500">
                <span className="px-2.5 py-1 bg-slate-100 rounded-md">Kriteria Relevan</span>
                <span className="px-2.5 py-1 bg-slate-100 rounded-md">Kalkulator Nilai</span>
                <span className="px-2.5 py-1 bg-slate-100 rounded-md">Tautkan ke LKPD</span>
              </div>
            </div>

            <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between text-indigo-700 font-bold text-sm">
              <span>Buka Generator Rubrik</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="bg-blue-50/70 rounded-3xl p-6 sm:p-8 border border-blue-100">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Zap className="w-5 h-5 text-blue-700" />
          <span>Dirancang Khusus untuk Kebutuhan Guru Sekolah Dasar</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-5 border border-blue-100 shadow-sm space-y-2">
            <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Fase A, B, dan C</h3>
            <p className="text-xs sm:text-sm text-slate-600">
              Bahasa dan kedalaman soal secara otomatis disesuaikan dengan fase peserta didik: konkret dan visual untuk kelas bawah (1–3), analitis dan HOTS untuk kelas atas (4–6).
            </p>
          </div>

          <div className="bg-white rounded-xl p-5 border border-blue-100 shadow-sm space-y-2">
            <div className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
              <Download className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">File Word Asli (.docx)</h3>
            <p className="text-xs sm:text-sm text-slate-600">
              Hasil unduhan berformat dokumen Microsoft Word (.docx) ukuran A4 rapi, lengkap dengan kop sekolah, tabel tidak terpotong, dan siap dicetak atau diedit lebih lanjut.
            </p>
          </div>

          <div className="bg-white rounded-xl p-5 border border-blue-100 shadow-sm space-y-2">
            <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Penyimpanan & Duplikasi</h3>
            <p className="text-xs sm:text-sm text-slate-600">
              Simpan dokumen ke riwayat lokal Anda. Guru dapat menduplikat LKPD kelas 5 menjadi kelas 6 hanya dengan satu klik tombol Duplikat.
            </p>
          </div>
        </div>
      </section>

      {/* Section: Tentang Pengembang */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
              Tentang Pengembang
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
              Susilo Fitri Yatmoko, M.Pd
            </h3>
            <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
              Aplikasi <strong>Generator LKPD & Rubrik Penilaian SD</strong> ini didedikasikan untuk mempermudah bapak dan ibu guru di seluruh Indonesia dalam merancang administrasi pembelajaran Kurikulum Merdeka yang berkualitas, berpusat pada siswa, dan hemat waktu.
            </p>
          </div>

          <div className="shrink-0">
            <a
              id="dev-profile-site-link"
              href="https://www.gurumerangkum.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 text-white font-semibold text-sm hover:bg-slate-800 transition-colors shadow-sm"
            >
              <Globe className="w-4 h-4 text-blue-400" />
              <span>Kunjungi www.gurumerangkum.com</span>
              <ExternalLink className="w-4 h-4 text-slate-400" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
