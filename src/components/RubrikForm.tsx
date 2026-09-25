import React, { useState } from 'react';
import {
  CheckSquare,
  Sparkles,
  AlertCircle,
  GraduationCap,
  Layers,
  BookOpen,
  Target,
  ListOrdered,
  Sliders,
  Zap,
} from 'lucide-react';
import { KelasSD, FaseSD, JenisTugasRubrik, SkalaRubrik, LkpdContent } from '../types';

interface RubrikFormProps {
  initialData?: {
    kelas?: KelasSD;
    fase?: FaseSD;
    mataPelajaran?: string;
    topik?: string;
    tujuanPembelajaran?: string;
    jenisTugas?: JenisTugasRubrik;
    jumlahKriteria?: number;
    skala?: SkalaRubrik;
    referensiLkpd?: LkpdContent;
  };
  onGenerate: (data: any) => void;
  isLoading: boolean;
}

const ALL_SUBJECTS = [
  'Pendidikan Agama & Budi Pekerti',
  'Pendidikan Pancasila',
  'Bahasa Indonesia',
  'Matematika',
  'IPAS (Ilmu Pengetahuan Alam & Sosial)',
  'PJOK (Pendidikan Jasmani, Olahraga, & Kesehatan)',
  'Seni Rupa',
  'Seni Musik',
  'Seni Tari',
  'Seni Teater',
  'Bahasa Inggris',
  'Muatan Lokal (Bahasa Daerah)',
  'Lainnya',
];

const JENIS_TUGAS_OPTIONS: JenisTugasRubrik[] = [
  'LKPD',
  'Praktik',
  'Proyek',
  'Presentasi',
  'Diskusi',
  'Produk',
  'Unjuk kerja',
  'Portofolio',
  'Lainnya',
];

