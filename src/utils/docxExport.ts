import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  BorderStyle,
  Header,
  Footer,
  HeadingLevel,
} from 'docx';
import { LkpdContent, RubrikContent } from '../types';

/**
 * Downloads a generated docx Document in the browser.
 */
export async function downloadDocxBlob(doc: Document, filename: string): Promise<void> {
  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

const PRIMARY_COLOR = '1E40AF'; // Blue 800
const SECONDARY_COLOR = '2563EB'; // Blue 600
const BORDER_COLOR = 'CBD5E1'; // Slate 300
const SHADING_COLOR = 'F1F5F9'; // Slate 100

/**
 * Creates header and footer components for documents.
 */
function createDocHeader(schoolName: string, subTitle: string) {
  return new Header({
    children: [
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        children: [
          new TextRun({
            text: `${schoolName} | ${subTitle}`,
            size: 18, // 9pt
            color: '64748B',
            font: 'Calibri',
            italics: true,
          }),
        ],
      }),
    ],
  });
}

function createDocFooter() {
  return new Footer({
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: 'Generator LKPD & Rubrik Penilaian SD  •  www.gurumerangkum.com',
            size: 18,
            color: '64748B',
            font: 'Calibri',
          }),
        ],
      }),
    ],
  });
}

/**
 * Creates a section heading (A. TUJUAN PEMBELAJARAN, etc.)
 */
function createSectionHeader(title: string): Paragraph {
  return new Paragraph({
    spacing: { before: 240, after: 120 },
    heading: HeadingLevel.HEADING_2,
    children: [
      new TextRun({
        text: title,
        bold: true,
        size: 24, // 12pt
        color: PRIMARY_COLOR,
        font: 'Calibri',
      }),
    ],
  });
}

/**
 * Creates the LKPD document section.
 */
