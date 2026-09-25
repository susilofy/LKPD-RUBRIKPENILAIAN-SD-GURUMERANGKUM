import React, { useState } from 'react';
import {
  Edit3,
  Eye,
  RefreshCw,
  Download,
  Save,
  Plus,
  Trash2,
  CheckSquare,
  Sparkles,
  ArrowLeft,
  CheckCircle,
  FileCheck,
  HelpCircle,
} from 'lucide-react';
import { LkpdContent, QuestionItem, ActivityStep, RegenerateOption } from '../types';
import { buildLkpdDocument, downloadDocxBlob } from '../utils/docxExport';

interface LkpdViewerProps {
  lkpd: LkpdContent;
  onUpdateLkpd: (updated: LkpdContent) => void;
  onSave: (lkpd: LkpdContent) => void;
  onRegenerate: (option: RegenerateOption) => void;
  onGenerateRubrikFromLkpd: (lkpd: LkpdContent) => void;
  onBackToForm: () => void;
  isRegenerating: boolean;
}

export const LkpdViewer: React.FC<LkpdViewerProps> = ({
  lkpd,
  onUpdateLkpd,
  onSave,
  onRegenerate,
  onGenerateRubrikFromLkpd,
  onBackToForm,
  isRegenerating,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showRegenModal, setShowRegenModal] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isDownloadingWord, setIsDownloadingWord] = useState(false);

  // Local draft state when in edit mode
  const [draft, setDraft] = useState<LkpdContent>(lkpd);

  // Sync draft when prop changes
  React.useEffect(() => {
    setDraft(lkpd);
  }, [lkpd]);

  const handleSaveEdit = () => {
    onUpdateLkpd(draft);
    setIsEditing(false);
  };

  const handleDownloadWord = async () => {
    try {
      setIsDownloadingWord(true);
      const doc = buildLkpdDocument(isEditing ? draft : lkpd);
      const cleanTopik = (lkpd.identitas.topik || 'Materi')
        .replace(/[^a-zA-Z0-9]/g, '_')
        .substring(0, 30);
      const cleanKelas = (lkpd.identitas.kelas || 'SD').replace(/\s+/g, '_');
      const cleanMapel = (lkpd.identitas.mataPelajaran || 'Mapel').split(' ')[0];
      const filename = `LKPD_${cleanKelas}_${cleanMapel}_${cleanTopik}.docx`;

      await downloadDocxBlob(doc, filename);
    } catch (err) {
      console.error('Word export error:', err);
    } finally {
      setIsDownloadingWord(false);
    }
  };

  const handleSaveToHistory = () => {
    onSave(isEditing ? draft : lkpd);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Helper functions for modifying questions in Edit mode
  const addQuestion = () => {
    const newQ: QuestionItem = {
      id: `q-new-${Date.now()}`,
      nomor: draft.pertanyaan.length + 1,
      tipe: 'Uraian / Analisis Mandiri',
      pertanyaan: 'Tuliskan pertanyaan baru di sini...',
      skorMaksimal: 2,
    };
    setDraft({
      ...draft,
      pertanyaan: [...draft.pertanyaan, newQ],
    });
  };

  const removeQuestion = (index: number) => {
    const updated = draft.pertanyaan
      .filter((_, i) => i !== index)
      .map((q, i) => ({ ...q, nomor: i + 1 }));
    setDraft({ ...draft, pertanyaan: updated });
  };

  const updateQuestion = (index: number, updatedField: Partial<QuestionItem>) => {
    const updated = [...draft.pertanyaan];
    updated[index] = { ...updated[index], ...updatedField };
    setDraft({ ...draft, pertanyaan: updated });
  };

  const addActivityStep = () => {
    const newStep: ActivityStep = {
      id: `step-new-${Date.now()}`,
      langkah: draft.langkahAktivitas.length + 1,
      instruksi: 'Instruksi Langkah Baru',
      deskripsi: 'Deskripsi langkah yang harus dilakukan siswa.',
    };
    setDraft({
      ...draft,
      langkahAktivitas: [...draft.langkahAktivitas, newStep],
    });
  };

  const removeActivityStep = (index: number) => {
    const updated = draft.langkahAktivitas
      .filter((_, i) => i !== index)
      .map((s, i) => ({ ...s, langkah: i + 1 }));
    setDraft({ ...draft, langkahAktivitas: updated });
  };

  const currentData = isEditing ? draft : lkpd;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Action Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-wrap items-center justify-between gap-3 sticky top-20 z-30">
        <button
          type="button"
          onClick={onBackToForm}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Form</span>
        </button>

        <div className="flex flex-wrap items-center gap-2">
          {/* Edit / Preview Toggle */}
          <button
            type="button"
            id="btn-toggle-edit"
            onClick={() => {
              if (isEditing) {
                handleSaveEdit();
              } else {
                setIsEditing(true);
              }
            }}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-all ${
              isEditing
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            {isEditing ? (
              <>
                <Eye className="w-4 h-4" />
                <span>Lihat Preview</span>
              </>
            ) : (
              <>
                <Edit3 className="w-4 h-4" />
                <span>Mode Edit</span>
              </>
            )}
          </button>

          {/* Regenerate Button */}
          <button
            type="button"
            id="btn-regenerate-modal"
            disabled={isRegenerating}
            onClick={() => setShowRegenModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-amber-50 text-amber-800 border border-amber-300 hover:bg-amber-100 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRegenerating ? 'animate-spin' : ''}`} />
            <span>Buat Ulang</span>
          </button>

          {/* Save Button */}
          <button
            type="button"
            id="btn-save-history"
            onClick={handleSaveToHistory}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-blue-50 text-blue-800 border border-blue-200 hover:bg-blue-100 transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Simpan</span>
          </button>

          {/* Download Word Button */}
          <button
            type="button"
            id="btn-download-word-lkpd"
            onClick={handleDownloadWord}
            disabled={isDownloadingWord}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-600/20 transition-all active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>{isDownloadingWord ? 'Menyiapkan .docx...' : 'Download Word (.docx)'}</span>
          </button>
        </div>
      </div>

      {/* Save Success Alert */}
      {saveSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-xs">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>LKPD berhasil disimpan ke Riwayat Dokumen! Anda dapat membukanya kembali kapan saja.</span>
        </div>
      )}

      {/* Connect to Rubric Prompt Banner */}
      <div className="p-4 bg-gradient-to-r from-blue-700 to-indigo-800 text-white rounded-2xl shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <span className="text-xs uppercase tracking-wider text-blue-200 font-bold flex items-center justify-center sm:justify-start gap-1.5">
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span>Integrasi Asesmen Otentik</span>
          </span>
          <p className="text-sm sm:text-base font-bold">
            Sudah selesai membuat LKPD ini?
          </p>
          <p className="text-xs text-blue-100 max-w-xl">
            AI dapat membaca isi tugas & aktivitas pada LKPD ini untuk langsung membuatkan Rubrik Penilaian yang terpadu dan selaras.
          </p>
        </div>
        <button
          type="button"
          id="btn-generate-rubrik-from-this-lkpd"
          onClick={() => onGenerateRubrikFromLkpd(currentData)}
          className="shrink-0 px-4 py-2.5 rounded-xl bg-white text-blue-800 font-bold text-xs sm:text-sm hover:bg-blue-50 shadow-sm transition-all"
        >
          Buat Rubrik dari LKPD Ini →
        </button>
      </div>

      {/* ============================================================ */}
      {/* THE PRINT / PREVIEW / EDIT CANVAS (A4 DOCUMENT PAPER LOOK) */}
      {/* ============================================================ */}
      <div className="bg-white rounded-2xl border border-slate-300 shadow-xl overflow-hidden p-6 sm:p-10 text-slate-800 font-sans">
        {/* Document Header / KOP */}
        <div className="border-b-2 border-slate-900 pb-4 mb-6 text-center space-y-1">
          <p className="text-xs uppercase tracking-widest font-extrabold text-blue-800">
            {currentData.identitas.namaSekolah || 'SEKOLAH DASAR'}
          </p>
          {isEditing ? (
            <input
              type="text"
              value={draft.judul}
              onChange={(e) => setDraft({ ...draft, judul: e.target.value })}
              className="text-center w-full text-xl sm:text-2xl font-black text-slate-900 border border-blue-400 rounded-lg p-1"
            />
          ) : (
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {currentData.judul || 'LEMBAR KERJA PESERTA DIDIK (LKPD)'}
            </h1>
          )}
          <p className="text-xs text-slate-600 font-medium">
            Kurikulum Merdeka • {currentData.identitas.mataPelajaran} • {currentData.identitas.kelas} ({currentData.identitas.fase})
          </p>
        </div>

        {/* Identity Table & Student Box */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm mb-6 p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div className="space-y-1">
            <div className="flex">
              <span className="w-28 font-bold text-slate-600">Nama Sekolah</span>
              <span className="font-semibold text-slate-900">: {currentData.identitas.namaSekolah}</span>
            </div>
            <div className="flex">
              <span className="w-28 font-bold text-slate-600">Mata Pelajaran</span>
              <span className="font-semibold text-slate-900">: {currentData.identitas.mataPelajaran}</span>
            </div>
            <div className="flex">
              <span className="w-28 font-bold text-slate-600">Kelas / Fase</span>
              <span className="font-semibold text-slate-900">: {currentData.identitas.kelas} / {currentData.identitas.fase}</span>
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex">
              <span className="w-28 font-bold text-slate-600">Topik / Materi</span>
              <span className="font-semibold text-slate-900">: {currentData.identitas.topik}</span>
            </div>
            <div className="flex">
              <span className="w-28 font-bold text-slate-600">Alokasi Waktu</span>
              <span className="font-semibold text-slate-900">: {currentData.identitas.alokasiWaktu}</span>
            </div>
            <div className="flex">
              <span className="w-28 font-bold text-slate-600">Guru Pengampu</span>
              <span className="font-semibold text-slate-900">: {currentData.identitas.namaGuru || '-'}</span>
            </div>
          </div>
        </div>

        {/* Kotak Identitas Peserta Didik */}
        <div className="border-2 border-dashed border-blue-400 rounded-xl p-4 mb-6 bg-blue-50/40 text-xs sm:text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <span className="font-bold text-slate-700">Nama Peserta Didik:</span>
              <div className="border-b border-slate-400 h-6"></div>
            </div>
            <div>
              <span className="font-bold text-slate-700">Kelas / No. Absen:</span>
              <div className="border-b border-slate-400 h-6"></div>
            </div>
            <div>
              <span className="font-bold text-slate-700">Hari / Tanggal:</span>
              <div className="border-b border-slate-400 h-6"></div>
            </div>
          </div>
        </div>

        {/* SECTION A: TUJUAN PEMBELAJARAN */}
        <section className="mb-6 space-y-2">
          <h2 className="text-sm sm:text-base font-bold text-blue-900 uppercase tracking-wide border-b border-blue-200 pb-1 flex items-center gap-2">
            <span>A. TUJUAN PEMBELAJARAN</span>
          </h2>
          {isEditing ? (
            <div className="space-y-2">
              {draft.tujuanPembelajaran.map((tp, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-xs font-bold w-5">{idx + 1}.</span>
                  <input
                    type="text"
                    value={tp}
                    onChange={(e) => {
                      const updated = [...draft.tujuanPembelajaran];
                      updated[idx] = e.target.value;
                      setDraft({ ...draft, tujuanPembelajaran: updated });
                    }}
                    className="w-full text-xs sm:text-sm px-2 py-1.5 border rounded-lg border-slate-300"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const updated = draft.tujuanPembelajaran.filter((_, i) => i !== idx);
                      setDraft({ ...draft, tujuanPembelajaran: updated });
                    }}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setDraft({ ...draft, tujuanPembelajaran: [...draft.tujuanPembelajaran, 'Tujuan baru...'] })}
                className="text-xs text-blue-700 font-semibold inline-flex items-center gap-1 hover:underline"
              >
                <Plus className="w-3.5 h-3.5" /> Tambah Tujuan
              </button>
            </div>
          ) : (
            <ol className="list-decimal list-inside space-y-1 text-xs sm:text-sm text-slate-700 leading-relaxed">
              {currentData.tujuanPembelajaran.map((tp, idx) => (
                <li key={idx}>{tp}</li>
              ))}
            </ol>
          )}
        </section>

        {/* SECTION B: PETUNJUK MENGERJAKAN */}
        <section className="mb-6 space-y-2">
          <h2 className="text-sm sm:text-base font-bold text-blue-900 uppercase tracking-wide border-b border-blue-200 pb-1">
            B. PETUNJUK MENGERJAKAN
          </h2>
          {isEditing ? (
            <div className="space-y-2">
              {draft.petunjukMengerjakan.map((petunjuk, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-xs font-bold w-5">{idx + 1}.</span>
                  <input
                    type="text"
                    value={petunjuk}
                    onChange={(e) => {
                      const updated = [...draft.petunjukMengerjakan];
                      updated[idx] = e.target.value;
                      setDraft({ ...draft, petunjukMengerjakan: updated });
                    }}
                    className="w-full text-xs sm:text-sm px-2 py-1.5 border rounded-lg border-slate-300"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const updated = draft.petunjukMengerjakan.filter((_, i) => i !== idx);
                      setDraft({ ...draft, petunjukMengerjakan: updated });
                    }}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setDraft({ ...draft, petunjukMengerjakan: [...draft.petunjukMengerjakan, 'Petunjuk baru...'] })}
                className="text-xs text-blue-700 font-semibold inline-flex items-center gap-1 hover:underline"
              >
                <Plus className="w-3.5 h-3.5" /> Tambah Petunjuk
              </button>
            </div>
          ) : (
            <ol className="list-decimal list-inside space-y-1 text-xs sm:text-sm text-slate-700 leading-relaxed">
              {currentData.petunjukMengerjakan.map((petunjuk, idx) => (
                <li key={idx}>{petunjuk}</li>
              ))}
            </ol>
          )}
        </section>

        {/* SECTION C: ALAT DAN BAHAN */}
        <section className="mb-6 space-y-2">
          <h2 className="text-sm sm:text-base font-bold text-blue-900 uppercase tracking-wide border-b border-blue-200 pb-1">
            C. ALAT DAN BAHAN
          </h2>
          {isEditing ? (
            <input
              type="text"
              value={draft.alatDanBahan?.join(', ') || ''}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  alatDanBahan: e.target.value.split(',').map((s) => s.trim()),
                })
              }
              className="w-full text-xs sm:text-sm px-3 py-2 border rounded-lg border-slate-300"
              placeholder="Pisahkan dengan koma..."
            />
          ) : (
            <p className="text-xs sm:text-sm text-slate-700">
              {currentData.alatDanBahan && currentData.alatDanBahan.length > 0
                ? currentData.alatDanBahan.join(', ')
                : 'Alat tulis, buku panduan belajar siswa, kertas kerja.'}
            </p>
          )}
        </section>

        {/* SECTION D: KEGIATAN PEMBELAJARAN (STIMULUS) */}
        <section className="mb-6 space-y-2">
          <h2 className="text-sm sm:text-base font-bold text-blue-900 uppercase tracking-wide border-b border-blue-200 pb-1">
            D. KEGIATAN PEMBELAJARAN / STIMULUS
          </h2>
          {isEditing ? (
            <textarea
              rows={4}
              value={draft.kegiatanPembelajaran}
              onChange={(e) => setDraft({ ...draft, kegiatanPembelajaran: e.target.value })}
              className="w-full text-xs sm:text-sm px-3 py-2 border rounded-lg border-slate-300"
            />
          ) : (
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed italic">
              {currentData.kegiatanPembelajaran}
            </div>
          )}
        </section>

        {/* SECTION E: TUGAS / LANGKAH AKTIVITAS */}
        <section className="mb-6 space-y-3">
          <div className="flex items-center justify-between border-b border-blue-200 pb-1">
            <h2 className="text-sm sm:text-base font-bold text-blue-900 uppercase tracking-wide">
              E. TUGAS & LANGKAH AKTIVITAS
            </h2>
            {isEditing && (
              <button
                type="button"
                onClick={addActivityStep}
                className="text-xs text-blue-700 font-bold inline-flex items-center gap-1 hover:underline"
              >
                <Plus className="w-3.5 h-3.5" /> Tambah Langkah
              </button>
            )}
          </div>

          <div className="space-y-2.5">
            {currentData.langkahAktivitas.map((act, idx) => (
              <div
                key={act.id || idx}
                className="p-3 rounded-xl bg-blue-50/50 border border-blue-100 flex items-start gap-3"
              >
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                  {act.langkah}
                </div>
                <div className="flex-1 space-y-1">
                  {isEditing ? (
                    <>
                      <input
                        type="text"
                        value={act.instruksi}
                        onChange={(e) => {
                          const updated = [...draft.langkahAktivitas];
                          updated[idx] = { ...updated[idx], instruksi: e.target.value };
                          setDraft({ ...draft, langkahAktivitas: updated });
                        }}
                        className="w-full font-bold text-xs sm:text-sm px-2 py-1 border rounded border-slate-300 mb-1"
                      />
                      <textarea
                        rows={2}
                        value={act.deskripsi}
                        onChange={(e) => {
                          const updated = [...draft.langkahAktivitas];
                          updated[idx] = { ...updated[idx], deskripsi: e.target.value };
                          setDraft({ ...draft, langkahAktivitas: updated });
                        }}
                        className="w-full text-xs sm:text-sm px-2 py-1 border rounded border-slate-300"
                      />
                    </>
                  ) : (
                    <>
                      <p className="font-bold text-xs sm:text-sm text-slate-900">{act.instruksi}</p>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{act.deskripsi}</p>
                    </>
                  )}
                </div>

                {isEditing && (
                  <button
                    type="button"
                    onClick={() => removeActivityStep(idx)}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* SECTION F: PERTANYAAN */}
        <section className="mb-6 space-y-4">
          <div className="flex items-center justify-between border-b border-blue-200 pb-1">
            <h2 className="text-sm sm:text-base font-bold text-blue-900 uppercase tracking-wide">
              F. PERTANYAAN
            </h2>
            {isEditing && (
              <button
                type="button"
                onClick={addQuestion}
                className="text-xs text-blue-700 font-bold inline-flex items-center gap-1 hover:underline"
              >
                <Plus className="w-3.5 h-3.5" /> Tambah Soal
              </button>
            )}
          </div>

          <div className="space-y-4">
            {currentData.pertanyaan.map((q, idx) => (
              <div
                key={q.id || idx}
                className="p-4 rounded-xl border border-slate-200 bg-white space-y-2.5 shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                    Soal {q.nomor} • {q.tipe}
                  </span>
                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => removeQuestion(idx)}
                      className="text-red-500 hover:text-red-700 text-xs flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Hapus
                    </button>
                  )}
                </div>

                {isEditing ? (
                  <div className="space-y-2">
                    <textarea
                      rows={2}
                      value={q.pertanyaan}
                      onChange={(e) => updateQuestion(idx, { pertanyaan: e.target.value })}
                      className="w-full text-xs sm:text-sm px-3 py-1.5 border rounded-lg border-slate-300"
                    />
                    {q.pilihan && (
                      <div className="space-y-1 pl-4">
                        <span className="text-xs font-semibold text-slate-500">Pilihan Jawaban:</span>
                        {q.pilihan.map((pil, pIdx) => (
                          <input
                            key={pIdx}
                            type="text"
                            value={pil}
                            onChange={(e) => {
                              const newPilihan = [...(q.pilihan || [])];
                              newPilihan[pIdx] = e.target.value;
                              updateQuestion(idx, { pilihan: newPilihan });
                            }}
                            className="w-full text-xs px-2 py-1 border rounded border-slate-300"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <p className="text-xs sm:text-sm font-medium text-slate-800 leading-relaxed">
                      {q.pertanyaan}
                    </p>

                    {q.pilihan && q.pilihan.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-4 pt-1">
                        {q.pilihan.map((pil, pIdx) => (
                          <div
                            key={pIdx}
                            className="flex items-center gap-2 text-xs sm:text-sm text-slate-700"
                          >
                            <span className="font-bold w-5 h-5 rounded-full border border-slate-300 flex items-center justify-center text-xs">
                              {String.fromCharCode(65 + pIdx)}
                            </span>
                            <span>{pil}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Lembar Jawaban Ruang Kosong */}
                    <div className="pt-2 border-t border-dashed border-slate-200">
                      <p className="text-xs text-slate-600 font-semibold mb-1">Jawaban:</p>
                      <div className="h-12 border-b border-slate-200 border-dashed"></div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* SECTION G: KESIMPULAN */}
        <section className="mb-6 space-y-2">
          <h2 className="text-sm sm:text-base font-bold text-blue-900 uppercase tracking-wide border-b border-blue-200 pb-1">
            G. KESIMPULAN
          </h2>
          {isEditing ? (
            <textarea
              rows={3}
              value={draft.kesimpulan}
              onChange={(e) => setDraft({ ...draft, kesimpulan: e.target.value })}
              className="w-full text-xs sm:text-sm px-3 py-2 border rounded-lg border-slate-300"
            />
          ) : (
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {currentData.kesimpulan}
            </p>
          )}
        </section>

        {/* SECTION H: REFLEKSI PESERTA DIDIK */}
        <section className="mb-6 space-y-3">
          <h2 className="text-sm sm:text-base font-bold text-blue-900 uppercase tracking-wide border-b border-blue-200 pb-1">
            H. REFLEKSI PESERTA DIDIK
          </h2>
          <div className="space-y-3 text-xs sm:text-sm">
            <div className="p-3 rounded-xl bg-amber-50/50 border border-amber-200">
              <span className="font-bold text-slate-800 block mb-1">
                1. Hal yang saya pelajari hari ini:
              </span>
              <p className="text-slate-600">{currentData.refleksi?.yangDipelajari}</p>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-200">
              <span className="font-bold text-slate-800 block mb-1">
                2. Hal yang paling saya sukai:
              </span>
              <p className="text-slate-600">{currentData.refleksi?.yangDisukai}</p>
            </div>
            <div className="p-3 rounded-xl bg-rose-50/50 border border-rose-200">
              <span className="font-bold text-slate-800 block mb-1">
                3. Hal yang masih belum saya pahami:
              </span>
              <p className="text-slate-600">{currentData.refleksi?.yangBelumDipahami}</p>
            </div>
          </div>
        </section>

        {/* Document Footer */}
        <div className="border-t border-slate-200 pt-4 text-center text-xs text-slate-600 font-medium">
          Generator LKPD & Rubrik Penilaian SD • www.gurumerangkum.com
        </div>
      </div>

      {/* ============================================================ */}
      {/* REGENERATE MODAL */}
      {/* ============================================================ */}
      {showRegenModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-blue-800 font-bold text-lg">
              <RefreshCw className="w-5 h-5" />
              <span>Pilihan Penyesuaian Ulang (Regenerate)</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600">
              Pilih alasan penyesuaian yang Anda inginkan agar AI memperbarui isi LKPD secara spesifik:
            </p>

            <div className="space-y-2">
              {[
                { label: 'Lebih sederhana', desc: 'Kosakata lebih ringan dan instruksi lebih pendek untuk siswa.' },
                { label: 'Lebih menantang', desc: 'Tingkatkan kedalaman eksplorasi dan tantangan.' },
                { label: 'Lebih HOTS', desc: 'Fokus pada penalaran kritis dan pemecahan masalah mendalam.' },
                { label: 'Lebih kreatif', desc: 'Tambahkan aktivitas proyek mini dan kreasi visual.' },
                { label: 'Lebih kontekstual', desc: 'Kaitkan erat dengan lingkungan nyata sekitar siswa.' },
                { label: 'Sesuaikan dengan kelas', desc: 'Optimalkan tingkat pemahaman sesuai fase kelas.' },
                { label: 'Ubah aktivitas', desc: 'Ganti ragam langkah aktivitas dengan metode alternatif.' },
              ].map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => {
                    setShowRegenModal(false);
                    onRegenerate(item.label as RegenerateOption);
                  }}
                  className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-all group"
                >
                  <span className="font-bold text-xs sm:text-sm text-slate-800 group-hover:text-blue-800 block">
                    {item.label}
                  </span>
                  <span className="text-xs text-slate-500 block">{item.desc}</span>
                </button>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setShowRegenModal(false)}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
