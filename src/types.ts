export type KelasSD = 'Kelas 1' | 'Kelas 2' | 'Kelas 3' | 'Kelas 4' | 'Kelas 5' | 'Kelas 6';
export type FaseSD = 'Fase A' | 'Fase B' | 'Fase C';
export type SemesterSD = '1' | '2';
export type TingkatKesulitan = 'Mudah' | 'Sedang' | 'Sulit' | 'Campuran';
export type KarakterLkpd = 'Individu' | 'Kelompok' | 'Individu dan kelompok';

export interface LkpdFormInput {
  // A. Identitas Pembelajaran
  namaSekolah: string;
  namaGuru: string;
  kelas: KelasSD;
  fase: FaseSD;
  mataPelajaran: string;
  semester: SemesterSD;
  topik: string;
  alokasiWaktu: string;

  // B. Komponen Pembelajaran
  capaianPembelajaran: string;
  tujuanPembelajaran: string;
  indikatorKetercapaian: string;
  modelPembelajaran: string;
  profilKarakter: string;
  sumberBelajar: string;
  alatDanBahan: string;

  // C. Aktivitas LKPD
  jenisAktivitas: string[];
  jumlahSoal: number;
  tingkatKesulitan: TingkatKesulitan;
  karakterLkpd: KarakterLkpd;
}

export interface QuestionItem {
  id: string;
  nomor: number;
  tipe: string; // e.g. 'Pilihan Ganda', 'Isian', 'Uraian / Analisis', 'Mencocokkan', 'HOTS'
  pertanyaan: string;
  pilihan?: string[]; // Untuk pilihan ganda
  kunciAtauPanduan?: string;
  skorMaksimal?: number;
}

export interface ActivityStep {
  id: string;
  langkah: number;
  instruksi: string;
  deskripsi: string;
}

export interface LkpdContent {
  id: string;
  judul: string;
  identitas: {
    namaSekolah: string;
    namaGuru: string;
    kelas: KelasSD;
    fase: FaseSD;
    mataPelajaran: string;
    semester: SemesterSD;
    topik: string;
    alokasiWaktu: string;
  };
  tujuanPembelajaran: string[];
  petunjukMengerjakan: string[];
  alatDanBahan: string[];
  kegiatanPembelajaran: string; // Konsep singkat / stimulus kontekstual
  langkahAktivitas: ActivityStep[];
  pertanyaan: QuestionItem[];
  kesimpulan: string;
  refleksi: {
    yangDipelajari: string;
    yangDisukai: string;
    yangBelumDipahami: string;
  };
  tanggalDibuat: string;
}

export type SkalaRubrik = '1–4' | '1–5' | '1–10' | 'Custom';
export type JenisTugasRubrik = 
  | 'LKPD'
  | 'Praktik'
  | 'Proyek'
  | 'Presentasi'
  | 'Diskusi'
  | 'Produk'
  | 'Unjuk kerja'
  | 'Portofolio'
  | 'Lainnya';

export interface RubrikKriteria {
  id: string;
  namaKriteria: string;
  deskripsi: string;
  skor4: string; // Sangat Baik
  skor3: string; // Baik
  skor2: string; // Cukup
  skor1: string; // Perlu Bimbingan
  skorMaksimal?: number;
}

export interface RubrikContent {
  id: string;
  judul: string;
  identitas: {
    namaSekolah: string;
    mataPelajaran: string;
    kelas: KelasSD;
    fase: FaseSD;
    topik: string;
    tujuanPembelajaran: string;
    jenisTugas: JenisTugasRubrik;
    skala: SkalaRubrik;
  };
  kriteriaList: RubrikKriteria[];
  kategoriPredikat: {
    skor4: string;
    skor3: string;
    skor2: string;
    skor1: string;
  };
  tanggalDibuat: string;
  referensiLkpdId?: string;
}

export type RubrikItem = RubrikKriteria;

export interface SavedDocument {
  id: string;
  namaDokumen?: string;
  title: string;
  tipe?: 'LKPD' | 'Rubrik' | 'LKPD + Rubrik';
  type: 'lkpd' | 'rubrik';
  tanggalDibuat?: string;
  createdAt: string;
  terakhirDiubah?: string;
  kelas: KelasSD | string;
  fase?: FaseSD | string;
  mataPelajaran: string;
  topik: string;
  lkpdData?: LkpdContent;
  rubrikData?: RubrikContent;
}

export type RegenerateOption =
  | 'Lebih sederhana'
  | 'Lebih menantang'
  | 'Lebih HOTS'
  | 'Lebih kreatif'
  | 'Lebih kontekstual'
  | 'Sesuaikan dengan kelas'
  | 'Ubah aktivitas';
