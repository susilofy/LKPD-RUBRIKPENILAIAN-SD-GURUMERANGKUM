import { LkpdContent, LkpdFormInput, RubrikContent, RegenerateOption } from '../types';

export function generateFallbackLkpd(input: LkpdFormInput, customPromptNote?: string): LkpdContent {
  const isLowerGrade = input.kelas === 'Kelas 1' || input.kelas === 'Kelas 2' || input.kelas === 'Kelas 3';
  const isGroup = input.karakterLkpd === 'Kelompok' || input.karakterLkpd === 'Individu dan kelompok';

  const title = `LKPD ${input.mataPelajaran} - ${input.topik}`;

  // Objectives
  const tujuan: string[] = [];
  if (input.tujuanPembelajaran) {
    tujuan.push(input.tujuanPembelajaran);
  } else {
    tujuan.push(
      isLowerGrade
        ? `Peserta didik mampu mengenali dan menceritakan kembali konsep dasar "${input.topik}" melalui pengamatan langsung.`
        : `Peserta didik mampu menganalisis, menyelesaikan permasalahan terstruktur, dan merefleksikan konsep "${input.topik}" secara mendalam (deep learning).`
    );
  }
  tujuan.push(
    isLowerGrade
      ? `Peserta didik dapat menunjukkan rasa ingin tahu dan sikap mandiri selama proses belajar.`
      : `Peserta didik dapat berkolaborasi, bernalar kritis, dan mengomunikasikan hasil temuan dengan tepat.`
  );

  // Instructions
  const petunjuk: string[] = [
    isLowerGrade
      ? 'Berdoalah sebelum memulai kegiatan bersama bapak/ibu guru dan teman-teman.'
      : 'Mulailah dengan membaca doa dan mencermati tujuan pembelajaran dengan teliti.',
    isLowerGrade
      ? 'Tuliskan nama lengkap dan kelasmu pada tempat yang sudah disediakan.'
      : 'Isi identitas diri/kelompok secara lengkap pada lembar kerja.',
    isLowerGrade
      ? 'Ikuti petunjuk langkah demi langkah dengan tertib dan ceria.'
      : 'Lakukan pengamatan dan diskusikan setiap pertanyaan secara bernalar kritis.',
    'Tanyakan kepada guru jika ada hal atau instruksi yang belum kamu pahami.',
    'Periksa kembali seluruh hasil pekerjaanmu sebelum dikumpulkan.',
  ];

  // Activities
  const steps = isLowerGrade
    ? [
        {
          id: 'step-1',
          langkah: 1,
          instruksi: 'Ayo Mengamati Gambar dan Benda Nyata',
          deskripsi: `Perhatikan benda atau peristiwa di sekitarmu yang berkaitan dengan "${input.topik}". Ceritakan apa yang kamu lihat kepada teman sebangkumu.`,
        },
        {
          id: 'step-2',
          langkah: 2,
          instruksi: 'Ayo Mencoba dan Menemukan',
          deskripsi: `Lakukan eksplorasi sederhana menggunakan alat dan bahan (${input.alatDanBahan || 'pensil warna, kartu kata, benda konkret'}).`,
        },
        {
          id: 'step-3',
          langkah: 3,
          instruksi: 'Ayo Berkreasi Bersama',
          deskripsi: `Tuliskan atau gambarkan hasil pengamatanmu pada kotak aktivitas yang tersedia.`,
        },
      ]
    : [
        {
          id: 'step-1',
          langkah: 1,
          instruksi: 'Orientasi Masalah & Literasi Awal',
          deskripsi: `Cermati narasi kasus kontekstual terkait "${input.topik}". Identifikasi data, fakta, serta permasalahan utama yang muncul.`,
        },
        {
          id: 'step-2',
          langkah: 2,
          instruksi: isGroup ? 'Penyelidikan Berkelompok (Kolaborasi)' : 'Analisis & Pengumpulan Data',
          deskripsi: `Kumpulkan data pendukung dari sumber belajar (${input.sumberBelajar || 'Buku Paket, Modul, Internet'}). Diskusikan strategi pemecahan masalah yang paling efisien.`,
        },
        {
          id: 'step-3',
          langkah: 3,
          instruksi: 'Sintesis Solusi & Pembuktian',
          deskripsi: `Ujilah solusi yang kelompokmu rancang, lalu rumuskan argumen logis berdasarkan bukti-bukti yang didapatkan.`,
        },
      ];

  // Questions tailored to grade
  const questions = [];
  const qCount = Math.max(3, Math.min(input.jumlahSoal || 4, 8));

  for (let i = 1; i <= qCount; i++) {
    if (isLowerGrade) {
      if (i === 1) {
        questions.push({
          id: `q-${i}`,
          nomor: i,
          tipe: 'Pilihan Ganda',
          pertanyaan: `Berdasarkan pengamatanmu tentang "${input.topik}", manakah pernyataan yang paling tepat di bawah ini?`,
          pilihan: [
            `Pilihan A: Pernyataan sesuai pengamatan langsung`,
            `Pilihan B: Pernyataan yang kurang sesuai`,
            `Pilihan C: Pernyataan yang tidak sesuai`,
          ],
          skorMaksimal: 1,
        });
      } else if (i === 2) {
        questions.push({
          id: `q-${i}`,
          nomor: i,
          tipe: 'Isian Singkat',
          pertanyaan: `Lengkapilah kalimat berikut: Ketika mempelajari "${input.topik}", hal yang paling penting diperhatikan adalah ............`,
          skorMaksimal: 2,
        });
      } else if (i === 3) {
        questions.push({
          id: `q-${i}`,
          nomor: i,
          tipe: 'Menjodohkan / Mengelompokkan',
          pertanyaan: `Hubungkan dengan garis antara ciri-ciri atau contoh di sebelah kiri dengan kelompok yang tepat di sebelah kanan!`,
          skorMaksimal: 2,
        });
      } else {
        questions.push({
          id: `q-${i}`,
          nomor: i,
          tipe: 'Aktivitas Kreatif & Uraian Sederhana',
          pertanyaan: `Gambarkan atau ceritakan pengalaman serumu saat mempraktikkan materi "${input.topik}" hari ini!`,
          skorMaksimal: 3,
        });
      }
    } else {
      // Kelas 4-6 (Deep Learning & HOTS)
      if (i === 1) {
        questions.push({
          id: `q-${i}`,
          nomor: i,
          tipe: 'Literasi & Pemahaman Konseptual',
          pertanyaan: `Berdasarkan teks pengantar dan fenomena kontekstual materi "${input.topik}", jelaskan hubungan sebab-akibat yang terjadi dengan kata-katamu sendiri!`,
          skorMaksimal: 3,
        });
      } else if (i === 2) {
        questions.push({
          id: `q-${i}`,
          nomor: i,
          tipe: 'Numerasi & Analisis Data',
          pertanyaan: `Apabila terjadi perubahan kondisi atau variabel pada situasi "${input.topik}", prediksikan dampaknya dan buktikan dengan perhitungan/analisis data yang logis!`,
          skorMaksimal: 4,
        });
      } else if (i === 3) {
        questions.push({
          id: `q-${i}`,
          nomor: i,
          tipe: 'HOTS (Pemecahan Masalah Kritis)',
          pertanyaan: `Temukan 1 masalah nyata di lingkungan sekolah atau masyarakat terkait topik ini, lalu rancanglah ide kreatif dan solutif untuk mengatasinya!`,
          skorMaksimal: 4,
        });
      } else {
        questions.push({
          id: `q-${i}`,
          nomor: i,
          tipe: 'Evaluasi & Refleksi Kritis',
          pertanyaan: `Bagaimana caramu membuktikan bahwa kesimpulan yang kamu peroleh sudah valid dan dapat dipertanggungjawabkan? Jelaskan argumenmu!`,
          skorMaksimal: 4,
        });
      }
    }
  }

  return {
    id: `lkpd-${Date.now()}`,
    judul: title,
    identitas: {
      namaSekolah: input.namaSekolah || 'SD Negeri Favorit',
      namaGuru: input.namaGuru || 'Guru Kelas SD',
      kelas: input.kelas,
      fase: input.fase,
      mataPelajaran: input.mataPelajaran,
      semester: input.semester,
      topik: input.topik,
      alokasiWaktu: input.alokasiWaktu || '2 x 35 Menit',
    },
    tujuanPembelajaran: tujuan,
    petunjukMengerjakan: petunjuk,
    alatDanBahan: input.alatDanBahan ? input.alatDanBahan.split(',').map((s) => s.trim()) : ['Buku Siswa', 'Lembar Kerja', 'Alat Tulis'],
    kegiatanPembelajaran: `Pembelajaran berfokus pada topik "${input.topik}". Peserta didik diajak mengeksplorasi konsep melalui pendekatan Kurikulum Merdeka yang menyenangkan, bermakna, dan berpusat pada murid (deep learning). ${
      customPromptNote ? `Catatan penyesuaian: ${customPromptNote}.` : ''
    }`,
    langkahAktivitas: steps,
    pertanyaan: questions,
    kesimpulan: `Berdasarkan seluruh proses penyelidikan dan pembelajaran pada materi "${input.topik}", kami menyimpulkan bahwa konsep ini sangat erat kaitannya dengan kehidupan sehari-hari dan membantu kami dalam menyelesaikan tantangan nyata.`,
    refleksi: {
      yangDipelajari: `Hari ini saya telah belajar mengenai konsep "${input.topik}" secara runtut dan bermakna.`,
      yangDisukai: `Bagian yang paling menyenangkan adalah saat berdiskusi, bereksperimen, dan memecahkan soal secara mandiri maupun bersama teman.`,
      yangBelumDipahami: `Saya ingin terus berlatih dan mendiskusikan bagian yang masih memerlukan latihan lebih lanjut.`,
    },
    tanggalDibuat: new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }),
  };
}

