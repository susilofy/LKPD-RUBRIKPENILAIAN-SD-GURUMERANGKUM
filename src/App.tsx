import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomeDashboard } from './components/HomeDashboard';
import { LkpdForm } from './components/LkpdForm';
import { LkpdViewer } from './components/LkpdViewer';
import { RubrikForm } from './components/RubrikForm';
import { RubrikViewer } from './components/RubrikViewer';
import { DocumentHistory } from './components/DocumentHistory';
import { GuideView } from './components/GuideView';
import {
  LkpdContent,
  RubrikContent,
  SavedDocument,
  LkpdFormInput,
  RegenerateOption,
} from './types';
import {
  getSavedDocuments,
  saveDocument,
  deleteDocument,
  duplicateDocument,
} from './utils/storage';
import {
  generateFallbackLkpd,
  generateFallbackRubrik,
  regenerateFallbackLkpd,
} from './utils/fallbackAi';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'beranda' | 'lkpd' | 'rubrik' | 'riwayat' | 'panduan'>('beranda');

  // Active documents being viewed/edited
  const [currentLkpd, setCurrentLkpd] = useState<LkpdContent | null>(null);
  const [currentRubrik, setCurrentRubrik] = useState<RubrikContent | null>(null);
  const [referensiLkpd, setReferensiLkpd] = useState<LkpdContent | null>(null);

  // Form input prepopulation (e.g. when duplicating or modifying)
  const [lkpdFormInitial, setLkpdFormInitial] = useState<Partial<LkpdFormInput> | undefined>(undefined);
  const [rubrikFormInitial, setRubrikFormInitial] = useState<any>(undefined);

  // Saved documents list
  const [documents, setDocuments] = useState<SavedDocument[]>([]);

  // Loading states
  const [isLoadingLkpd, setIsLoadingLkpd] = useState(false);
  const [isLoadingRubrik, setIsLoadingRubrik] = useState(false);
  const [isRegeneratingLkpd, setIsRegeneratingLkpd] = useState(false);

  // Load history on mount
  useEffect(() => {
    const loaded = getSavedDocuments();
    setDocuments(loaded);
  }, []);

  const refreshDocuments = () => {
    setDocuments(getSavedDocuments());
  };

  // Generate LKPD Handler
  const handleGenerateLkpd = async (input: LkpdFormInput) => {
    setIsLoadingLkpd(true);
    try {
      const res = await fetch('/api/generate-lkpd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data) {
          setCurrentLkpd(data.data);
          return;
        }
      }
      // If server returns fallback flag or fails, seamlessly use client-side pedagogical generator
      const fallback = generateFallbackLkpd(input);
      setCurrentLkpd(fallback);
    } catch (err) {
      console.warn('Using client-side fallback generation for LKPD:', err);
      const fallback = generateFallbackLkpd(input);
      setCurrentLkpd(fallback);
    } finally {
      setIsLoadingLkpd(false);
    }
  };

  // Regenerate LKPD Handler
  const handleRegenerateLkpd = async (option: RegenerateOption) => {
    if (!currentLkpd) return;
    setIsRegeneratingLkpd(true);
    try {
      const res = await fetch('/api/regenerate-lkpd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lkpd: currentLkpd, reason: option }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data) {
          setCurrentLkpd(data.data);
          return;
        }
      }

      // Fallback regenerate
      const updated = regenerateFallbackLkpd(currentLkpd, option);
      setCurrentLkpd(updated);
    } catch (err) {
      console.warn('Fallback regenerate applied:', err);
      const updated = regenerateFallbackLkpd(currentLkpd, option);
      setCurrentLkpd(updated);
    } finally {
      setIsRegeneratingLkpd(false);
    }
  };

  // Generate Rubrik Handler
  const handleGenerateRubrik = async (input: any) => {
    setIsLoadingRubrik(true);
    try {
      const res = await fetch('/api/generate-rubrik', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data) {
          setCurrentRubrik(data.data);
          if (input.referensiLkpd) {
            setReferensiLkpd(input.referensiLkpd);
          }
          return;
        }
      }

      // Fallback
      const fallback = generateFallbackRubrik(input);
      setCurrentRubrik(fallback);
      if (input.referensiLkpd) {
        setReferensiLkpd(input.referensiLkpd);
      }
    } catch (err) {
      console.warn('Using client-side fallback generation for Rubrik:', err);
      const fallback = generateFallbackRubrik(input);
      setCurrentRubrik(fallback);
      if (input.referensiLkpd) {
        setReferensiLkpd(input.referensiLkpd);
      }
    } finally {
      setIsLoadingRubrik(false);
    }
  };

  // Switch to Rubrik generator with LKPD prefilled
  const handleGenerateRubrikFromLkpd = (lkpd: LkpdContent) => {
    setReferensiLkpd(lkpd);
    setRubrikFormInitial({
      kelas: lkpd.identitas.kelas,
      fase: lkpd.identitas.fase,
      mataPelajaran: lkpd.identitas.mataPelajaran,
      topik: lkpd.identitas.topik,
      tujuanPembelajaran: lkpd.tujuanPembelajaran.join('; '),
      jenisTugas: 'LKPD',
      referensiLkpd: lkpd,
    });
    setCurrentRubrik(null);
    setActiveTab('rubrik');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Save Handlers
  const handleSaveLkpd = (lkpd: LkpdContent) => {
    const doc: SavedDocument = {
      id: lkpd.id || `lkpd-${Date.now()}`,
      title: lkpd.judul,
      type: 'lkpd',
      kelas: lkpd.identitas.kelas,
      fase: lkpd.identitas.fase,
      mataPelajaran: lkpd.identitas.mataPelajaran,
      topik: lkpd.identitas.topik,
      createdAt: lkpd.tanggalDibuat || new Date().toLocaleDateString('id-ID'),
      lkpdData: lkpd,
    };
    saveDocument(doc);
    refreshDocuments();
  };

  const handleSaveRubrik = (rubrik: RubrikContent) => {
    const doc: SavedDocument = {
      id: rubrik.id || `rubrik-${Date.now()}`,
      title: rubrik.judul,
      type: 'rubrik',
      kelas: rubrik.identitas.kelas,
      fase: rubrik.identitas.fase,
      mataPelajaran: rubrik.identitas.mataPelajaran,
      topik: rubrik.identitas.topik,
      createdAt: rubrik.tanggalDibuat || new Date().toLocaleDateString('id-ID'),
      rubrikData: rubrik,
    };
    saveDocument(doc);
    refreshDocuments();
  };

  // Document history handlers
  const handleOpenLkpdFromHistory = (lkpd: LkpdContent) => {
    setCurrentLkpd(lkpd);
    setActiveTab('lkpd');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenRubrikFromHistory = (rubrik: RubrikContent) => {
    setCurrentRubrik(rubrik);
    setActiveTab('rubrik');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDuplicateDoc = (docId: string) => {
    const dup = duplicateDocument(docId);
    if (dup) {
      refreshDocuments();
      if (dup.type === 'lkpd' && dup.lkpdData) {
        setCurrentLkpd(dup.lkpdData);
        setActiveTab('lkpd');
      } else if (dup.type === 'rubrik' && dup.rubrikData) {
        setCurrentRubrik(dup.rubrikData);
        setActiveTab('rubrik');
      }
    }
  };

  const handleDeleteDoc = (docId: string) => {
    deleteDocument(docId);
    refreshDocuments();
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-900 font-sans antialiased selection:bg-blue-600 selection:text-white">
      {/* Header Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        savedCount={documents.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* TAB 1: BERANDA */}
        {activeTab === 'beranda' && (
          <HomeDashboard
            onNavigate={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* TAB 2: GENERATOR LKPD */}
        {activeTab === 'lkpd' && (
          <div>
            {currentLkpd ? (
              <LkpdViewer
                lkpd={currentLkpd}
                onUpdateLkpd={(updated) => setCurrentLkpd(updated)}
                onSave={handleSaveLkpd}
                onRegenerate={handleRegenerateLkpd}
                onGenerateRubrikFromLkpd={handleGenerateRubrikFromLkpd}
                onBackToForm={() => setCurrentLkpd(null)}
                isRegenerating={isRegeneratingLkpd}
              />
            ) : (
              <LkpdForm
                initialData={lkpdFormInitial}
                onGenerate={handleGenerateLkpd}
                isLoading={isLoadingLkpd}
              />
            )}
          </div>
        )}

        {/* TAB 3: GENERATOR RUBRIK */}
        {activeTab === 'rubrik' && (
          <div>
            {currentRubrik ? (
              <RubrikViewer
                rubrik={currentRubrik}
                referensiLkpd={referensiLkpd || undefined}
                onUpdateRubrik={(updated) => setCurrentRubrik(updated)}
                onSave={handleSaveRubrik}
                onBackToForm={() => setCurrentRubrik(null)}
              />
            ) : (
              <RubrikForm
                initialData={rubrikFormInitial}
                onGenerate={handleGenerateRubrik}
                isLoading={isLoadingRubrik}
              />
            )}
          </div>
        )}

        {/* TAB 4: RIWAYAT DOKUMEN */}
        {activeTab === 'riwayat' && (
          <DocumentHistory
            documents={documents}
            onOpenLkpd={handleOpenLkpdFromHistory}
            onOpenRubrik={handleOpenRubrikFromHistory}
            onDuplicate={handleDuplicateDoc}
            onDelete={handleDeleteDoc}
            onNavigate={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* TAB 5: PANDUAN */}
        {activeTab === 'panduan' && <GuideView />}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default App;
