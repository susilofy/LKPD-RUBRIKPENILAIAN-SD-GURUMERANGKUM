import { SavedDocument, LkpdContent, RubrikContent } from '../types';

const STORAGE_KEY = 'generator_lkpd_rubrik_sd_docs_v1';

const INITIAL_DOCS: SavedDocument[] = [
  {
    id: 'doc-seed-1',
    namaDokumen: 'LKPD Kelas 4 IPAS - Fotosintesis Proses Penting di Bumi',
    title: 'LKPD Kelas 4 IPAS - Fotosintesis Proses Penting di Bumi',
    tipe: 'LKPD + Rubrik',
    type: 'lkpd',
    tanggalDibuat: '18 September 2026',
    createdAt: '18 September 2026',
    terakhirDiubah: '18 September 2026',
    kelas: 'Kelas 4',
    fase: 'Fase B',
    mataPelajaran: 'IPAS',
    topik: 'Fotosintesis Proses Penting di Bumi',
    lkpdData: {
      id: 'lkpd-seed-1',
      judul: 'LKPD IPAS - Fotosintesis Proses Penting di Bumi',
      identitas: {
        namaSekolah: 'SD Negeri Sukamaju',
        namaGuru: 'Susilo Fitri Yatmoko, M.Pd',
        kelas: 'Kelas 4',
        fase: 'Fase B',
        mataPelajaran: 'IPAS',
        semester: '1',
        topik: 'Fotosintesis Proses Penting di Bumi',
        alokasiWaktu: '2 x 35 Menit',
      },
      tujuanPembelajaran: [
        'Peserta didik dapat memahami kebutuhan tumbuhan untuk melakukan fotosintesis serta hasil dari proses tersebut.',
        'Peserta didik dapat menganalisis pentingnya fotosintesis bagi kelangsungan makhluk hidup di bumi secara bernalar kritis.',
      ],
      petunjukMengerjakan: [
        'Berdoalah sebelum memulai kegiatan belajar bersama kelompokmu.',
        'Tuliskan identitas nama kelompok dan anggota secara lengkap.',
        'Lakukan pengamatan dan diskusikan setiap pertanyaan secara aktif dan santun.',
        'Tanyakan kepada guru apabila mengalami kesulitan.',
      ],
      alatDanBahan: [
        'Daun segar berwarna hijau',
        'Gelas beker atau toples bening berisi air',
        'Kaca pembesar (lup)',
        'Buku IPAS Kelas 4 Kurikulum Merdeka',
      ],
      kegiatanPembelajaran:
        'Pernahkah kamu berpikir bagaimana tumbuhan makan? Berbeda dengan manusia dan hewan, tumbuhan dapat memasak makanannya sendiri melalui proses fotosintesis dengan bantuan cahaya matahari, air, karbon dioksida, dan klorofil.',
      langkahAktivitas: [
        {
          id: 'step-1',
          langkah: 1,
          instruksi: 'Ayo Mengamati Gelembung Udara',
          deskripsi: 'Letakkan daun segar ke dalam toples berisi air di bawah sinar matahari selama 15 menit. Amati apakah muncul gelembung udara kecil di sekitar permukaan daun.',
        },
        {
          id: 'step-2',
          langkah: 2,
          instruksi: 'Diskusi Kelompok (Deep Learning)',
          deskripsi: 'Diskusikan apa arti munculnya gelembung udara tersebut dan gas apa yang dilepaskan tumbuhan.',
        },
      ],
      pertanyaan: [
        {
          id: 'q-1',
          nomor: 1,
          tipe: 'Pilihan Ganda',
          pertanyaan: 'Zat hijau daun yang berfungsi menyerap energi cahaya matahari dalam fotosintesis disebut...',
          pilihan: ['Klorofil', 'Oksigen', 'Karbon Dioksida', 'Glukosa'],
          skorMaksimal: 1,
        },
        {
          id: 'q-2',
          nomor: 2,
          tipe: 'Isian',
          pertanyaan: 'Dua bahan utama yang diserap tumbuhan dari lingkungan untuk fotosintesis adalah air dan ..........',
          skorMaksimal: 2,
        },
        {
          id: 'q-3',
          nomor: 3,
          tipe: 'HOTS & Analisis Kasus',
          pertanyaan: 'Apa yang akan terjadi pada kehidupan manusia dan hewan jika semua tumbuhan di bumi ditebang habis dan tidak bisa berfotosintesis? Jelaskan alasan logismu!',
          skorMaksimal: 4,
        },
      ],
      kesimpulan:
        'Fotosintesis adalah proses tumbuhan hijau menghasilkan oksigen dan makanan (karbohidrat) menggunakan energi cahaya matahari. Tanpa fotosintesis, rantai makanan dan ketersediaan oksigen di bumi akan terganggu.',
      refleksi: {
        yangDipelajari: 'Saya belajar proses fotosintesis dan bahan-bahan yang dibutuhkan tumbuhan.',
        yangDisukai: 'Mengamati daun di dalam air dan melihat gelembung udara oksigen.',
        yangBelumDipahami: 'Bagaimana daun menyimpan cadangan makanan di akar dan buah.',
      },
      tanggalDibuat: '18 September 2026',
    },
    rubrikData: {
      id: 'rubrik-seed-1',
      judul: 'Rubrik Penilaian IPAS - Fotosintesis',
      identitas: {
        namaSekolah: 'SD Negeri Sukamaju',
        mataPelajaran: 'IPAS',
        kelas: 'Kelas 4',
        fase: 'Fase B',
        topik: 'Fotosintesis Proses Penting di Bumi',
        tujuanPembelajaran: 'Menilai pemahaman konsep fotosintesis dan kemampuan bernalar kritis peserta didik.',
        jenisTugas: 'LKPD',
        skala: '1–4',
      },
      kriteriaList: [
        {
          id: 'crit-1',
          namaKriteria: 'Pemahaman Konsep Fotosintesis',
          deskripsi: 'Ketepatan menguraikan bahan baku dan hasil proses fotosintesis.',
          skor4: 'Menjelaskan seluruh komponen fotosintesis dengan sangat tepat, lengkap, dan runtut.',
          skor3: 'Menjelaskan sebagian besar komponen fotosintesis dengan benar.',
          skor2: 'Menjelaskan konsep namun masih ada kekeliruan antara bahan baku dan hasil.',
          skor1: 'Belum memahami konsep dasar fotosintesis.',
          skorMaksimal: 4,
        },
        {
          id: 'crit-2',
          namaKriteria: 'Penalaran Kritis (HOTS)',
          deskripsi: 'Kemampuan menganalisis dampak ketiadaan tumbuhan bagi bumi.',
          skor4: 'Mampu memberikan analisis mendalam, menghubungkan rantai makanan dan siklus oksigen secara logis.',
          skor3: 'Memberikan analisis dampak yang logis dengan penjelasan cukup.',
          skor2: 'Hanya menyebutkan satu dampak sederhana tanpa argumen pendukung.',
          skor1: 'Belum mampu menyampaikan dampak yang relevan.',
          skorMaksimal: 4,
        },
        {
          id: 'crit-3',
          namaKriteria: 'Kerja Sama Kelompok',
          deskripsi: 'Keaktifan berpartisipasi dan berbagi tugas selama diskusi.',
          skor4: 'Sangat aktif berdiskusi, saling menghargai pendapat, dan membagi tugas secara merata.',
          skor3: 'Aktif berpartisipasi dan bekerja sama dengan baik.',
          skor2: 'Kurang aktif dan hanya bergantung pada salah satu teman.',
          skor1: 'Pasif dan tidak berkontribusi dalam kelompok.',
          skorMaksimal: 4,
        },
      ],
      kategoriPredikat: {
        skor4: 'Sangat Baik (A)',
        skor3: 'Baik (B)',
        skor2: 'Cukup (C)',
        skor1: 'Perlu Bimbingan (D)',
      },
      tanggalDibuat: '18 September 2026',
    },
  },
  {
    id: 'doc-seed-2',
    namaDokumen: 'LKPD Kelas 2 Matematika - Menjumlahkan Bilangan Sampai 50',
    title: 'LKPD Kelas 2 Matematika - Menjumlahkan Bilangan Sampai 50',
    tipe: 'LKPD',
    type: 'lkpd',
    tanggalDibuat: '15 September 2026',
    createdAt: '15 September 2026',
    terakhirDiubah: '15 September 2026',
    kelas: 'Kelas 2',
    fase: 'Fase A',
    mataPelajaran: 'Matematika',
    topik: 'Menjumlahkan Bilangan Sampai 50 dengan Benda Konkret',
    lkpdData: {
      id: 'lkpd-seed-2',
      judul: 'LKPD Matematika - Menjumlahkan Bilangan Sampai 50',
      identitas: {
        namaSekolah: 'SD Negeri Teladan',
        namaGuru: 'Susilo Fitri Yatmoko, M.Pd',
        kelas: 'Kelas 2',
        fase: 'Fase A',
        mataPelajaran: 'Matematika',
        semester: '1',
        topik: 'Menjumlahkan Bilangan Sampai 50',
        alokasiWaktu: '2 x 35 Menit',
      },
      tujuanPembelajaran: [
        'Peserta didik dapat menghitung penjumlahan dua bilangan cacah sampai dengan 50 menggunakan bantuan benda konkret dan gambar.',
        'Peserta didik dapat memecahkan cerita matematika sederhana yang sering dijumpai sehari-hari.',
      ],
      petunjukMengerjakan: [
        'Ayo berdoa bersama sebelum mulai belajar.',
        'Tuliskan nama panggilan dan nomormu di atas kertas.',
        'Hitunglah benda dan gambar dengan gembira dan teliti.',
        'Bila ada yang bingung, angkat tangan dan panggil bapak/ibu guru ya!',
      ],
      alatDanBahan: ['Sedotan warna-warni / stik es krim', 'Kartu angka', 'Pensil dan penghapus'],
      kegiatanPembelajaran:
        'Ayo kita bermain toko buah bersama teman! Ibu guru membawa 15 apel merah dan 12 jeruk manis di keranjang. Berapakah jumlah seluruh buah di keranjang?',
      langkahAktivitas: [
        {
          id: 'step-1',
          langkah: 1,
          instruksi: 'Kumpulkan Stik Es Krim',
          deskripsi: 'Ambil stik es krim sebanyak bilangan puluhan dan satuan sesuai instruksi pada kartu soal.',
        },
        {
          id: 'step-2',
          langkah: 2,
          instruksi: 'Gabungkan dan Hitung Bersama',
          deskripsi: 'Gabungkan kelompok puluhan dan satuan, lalu hitung jumlah seluruh stik es krim.',
        },
      ],
      pertanyaan: [
        {
          id: 'q-1',
          nomor: 1,
          tipe: 'Pilihan Ganda Bergambar',
          pertanyaan: 'Budi memiliki 20 kelereng. Ayah memberi Budi 15 kelereng lagi. Berapa banyak kelereng Budi sekarang?',
          pilihan: ['35 kelereng', '25 kelereng', '30 kelereng'],
          skorMaksimal: 1,
        },
        {
          id: 'q-2',
          nomor: 2,
          tipe: 'Isian Singkat',
          pertanyaan: 'Hasil dari 24 + 13 = ...........',
          skorMaksimal: 2,
        },
        {
          id: 'q-3',
          nomor: 3,
          tipe: 'Soal Cerita Konkret',
          pertanyaan: 'Di kebun ada 18 bunga mawar dan 11 bunga melati. Berapa jumlah semua bunga di kebun? Tuliskan cara menghitungnya!',
          skorMaksimal: 3,
        },
      ],
      kesimpulan: 'Menjumlahkan bilangan lebih mudah jika kita mengelompokkan puluhan dan satuannya terlebih dahulu.',
      refleksi: {
        yangDipelajari: 'Belajar menghitung tambah-tambahan memakai stik es krim.',
        yangDisukai: 'Bermain peran toko buah bersama teman sebangku.',
        yangBelumDipahami: 'Menghitung cepat bilangan yang lebih dari 40.',
      },
      tanggalDibuat: '15 September 2026',
    },
  },
];