export function createLkpdSection(lkpd: LkpdContent): any {
  const { identitas } = lkpd;

  // Identity Table
  const identityTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: 'Nama Sekolah: ', bold: true }),
                  new TextRun({ text: identitas.namaSekolah || 'SD Negeri ...' }),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: 'Mata Pelajaran: ', bold: true }),
                  new TextRun({ text: identitas.mataPelajaran }),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: 'Fase / Kelas: ', bold: true }),
                  new TextRun({ text: `${identitas.fase} / ${identitas.kelas} (Sem. ${identitas.semester})` }),
                ],
              }),
            ],
            borders: {
              top: { style: BorderStyle.SINGLE, size: 1, color: BORDER_COLOR },
              bottom: { style: BorderStyle.SINGLE, size: 1, color: BORDER_COLOR },
              left: { style: BorderStyle.SINGLE, size: 1, color: BORDER_COLOR },
              right: { style: BorderStyle.SINGLE, size: 1, color: BORDER_COLOR },
            },
            shading: { fill: SHADING_COLOR },
          }),
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: 'Topik: ', bold: true }),
                  new TextRun({ text: identitas.topik }),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: 'Alokasi Waktu: ', bold: true }),
                  new TextRun({ text: identitas.alokasiWaktu || '2 x 35 Menit' }),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: 'Guru Pengampu: ', bold: true }),
                  new TextRun({ text: identitas.namaGuru || 'Guru Kelas' }),
                ],
              }),
            ],
            borders: {
              top: { style: BorderStyle.SINGLE, size: 1, color: BORDER_COLOR },
              bottom: { style: BorderStyle.SINGLE, size: 1, color: BORDER_COLOR },
              left: { style: BorderStyle.SINGLE, size: 1, color: BORDER_COLOR },
              right: { style: BorderStyle.SINGLE, size: 1, color: BORDER_COLOR },
            },
            shading: { fill: SHADING_COLOR },
          }),
        ],
      }),
    ],
  });

  // Student Identity Box
  const studentBox = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 100, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                spacing: { before: 80, after: 80 },
                children: [
                  new TextRun({ text: 'Nama Peserta Didik : ___________________________   ', bold: true }),
                  new TextRun({ text: 'No. Absen : _______   ', bold: true }),
                  new TextRun({ text: 'Tanggal : ______________', bold: true }),
                ],
              }),
            ],
            borders: {
              top: { style: BorderStyle.DASHED, size: 1, color: SECONDARY_COLOR },
              bottom: { style: BorderStyle.DASHED, size: 1, color: SECONDARY_COLOR },
              left: { style: BorderStyle.DASHED, size: 1, color: SECONDARY_COLOR },
              right: { style: BorderStyle.DASHED, size: 1, color: SECONDARY_COLOR },
            },
          }),
        ],
      }),
    ],
  });

  // Sections Children
  const paragraphs: (Paragraph | Table)[] = [
    // Title
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 100, after: 60 },
      heading: HeadingLevel.HEADING_1,
      children: [
        new TextRun({
          text: 'LEMBAR KERJA PESERTA DIDIK (LKPD)',
          bold: true,
          size: 32, // 16pt
          color: PRIMARY_COLOR,
          font: 'Calibri',
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 180 },
      children: [
        new TextRun({
          text: `Kurikulum Merdeka  •  ${identitas.mataPelajaran}  •  ${identitas.kelas}`,
          size: 22,
          color: '475569',
          font: 'Calibri',
        }),
      ],
    }),

    identityTable,
    new Paragraph({ spacing: { before: 140, after: 140 } }),
    studentBox,
    new Paragraph({ spacing: { before: 140, after: 140 } }),

    // A. TUJUAN PEMBELAJARAN
    createSectionHeader('A. TUJUAN PEMBELAJARAN'),
    ...lkpd.tujuanPembelajaran.map(
      (tp, index) =>
        new Paragraph({
          spacing: { after: 60 },
          children: [
            new TextRun({ text: `${index + 1}. `, bold: true }),
            new TextRun({ text: tp }),
          ],
        })
    ),

    // B. PETUNJUK MENGERJAKAN
    createSectionHeader('B. PETUNJUK MENGERJAKAN'),
    ...lkpd.petunjukMengerjakan.map(
      (petunjuk, index) =>
        new Paragraph({
          spacing: { after: 60 },
          children: [
            new TextRun({ text: `${index + 1}. `, bold: true }),
            new TextRun({ text: petunjuk }),
          ],
        })
    ),

    // C. ALAT DAN BAHAN
    createSectionHeader('C. ALAT DAN BAHAN'),
    new Paragraph({
      spacing: { after: 80 },
      children: [
        new TextRun({
          text: lkpd.alatDanBahan && lkpd.alatDanBahan.length > 0
            ? lkpd.alatDanBahan.join(', ')
            : 'Alat tulis, buku panduan belajar siswa, kertas kerja.',
        }),
      ],
    }),

    // D. KEGIATAN PEMBELAJARAN
    createSectionHeader('D. KEGIATAN PEMBELAJARAN / STIMULUS'),
    new Paragraph({
      spacing: { after: 120 },
      children: [new TextRun({ text: lkpd.kegiatanPembelajaran || '' })],
    }),

    // E. TUGAS / AKTIVITAS
    createSectionHeader('E. TUGAS / LANGKAH AKTIVITAS'),
    ...lkpd.langkahAktivitas.map(
      (akt) =>
        new Paragraph({
          spacing: { after: 80 },
          children: [
            new TextRun({ text: `Langkah ${akt.langkah}: `, bold: true }),
            new TextRun({ text: `${akt.instruksi} - ${akt.deskripsi}` }),
          ],
        })
    ),

    // F. PERTANYAAN
    createSectionHeader('F. PERTANYAAN DAN TUGAS MANDIRI / KELOMPOK'),
    ...lkpd.pertanyaan.flatMap((q) => {
      const qElements: Paragraph[] = [];
      qElements.push(
        new Paragraph({
          spacing: { before: 100, after: 60 },
          children: [
            new TextRun({ text: `Soal ${q.nomor} (${q.tipe}): `, bold: true }),
            new TextRun({ text: q.pertanyaan }),
          ],
        })
      );

      if (q.pilihan && q.pilihan.length > 0) {
        q.pilihan.forEach((pil, pIdx) => {
          const optLetter = String.fromCharCode(65 + pIdx);
          qElements.push(
            new Paragraph({
              spacing: { after: 40 },
              indent: { left: 400 },
              children: [
                new TextRun({ text: `${optLetter}. `, bold: true }),
                new TextRun({ text: pil }),
              ],
            })
          );
        });
      }

      // Space for answering
      qElements.push(
        new Paragraph({
          spacing: { before: 60, after: 100 },
          indent: { left: 400 },
          children: [
            new TextRun({
              text: 'Jawaban: _________________________________________________________________________',
              color: '94A3B8',
            }),
          ],
        })
      );

      return qElements;
    }),

    // G. KESIMPULAN
    createSectionHeader('G. KESIMPULAN'),
    new Paragraph({
      spacing: { after: 120 },
      children: [
        new TextRun({
          text:
            lkpd.kesimpulan ||
            'Tuliskan kesimpulan yang kamu dapatkan setelah menyelesaikan seluruh aktivitas hari ini:',
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 80 },
      children: [
        new TextRun({
          text: '_________________________________________________________________________________',
          color: '94A3B8',
        }),
      ],
    }),

    // H. REFLEKSI PESERTA DIDIK
    createSectionHeader('H. REFLEKSI PESERTA DIDIK'),
    new Paragraph({
      spacing: { after: 60 },
      children: [
        new TextRun({ text: '1. Hal yang saya pelajari hari ini: ', bold: true }),
        new TextRun({
          text: lkpd.refleksi?.yangDipelajari || '.......................................................',
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 60 },
      children: [
        new TextRun({ text: '2. Hal yang paling saya sukai: ', bold: true }),
        new TextRun({
          text: lkpd.refleksi?.yangDisukai || '.......................................................',
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 120 },
      children: [
        new TextRun({ text: '3. Hal yang masih belum saya pahami: ', bold: true }),
        new TextRun({
          text: lkpd.refleksi?.yangBelumDipahami || '.......................................................',
        }),
      ],
    }),
  ];

  return {
    properties: {
      page: {
        margin: {
          top: 1440, // 1 inch
          bottom: 1440,
          left: 1440,
          right: 1440,
        },
      },
    },
    headers: { default: createDocHeader(identitas.namaSekolah || 'SD', 'LKPD') },
    footers: { default: createDocFooter() },
    children: paragraphs,
  };
}

/**
 * Generates an LKPD Word document (.docx).
 */
export function buildLkpdDocument(lkpd: LkpdContent): Document {
  return new Document({
    sections: [createLkpdSection(lkpd)],
  });
}

/**
 * Creates the Rubrik Penilaian document section.
 */
export function createRubrikSection(rubrik: RubrikContent): any {
  const { identitas } = rubrik;

  // Header Table
  const headerTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: 'Nama Sekolah: ', bold: true }),
                  new TextRun({ text: identitas.namaSekolah || 'SD Negeri ...' }),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: 'Mata Pelajaran: ', bold: true }),
                  new TextRun({ text: identitas.mataPelajaran }),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: 'Fase / Kelas: ', bold: true }),
                  new TextRun({ text: `${identitas.fase} / ${identitas.kelas}` }),
                ],
              }),
            ],
            borders: {
              top: { style: BorderStyle.SINGLE, size: 1, color: BORDER_COLOR },
              bottom: { style: BorderStyle.SINGLE, size: 1, color: BORDER_COLOR },
              left: { style: BorderStyle.SINGLE, size: 1, color: BORDER_COLOR },
              right: { style: BorderStyle.SINGLE, size: 1, color: BORDER_COLOR },
            },
            shading: { fill: SHADING_COLOR },
          }),
          new TableCell({
            width: { size: 50, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: 'Topik / Materi: ', bold: true }),
                  new TextRun({ text: identitas.topik }),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: 'Jenis Tugas: ', bold: true }),
                  new TextRun({ text: identitas.jenisTugas }),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: 'Nama Peserta Didik: ', bold: true }),
                  new TextRun({ text: '____________________' }),
                ],
              }),
            ],
            borders: {
              top: { style: BorderStyle.SINGLE, size: 1, color: BORDER_COLOR },
              bottom: { style: BorderStyle.SINGLE, size: 1, color: BORDER_COLOR },
              left: { style: BorderStyle.SINGLE, size: 1, color: BORDER_COLOR },
              right: { style: BorderStyle.SINGLE, size: 1, color: BORDER_COLOR },
            },
            shading: { fill: SHADING_COLOR },
          }),
        ],
      }),
    ],
  });

  // Rubric Table Rows
  const tableHeaderRow = new TableRow({
    children: [
      new TableCell({
        width: { size: 6, type: WidthType.PERCENTAGE },
        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'No', bold: true, color: 'FFFFFF' })] })],
        shading: { fill: PRIMARY_COLOR },
      }),
      new TableCell({
        width: { size: 24, type: WidthType.PERCENTAGE },
        children: [new Paragraph({ children: [new TextRun({ text: 'Kriteria Penilaian', bold: true, color: 'FFFFFF' })] })],
        shading: { fill: PRIMARY_COLOR },
      }),
      new TableCell({
        width: { size: 18, type: WidthType.PERCENTAGE },
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: 'Skor 4\n(Sangat Baik)', bold: true, color: 'FFFFFF' }),
            ],
          }),
        ],
        shading: { fill: PRIMARY_COLOR },
      }),
      new TableCell({
        width: { size: 18, type: WidthType.PERCENTAGE },
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: 'Skor 3\n(Baik)', bold: true, color: 'FFFFFF' }),
            ],
          }),
        ],
        shading: { fill: PRIMARY_COLOR },
      }),
      new TableCell({
        width: { size: 17, type: WidthType.PERCENTAGE },
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: 'Skor 2\n(Cukup)', bold: true, color: 'FFFFFF' }),
            ],
          }),
        ],
        shading: { fill: PRIMARY_COLOR },
      }),
      new TableCell({
        width: { size: 17, type: WidthType.PERCENTAGE },
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: 'Skor 1\n(Perlu Bimbingan)', bold: true, color: 'FFFFFF' }),
            ],
          }),
        ],
        shading: { fill: PRIMARY_COLOR },
      }),
    ],
  });

  const dataRows = rubrik.kriteriaList.map((crit, idx) => {
    return new TableRow({
      children: [
        new TableCell({
          width: { size: 6, type: WidthType.PERCENTAGE },
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: String(idx + 1), bold: true })] })],
          borders: {
            top: { style: BorderStyle.SINGLE, size: 1, color: BORDER_COLOR },
            bottom: { style: BorderStyle.SINGLE, size: 1, color: BORDER_COLOR },
            left: { style: BorderStyle.SINGLE, size: 1, color: BORDER_COLOR },
            right: { style: BorderStyle.SINGLE, size: 1, color: BORDER_COLOR },
          },
        }),
        new TableCell({
          width: { size: 24, type: WidthType.PERCENTAGE },
          children: [
            new Paragraph({
              children: [
                new TextRun({ text: crit.namaKriteria, bold: true }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({ text: crit.deskripsi || '', size: 18, color: '64748B' }),
              ],
            }),
          ],
          borders: {
            top: { style: BorderStyle.SINGLE, size: 1, color: BORDER_COLOR },
            bottom: { style: BorderStyle.SINGLE, size: 1, color: BORDER_COLOR },
            left: { style: BorderStyle.SINGLE, size: 1, color: BORDER_COLOR },
            right: { style: BorderStyle.SINGLE, size: 1, color: BORDER_COLOR },
          },
        }),
        new TableCell({
          width: { size: 18, type: WidthType.PERCENTAGE },
          children: [new Paragraph({ children: [new TextRun({ text: crit.skor4, size: 19 })] })],
          borders: {
            top: { style: BorderStyle.SINGLE, size: 1, color: BORDER_COLOR },
            bottom: { style: BorderStyle.SINGLE, size: 1, color: BORDER_COLOR },
            left: { style: BorderStyle.SINGLE, size: 1, color: BORDER_COLOR },
            right: { style: BorderStyle.SINGLE, size: 1, color: BORDER_COLOR },
          },
        }),
        new TableCell({
          width: { size: 18, type: WidthType.PERCENTAGE },
          children: [new Paragraph({ children: [new TextRun({ text: crit.skor3, size: 19 })] })],
          borders: {
            top: { style: BorderStyle.SINGLE, size: 1, color: BORDER_COLOR },
            bottom: { style: BorderStyle.SINGLE, size: 1, color: BORDER_COLOR },
            left: { style: BorderStyle.SINGLE, size: 1, color: BORDER_COLOR },
            right: { style: BorderStyle.SINGLE, size: 1, color: BORDER_COLOR },
          },
        }),
        new TableCell({
          width: { size: 17, type: WidthType.PERCENTAGE },
          children: [new Paragraph({ children: [new TextRun({ text: crit.skor2, size: 19 })] })],
          borders: {
            top: { style: BorderStyle.SINGLE, size: 1, color: BORDER_COLOR },
            bottom: { style: BorderStyle.SINGLE, size: 1, color: BORDER_COLOR },
            left: { style: BorderStyle.SINGLE, size: 1, color: BORDER_COLOR },
            right: { style: BorderStyle.SINGLE, size: 1, color: BORDER_COLOR },
          },
        }),
        new TableCell({
          width: { size: 17, type: WidthType.PERCENTAGE },
          children: [new Paragraph({ children: [new TextRun({ text: crit.skor1, size: 19 })] })],
          borders: {
            top: { style: BorderStyle.SINGLE, size: 1, color: BORDER_COLOR },
            bottom: { style: BorderStyle.SINGLE, size: 1, color: BORDER_COLOR },
            left: { style: BorderStyle.SINGLE, size: 1, color: BORDER_COLOR },
            right: { style: BorderStyle.SINGLE, size: 1, color: BORDER_COLOR },
          },
        }),
      ],
    });
  });

  const rubricTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [tableHeaderRow, ...dataRows],
  });

  // Calculation Formula guide box
  const formulaBox = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 100, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                spacing: { before: 80, after: 40 },
                children: [
                  new TextRun({ text: 'PEDOMAN PERHITUNGAN NILAI AKHIR', bold: true, color: PRIMARY_COLOR }),
                ],
              }),
              new Paragraph({
                spacing: { after: 40 },
                children: [
                  new TextRun({ text: 'Rumus: Nilai Akhir = (Skor Perolehan / Skor Maksimal) x 100\n' }),
                  new TextRun({
                    text: `Skor Maksimal = ${rubrik.kriteriaList.length * 4} (Jumlah kriteria: ${rubrik.kriteriaList.length}, Skala: 4)`,
                    italics: true,
                  }),
                ],
              }),
              new Paragraph({
                spacing: { after: 60 },
                children: [
                  new TextRun({ text: 'Kategori Predikat: ', bold: true }),
                  new TextRun({ text: `4 = ${rubrik.kategoriPredikat.skor4}  |  3 = ${rubrik.kategoriPredikat.skor3}  |  2 = ${rubrik.kategoriPredikat.skor2}  |  1 = ${rubrik.kategoriPredikat.skor1}` }),
                ],
              }),
            ],
            borders: {
              top: { style: BorderStyle.SINGLE, size: 1, color: BORDER_COLOR },
              bottom: { style: BorderStyle.SINGLE, size: 1, color: BORDER_COLOR },
              left: { style: BorderStyle.SINGLE, size: 1, color: BORDER_COLOR },
              right: { style: BorderStyle.SINGLE, size: 1, color: BORDER_COLOR },
            },
            shading: { fill: SHADING_COLOR },
          }),
        ],
      }),
    ],
  });

  return {
    properties: {
      page: {
        margin: {
          top: 1440,
          bottom: 1440,
          left: 1440,
          right: 1440,
        },
      },
    },
    headers: { default: createDocHeader(identitas.namaSekolah || 'SD', 'Rubrik Penilaian') },
    footers: { default: createDocFooter() },
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 100, after: 60 },
        heading: HeadingLevel.HEADING_1,
        children: [
          new TextRun({
            text: 'RUBRIK PENILAIAN PEMBELAJARAN',
            bold: true,
            size: 32,
            color: PRIMARY_COLOR,
            font: 'Calibri',
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 180 },
        children: [
          new TextRun({
            text: `Kurikulum Merdeka  •  ${identitas.mataPelajaran}  •  ${identitas.kelas}`,
            size: 22,
            color: '475569',
            font: 'Calibri',
          }),
        ],
      }),
      headerTable,
      new Paragraph({ spacing: { before: 120, after: 120 } }),
      new Paragraph({
        spacing: { after: 80 },
        children: [
          new TextRun({ text: 'Tujuan Pembelajaran: ', bold: true }),
          new TextRun({ text: identitas.tujuanPembelajaran || '-' }),
        ],
      }),
      rubricTable,
      new Paragraph({ spacing: { before: 160, after: 160 } }),
      formulaBox,
    ],
  };
}

/**
 * Generates a Rubrik Penilaian Word document (.docx).
 */
export function buildRubrikDocument(rubrik: RubrikContent): Document {
  return new Document({
    sections: [createRubrikSection(rubrik)],
  });
}

/**
 * Combines LKPD and Rubrik into a single Word document (.docx).
 */
export function buildCombinedDocument(lkpd: LkpdContent, rubrik: RubrikContent): Document {
  return new Document({
    sections: [
      createLkpdSection(lkpd),
      createRubrikSection(rubrik),
    ],
  });
}
