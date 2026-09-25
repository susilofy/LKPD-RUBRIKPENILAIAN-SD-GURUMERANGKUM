import React, { useState } from 'react';
import {
  Search,
  FileText,
  CheckSquare,
  Copy,
  Trash2,
  Download,
  FolderOpen,
  Calendar,
  Layers,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import { SavedDocument, LkpdContent, RubrikContent } from '../types';
import { buildLkpdDocument, buildRubrikDocument, downloadDocxBlob } from '../utils/docxExport';

interface DocumentHistoryProps {
  documents: SavedDocument[];
  onOpenLkpd: (lkpd: LkpdContent) => void;
  onOpenRubrik: (rubrik: RubrikContent) => void;
  onDuplicate: (docId: string) => void;
  onDelete: (docId: string) => void;
  onNavigate: (tab: 'lkpd' | 'rubrik') => void;
}

export const DocumentHistory: React.FC<DocumentHistoryProps> = ({
  documents,
  onOpenLkpd,
  onOpenRubrik,
  onDuplicate,
  onDelete,
  onNavigate,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'lkpd' | 'rubrik'>('all');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  // Filter documents
  const filteredDocs = documents.filter((doc) => {
    if (filterType !== 'all' && doc.type !== filterType) return false;

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      const matchTitle = doc.title.toLowerCase().includes(term);
      const matchMapel = doc.mataPelajaran.toLowerCase().includes(term);
      const matchKelas = doc.kelas.toLowerCase().includes(term);
      const matchTopik = doc.topik.toLowerCase().includes(term);
      return matchTitle || matchMapel || matchKelas || matchTopik;
    }
    return true;
  });

  const handleDownloadDirect = async (doc: SavedDocument) => {
    try {
      setDownloadingId(doc.id);
      if (doc.type === 'lkpd' && doc.lkpdData) {
        const docx = buildLkpdDocument(doc.lkpdData);
        const filename = `LKPD_${doc.kelas}_${doc.topik.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 25)}.docx`;
        await downloadDocxBlob(docx, filename);
      } else if (doc.type === 'rubrik' && doc.rubrikData) {
        const docx = buildRubrikDocument(doc.rubrikData);
        const filename = `Rubrik_${doc.kelas}_${doc.topik.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 25)}.docx`;
        await downloadDocxBlob(docx, filename);
      }
    } catch (err) {
      console.error('Direct download error:', err);
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Title & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Riwayat Dokumen Tersimpan
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Kelola, buka kembali, duplikat untuk kelas lain, dan unduh dokumen LKPD serta Rubrik Penilaian Anda.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-blue-100 text-blue-800">
            Total {documents.length} Dokumen
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari topik, kelas, mapel..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* Filter Type Pills */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setFilterType('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterType === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Semua ({documents.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType('lkpd')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterType === 'lkpd'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            LKPD ({documents.filter((d) => d.type === 'lkpd').length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType('rubrik')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterType === 'rubrik'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Rubrik ({documents.filter((d) => d.type === 'rubrik').length})
          </button>
        </div>
      </div>

      {/* Document List */}
      {filteredDocs.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center">
            <FolderOpen className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-800">Belum Ada Dokumen Tersimpan</h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
              {searchTerm
                ? 'Tidak ditemukan dokumen yang cocok dengan kata kunci pencarian Anda.'
                : 'Buat LKPD atau Rubrik Penilaian pertama Anda sekarang, lalu klik tombol "Simpan".'}
            </p>
          </div>
          <div className="pt-2 flex justify-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate('lkpd')}
              className="px-4 py-2.5 rounded-xl bg-blue-600 text-white text-xs sm:text-sm font-bold hover:bg-blue-700"
            >
              Buat LKPD Sekarang
            </button>
            <button
              type="button"
              onClick={() => onNavigate('rubrik')}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-xs sm:text-sm font-bold hover:bg-indigo-700"
            >
              Buat Rubrik Penilaian
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredDocs.map((doc) => {
            const isLkpd = doc.type === 'lkpd';
            return (
              <div
                key={doc.id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-blue-400 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  {/* Top Badges */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs px-2.5 py-1 rounded-md font-bold flex items-center gap-1.5 ${
                        isLkpd
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-indigo-100 text-indigo-800'
                      }`}
                    >
                      {isLkpd ? <FileText className="w-3.5 h-3.5" /> : <CheckSquare className="w-3.5 h-3.5" />}
                      <span>{isLkpd ? 'LEMBAR KERJA (LKPD)' : 'RUBRIK PENILAIAN'}</span>
                    </span>

                    <span className="text-xs text-slate-600 flex items-center gap-1 font-medium">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{doc.createdAt}</span>
                    </span>
                  </div>

                  {/* Title & Metadata */}
                  <div className="space-y-1">
                    <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-700 transition-colors line-clamp-2">
                      {doc.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-1">
                      {doc.mataPelajaran} • {doc.kelas} ({doc.fase})
                    </p>
                  </div>

                  {/* Topic snippet */}
                  <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="font-bold text-slate-700">Materi: </span>
                    <span>{doc.topik}</span>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    {/* Buka / Edit */}
                    <button
                      type="button"
                      onClick={() => {
                        if (isLkpd && doc.lkpdData) onOpenLkpd(doc.lkpdData);
                        else if (!isLkpd && doc.rubrikData) onOpenRubrik(doc.rubrikData);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white text-xs font-bold transition-all flex items-center gap-1"
                    >
                      <FolderOpen className="w-3.5 h-3.5" />
                      <span>Buka & Edit</span>
                    </button>

                    {/* Duplikat */}
                    <button
                      type="button"
                      title="Duplikasi dokumen ini untuk diubah ke kelas lain"
                      onClick={() => onDuplicate(doc.id)}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-bold transition-all flex items-center gap-1"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Duplikat</span>
                    </button>

                    {/* Hapus */}
                    <button
                      type="button"
                      title="Hapus dokumen dari riwayat"
                      onClick={() => onDelete(doc.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Download Word button */}
                  <button
                    type="button"
                    title="Unduh langsung ke Word (.docx)"
                    onClick={() => handleDownloadDirect(doc)}
                    disabled={downloadingId === doc.id}
                    className="p-2 rounded-lg bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 transition-colors"
                  >
                    <Download className={`w-4 h-4 ${downloadingId === doc.id ? 'animate-bounce' : ''}`} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