export function generateFallbackRubrik(
  arg1: any,
  arg2?: string,
  arg3?: string,
  arg4?: string,
  arg5?: string,
  arg6: any = 'LKPD',
  arg7 = 4
): RubrikContent {
  let kelas = 'Kelas 4';
  let fase = 'Fase B';
  let mataPelajaran = 'IPAS';
  let topik = 'Materi Belajar';
  let tujuanPembelajaran = '';
  let jenisTugas: any = 'LKPD';
  let jumlahKriteria = 4;
  let skala = '1–4';

  if (typeof arg1 === 'object' && arg1 !== null) {
    kelas = arg1.kelas || kelas;
    fase = arg1.fase || fase;
    mataPelajaran = arg1.mataPelajaran || mataPelajaran;
    topik = arg1.topik || topik;
    tujuanPembelajaran = arg1.tujuanPembelajaran || '';
    jenisTugas = arg1.jenisTugas || 'LKPD';
    jumlahKriteria = arg1.jumlahKriteria || 4;
    skala = arg1.skala || '1–4';
  } else {
    kelas = arg1 || kelas;
    fase = arg2 || fase;
    mataPelajaran = arg3 || mataPelajaran;
    topik = arg4 || topik;
    tujuanPembelajaran = arg5 || '';
    jenisTugas = arg6 || 'LKPD';
    jumlahKriteria = arg7 || 4;
  }
  const kriteriaPool = [
    {
      namaKriteria: 'Pemahaman Materi',
      deskripsi: `Kemampuan menguasai dan menjelaskan konsep dasar materi "${topik}".`,
      skor4: 'Menunjukkan pemahaman konsep yang sangat mendalam, akurat, dan mampu mengaitkan dengan contoh kontekstual.',
      skor3: 'Menunjukkan pemahaman konsep yang baik dan tepat dengan sedikit bimbingan.',
      skor2: 'Menunjukkan pemahaman konsep yang cukup, namun masih terdapat beberapa kekeliruan.',
      skor1: 'Belum memahami konsep dasar dan membutuhkan bimbingan intensif dari guru.',
    },
    {
      namaKriteria: 'Ketepatan Jawaban & Prosedur',
      deskripsi: 'Ketelitian dalam menyelesaikan instruksi, perhitungan, dan jawaban tugas.',
      skor4: 'Seluruh langkah dan jawaban dikerjakan dengan sangat tepat, runtut, dan lengkap.',
      skor3: 'Sebagian besar langkah dan jawaban tepat dengan sedikit ketidaktelitian kecil.',
      skor2: 'Hanya separuh langkah dan jawaban yang tepat dan perlu perbaikan.',
      skor1: 'Sebagian besar langkah dan jawaban belum tepat atau belum selesai.',
    },
    {
      namaKriteria: 'Kreativitas & Daya Pikir Kritis (HOTS)',
      deskripsi: 'Kemampuan menyampaikan gagasan unik, argumen logis, dan solusi masalah.',
      skor4: 'Mampu menyajikan ide-ide orisinal, penalaran kritis yang kuat, dan solusi inovatif.',
      skor3: 'Mampu memberikan gagasan yang baik dan logis sesuai konteks materi.',
      skor2: 'Gagasan masih bersifat umum dan belum menunjukkan pendalaman pemikiran.',
      skor1: 'Belum mampu memunculkan gagasan mandiri atau bernalar kritis.',
    },
    {
      namaKriteria: 'Kemandirian & Tanggung Jawab',
      deskripsi: 'Sikap kerja, ketepatan waktu, dan kerapian pengerjaan tugas.',
      skor4: 'Menyelesaikan tugas secara mandiri, rapi, tertib, dan tepat waktu dengan antusiasme tinggi.',
      skor3: 'Menyelesaikan tugas dengan baik dan mandiri dengan sesekali bertanya.',
      skor2: 'Memerlukan dorongan dan pengingat berulang untuk menyelesaikan tugas.',
      skor1: 'Pasif dan tugas belum terselesaikan dengan tuntas.',
    },
    {
      namaKriteria: 'Kolaborasi & Komunikasi',
      deskripsi: 'Kemampuan berinteraksi, berbagi peran, dan mempresentasikan hasil kerja.',
      skor4: 'Sangat aktif berkolaborasi, mendengarkan pendapat teman, dan mengomunikasikan hasil kerja dengan santun.',
      skor3: 'Bekerja sama dengan baik dan mampu menyampaikan pendapat dengan jelas.',
      skor2: 'Kurang aktif dalam kerja tim atau presentasi masih malu-malu.',
      skor1: 'Tidak terlibat aktif dalam kerja sama tim dan menolak berkomunikasi.',
    },
  ];

  const selectedKriteria = kriteriaPool.slice(0, Math.min(jumlahKriteria, kriteriaPool.length)).map((c, i) => ({
    id: `crit-${i + 1}`,
    ...c,
    skorMaksimal: 4,
  }));

  return {
    id: `rubrik-${Date.now()}`,
    judul: `Rubrik Penilaian ${mataPelajaran} - ${topik}`,
    identitas: {
      namaSekolah: 'SD Negeri Favorit',
      mataPelajaran,
      kelas: kelas as any,
      fase: fase as any,
      topik,
      tujuanPembelajaran: tujuanPembelajaran || `Menilai pencapaian kompetensi peserta didik pada materi "${topik}".`,
      jenisTugas,
      skala: '1–4',
    },
    kriteriaList: selectedKriteria,
    kategoriPredikat: {
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
  };
}

export function applyRegenerationToLkpd(lkpd: LkpdContent, option: RegenerateOption): LkpdContent {
  const cloned: LkpdContent = JSON.parse(JSON.stringify(lkpd));

  switch (option) {
    case 'Lebih sederhana':
      cloned.petunjukMengerjakan = cloned.petunjukMengerjakan.map((p) => `Ringkas: ${p}`);
      cloned.pertanyaan = cloned.pertanyaan.map((q) => ({
        ...q,
        pertanyaan: `(Disederhanakan) ${q.pertanyaan}`,
      }));
      break;

    case 'Lebih menantang':
    case 'Lebih HOTS':
      cloned.pertanyaan = cloned.pertanyaan.map((q, idx) => ({
        ...q,
        tipe: 'HOTS & Analisis Lanjutan',
        pertanyaan: `(Tantangan Berpikir Kritis): Analisislah mengapa terjadi fenomena pada ${cloned.identitas.topik}! Bagaimana solusimu jika kondisi tersebut berubah secara drastis?`,
      }));
      break;

    case 'Lebih kreatif':
      cloned.langkahAktivitas.push({
        id: `step-extra-${Date.now()}`,
        langkah: cloned.langkahAktivitas.length + 1,
        instruksi: 'Proyek Kreatif Terapan',
        deskripsi: `Rancanglah sebuah poster mini, peta konsep bergambar, atau simulasi peran yang menggambarkan inti materi "${cloned.identitas.topik}".`,
      });
      break;

    case 'Lebih kontekstual':
      cloned.kegiatanPembelajaran = `Studi Kasus Lingkungan Sekitar: Cermati lingkungan sekolah dan rumahmu. Bagaimana konsep "${cloned.identitas.topik}" kamu temukan di kehidupan sehari-hari? Diskusikan dampaknya bagi masyarakat.`;
      break;

    case 'Sesuaikan dengan kelas':
      cloned.kesimpulan = `Kesimpulan disesuaikan khusus untuk tingkat pemahaman ${cloned.identitas.kelas} agar peserta didik dapat mengaplikasikannya secara nyata.`;
      break;

    case 'Ubah aktivitas':
      cloned.langkahAktivitas = [
        {
          id: 'step-rev-1',
          langkah: 1,
          instruksi: 'Aktivitas Diskusi & Mind Mapping',
          deskripsi: `Buatlah bagan ide utama mengenai "${cloned.identitas.topik}" secara visual dan berwarna bersama temanmu.`,
        },
        {
          id: 'step-rev-2',
          langkah: 2,
          instruksi: 'Eksperimen / Simulasi Interaktif',
          deskripsi: `Praktikkan simulasi mini dengan panduan pertanyaan pengarah untuk menemukan bukti konkret.`,
        },
      ];
      break;
  }

  return cloned;
}

export const regenerateFallbackLkpd = applyRegenerationToLkpd;
