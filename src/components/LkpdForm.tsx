import React, { useState } from 'react';
import {
  Sparkles,
  School,
  User,
  GraduationCap,
  BookOpen,
  Calendar,
  Clock,
  Target,
  Wrench,
  HelpCircle,
  AlertCircle,
  Zap,
} from 'lucide-react';
import { LkpdFormInput, KelasSD, FaseSD, SemesterSD, TingkatKesulitan, KarakterLkpd } from '../types';

interface LkpdFormProps {
  initialData?: Partial<LkpdFormInput>;
  onGenerate: (data: LkpdFormInput) => void;
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

const ALL_ACTIVITIES = [
  'Pilihan ganda',
  'Isian',
  'Menjodohkan',
  'Benar/Salah',
  'Uraian',
  'Mengamati',
  'Mengelompokkan',
  'Mencocokkan',
  'Eksperimen',
  'Praktik',
  'Diskusi kelompok',
  'Proyek',
  'Pemecahan masalah',
  'Literasi',
  'Numerasi',
  'HOTS',
  'Aktivitas kreatif',
];

export const LkpdForm: React.FC<LkpdFormProps> = ({ initialData, onGenerate, isLoading }) => {
  const [formData, setFormData] = useState<LkpdFormInput>({
    namaSekolah: initialData?.namaSekolah || 'SD Negeri Favorit',
    namaGuru: initialData?.namaGuru || '',
    kelas: initialData?.kelas || 'Kelas 4',
    fase: initialData?.fase || 'Fase B',
    mataPelajaran: initialData?.mataPelajaran || 'IPAS (Ilmu Pengetahuan Alam & Sosial)',
    semester: initialData?.semester || '1',
    topik: initialData?.topik || '',
    alokasiWaktu: initialData?.alokasiWaktu || '2 x 35 Menit',

    capaianPembelajaran: initialData?.capaianPembelajaran || '',
    tujuanPembelajaran: initialData?.tujuanPembelajaran || '',
    indikatorKetercapaian: initialData?.indikatorKetercapaian || '',
    modelPembelajaran: initialData?.modelPembelajaran || 'Problem-Based Learning (PBL)',
    profilKarakter: initialData?.profilKarakter || 'Bernalar Kritis, Mandiri, Gotong Royong',
    sumberBelajar: initialData?.sumberBelajar || 'Buku Siswa IPAS Kelas 4 Kurikulum Merdeka, Lingkungan Sekitar',
    alatDanBahan: initialData?.alatDanBahan || 'Kertas gambar, pensil warna, lup, lembar observasi',

    jenisAktivitas: initialData?.jenisAktivitas && initialData.jenisAktivitas.length > 0
      ? initialData.jenisAktivitas
      : ['Mengamati', 'Literasi', 'Diskusi kelompok', 'HOTS', 'Uraian'],
    jumlahSoal: initialData?.jumlahSoal || 4,
    tingkatKesulitan: initialData?.tingkatKesulitan || 'Sedang',
    karakterLkpd: initialData?.karakterLkpd || 'Individu dan kelompok',
  });

  const [customSubject, setCustomSubject] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  // Auto-sync Fase when Kelas changes
  const handleKelasChange = (newKelas: KelasSD) => {
    let newFase: FaseSD = 'Fase B';
    if (newKelas === 'Kelas 1' || newKelas === 'Kelas 2') newFase = 'Fase A';
    else if (newKelas === 'Kelas 3' || newKelas === 'Kelas 4') newFase = 'Fase B';
    else if (newKelas === 'Kelas 5' || newKelas === 'Kelas 6') newFase = 'Fase C';

    setFormData((prev) => ({
      ...prev,
      kelas: newKelas,
      fase: newFase,
    }));
  };

  const handleActivityToggle = (activity: string) => {
    setFormData((prev) => {
      const exists = prev.jenisAktivitas.includes(activity);
      if (exists) {
        return {
          ...prev,
          jenisAktivitas: prev.jenisAktivitas.filter((a) => a !== activity),
        };
      } else {
        return {
          ...prev,
          jenisAktivitas: [...prev.jenisAktivitas, activity],
        };
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const effectiveSubject = formData.mataPelajaran === 'Lainnya' ? customSubject.trim() : formData.mataPelajaran;
    if (!formData.kelas || !effectiveSubject || !formData.topik.trim()) {
      setValidationError('Silakan lengkapi data pembelajaran terlebih dahulu. (Kelas, Mata Pelajaran, dan Topik wajib diisi)');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setValidationError(null);
    onGenerate({
      ...formData,
      mataPelajaran: effectiveSubject,
    });
  };

  // Quick Preset Handlers
  const loadPreset = (preset: 'ipas4' | 'matematika2' | 'indo1' | 'pancasila5') => {
    if (preset === 'ipas4') {
      setFormData({
        namaSekolah: 'SD Negeri Sukamaju',
        namaGuru: 'Susilo Fitri Yatmoko, M.Pd',
        kelas: 'Kelas 4',
        fase: 'Fase B',
        mataPelajaran: 'IPAS (Ilmu Pengetahuan Alam & Sosial)',
        semester: '1',
        topik: 'Fotosintesis dan Daur Hidup Tumbuhan di Bumi',
        alokasiWaktu: '2 x 35 Menit',
        capaianPembelajaran: 'Peserta didik menganalisis hubungan antara bentuk serta fungsi bagian tubuh pada tumbuhan dan proses fotosintesis.',
        tujuanPembelajaran: 'Peserta didik dapat mengidentifikasi kebutuhan tumbuhan dalam proses fotosintesis serta mendeskripsikan dampaknya bagi kehidupan bumi.',
        indikatorKetercapaian: 'Menjelaskan 4 bahan utama fotosintesis dan menghasilkan argumen logis mengenai pentingnya oksigen bagi makhluk hidup.',
        modelPembelajaran: 'Problem-Based Learning (PBL)',
        profilKarakter: 'Bernalar Kritis, Gotong Royong, Mandiri',
        sumberBelajar: 'Buku Siswa IPAS Kelas 4 Kemendikbud, Lingkungan Halaman Sekolah',
        alatDanBahan: 'Daun hijau segar, gelas kaca bening, air, kaca pembesar',
        jenisAktivitas: ['Mengamati', 'Eksperimen', 'Diskusi kelompok', 'HOTS', 'Uraian'],
        jumlahSoal: 4,
        tingkatKesulitan: 'Sedang',
        karakterLkpd: 'Individu dan kelompok',
      });
    } else if (preset === 'matematika2') {
      setFormData({
        namaSekolah: 'SD Negeri Teladan',
        namaGuru: 'Guru Kelas 2',
        kelas: 'Kelas 2',
        fase: 'Fase A',
        mataPelajaran: 'Matematika',
        semester: '1',
        topik: 'Penjumlahan Bilangan Cacah Sampai 50 dengan Benda Nyata',
        alokasiWaktu: '2 x 35 Menit',
        capaianPembelajaran: 'Peserta didik menunjukkan pemahaman dan intuisi bilangan pada bilangan cacah sampai 100 serta melakukan operasi penjumlahan.',
        tujuanPembelajaran: 'Peserta didik mampu menghitung hasil penjumlahan dua bilangan hingga 50 dengan bantuan stik dan gambar benda.',
        indikatorKetercapaian: 'Menghitung secara tepat penjumlahan tanpa menyimpan dan dengan menyimpan sederhana.',
        modelPembelajaran: 'Discovery Learning dengan Pendekatan Konkret-Piktorial-Abstrak (CPA)',
        profilKarakter: 'Mandiri, Teliti, Bernalar Kritis',
        sumberBelajar: 'Buku Siswa Matematika Kelas 2 Kurikulum Merdeka',
        alatDanBahan: 'Stik es krim berwarna, kelereng, kartu angka',
        jenisAktivitas: ['Pilihan ganda', 'Isian', 'Mencocokkan', 'Aktivitas kreatif', 'Numerasi'],
        jumlahSoal: 4,
        tingkatKesulitan: 'Mudah',
        karakterLkpd: 'Individu',
      });
    } else if (preset === 'indo1') {
      setFormData({
        namaSekolah: 'SD Harapan Bangsa',
        namaGuru: 'Guru Kelas 1',
        kelas: 'Kelas 1',
        fase: 'Fase A',
        mataPelajaran: 'Bahasa Indonesia',
        semester: '1',
        topik: 'Mengenal Bunyi Huruf dan Suku Kata \'ba-bi-bu-be-bo\'',
        alokasiWaktu: '2 x 35 Menit',
        capaianPembelajaran: 'Peserta didik bersikap menjadi pendengar penuh perhatian dan mampu mengenali bunyi huruf serta membaca suku kata sederhana.',
        tujuanPembelajaran: 'Peserta didik dapat merangkai huruf b dengan huruf vokal menjadi suku kata dan kata bermakna (buku, bola, baju).',
        indikatorKetercapaian: 'Mencocokkan gambar dengan suku kata awal yang sesuai secara lisan dan tulisan.',
        modelPembelajaran: 'Permainan Bahasa (Game-Based Learning)',
        profilKarakter: 'Kreatif, Percaya Diri, Mandiri',
        sumberBelajar: 'Buku Bahasa Indonesia Kelas 1, Kartu Huruf Bergambar',
        alatDanBahan: 'Kartu gambar kata benda, spidol warna, lembar tebak kata',
        jenisAktivitas: ['Mengamati', 'Menjodohkan', 'Mencocokkan', 'Literasi', 'Aktivitas kreatif'],
        jumlahSoal: 4,
        tingkatKesulitan: 'Mudah',
        karakterLkpd: 'Individu',
      });
    } else if (preset === 'pancasila5') {
      setFormData({
        namaSekolah: 'SD Nusantara Merdeka',
        namaGuru: 'Susilo Fitri Yatmoko, M.Pd',
        kelas: 'Kelas 5',
        fase: 'Fase C',
        mataPelajaran: 'Pendidikan Pancasila',
        semester: '1',
        topik: 'Penerapan Nilai-Nilai Pancasila dalam Kehidupan Bermasyarakat',
        alokasiWaktu: '2 x 35 Menit',
        capaianPembelajaran: 'Peserta didik memahami dan menyajikan contoh perilaku yang sesuai dengan sila-sila Pancasila dalam kehidupan sehari-hari.',
        tujuanPembelajaran: 'Peserta didik dapat menganalisis studi kasus nyata di lingkungan sekitar dan merumuskan aksi gotong royong sesuai nilai Pancasila.',
        indikatorKetercapaian: 'Mampu menghubungkan 5 kasus sosial dengan sila Pancasila yang relevan serta merancang solusi perbaikan.',
        modelPembelajaran: 'Project-Based Learning & Diskusi Reflektif',
        profilKarakter: 'Berkebinekaan Global, Gotong Royong, Bernalar Kritis',
        sumberBelajar: 'Buku Pendidikan Pancasila Kelas 5, Artikel Cerita Inspiratif',
        alatDanBahan: 'Kertas karton manila, sticky notes, lembar kasus bergambar',
        jenisAktivitas: ['Pemecahan masalah', 'Diskusi kelompok', 'Proyek', 'HOTS', 'Uraian'],
        jumlahSoal: 4,
        tingkatKesulitan: 'Sedang',
        karakterLkpd: 'Individu dan kelompok',
      });
    }
    setValidationError(null);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Title & Description */}
      <div className="mb-6 text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Formulir Pembuatan LKPD
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Lengkapi identitas, komponen pembelajaran, dan aktivitas. AI akan menyusun Lembar Kerja Peserta Didik terstruktur dengan Kurikulum Merdeka.
        </p>
      </div>

      {/* Quick Example Presets */}
      <div className="mb-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200/80">
        <div className="flex items-center gap-2 text-xs font-bold text-blue-900 uppercase tracking-wider mb-2.5">
          <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
          <span>Isi Cepat dengan Contoh Kurikulum Merdeka (1-Klik):</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => loadPreset('ipas4')}
            className="px-3 py-1.5 bg-white hover:bg-blue-600 hover:text-white text-blue-800 text-xs font-semibold rounded-lg border border-blue-200 transition-all shadow-xs"
          >
            🌱 Kelas 4: IPAS (Fotosintesis)
          </button>
          <button
            type="button"
            onClick={() => loadPreset('matematika2')}
            className="px-3 py-1.5 bg-white hover:bg-blue-600 hover:text-white text-blue-800 text-xs font-semibold rounded-lg border border-blue-200 transition-all shadow-xs"
          >
            🔢 Kelas 2: Matematika (Penjumlahan)
          </button>
          <button
            type="button"
            onClick={() => loadPreset('indo1')}
            className="px-3 py-1.5 bg-white hover:bg-blue-600 hover:text-white text-blue-800 text-xs font-semibold rounded-lg border border-blue-200 transition-all shadow-xs"
          >
            📖 Kelas 1: Bahasa Indonesia (Suku Kata)
          </button>
          <button
            type="button"
            onClick={() => loadPreset('pancasila5')}
            className="px-3 py-1.5 bg-white hover:bg-blue-600 hover:text-white text-blue-800 text-xs font-semibold rounded-lg border border-blue-200 transition-all shadow-xs"
          >
            🇮🇩 Kelas 5: Pendidikan Pancasila
          </button>
        </div>
      </div>

      {/* Validation Error Banner */}
      {validationError && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border-2 border-red-300 flex items-start gap-3 text-red-800 text-sm font-semibold">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>{validationError}</div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* ========================================== */}
        {/* A. IDENTITAS PEMBELAJARAN */}
        {/* ========================================== */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              A
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Identitas Pembelajaran</h2>
              <p className="text-xs text-slate-500">Informasi utama sekolah, guru, kelas, fase, dan topik materi.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {/* 1. Nama Sekolah */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                1. Nama Sekolah
              </label>
              <div className="relative">
                <School className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  id="input-nama-sekolah"
                  type="text"
                  value={formData.namaSekolah}
                  onChange={(e) => setFormData({ ...formData, namaSekolah: e.target.value })}
                  placeholder="Contoh: SD Negeri 1 Sukamaju"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>
            </div>

            {/* 2. Nama Guru */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                2. Nama Guru
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  id="input-nama-guru"
                  type="text"
                  value={formData.namaGuru}
                  onChange={(e) => setFormData({ ...formData, namaGuru: e.target.value })}
                  placeholder="Contoh: Susilo Fitri Yatmoko, M.Pd"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>
            </div>

            {/* 3. Kelas */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                3. Kelas <span className="text-red-500">*</span>
              </label>
              <select
                id="select-kelas"
                value={formData.kelas}
                onChange={(e) => handleKelasChange(e.target.value as KelasSD)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:border-blue-600 focus:ring-2 focus:ring-blue-100 bg-white transition-all"
              >
                <option value="Kelas 1">Kelas 1 (Fase A)</option>
                <option value="Kelas 2">Kelas 2 (Fase A)</option>
                <option value="Kelas 3">Kelas 3 (Fase B)</option>
                <option value="Kelas 4">Kelas 4 (Fase B)</option>
                <option value="Kelas 5">Kelas 5 (Fase C)</option>
                <option value="Kelas 6">Kelas 6 (Fase C)</option>
              </select>
            </div>

            {/* 4. Fase */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                4. Fase Kurikulum Merdeka
              </label>
              <select
                id="select-fase"
                value={formData.fase}
                onChange={(e) => setFormData({ ...formData, fase: e.target.value as FaseSD })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:border-blue-600 focus:ring-2 focus:ring-blue-100 bg-slate-50 transition-all"
              >
                <option value="Fase A">Fase A (Kelas 1–2 SD)</option>
                <option value="Fase B">Fase B (Kelas 3–4 SD)</option>
                <option value="Fase C">Fase C (Kelas 5–6 SD)</option>
              </select>
            </div>

            {/* 5. Mata Pelajaran */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                5. Mata Pelajaran <span className="text-red-500">*</span>
              </label>
              <select
                id="select-mapel"
                value={formData.mataPelajaran}
                onChange={(e) => setFormData({ ...formData, mataPelajaran: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:border-blue-600 focus:ring-2 focus:ring-blue-100 bg-white transition-all"
              >
                {ALL_SUBJECTS.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>

              {formData.mataPelajaran === 'Lainnya' && (
                <input
                  type="text"
                  value={customSubject}
                  onChange={(e) => setCustomSubject(e.target.value)}
                  placeholder="Ketik nama mata pelajaran..."
                  className="mt-2 w-full px-3.5 py-2 rounded-xl border border-blue-300 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              )}
            </div>

            {/* 6. Semester */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                6. Semester
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  id="semester-1-btn"
                  onClick={() => setFormData({ ...formData, semester: '1' })}
                  className={`py-2.5 px-4 rounded-xl text-sm font-bold border transition-all ${
                    formData.semester === '1'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  Semester 1 (Ganjil)
                </button>
                <button
                  type="button"
                  id="semester-2-btn"
                  onClick={() => setFormData({ ...formData, semester: '2' })}
                  className={`py-2.5 px-4 rounded-xl text-sm font-bold border transition-all ${
                    formData.semester === '2'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  Semester 2 (Genap)
                </button>
              </div>
            </div>

            {/* 7. Topik / Materi */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                7. Topik / Materi Pembelajaran <span className="text-red-500">*</span>
              </label>
              <input
                id="input-topik"
                type="text"
                value={formData.topik}
                onChange={(e) => setFormData({ ...formData, topik: e.target.value })}
                placeholder="Contoh: Fotosintesis Proses Penting di Bumi, atau Pecahan Senilai"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                required
              />
            </div>

            {/* 8. Alokasi Waktu */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                8. Alokasi Waktu
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  id="input-alokasi-waktu"
                  type="text"
                  value={formData.alokasiWaktu}
                  onChange={(e) => setFormData({ ...formData, alokasiWaktu: e.target.value })}
                  placeholder="Contoh: 2 x 35 Menit (1 Pertemuan)"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ========================================== */}
        {/* B. KOMPONEN PEMBELAJARAN */}
        {/* ========================================== */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
              B
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Komponen Pembelajaran</h2>
              <p className="text-xs text-slate-500">Capaian, tujuan, indikator ketercapaian, karakter, dan sarana belajar.</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* 9. Capaian Pembelajaran */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                9. Capaian Pembelajaran (CP)
              </label>
              <textarea
                id="input-cp"
                rows={2}
                value={formData.capaianPembelajaran}
                onChange={(e) => setFormData({ ...formData, capaianPembelajaran: e.target.value })}
                placeholder="Tuliskan elemen CP atau biarkan AI membantu merumuskannya..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* 10. Tujuan Pembelajaran */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                10. Tujuan Pembelajaran (TP)
              </label>
              <textarea
                id="input-tp"
                rows={2}
                value={formData.tujuanPembelajaran}
                onChange={(e) => setFormData({ ...formData, tujuanPembelajaran: e.target.value })}
                placeholder="Contoh: Melalui pengamatan, peserta didik mampu mengidentifikasi proses fotosintesis dengan bernalar kritis."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* 11. Indikator / Kriteria Ketercapaian */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                11. Indikator / Kriteria Ketercapaian (KKTP)
              </label>
              <input
                id="input-kktp"
                type="text"
                value={formData.indikatorKetercapaian}
                onChange={(e) => setFormData({ ...formData, indikatorKetercapaian: e.target.value })}
                placeholder="Contoh: Mampu menyebutkan 4 komponen fotosintesis dan menyimpulkan peran cahaya matahari."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* 12. Model/Metode Pembelajaran */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  12. Model / Metode Pembelajaran
                </label>
                <input
                  id="input-model"
                  type="text"
                  value={formData.modelPembelajaran}
                  onChange={(e) => setFormData({ ...formData, modelPembelajaran: e.target.value })}
                  placeholder="Contoh: Problem-Based Learning (PBL), Discovery, Eksperimen"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* 13. Profil Pelajar Pancasila / Karakter */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  13. Profil / Karakter yang Dikembangkan
                </label>
                <input
                  id="input-profil"
                  type="text"
                  value={formData.profilKarakter}
                  onChange={(e) => setFormData({ ...formData, profilKarakter: e.target.value })}
                  placeholder="Contoh: Bernalar Kritis, Mandiri, Gotong Royong"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* 14. Sumber Belajar */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  14. Sumber Belajar
                </label>
                <input
                  id="input-sumber-belajar"
                  type="text"
                  value={formData.sumberBelajar}
                  onChange={(e) => setFormData({ ...formData, sumberBelajar: e.target.value })}
                  placeholder="Contoh: Buku Siswa Kemendikbudristek, Lingkungan Sekitar"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* 15. Alat dan Bahan */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  15. Alat dan Bahan
                </label>
                <input
                  id="input-alat-bahan"
                  type="text"
                  value={formData.alatDanBahan}
                  onChange={(e) => setFormData({ ...formData, alatDanBahan: e.target.value })}
                  placeholder="Contoh: Daun hijau, air, wadah bening, alat tulis"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ========================================== */}
        {/* C. AKTIVITAS LKPD */}
        {/* ========================================== */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              C
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Aktivitas LKPD</h2>
              <p className="text-xs text-slate-500">Pilih ragam aktivitas yang akan dikerjakan siswa (dapat memilih lebih dari satu).</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Pilihan Jenis Aktivitas (Checkboxes) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                Pilih Jenis Aktivitas / Bentuk Soal (Pilih Beberapa):
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                {ALL_ACTIVITIES.map((act) => {
                  const isChecked = formData.jenisAktivitas.includes(act);
                  return (
                    <label
                      key={act}
                      className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs sm:text-sm font-medium cursor-pointer transition-all ${
                        isChecked
                          ? 'bg-blue-50 border-blue-500 text-blue-900 shadow-xs'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleActivityToggle(act)}
                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                      />
                      <span className="truncate">{act}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              {/* 16. Jumlah Aktivitas / Soal */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  16. Jumlah Soal / Aktivitas
                </label>
                <select
                  id="select-jumlah-soal"
                  value={formData.jumlahSoal}
                  onChange={(e) => setFormData({ ...formData, jumlahSoal: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:border-blue-600 focus:ring-2 focus:ring-blue-100 bg-white"
                >
                  <option value={3}>3 Aktivitas/Soal (Ringkas)</option>
                  <option value={4}>4 Aktivitas/Soal (Ideal)</option>
                  <option value={5}>5 Aktivitas/Soal (Lengkap)</option>
                  <option value={6}>6 Aktivitas/Soal (Mendalam)</option>
                  <option value={8}>8 Aktivitas/Soal (Komprehensif)</option>
                </select>
              </div>

              {/* 17. Tingkat Kesulitan */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  17. Tingkat Kesulitan
                </label>
                <select
                  id="select-kesulitan"
                  value={formData.tingkatKesulitan}
                  onChange={(e) => setFormData({ ...formData, tingkatKesulitan: e.target.value as TingkatKesulitan })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:border-blue-600 focus:ring-2 focus:ring-blue-100 bg-white"
                >
                  <option value="Mudah">Mudah</option>
                  <option value="Sedang">Sedang (Rekomendasi)</option>
                  <option value="Sulit">Sulit</option>
                  <option value="Campuran">Campuran (Gradual)</option>
                </select>
              </div>

              {/* 18. Karakter LKPD */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  18. Karakter LKPD
                </label>
                <select
                  id="select-karakter"
                  value={formData.karakterLkpd}
                  onChange={(e) => setFormData({ ...formData, karakterLkpd: e.target.value as KarakterLkpd })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:border-blue-600 focus:ring-2 focus:ring-blue-100 bg-white"
                >
                  <option value="Individu">Individu (Mandiri)</option>
                  <option value="Kelompok">Kelompok (Kolaboratif)</option>
                  <option value="Individu dan kelompok">Individu & Kelompok (Campuran)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            id="generate-lkpd-btn"
            disabled={isLoading}
            className={`w-full py-4 px-6 rounded-2xl font-bold text-base sm:text-lg flex items-center justify-center gap-3 transition-all cursor-pointer shadow-lg ${
              isLoading
                ? 'bg-slate-400 text-white cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/30 hover:shadow-xl hover:scale-[1.01] active:scale-[0.99]'
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                <span>Sedang Menyusun LKPD Otomatis...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-yellow-300" />
                <span>GENERATE LKPD</span>
              </>
            )}
          </button>
          <p className="text-center text-xs text-slate-500 mt-2">
            Materi disesuaikan dengan fase perkembangan peserta didik Kurikulum Merdeka.
          </p>
        </div>
      </form>
    </div>
  );
};
