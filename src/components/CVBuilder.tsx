import React, { useState, useEffect, useRef } from 'react';
import {
  FileText,
  Sliders,
  ChevronLeft,
  ChevronRight,
  Download,
  Printer,
  Sparkles,
  Layers,
  Check,
  Smartphone,
  Monitor,
  Maximize,
} from 'lucide-react';
import { CVData, Language, DocumentTemplate } from '../types';
import { WordToolbar } from './WordToolbar';
import { A4Document } from './A4Document';
import { CVFormPanel } from './CVFormPanel';
import { DesignSettingsPanel } from './DesignSettingsPanel';
import { StorageService } from '../lib/storage';
import { generateAndDownloadPDF, printDocument, downloadAsDocx } from '../lib/pdf';
import { TEMPLATES_DATA } from '../data/templates';
import { useTranslation } from '../lib/i18n';

interface CVBuilderProps {
  cv: CVData;
  setCV: React.Dispatch<React.SetStateAction<CVData>>;
  language: Language;
  onBackToHome?: () => void;
}

export const CVBuilder: React.FC<CVBuilderProps> = ({
  cv,
  setCV,
  language,
  onBackToHome,
}) => {
  const t = useTranslation(language);
  const [zoom, setZoom] = useState<number>(95);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [mobileTab, setMobileTab] = useState<'content' | 'preview' | 'design'>('preview');
  const [showTemplateModal, setShowTemplateModal] = useState<boolean>(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState<boolean>(false);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-save logic
  const handleUpdateCV = (updatedFields: Partial<CVData>) => {
    setIsSaving(true);
    setCV((prev) => {
      const next = {
        ...prev,
        ...updatedFields,
        lastModified: Date.now(),
      };
      // Schedule debounce auto-save to storage
      if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
      autoSaveTimerRef.current = setTimeout(() => {
        StorageService.saveCV(next);
        setIsSaving(false);
      }, 1000);
      return next;
    });
  };

  const handleUpdateField = (field: keyof CVData, val: any) => {
    handleUpdateCV({ [field]: val });
  };

  // Add & Remove pages
  const handleAddPage = () => {
    const nextCount = Math.min(5, (cv.pagesCount || 1) + 1);
    handleUpdateCV({ pagesCount: nextCount });
  };

  const handleRemovePage = () => {
    const nextCount = Math.max(1, (cv.pagesCount || 1) - 1);
    handleUpdateCV({ pagesCount: nextCount });
  };

  // Switch Template
  const handleSelectTemplate = (template: DocumentTemplate) => {
    handleUpdateCV({
      templateId: template.id,
      design: {
        ...cv.design,
        primaryColor: template.accentColor || cv.design.primaryColor,
        headerStyle: template.id.includes('two-column')
          ? 'sidebar'
          : template.id.includes('creative')
          ? 'banner'
          : 'modern',
        fontFamily: template.language === 'বাংলা' ? 'Noto Sans Bengali' : cv.design.fontFamily,
      },
    });
    setShowTemplateModal(false);
  };

  // Download PDF
  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const filename = `${(cv.fullName || 'CV').replace(/\s+/g, '_')}_SmartCV.pdf`;
      await generateAndDownloadPDF('cv-printable-document-container', filename);
    } catch (err) {
      console.error('PDF generation error:', err);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // Download DOC
  const handleDownloadDocx = () => {
    const docElem =
      document.getElementById('cv-printable-document-container') ||
      document.getElementById('cv-printable-document');
    if (docElem) {
      downloadAsDocx(cv.fullName || 'My_CV', docElem.innerHTML);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col bg-slate-100/70">
      {/* Top Word-Style Toolbar */}
      <WordToolbar
        language={language}
        zoom={zoom}
        setZoom={setZoom}
        isSaving={isSaving}
        isGeneratingPDF={isGeneratingPDF}
        onDownloadPDF={handleDownloadPDF}
        onDownloadDocx={handleDownloadDocx}
        onPrint={printDocument}
        onAddPage={handleAddPage}
        onRemovePage={handleRemovePage}
        currentPage={1}
        totalPages={cv.pagesCount || 1}
        activeFont={cv.design.fontFamily}
        onChangeFont={(f) => handleUpdateCV({ design: { ...cv.design, fontFamily: f } })}
        activeColor={cv.design.primaryColor}
        onChangeColor={(c) => handleUpdateCV({ design: { ...cv.design, primaryColor: c } })}
      />

      {/* Sub-header with Template Switcher & View Toggles */}
      <div className="bg-white/80 border-b border-slate-200/80 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowTemplateModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-2xs hover:border-blue-300 transition"
          >
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            <span>Switch Template ({TEMPLATES_DATA.find((t) => t.id === cv.templateId)?.name || 'Modern Blue'})</span>
          </button>
        </div>

        {/* Mobile View Switcher (Bottom / Sub-header) */}
        <div className="flex lg:hidden items-center p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => setMobileTab('content')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
              mobileTab === 'content' ? 'bg-white text-blue-600 shadow-2xs' : 'text-slate-600'
            }`}
          >
            Form
          </button>
          <button
            onClick={() => setMobileTab('preview')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
              mobileTab === 'preview' ? 'bg-white text-blue-600 shadow-2xs' : 'text-slate-600'
            }`}
          >
            Live A4
          </button>
          <button
            onClick={() => setMobileTab('design')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
              mobileTab === 'design' ? 'bg-white text-blue-600 shadow-2xs' : 'text-slate-600'
            }`}
          >
            Design
          </button>
        </div>
      </div>

      {/* Main 3-Column Layout: [Left Tools] | [Center Live A4 Document] | [Right Design Settings] */}
      <div className="flex-1 flex overflow-hidden max-w-[1920px] mx-auto w-full">
        {/* Left Column: Form Sections & Content Tools (Desktop or Mobile active) */}
        <aside
          className={`w-full lg:w-80 xl:w-96 bg-white/70 border-r border-slate-200/80 overflow-y-auto p-4 shrink-0 transition-all ${
            mobileTab === 'content' ? 'block' : 'hidden lg:block'
          }`}
          style={{ height: 'calc(100vh - 8rem)' }}
        >
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-sm">{t.tools}</h3>
            <span className="text-[11px] text-slate-500 font-medium">Click to expand</span>
          </div>
          <CVFormPanel cv={cv} onUpdateCV={handleUpdateCV} />
        </aside>

        {/* Center Column: Live A4 Document Container with Realtime Visuals */}
        <main
          className={`flex-1 overflow-y-auto overflow-x-auto p-4 sm:p-8 flex justify-center bg-slate-200/60 ${
            mobileTab === 'preview' ? 'block' : 'hidden lg:flex'
          }`}
          style={{ height: 'calc(100vh - 8rem)' }}
        >
          <div className="a4-page-scale-wrapper py-4 flex justify-center w-full">
            <A4Document
              cv={cv}
              scale={zoom / 100}
              onUpdateField={handleUpdateField}
              isEditable={true}
            />
          </div>
        </main>

        {/* Right Column: Design Settings & Properties (Desktop or Mobile active) */}
        <aside
          className={`w-full lg:w-80 xl:w-88 bg-white/70 border-l border-slate-200/80 overflow-y-auto p-4 shrink-0 transition-all ${
            mobileTab === 'design' ? 'block' : 'hidden lg:block'
          }`}
          style={{ height: 'calc(100vh - 8rem)' }}
        >
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-sm">{t.designSettings}</h3>
            <span className="text-[11px] text-slate-500 font-medium">Colors & Typography</span>
          </div>
          <DesignSettingsPanel
            cv={cv}
            onUpdateCV={handleUpdateCV}
            onAddPage={handleAddPage}
            onRemovePage={handleRemovePage}
          />
        </aside>
      </div>

      {/* Template Selection Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg text-slate-900">Choose a CV Style</h3>
                <p className="text-xs text-slate-500">Your information will automatically adapt to the new design without data loss.</p>
              </div>
              <button
                onClick={() => setShowTemplateModal(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {TEMPLATES_DATA.filter((t) => t.category === 'CV' || t.category === 'Resume' || t.category === 'Marriage CV').map((tmpl) => (
                <div
                  key={tmpl.id}
                  onClick={() => handleSelectTemplate(tmpl)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    cv.templateId === tmpl.id
                      ? 'border-blue-600 bg-blue-50/40 ring-2 ring-blue-500/20'
                      : 'border-slate-200 hover:border-blue-300 hover:shadow-md'
                  }`}
                >
                  <div
                    className="w-full h-32 rounded-xl mb-3 flex flex-col justify-between p-3 text-white relative overflow-hidden"
                    style={{ backgroundColor: tmpl.accentColor }}
                  >
                    <div className="text-xs font-bold uppercase tracking-wider">{tmpl.style}</div>
                    <div className="space-y-1">
                      <div className="h-2 w-20 bg-white/90 rounded-full" />
                      <div className="h-1.5 w-14 bg-white/60 rounded-full" />
                    </div>
                    {tmpl.isATS && (
                      <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-xs text-[10px] font-bold">
                        ATS 99%
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-sm text-slate-800">{tmpl.name}</h4>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{tmpl.description}</p>
                  <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                    <span>{tmpl.language}</span>
                    <span>{tmpl.pageCount} Page{tmpl.pageCount > 1 ? 's' : ''}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