export const RubrikForm: React.FC<RubrikFormProps> = ({ initialData, onGenerate, isLoading }) => {
  const [kelas, setKelas] = useState<KelasSD>(initialData?.kelas || 'Kelas 4');
  const [fase, setFase] = useState<FaseSD>(initialData?.fase || 'Fase B');
  const [mataPelajaran, setMataPelajaran] = useState(initialData?.mataPelajaran || 'IPAS (Ilmu Pengetahuan Alam & Sosial)');
  const [customSubject, setCustomSubject] = useState('');
  const [topik, setTopik] = useState(initialData?.topik || '');
  const [tujuanPembelajaran, setTujuanPembelajaran] = useState(initialData?.tujuanPembelajaran || '');
  const [jenisTugas, setJenisTugas] = useState<JenisTugasRubrik>(initialData?.jenisTugas || 'LKPD');
  const [jumlahKriteria, setJumlahKriteria] = useState<number>(initialData?.jumlahKriteria || 4);
  const [customKriteriaCount, setCustomKriteriaCount] = useState<number>(6);
  const [isCustomKriteria, setIsCustomKriteria] = useState(false);
  const [skala, setSkala] = useState<SkalaRubrik>(initialData?.skala || '1–4');

  const [validationError, setValidationError] = useState<string | null>(null);

  const handleKelasChange = (newKelas: KelasSD) => {
    setKelas(newKelas);
    if (newKelas === 'Kelas 1' || newKelas === 'Kelas 2') setFase('Fase A');
    else if (newKelas === 'Kelas 3' || newKelas === 'Kelas 4') setFase('Fase B');
    else if (newKelas === 'Kelas 5' || newKelas === 'Kelas 6') setFase('Fase C');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const effectiveSubject = mataPelajaran === 'Lainnya' ? customSubject.trim() : mataPelajaran;

    if (!kelas || !effectiveSubject || !topik.trim()) {
      setValidationError('Silakan lengkapi data pembelajaran terlebih dahulu. (Kelas, Mata Pelajaran, dan Topik wajib diisi)');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setValidationError(null);

    const finalCount = isCustomKriteria ? customKriteriaCount : jumlahKriteria;

    onGenerate({
      kelas,
      fase,
      mataPelajaran: effectiveSubject,
      topik: topik.trim(),
      tujuanPembelajaran: tujuanPembelajaran.trim(),
      jenisTugas,
      jumlahKriteria: finalCount,
      skala,
      referensiLkpd: initialData?.referensiLkpd,
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Title */}
      <div className="mb-6 text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Generator Rubrik Penilaian SD
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Rancang instrumen penilaian otentik Kurikulum Merdeka yang relevan dengan tugas dan mata pelajaran kelas 1 sampai 6.
        </p>
      </div>

      {/* Referensi LKPD notice if provided */}
      {initialData?.referensiLkpd && (
        <div className="mb-6 p-4 rounded-2xl bg-blue-50 border border-blue-200 flex items-start gap-3 text-blue-950 text-xs sm:text-sm">
          <Sparkles className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block">Tersambung dengan LKPD:</span>
            <span>{initialData.referensiLkpd.judul}. AI akan membuat kriteria penilaian yang langsung mencerminkan butir aktivitas dalam LKPD tersebut.</span>
          </div>
        </div>
      )}

      {/* Validation Error Banner */}
      {validationError && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border-2 border-red-300 flex items-start gap-3 text-red-800 text-sm font-semibold">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>{validationError}</div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {/* 1. Kelas */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                1. Kelas <span className="text-red-500">*</span>
              </label>
              <select
                id="rubrik-select-kelas"
                value={kelas}
                onChange={(e) => handleKelasChange(e.target.value as KelasSD)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 bg-white"
              >
                <option value="Kelas 1">Kelas 1</option>
                <option value="Kelas 2">Kelas 2</option>
                <option value="Kelas 3">Kelas 3</option>
                <option value="Kelas 4">Kelas 4</option>
                <option value="Kelas 5">Kelas 5</option>
                <option value="Kelas 6">Kelas 6</option>
              </select>
            </div>

            {/* 2. Fase */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                2. Fase Kurikulum Merdeka
              </label>
              <select
                id="rubrik-select-fase"
                value={fase}
                onChange={(e) => setFase(e.target.value as FaseSD)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 bg-slate-50"
              >
                <option value="Fase A">Fase A (Kelas 1–2 SD)</option>
                <option value="Fase B">Fase B (Kelas 3–4 SD)</option>
                <option value="Fase C">Fase C (Kelas 5–6 SD)</option>
              </select>
            </div>

            {/* 3. Mata Pelajaran */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                3. Mata Pelajaran <span className="text-red-500">*</span>
              </label>
              <select
                id="rubrik-select-mapel"
                value={mataPelajaran}
                onChange={(e) => setMataPelajaran(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 bg-white"
              >
                {ALL_SUBJECTS.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>

              {mataPelajaran === 'Lainnya' && (
                <input
                  type="text"
                  value={customSubject}
                  onChange={(e) => setCustomSubject(e.target.value)}
                  placeholder="Nama mata pelajaran..."
                  className="mt-2 w-full px-3.5 py-2 rounded-xl border border-indigo-300 text-sm"
                />
              )}
            </div>

            {/* 6. Jenis Tugas */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                6. Jenis Tugas
              </label>
              <select
                id="rubrik-select-jenis-tugas"
                value={jenisTugas}
                onChange={(e) => setJenisTugas(e.target.value as JenisTugasRubrik)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 bg-white"
              >
                {JENIS_TUGAS_OPTIONS.map((jt) => (
                  <option key={jt} value={jt}>
                    {jt}
                  </option>
                ))}
              </select>
            </div>

            {/* 4. Topik / Materi */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                4. Materi / Topik Pembelajaran <span className="text-red-500">*</span>
              </label>
              <input
                id="rubrik-input-topik"
                type="text"
                value={topik}
                onChange={(e) => setTopik(e.target.value)}
                placeholder="Contoh: Membuat Poster Menjaga Kebersihan Lingkungan, atau Fotosintesis"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
                required
              />
            </div>

            {/* 5. Tujuan Pembelajaran */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                5. Tujuan Pembelajaran (Opsional)
              </label>
              <textarea
                id="rubrik-input-tp"
                rows={2}
                value={tujuanPembelajaran}
                onChange={(e) => setTujuanPembelajaran(e.target.value)}
                placeholder="Tuliskan tujuan pembelajaran yang dinilai..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            {/* 7. Jumlah Kriteria */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                7. Jumlah Kriteria Penilaian
              </label>
              <div className="flex gap-2">
                {[3, 4, 5].map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => {
                      setJumlahKriteria(count);
                      setIsCustomKriteria(false);
                    }}
                    className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-all ${
                      !isCustomKriteria && jumlahKriteria === count
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {count} Kriteria
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setIsCustomKriteria(true)}
                  className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-all ${
                    isCustomKriteria
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  Custom
                </button>
              </div>

              {isCustomKriteria && (
                <input
                  type="number"
                  min={2}
                  max={8}
                  value={customKriteriaCount}
                  onChange={(e) => setCustomKriteriaCount(Number(e.target.value))}
                  className="mt-2 w-full px-3.5 py-2 rounded-xl border border-indigo-300 text-sm"
                  placeholder="Jumlah kriteria (2–8)..."
                />
              )}
            </div>

            {/* 8. Skala Penilaian */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                8. Skala Penilaian
              </label>
              <select
                id="rubrik-select-skala"
                value={skala}
                onChange={(e) => setSkala(e.target.value as SkalaRubrik)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 bg-white"
              >
                <option value="1–4">Skala 1–4 (Sangat Baik s.d Perlu Bimbingan)</option>
                <option value="1–5">Skala 1–5</option>
                <option value="1–10">Skala 1–10</option>
                <option value="Custom">Custom</option>
              </select>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            id="generate-rubrik-btn"
            disabled={isLoading}
            className={`w-full py-4 px-6 rounded-2xl font-bold text-base sm:text-lg flex items-center justify-center gap-3 transition-all cursor-pointer shadow-lg ${
              isLoading
                ? 'bg-slate-400 text-white cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/30 hover:shadow-xl hover:scale-[1.01] active:scale-[0.99]'
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                <span>Menyusun Rubrik Penilaian dengan AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-yellow-300" />
                <span>GENERATE RUBRIK PENILAIAN</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
