import React from 'react';
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  ZoomIn,
  ZoomOut,
  Plus,
  Minus,
  CheckCircle2,
  Clock,
  Printer,
  Download,
  Share2,
  Eye,
  Type,
  Maximize2,
  Loader2,
  Image as ImageIcon,
} from 'lucide-react';
import { Language } from '../types';
import { useTranslation } from '../lib/i18n';

interface WordToolbarProps {
  language: Language;
  zoom: number;
  setZoom: (z: number) => void;
  isSaving: boolean;
  isGeneratingPDF?: boolean;
  isGeneratingJPEG?: boolean;
  onDownloadPDF: () => void;
  onDownloadJPEG?: () => void;
  onDownloadDocx: () => void;
  onPrint: () => void;
  onAddPage: () => void;
  onRemovePage: () => void;
  currentPage: number;
  totalPages: number;
  activeFont: string;
  onChangeFont: (font: string) => void;
  activeColor: string;
  onChangeColor: (color: string) => void;
  onFormatText?: (command: string, value?: string) => void;
}

export const WordToolbar: React.FC<WordToolbarProps> = ({
  language,
  zoom,
  setZoom,
  isSaving,
  isGeneratingPDF = false,
  isGeneratingJPEG = false,
  onDownloadPDF,
  onDownloadJPEG,
  onDownloadDocx,
  onPrint,
  onAddPage,
  onRemovePage,
  currentPage,
  totalPages,
  activeFont,
  onChangeFont,
  activeColor,
  onChangeColor,
  onFormatText,
}) => {
  const t = useTranslation(language);

  const handleCommand = (cmd: string, val?: string) => {
    if (onFormatText) {
      onFormatText(cmd, val);
    } else {
      document.execCommand(cmd, false, val);
    }
  };

  return (
    <div className="glass-panel border-b border-slate-200/80 sticky top-16 z-30 px-3 py-2 text-xs shadow-xs">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        {/* Left Toolbar Group: Text Formatting & Fonts */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {/* Font Family Dropdown */}
          <div className="flex items-center gap-1 bg-white/80 border border-slate-200/80 rounded-lg px-2 py-1 shadow-2xs">
            <Type className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={activeFont}
              onChange={(e) => onChangeFont(e.target.value)}
              className="bg-transparent font-medium text-slate-700 outline-none text-xs cursor-pointer"
            >
              <option value="Inter">Inter (Clean)</option>
              <option value="Noto Sans Bengali">Noto Sans Bengali (বাংলা)</option>
              <option value="Poppins">Poppins (Modern)</option>
              <option value="Roboto">Roboto (Technical)</option>
              <option value="serif">Times / Serif (Classic)</option>
            </select>
          </div>

          {/* Quick formatting buttons */}
          <div className="flex items-center gap-0.5 bg-white/80 border border-slate-200/80 rounded-lg p-0.5 shadow-2xs">
            <button
              onClick={() => handleCommand('bold')}
              title="Bold (Ctrl+B)"
              className="p-1.5 rounded hover:bg-slate-100 text-slate-700 hover:text-blue-600 transition"
            >
              <Bold className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleCommand('italic')}
              title="Italic (Ctrl+I)"
              className="p-1.5 rounded hover:bg-slate-100 text-slate-700 hover:text-blue-600 transition"
            >
              <Italic className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleCommand('underline')}
              title="Underline (Ctrl+U)"
              className="p-1.5 rounded hover:bg-slate-100 text-slate-700 hover:text-blue-600 transition"
            >
              <Underline className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Alignment Buttons */}
          <div className="hidden md:flex items-center gap-0.5 bg-white/80 border border-slate-200/80 rounded-lg p-0.5 shadow-2xs">
            <button
              onClick={() => handleCommand('justifyLeft')}
              title="Align Left"
              className="p-1.5 rounded hover:bg-slate-100 text-slate-700 hover:text-blue-600 transition"
            >
              <AlignLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleCommand('justifyCenter')}
              title="Align Center"
              className="p-1.5 rounded hover:bg-slate-100 text-slate-700 hover:text-blue-600 transition"
            >
              <AlignCenter className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleCommand('justifyRight')}
              title="Align Right"
              className="p-1.5 rounded hover:bg-slate-100 text-slate-700 hover:text-blue-600 transition"
            >
              <AlignRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleCommand('justifyFull')}
              title="Justify"
              className="p-1.5 rounded hover:bg-slate-100 text-slate-700 hover:text-blue-600 transition"
            >
              <AlignJustify className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Lists */}
          <div className="hidden sm:flex items-center gap-0.5 bg-white/80 border border-slate-200/80 rounded-lg p-0.5 shadow-2xs">
            <button
              onClick={() => handleCommand('insertUnorderedList')}
              title="Bullet List"
              className="p-1.5 rounded hover:bg-slate-100 text-slate-700 hover:text-blue-600 transition"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleCommand('insertOrderedList')}
              title="Numbered List"
              className="p-1.5 rounded hover:bg-slate-100 text-slate-700 hover:text-blue-600 transition"
            >
              <ListOrdered className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Color Picker Quick Palette */}
          <div className="flex items-center gap-1 bg-white/80 border border-slate-200/80 rounded-lg px-2 py-1 shadow-2xs">
            <span className="text-[11px] font-semibold text-slate-500 mr-1">Theme:</span>
            <input
              type="color"
              value={activeColor}
              onChange={(e) => onChangeColor(e.target.value)}
              className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent"
              title="Change Accent Color"
            />
          </div>

          {/* Zoom controls */}
          <div className="hidden lg:flex items-center gap-1 bg-white/80 border border-slate-200/80 rounded-lg px-2 py-1 shadow-2xs">
            <button
              onClick={() => setZoom(Math.max(60, zoom - 10))}
              className="p-0.5 hover:text-blue-600 text-slate-600"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="font-semibold text-slate-700 w-9 text-center">{zoom}%</span>
            <button
              onClick={() => setZoom(Math.min(140, zoom + 10))}
              className="p-0.5 hover:text-blue-600 text-slate-600"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Page Counter & Controls */}
          <div className="flex items-center gap-1 bg-white/80 border border-slate-200/80 rounded-lg px-2 py-1 shadow-2xs">
            <span className="font-medium text-slate-600">
              {t.pageOf} {currentPage} {t.of} {totalPages}
            </span>
            <button
              onClick={onAddPage}
              title="Add Page (A4)"
              className="ml-1 p-0.5 rounded hover:bg-blue-50 text-blue-600 hover:text-blue-700"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
            {totalPages > 1 && (
              <button
                onClick={onRemovePage}
                title="Remove Last Page"
                className="p-0.5 rounded hover:bg-red-50 text-red-500 hover:text-red-700"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Right Toolbar Group: Auto-Save Status, Download PDF, Print, DOC */}
        <div className="flex items-center gap-2">
          {/* Auto-save badge */}
          <div className="hidden sm:flex items-center gap-1 text-[11px] font-medium text-slate-500 mr-1">
            {isSaving ? (
              <>
                <Clock className="w-3 h-3 text-amber-500 animate-spin" />
                <span className="text-amber-600">{t.saving}</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                <span className="text-emerald-700">{t.allSaved}</span>
              </>
            )}
          </div>

          {/* Print Button */}
          <button
            id="word-toolbar-print-btn"
            onClick={onPrint}
            title={t.print}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white/90 hover:bg-white text-slate-700 hover:border-slate-300 font-semibold shadow-2xs active:scale-95 transition"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            <span className="hidden sm:inline">{t.print}</span>
          </button>

          {/* Word DOC Download */}
          <button
            id="word-toolbar-doc-btn"
            onClick={onDownloadDocx}
            title={t.downloadDOC}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white/90 hover:bg-white text-slate-700 hover:border-slate-300 font-semibold shadow-2xs active:scale-95 transition"
          >
            <Download className="w-3.5 h-3.5 text-indigo-600" />
            <span>Word (.doc)</span>
          </button>

          {/* JPG / JPEG Image Download */}
          {onDownloadJPEG && (
            <button
              id="word-toolbar-jpg-btn"
              onClick={onDownloadJPEG}
              disabled={isGeneratingJPEG}
              title={language === 'bn' ? 'জেপিজি ছবি হিসেবে সেভ করুন' : 'Save as JPG / JPEG'}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold shadow-2xs active:scale-95 transition"
            >
              {isGeneratingJPEG ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                  <span className="hidden sm:inline">{language === 'bn' ? 'তৈরি হচ্ছে...' : 'Saving...'}</span>
                </>
              ) : (
                <>
                  <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
                  <span>JPG</span>
                </>
              )}
            </button>
          )}

          {/* Primary Action: Download PDF */}
          <button
            id="word-toolbar-download-pdf-btn"
            onClick={onDownloadPDF}
            disabled={isGeneratingPDF}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-semibold text-white shadow-sm shadow-blue-500/20 active:scale-95 transition ${
              isGeneratingPDF
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
            }`}
          >
            {isGeneratingPDF ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>{language === 'bn' ? 'পিডিএফ তৈরি হচ্ছে...' : 'Generating PDF...'}</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>{t.downloadPDF}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