export function getSavedDocuments(): SavedDocument[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DOCS));
      return INITIAL_DOCS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load saved docs', err);
    return INITIAL_DOCS;
  }
}

export function saveDocument(doc: SavedDocument): void {
  try {
    const current = getSavedDocuments();
    const existingIdx = current.findIndex((d) => d.id === doc.id);
    if (existingIdx >= 0) {
      current[existingIdx] = {
        ...doc,
        terakhirDiubah: new Date().toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        }),
      };
    } else {
      current.unshift(doc);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  } catch (err) {
    console.error('Failed to save doc', err);
  }
}

export function deleteDocument(id: string): SavedDocument[] {
  try {
    const current = getSavedDocuments();
    const filtered = current.filter((d) => d.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return filtered;
  } catch (err) {
    console.error('Failed to delete doc', err);
    return [];
  }
}

export function duplicateDocument(id: string): SavedDocument | null {
  try {
    const current = getSavedDocuments();
    const target = current.find((d) => d.id === id);
    if (!target) return null;

    const cloned: SavedDocument = JSON.parse(JSON.stringify(target));
    cloned.id = `doc-copy-${Date.now()}`;
    cloned.namaDokumen = `${target.namaDokumen} (Salinan)`;
    cloned.tanggalDibuat = new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    cloned.terakhirDiubah = cloned.tanggalDibuat;

    if (cloned.lkpdData) {
      cloned.lkpdData.id = `lkpd-${Date.now()}`;
      cloned.lkpdData.judul = `${cloned.lkpdData.judul} (Salinan)`;
    }
    if (cloned.rubrikData) {
      cloned.rubrikData.id = `rubrik-${Date.now()}`;
      cloned.rubrikData.judul = `${cloned.rubrikData.judul} (Salinan)`;
    }

    current.unshift(cloned);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
    return cloned;
  } catch (err) {
    console.error('Failed to duplicate doc', err);
    return null;
  }
}
