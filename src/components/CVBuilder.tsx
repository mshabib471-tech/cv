import React, { useState, useRef } from 'react';
import {
  Sliders,
  Download,
  Printer,
  Layers,
  CheckCircle2,
  FileText,
  X,
  Eye,
  Info,
  Sparkles,
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
import { TemplateLivePreview } from './TemplateLivePreview';

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
  const [zoom, setZoom] = useState<number>(100);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [showTemplateModal, setShowTemplateModal] = useState<boolean>(false);
  const [showDesignDrawer, setShowDesignDrawer] = useState<boolean>(false);
  const [showFormAssistant, setShowFormAssistant] = useState<boolean>(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState<boolean>(false);
  const [pdfSuccessNotice, setPdfSuccessNotice] = useState<boolean>(false);
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
      if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
      autoSaveTimerRef.current = setTimeout(() => {
        StorageService.saveCV(next);
        setIsSaving(false);
      }, 800);
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
    setPdfSuccessNotice(false);
    try {
      const isMarriage = cv.category === 'Marriage CV' || cv.templateId?.includes('marriage');
      const cleanName = (cv.fullName || 'Professional')
        .trim()
        .replace(/[\s\W]+/g, '_')
        .replace(/^_+|_+$/g, '') || 'SmartCV';
      const docType = isMarriage
        ? 'Marriage_Biodata'
        : cv.templateId?.includes('corporate')
        ? 'Executive_Resume'
        : cv.templateId?.includes('ats')
        ? 'ATS_Resume'
        : 'Resume';
      const filename = `${cleanName}_${docType}.pdf`;
      const success = await generateAndDownloadPDF('cv-printable-document-container', filename);
      if (success) {
        setPdfSuccessNotice(true);
        setTimeout(() => setPdfSuccessNotice(false), 4000);
      }
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

  const currentTemplate = TEMPLATES_DATA.find((t) => t.id === cv.templateId);
  const isBangla = cv.language === 'bn' || cv.design?.fontFamily === 'Noto Sans Bengali';

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col bg-slate-100/90 relative">
      {/* Top Word-Style Toolbar */}
      <WordToolbar
        language={language}
        zoom={zoom}
        setZoom={setZoom}
        isSaving={isSaving}
        isGeneratingPDF={isGeneratingPDF}
        onDownloadPDF={handleDownloadPDF}
        onDownloadDocx={handleDownloadDocx}
        onPrint={() => printDocument(`${cv.fullName || 'SmartCV'}_Resume`)}
        onAddPage={handleAddPage}
        onRemovePage={handleRemovePage}
        currentPage={1}
        totalPages={cv.pagesCount || 1}
        activeFont={cv.design.fontFamily}
        onChangeFont={(f) => handleUpdateCV({ design: { ...cv.design, fontFamily: f } })}
        activeColor={cv.design.primaryColor}
        onChangeColor={(c) => handleUpdateCV({ design: { ...cv.design, primaryColor: c } })}
      />

      {/* Sub-header with Live Editor Guide & Quick Actions */}
      <div className="bg-white border-b border-slate-200/80 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-2xs z-20">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Template Switcher Pill */}
          <button
            onClick={() => setShowTemplateModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-2xs hover:border-blue-300 transition"
          >
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            <span>
              {isBangla ? 'টেমপ্লেট পরিবর্তন:' : 'Template:'}{' '}
              <strong className="text-slate-900">{currentTemplate?.name || 'Modern Blue'}</strong>
            </span>
          </button>

          {/* Design & Colors Drawer Toggle */}
          <button
            onClick={() => setShowDesignDrawer(!showDesignDrawer)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold shadow-2xs transition ${
              showDesignDrawer
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-blue-600" />
            <span>{isBangla ? 'ডিজাইন ও কালার' : 'Design & Layout'}</span>
          </button>

          {/* Optional Form Assistant Toggle */}
          <button
            onClick={() => setShowFormAssistant(!showFormAssistant)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold shadow-2xs transition ${
              showFormAssistant
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-slate-500" />
            <span>{isBangla ? 'ফর্ম তালিকা (ঐচ্ছিক)' : 'Form List (Optional)'}</span>
          </button>
        </div>

        {/* Live editing reminder tip */}
        <div className="hidden md:flex items-center gap-2 text-xs text-slate-600 bg-blue-50/80 border border-blue-200/60 rounded-xl px-3 py-1">
          <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span>
            {isBangla
              ? 'সরাসরি এডিটর চালু: সিভির যেকোনো লেখা বা ছবির উপর ক্লিক করে পরিবর্তন করুন!'
              : 'Direct live editor active: Click anywhere on text or photo to edit in-place!'}
          </span>
        </div>
      </div>

      {/* PDF Generation Success Toast */}
      {pdfSuccessNotice && (
        <div className="fixed top-28 right-6 z-50 bg-emerald-600 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-bold animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>{isBangla ? 'পিডিএফ সফলভাবে ডাউনলোড হয়েছে!' : 'PDF downloaded successfully!'}</span>
        </div>
      )}

      {/* Main Centerpiece: Live Document Editor */}
      <div className="flex-1 flex overflow-hidden w-full relative">
        {/* Optional Form Assistant Panel (Sliding Drawer - Only when explicitly toggled) */}
        {showFormAssistant && (
          <aside className="w-full sm:w-96 bg-white border-r border-slate-200/90 shadow-lg z-20 overflow-y-auto p-4 shrink-0 transition-all">
            <div className="mb-3 flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-800 text-sm">{isBangla ? 'ফর্ম ফিল্ডস' : 'Form Fields'}</h3>
                <p className="text-[11px] text-slate-500">
                  {isBangla
                    ? 'আপনি চাইলে সরাসরি লাইভ সিভিতেও এডিট করতে পারেন।'
                    : 'You can also click directly on the live document to edit.'}
                </p>
              </div>
              <button
                onClick={() => setShowFormAssistant(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <CVFormPanel cv={cv} onUpdateCV={handleUpdateCV} />
          </aside>
        )}

        {/* Primary Live A4 Canvas (Full focus & Spacious) */}
        <main className="flex-1 overflow-y-auto overflow-x-auto p-4 sm:p-8 flex flex-col items-center bg-slate-200/50">
          <div className="a4-page-scale-wrapper py-6 flex justify-center w-full">
            <A4Document
              cv={cv}
              scale={zoom / 100}
              onUpdateField={handleUpdateField}
              isEditable={true}
            />
          </div>
        </main>

        {/* Optional Design Drawer (Sliding Drawer on Right) */}
        {showDesignDrawer && (
          <aside className="w-full sm:w-88 bg-white border-l border-slate-200/90 shadow-lg z-20 overflow-y-auto p-4 shrink-0 transition-all">
            <div className="mb-3 flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-sm">{t.designSettings}</h3>
              <button
                onClick={() => setShowDesignDrawer(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <DesignSettingsPanel
              cv={cv}
              onUpdateCV={handleUpdateCV}
              onAddPage={handleAddPage}
              onRemovePage={handleRemovePage}
            />
          </aside>
        )}
      </div>

      {/* Template Selection Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="font-bold text-lg text-slate-900">
                  {isBangla ? 'সিভি টেমপ্লেট নির্বাচন করুন' : 'Choose a CV Template'}
                </h3>
                <p className="text-xs text-slate-500">
                  {isBangla
                    ? 'আপনার সমস্ত এডিট করা তথ্য ঠিক থাকবে এবং নতুন ডিজাইনে সাথে সাথে দেখা যাবে।'
                    : 'All your customized text and photo will be preserved in the new layout.'}
                </p>
              </div>
              <button
                onClick={() => setShowTemplateModal(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {TEMPLATES_DATA.filter(
                (tmpl) => tmpl.category === 'CV' || tmpl.category === 'Resume' || tmpl.category === 'Marriage CV'
              ).map((tmpl) => (
                <div
                  key={tmpl.id}
                  onClick={() => handleSelectTemplate(tmpl)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    cv.templateId === tmpl.id
                      ? 'border-blue-600 bg-blue-50/40 ring-2 ring-blue-500/20 shadow-md'
                      : 'border-slate-200 hover:border-blue-300 hover:shadow-md bg-white'
                  }`}
                >
                  <div className="w-full aspect-[210/297] max-h-48 rounded-xl mb-3 flex items-center justify-center p-2 bg-slate-50 border border-slate-200/80 overflow-hidden relative shadow-inner group">
                    <div className="w-full max-w-[150px] transform group-hover:scale-105 transition-transform duration-200">
                      <TemplateLivePreview
                        templateId={tmpl.id}
                        category={tmpl.category}
                        style={tmpl.style}
                        accentColor={tmpl.accentColor}
                        name={tmpl.name}
                        language={tmpl.language}
                        isATS={tmpl.isATS}
                      />
                    </div>
                    {tmpl.isATS && (
                      <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-emerald-600 text-white text-[9px] font-bold shadow-xs">
                        ATS 99%
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-sm text-slate-800">{tmpl.name}</h4>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{tmpl.description}</p>
                  <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold">
                      {tmpl.language}
                    </span>
                    <span>
                      {tmpl.pageCount} {tmpl.pageCount > 1 ? 'Pages' : 'Page'}
                    </span>
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
