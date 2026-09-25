import React, { useState } from 'react';
import {
  Edit3,
  Eye,
  Download,
  Save,
  Plus,
  Trash2,
  CheckCircle,
  Calculator,
  ArrowLeft,
  FileCheck,
  Award,
} from 'lucide-react';
import { RubrikContent, RubrikItem, LkpdContent } from '../types';
import { buildRubrikDocument, buildCombinedDocument, downloadDocxBlob } from '../utils/docxExport';

interface RubrikViewerProps {
  rubrik: RubrikContent;
  referensiLkpd?: LkpdContent;
  onUpdateRubrik: (updated: RubrikContent) => void;
  onSave: (rubrik: RubrikContent) => void;
  onBackToForm: () => void;
}

export const RubrikViewer: React.FC<RubrikViewerProps> = ({
  rubrik,
  referensiLkpd,
  onUpdateRubrik,
  onSave,
  onBackToForm,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isDownloadingWord, setIsDownloadingWord] = useState(false);
  const [isDownloadingCombined, setIsDownloadingCombined] = useState(false);

  // Student scoring calculator state
  const [studentName, setStudentName] = useState('Ahmad Fauzan');
  const [studentScores, setStudentScores] = useState<Record<string, number>>({});

  // Local draft state for editing
  const [draft, setDraft] = useState<RubrikContent>(rubrik);

  React.useEffect(() => {
    setDraft(rubrik);
    // Initialize default scores (e.g. 3) for calculator
    const initial: Record<string, number> = {};
    rubrik.kriteriaList.forEach((k) => {
      initial[k.id] = 3;
    });
    setStudentScores(initial);
  }, [rubrik]);

  const currentData = isEditing ? draft : rubrik;

  // Calculate scores
  const totalSkorMaksimal = currentData.kriteriaList.length * 4;
  const totalSkorDiperoleh = Object.values(studentScores).reduce((a, b) => a + (b || 0), 0);
  const nilaiAkhir = totalSkorMaksimal > 0
    ? Math.round((totalSkorDiperoleh / totalSkorMaksimal) * 100)
    : 0;

  // Predicate label determination
  const averageScore = currentData.kriteriaList.length > 0
    ? totalSkorDiperoleh / currentData.kriteriaList.length
    : 0;

  let predikatLabel = currentData.kategoriPredikat?.skor1 || 'Perlu Bimbingan';
  if (averageScore >= 3.5) {
    predikatLabel = currentData.kategoriPredikat?.skor4 || 'Sangat Baik (A)';
  } else if (averageScore >= 2.5) {
    predikatLabel = currentData.kategoriPredikat?.skor3 || 'Baik (B)';
  } else if (averageScore >= 1.5) {
    predikatLabel = currentData.kategoriPredikat?.skor2 || 'Cukup (C)';
  }

  const handleScoreChange = (critId: string, score: number) => {
    setStudentScores((prev) => ({
      ...prev,
      [critId]: score,
    }));
  };

  const handleSaveEdit = () => {
    onUpdateRubrik(draft);
    setIsEditing(false);
  };

  const handleSaveToHistory = () => {
    onSave(isEditing ? draft : rubrik);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleDownloadWord = async () => {
    try {
      setIsDownloadingWord(true);
      const doc = buildRubrikDocument(isEditing ? draft : rubrik);
      const cleanTopik = (rubrik.identitas.topik || 'Materi')
        .replace(/[^a-zA-Z0-9]/g, '_')
        .substring(0, 30);
      const cleanKelas = (rubrik.identitas.kelas || 'SD').replace(/\s+/g, '_');
      const cleanMapel = (rubrik.identitas.mataPelajaran || 'Mapel').split(' ')[0];
      const filename = `Rubrik_Kelas_${cleanKelas}_${cleanMapel}_${cleanTopik}.docx`;

      await downloadDocxBlob(doc, filename);
    } catch (err) {
      console.error('Word export error:', err);
    } finally {
      setIsDownloadingWord(false);
    }
  };

  const handleDownloadCombined = async () => {
    if (!referensiLkpd) return;
    try {
      setIsDownloadingCombined(true);
      const doc = buildCombinedDocument(referensiLkpd, isEditing ? draft : rubrik);
      const cleanTopik = (rubrik.identitas.topik || 'Materi')
        .replace(/[^a-zA-Z0-9]/g, '_')
        .substring(0, 30);
      const cleanKelas = (rubrik.identitas.kelas || 'SD').replace(/\s+/g, '_');
      const filename = `LKPD_dan_Rubrik_Kelas_${cleanKelas}_${cleanTopik}.docx`;

      await downloadDocxBlob(doc, filename);
    } catch (err) {
      console.error('Combined docx export error:', err);
    } finally {
      setIsDownloadingCombined(false);
    }
  };

  const addCriteria = () => {
    const newCrit: RubrikItem = {
      id: `crit-new-${Date.now()}`,
      namaKriteria: 'Kriteria Penilaian Baru',
      deskripsi: 'Deskripsi aspek yang dinilai.',
      skor4: 'Menunjukkan pemahaman sangat mendalam dan mandiri.',
      skor3: 'Menunjukkan pemahaman baik dengan sedikit bantuan.',
      skor2: 'Menunjukkan pemahaman cukup, masih butuh bimbingan.',
      skor1: 'Belum menunjukkan pemahaman, perlu bimbingan penuh.',
      skorMaksimal: 4,
    };
    setDraft({
      ...draft,
      kriteriaList: [...draft.kriteriaList, newCrit],
    });
  };

  const removeCriteria = (index: number) => {
    const updated = draft.kriteriaList.filter((_, i) => i !== index);
    setDraft({ ...draft, kriteriaList: updated });
  };

  const updateCriteriaField = (index: number, fields: Partial<RubrikItem>) => {
    const updated = [...draft.kriteriaList];
    updated[index] = { ...updated[index], ...fields };
    setDraft({ ...draft, kriteriaList: updated });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
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
            id="btn-rubrik-toggle-edit"
            onClick={() => {
              if (isEditing) handleSaveEdit();
              else setIsEditing(true);
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

          {/* Save Button */}
          <button
            type="button"
            id="btn-save-rubrik-history"
            onClick={handleSaveToHistory}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-indigo-50 text-indigo-800 border border-indigo-200 hover:bg-indigo-100 transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Simpan</span>
          </button>

          {/* Download Rubrik Word */}
          <button
            type="button"
            id="btn-download-word-rubrik"
            onClick={handleDownloadWord}
            disabled={isDownloadingWord}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition-all active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>{isDownloadingWord ? 'Menyiapkan .docx...' : 'Download Rubrik Word (.docx)'}</span>
          </button>

          {/* Download Combined LKPD + Rubrik if referenced */}
          {referensiLkpd && (
            <button
              type="button"
              id="btn-download-combined-word"
              onClick={handleDownloadCombined}
              disabled={isDownloadingCombined}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-blue-700 to-indigo-700 text-white hover:opacity-95 shadow-md transition-all active:scale-95"
            >
              <FileCheck className="w-4 h-4" />
              <span>{isDownloadingCombined ? 'Menyiapkan...' : 'Download LKPD + Rubrik'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Save Success Alert */}
      {saveSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-xs">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>Rubrik berhasil disimpan ke Riwayat Dokumen!</span>
        </div>
      )}

      {/* ============================================================ */}
      {/* SIMULASI KALKULATOR NILAI OTOMATIS (SECTION 8) */}
      {/* ============================================================ */}
      <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-indigo-700/50 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/30 flex items-center justify-center text-indigo-300 font-bold">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold">Kalkulator Penilaian Otomatis Siswa</h2>
              <p className="text-xs text-indigo-200">
                Pilih skor yang diperoleh siswa pada tiap kriteria untuk menghitung Nilai Akhir & Predikat secara instan.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-300">Nama Siswa:</span>
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className="bg-indigo-950/60 border border-indigo-700/80 rounded-lg px-2.5 py-1 text-xs text-white font-medium"
              placeholder="Ketik nama siswa..."
            />
          </div>
        </div>

        {/* Scoring Buttons per Criterion */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {currentData.kriteriaList.map((crit, idx) => (
            <div key={crit.id || idx} className="bg-indigo-950/40 rounded-xl p-3 border border-indigo-800/40 space-y-2">
              <span className="text-xs font-semibold text-indigo-200 line-clamp-1">
                {idx + 1}. {crit.namaKriteria}
              </span>
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((s) => {
                  const isSelected = studentScores[crit.id] === s;
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => handleScoreChange(crit.id, s)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        isSelected
                          ? 'bg-amber-400 text-slate-950 shadow-md font-extrabold scale-105'
                          : 'bg-indigo-900/60 text-indigo-200 hover:bg-indigo-800'
                      }`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Result Metrics */}
        <div className="pt-2 border-t border-indigo-800/60 flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm">
          <div className="flex flex-wrap items-center gap-6">
            <div>
              <span className="text-indigo-300 block text-xs">Total Skor Diperoleh</span>
              <span className="text-lg sm:text-xl font-black text-white">
                {totalSkorDiperoleh} <span className="text-xs text-indigo-300 font-normal">/ {totalSkorMaksimal}</span>
              </span>
            </div>
            <div>
              <span className="text-indigo-300 block text-xs">Rumus Nilai Akhir</span>
              <span className="text-xs text-indigo-200 font-mono">
                ({totalSkorDiperoleh} / {totalSkorMaksimal}) × 100
              </span>
            </div>
            <div>
              <span className="text-indigo-300 block text-xs">Nilai Akhir (0–100)</span>
              <span className="text-2xl sm:text-3xl font-black text-amber-300">
                {nilaiAkhir}
              </span>
            </div>
          </div>

          <div className="bg-indigo-800/60 rounded-xl px-4 py-2 border border-indigo-600/50 flex items-center gap-2.5">
            <Award className="w-5 h-5 text-amber-300" />
            <div>
              <span className="text-xs text-indigo-200 block">Predikat Kinerja:</span>
              <span className="text-sm font-extrabold text-white">{predikatLabel}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* THE PRINT / PREVIEW / EDIT CANVAS (A4 DOCUMENT PAPER LOOK) */}
      {/* ============================================================ */}
      <div className="bg-white rounded-2xl border border-slate-300 shadow-xl overflow-hidden p-6 sm:p-10 text-slate-800 font-sans">
        {/* Document Header / KOP */}
        <div className="border-b-2 border-slate-900 pb-4 mb-6 text-center space-y-1">
          <p className="text-xs uppercase tracking-widest font-extrabold text-indigo-800">
            {currentData.identitas.namaSekolah || 'SEKOLAH DASAR'}
          </p>
          {isEditing ? (
            <input
              type="text"
              value={draft.judul}
              onChange={(e) => setDraft({ ...draft, judul: e.target.value })}
              className="text-center w-full text-xl sm:text-2xl font-black text-slate-900 border border-indigo-400 rounded-lg p-1"
            />
          ) : (
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {currentData.judul || 'RUBRIK PENILAIAN PEMBELAJARAN'}
            </h1>
          )}
          <p className="text-xs text-slate-600 font-medium">
            Kurikulum Merdeka • {currentData.identitas.mataPelajaran} • {currentData.identitas.kelas} ({currentData.identitas.fase})
          </p>
        </div>

        {/* Identity Table & Student Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm mb-6 p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div className="space-y-1">
            <div className="flex">
              <span className="w-28 font-bold text-slate-600">Mata Pelajaran</span>
              <span className="font-semibold text-slate-900">: {currentData.identitas.mataPelajaran}</span>
            </div>
            <div className="flex">
              <span className="w-28 font-bold text-slate-600">Kelas / Fase</span>
              <span className="font-semibold text-slate-900">: {currentData.identitas.kelas} / {currentData.identitas.fase}</span>
            </div>
            <div className="flex">
              <span className="w-28 font-bold text-slate-600">Jenis Tugas</span>
              <span className="font-semibold text-slate-900">: {currentData.identitas.jenisTugas || 'LKPD'}</span>
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex">
              <span className="w-28 font-bold text-slate-600">Topik / Materi</span>
              <span className="font-semibold text-slate-900">: {currentData.identitas.topik}</span>
            </div>
            <div className="flex">
              <span className="w-28 font-bold text-slate-600">Skala Penilaian</span>
              <span className="font-semibold text-slate-900">: {currentData.identitas.skala || '1–4'}</span>
            </div>
            <div className="flex">
              <span className="w-28 font-bold text-slate-600">Nama Siswa</span>
              <span className="font-semibold text-slate-900">: _________________________</span>
            </div>
          </div>
        </div>

        {/* Rubrik Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm sm:text-base font-bold text-indigo-900 uppercase tracking-wide">
              TABEL MATRIKS RUBRIK PENILAIAN
            </h2>
            {isEditing && (
              <button
                type="button"
                onClick={addCriteria}
                className="text-xs text-indigo-700 font-bold inline-flex items-center gap-1 hover:underline"
              >
                <Plus className="w-3.5 h-3.5" /> Tambah Kriteria
              </button>
            )}
          </div>

          <div className="overflow-x-auto border border-slate-300 rounded-xl">
            <table className="w-full text-xs sm:text-sm text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-900 border-b border-slate-300 text-xs uppercase font-extrabold">
                  <th className="p-3 w-10 text-center border-r border-slate-300">No</th>
                  <th className="p-3 w-44 border-r border-slate-300">Kriteria Penilaian</th>
                  <th className="p-3 w-48 border-r border-slate-300 bg-emerald-50/70 text-emerald-950">
                    Skor 4<br />
                    <span className="font-normal text-[11px] text-emerald-800">Sangat Baik</span>
                  </th>
                  <th className="p-3 w-48 border-r border-slate-300 bg-blue-50/70 text-blue-950">
                    Skor 3<br />
                    <span className="font-normal text-[11px] text-blue-800">Baik</span>
                  </th>
                  <th className="p-3 w-48 border-r border-slate-300 bg-amber-50/70 text-amber-950">
                    Skor 2<br />
                    <span className="font-normal text-[11px] text-amber-800">Cukup</span>
                  </th>
                  <th className="p-3 w-48 bg-rose-50/70 text-rose-950">
                    Skor 1<br />
                    <span className="font-normal text-[11px] text-rose-800">Perlu Bimbingan</span>
                  </th>
                  {isEditing && <th className="p-3 w-12 text-center">Aksi</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {currentData.kriteriaList.map((crit, idx) => (
                  <tr key={crit.id || idx} className="hover:bg-slate-50/50 align-top">
                    {/* No */}
                    <td className="p-3 text-center font-bold text-slate-500 border-r border-slate-300">
                      {idx + 1}
                    </td>

                    {/* Nama & Deskripsi Kriteria */}
                    <td className="p-3 border-r border-slate-300 space-y-1">
                      {isEditing ? (
                        <>
                          <input
                            type="text"
                            value={crit.namaKriteria}
                            onChange={(e) => updateCriteriaField(idx, { namaKriteria: e.target.value })}
                            className="w-full font-bold text-xs p-1.5 border rounded border-slate-300"
                          />
                          <textarea
                            rows={2}
                            value={crit.deskripsi}
                            onChange={(e) => updateCriteriaField(idx, { deskripsi: e.target.value })}
                            className="w-full text-xs p-1.5 border rounded border-slate-300"
                            placeholder="Deskripsi..."
                          />
                        </>
                      ) : (
                        <>
                          <p className="font-bold text-slate-900">{crit.namaKriteria}</p>
                          <p className="text-xs text-slate-500">{crit.deskripsi}</p>
                        </>
                      )}
                    </td>

                    {/* Skor 4 */}
                    <td className="p-3 border-r border-slate-300 bg-emerald-50/30">
                      {isEditing ? (
                        <textarea
                          rows={3}
                          value={crit.skor4}
                          onChange={(e) => updateCriteriaField(idx, { skor4: e.target.value })}
                          className="w-full text-xs p-1.5 border rounded border-slate-300"
                        />
                      ) : (
                        <p className="text-xs text-slate-700 leading-relaxed">{crit.skor4}</p>
                      )}
                    </td>

                    {/* Skor 3 */}
                    <td className="p-3 border-r border-slate-300 bg-blue-50/30">
                      {isEditing ? (
                        <textarea
                          rows={3}
                          value={crit.skor3}
                          onChange={(e) => updateCriteriaField(idx, { skor3: e.target.value })}
                          className="w-full text-xs p-1.5 border rounded border-slate-300"
                        />
                      ) : (
                        <p className="text-xs text-slate-700 leading-relaxed">{crit.skor3}</p>
                      )}
                    </td>

                    {/* Skor 2 */}
                    <td className="p-3 border-r border-slate-300 bg-amber-50/30">
                      {isEditing ? (
                        <textarea
                          rows={3}
                          value={crit.skor2}
                          onChange={(e) => updateCriteriaField(idx, { skor2: e.target.value })}
                          className="w-full text-xs p-1.5 border rounded border-slate-300"
                        />
                      ) : (
                        <p className="text-xs text-slate-700 leading-relaxed">{crit.skor2}</p>
                      )}
                    </td>

                    {/* Skor 1 */}
                    <td className="p-3 bg-rose-50/30">
                      {isEditing ? (
                        <textarea
                          rows={3}
                          value={crit.skor1}
                          onChange={(e) => updateCriteriaField(idx, { skor1: e.target.value })}
                          className="w-full text-xs p-1.5 border rounded border-slate-300"
                        />
                      ) : (
                        <p className="text-xs text-slate-700 leading-relaxed">{crit.skor1}</p>
                      )}
                    </td>

                    {/* Hapus Action in Edit Mode */}
                    {isEditing && (
                      <td className="p-3 text-center">
                        <button
                          type="button"
                          onClick={() => removeCriteria(idx)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Kategori Predikat & Catatan Penilaian Guru */}
        <div className="mt-6 pt-4 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs sm:text-sm">
          <div className="space-y-2">
            <span className="font-bold text-slate-800 uppercase tracking-wide block">
              Pedoman Konversi Nilai & Predikat:
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200">
                <span className="font-bold text-emerald-900 block">Skor 86–100:</span>
                <span className="text-emerald-700">Sangat Baik (A)</span>
              </div>
              <div className="p-2 rounded-lg bg-blue-50 border border-blue-200">
                <span className="font-bold text-blue-900 block">Skor 71–85:</span>
                <span className="text-blue-700">Baik (B)</span>
              </div>
              <div className="p-2 rounded-lg bg-amber-50 border border-amber-200">
                <span className="font-bold text-amber-900 block">Skor 56–70:</span>
                <span className="text-amber-700">Cukup (C)</span>
              </div>
              <div className="p-2 rounded-lg bg-rose-50 border border-rose-200">
                <span className="font-bold text-rose-900 block">Skor &lt; 55:</span>
                <span className="text-rose-700">Perlu Bimbingan (D)</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <span className="font-bold text-slate-800 uppercase tracking-wide block">
              Catatan Umpan Balik Guru:
            </span>
            <div className="border border-slate-300 rounded-xl p-3 h-24 text-xs text-slate-600">
              Tuliskan catatan perkembangan dan saran perbaikan untuk peserta didik di sini...
            </div>
          </div>
        </div>

        {/* Document Footer */}
        <div className="border-t border-slate-200 pt-6 mt-6 text-center text-xs text-slate-600 font-medium">
          Generator LKPD & Rubrik Penilaian SD • www.gurumerangkum.com
        </div>
      </div>
    </div>
  );
};
