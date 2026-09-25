import React from 'react';
import { Globe, Heart, GraduationCap, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-16 bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center border-b border-slate-800 pb-8">
          {/* Brand & Purpose */}
          <div className="space-y-2 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="font-bold text-white text-base tracking-wide">
                GENERATOR LKPD & RUBRIK SD
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 max-w-sm">
              Membantu guru Sekolah Dasar (Kelas 1–6) menyusun LKPD dan Rubrik Penilaian Kurikulum Merdeka secara terstruktur, mendalam (deep learning), dan siap unduh Microsoft Word (.docx).
            </p>
          </div>

          {/* Quick Links & Info */}
          <div className="text-center space-y-1 text-xs sm:text-sm text-slate-400">
            <p className="font-semibold text-slate-200">Dedikasi Pendidikan Dasar Indonesia</p>
            <p>Mendukung Semua Mata Pelajaran • Kelas 1 sampai Kelas 6</p>
            <p className="text-slate-500">Ekspor Dokumen Microsoft Word (.docx) & Google Docs</p>
          </div>

          {/* Developer Identity */}
          <div className="text-center md:text-right space-y-2">
            <span className="text-xs uppercase tracking-wider text-blue-400 font-semibold block">
              Identitas Pengembang
            </span>
            <p className="text-sm font-bold text-white">
              Susilo Fitri Yatmoko, M.Pd
            </p>
            <a
              id="footer-developer-link"
              href="https://www.gurumerangkum.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors hover:underline"
            >
              <Globe className="w-4 h-4" />
              <span>www.gurumerangkum.com</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </a>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
          <p>© 2026 Susilo Fitri Yatmoko, M.Pd. Hak Cipta Dilindungi Undang-Undang.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Dirancang untuk kemudahan bapak & ibu guru SD</span>
            <Heart className="w-3.5 h-3.5 text-red-500 inline fill-red-500" />
          </div>
        </div>
      </div>
    </footer>
  );
};
