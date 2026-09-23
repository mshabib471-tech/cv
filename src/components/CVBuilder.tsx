import React, { useState, useRef, useEffect } from 'react';
import {
  Download,
  Printer,
  Layers,
  CheckCircle2,
  X,
  Eye,
  Info,
  Sparkles,
} from 'lucide-react';
import { CVData, Language, DocumentTemplate } from '../types';
import { WordToolbar } from './WordToolbar';
import { A4Document } from './A4Document';
import { StorageService } from '../lib/storage';
import { generateAndDownloadPDF, exportDocumentAsJPEG, printDocument, DownloadReadyEventDetail, PDFGenerationProgress } from '../lib/pdf';
import { TEMPLATES_DATA } from '../data/templates';
import { useTranslation } from '../lib/i18n';
import { TemplateLivePreview } from './TemplateLivePreview';
import { useToast } from '../context/ToastContext';
import { AvatarPickerModal } from './AvatarPickerModal';
import { MasterProfileModal } from './MasterProfileModal';
import { ImageDownloadAgainModal } from './ImageDownloadAgainModal';
import { Star, Zap, UserCircle, Image as ImageIcon } from 'lucide-react';

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
  const [showAvatarPicker, setShowAvatarPicker] = useState<boolean>(false);
  const [showMasterProfile, setShowMasterProfile] = useState<boolean>(false);
  const [showDownloadAgainModal, setShowDownloadAgainModal] = useState<boolean>(false);
  const [lastExportedJpeg, setLastExportedJpeg] = useState<{ url: string; filename: string }>({
    url: '',
    filename: '',
  });
  const [isGeneratingPDF, setIsGeneratingPDF] = useState<boolean>(false);
  const [pdfSuccessNotice, setPdfSuccessNotice] = useState<boolean>(false);
  const [isGeneratingJPEG, setIsGeneratingJPEG] = useState<boolean>(false);
  const [jpegSuccessNotice, setJpegSuccessNotice] = useState<boolean>(false);
  const [downloadReadyInfo, setDownloadReadyInfo] = useState<DownloadReadyEventDetail | null>(null);

  // Mobile Touch Pinch-to-Zoom refs & state
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const initialPinchDistRef = useRef<number | null>(null);
  const initialZoomRef = useRef<number>(zoom);
  const isPinchingRef = useRef<boolean>(false);
  const lastTapTimeRef = useRef<number>(0);
  const [showPinchBadge, setShowPinchBadge] = useState<boolean>(false);
  const pinchTimeoutRef = useRef<any>(null);

  // Auto-fit initial zoom on mobile screens so the full document is immediately viewable
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      const screenW = window.innerWidth;
      // 210mm at 96 DPI is ~794px
      const fitZoom = Math.min(100, Math.max(45, Math.floor(((screenW - 20) / 794) * 100)));
      setZoom(fitZoom);
    }
  }, []);

  // Handlers for two-finger touch pinch-to-zoom and double-tap zoom
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 2) {
      // 2 fingers touch -> start pinch gesture
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      initialPinchDistRef.current = dist;
      initialZoomRef.current = zoom;
      isPinchingRef.current = true;
      setShowPinchBadge(true);
      if (pinchTimeoutRef.current) clearTimeout(pinchTimeoutRef.current);
    } else if (e.touches.length === 1) {
      // Single finger touch: check for double tap to toggle fit/edit zoom
      const now = Date.now();
      if (now - lastTapTimeRef.current < 280) {
        const screenW = typeof window !== 'undefined' ? window.innerWidth : 390;
        const fitZoom = Math.min(100, Math.max(45, Math.floor(((screenW - 20) / 794) * 100)));
        if (zoom <= fitZoom + 10) {
          setZoom(120);
        } else {
          setZoom(fitZoom);
        }
        setShowPinchBadge(true);
        if (pinchTimeoutRef.current) clearTimeout(pinchTimeoutRef.current);
        pinchTimeoutRef.current = setTimeout(() => setShowPinchBadge(false), 1400);
      }
      lastTapTimeRef.current = now;
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 2 && initialPinchDistRef.current && isPinchingRef.current) {
      const currentDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const ratio = currentDist / initialPinchDistRef.current;
      const nextZoom = Math.min(230, Math.max(35, Math.round(initialZoomRef.current * ratio)));
      setZoom(nextZoom);
      setShowPinchBadge(true);
      if (pinchTimeoutRef.current) clearTimeout(pinchTimeoutRef.current);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (isPinchingRef.current && e.touches.length < 2) {
      isPinchingRef.current = false;
      initialPinchDistRef.current = null;
      if (pinchTimeoutRef.current) clearTimeout(pinchTimeoutRef.current);
      pinchTimeoutRef.current = setTimeout(() => {
        setShowPinchBadge(false);
      }, 1400);
    }
  };

  const { toast, updateToast } = useToast();
  const activePdfToastIdRef = useRef<string | null>(null);
  const activeJpegToastIdRef = useRef<string | null>(null);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleReady = (e: Event) => {
      const customEvt = e as CustomEvent<DownloadReadyEventDetail>;
      if (customEvt.detail) {
        setDownloadReadyInfo(customEvt.detail);
        if (activePdfToastIdRef.current) {
          updateToast(activePdfToastIdRef.current, {
            downloadUrl: customEvt.detail.url,
            filename: customEvt.detail.filename,
          });
        }
        if (activeJpegToastIdRef.current) {
          updateToast(activeJpegToastIdRef.current, {
            downloadUrl: customEvt.detail.url,
            filename: customEvt.detail.filename,
          });
        }
      }
    };
    window.addEventListener('smartdoc-download-ready', handleReady);
    return () => window.removeEventListener('smartdoc-download-ready', handleReady);
  }, [updateToast]);

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
    const isBangladeshi = template.id.includes('bangladeshi') || template.id.includes('habib');
    const isMarriage = template.category === 'Marriage CV' || template.id.includes('marriage');
    const isExecutive = template.id.includes('executive') || template.style === 'Executive';
    const isTwoColumn = template.id.includes('two-column') || template.id.includes('corporate') || isExecutive;
    const isATS = template.id.includes('ats') || template.isATS || template.id.includes('student');

    handleUpdateCV({
      templateId: template.id,
      category: template.category,
      pagesCount: template.pageCount || cv.pagesCount || 1,
      isATS: template.isATS !== undefined ? template.isATS : cv.isATS,
      design: {
        ...cv.design,
        primaryColor: template.accentColor || cv.design.primaryColor,
        headerStyle: isBangladeshi
          ? 'bangladeshi'
          : isMarriage
          ? 'marriage'
          : isTwoColumn
          ? 'sidebar'
          : isATS
          ? 'minimal'
          : template.id.includes('creative')
          ? 'banner'
          : 'modern',
        fontFamily:
          template.language === 'বাংলা' ? 'Noto Sans Bengali' : cv.design.fontFamily,
      },
    });
    setShowTemplateModal(false);
  };

  // Download PDF
  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    setPdfSuccessNotice(false);
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

    const toastId = toast.loading('Preparing PDF...', {
      filename,
      progress: 10,
      message: language === 'bn' ? 'হাই-রেজোলিউশন পেজ রেন্ডার করা হচ্ছে...' : 'Rendering high-resolution document pages...',
    });
    activePdfToastIdRef.current = toastId;

    try {
      const success = await generateAndDownloadPDF(
        'cv-printable-document-container',
        filename,
        (prog) => {
          updateToast(toastId, {
            progress: prog.progress,
            message: prog.message,
          });
        }
      );

      if (success) {
        setPdfSuccessNotice(true);
        updateToast(toastId, {
          type: 'success',
          title: 'Download successful!',
          message: language === 'bn'
            ? 'আপনার পিডিএফ সফলভাবে ডাউনলোড হয়েছে।'
            : 'Your PDF has been generated and downloaded successfully.',
          progress: 100,
          filename,
        });
        setTimeout(() => setPdfSuccessNotice(false), 4000);
      } else {
        updateToast(toastId, {
          type: 'error',
          title: 'Error occurred',
          message: language === 'bn'
            ? 'পিডিএফ তৈরিতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।'
            : 'Failed to generate PDF document. Please try again.',
        });
      }
    } catch (err: any) {
      console.error('PDF generation error:', err);
      updateToast(toastId, {
        type: 'error',
        title: 'Error occurred',
        message: err?.message || (language === 'bn' ? 'পিডিএফ তৈরিতে সমস্যা হয়েছে।' : 'An unexpected error occurred during generation.'),
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // Download JPG / JPEG
  const handleDownloadJPEG = async () => {
    setIsGeneratingJPEG(true);
    setJpegSuccessNotice(false);
    const isMarriage = cv.category === 'Marriage CV' || cv.templateId?.includes('marriage');
    const cleanName = (cv.fullName || 'Professional')
      .trim()
      .replace(/[\s\W]+/g, '_')
      .replace(/^_+|_+$/g, '') || 'SmartCV';
    const docType = isMarriage
      ? 'Marriage_Biodata'
      : cv.templateId?.includes('bangladeshi') || cv.templateId?.includes('habib')
      ? 'Resume'
      : cv.templateId?.includes('corporate')
      ? 'Executive_Resume'
      : cv.templateId?.includes('ats')
      ? 'ATS_Resume'
      : 'Resume';
    // Append timestamp suffix so repeated saves auto-rename and work every time
    const timeSuffix = Date.now().toString().slice(-4);
    const filename = `${cleanName}_${docType}_${timeSuffix}`;

    const toastId = toast.loading('Preparing Image...', {
      filename: `${filename}.jpg`,
      progress: 15,
      message: language === 'bn' ? 'জেপিজি ছবি তৈরি হচ্ছে...' : 'Rendering high-resolution image...',
    });
    activeJpegToastIdRef.current = toastId;

    try {
      const res = await exportDocumentAsJPEG('cv-printable-document-container', filename);
      if (res.success) {
        setJpegSuccessNotice(true);
        if (res.dataUrl) {
          setLastExportedJpeg({
            url: res.dataUrl,
            filename: res.filename || `${filename}.jpg`,
          });
          setShowDownloadAgainModal(true);
        }
        updateToast(toastId, {
          type: 'success',
          title: 'Download successful!',
          message: language === 'bn'
            ? 'জেপিজি ছবি সফলভাবে ডাউনলোড হয়েছে।'
            : 'Image downloaded successfully.',
          progress: 100,
          filename: res.filename || `${filename}.jpg`,
        });
        setTimeout(() => setJpegSuccessNotice(false), 4000);
      } else {
        updateToast(toastId, {
          type: 'error',
          title: 'Error occurred',
          message: language === 'bn' ? 'ছবি তৈরিতে সমস্যা হয়েছে।' : 'Failed to generate image.',
        });
      }
    } catch (err: any) {
      console.error('JPEG generation error:', err);
      updateToast(toastId, {
        type: 'error',
        title: 'Error occurred',
        message: err?.message || 'Failed to generate image.',
      });
    } finally {
      setIsGeneratingJPEG(false);
    }
  };

  const handleDownloadAgain = () => {
    if (lastExportedJpeg.url) {
      const a = document.createElement('a');
      a.href = lastExportedJpeg.url;
      a.download = lastExportedJpeg.filename || 'SmartCV.jpg';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const handleToggleFavorite = () => {
    const updated = !cv.isFavorite;
    handleUpdateCV({ isFavorite: updated });
    StorageService.toggleFavoriteCV(cv.id);
    toast.success(
      updated
        ? isBangla ? 'সিভিটি পছন্দের তালিকায় যোগ করা হয়েছে!' : 'Added to favorites!'
        : isBangla ? 'পছন্দের তালিকা থেকে বাদ দেওয়া হয়েছে।' : 'Removed from favorites.'
    );
  };

  const currentTemplate = TEMPLATES_DATA.find((t) => t.id === cv.templateId);
  const isBangla = cv.language === 'bn' || cv.design?.fontFamily === 'Noto Sans Bengali';

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col bg-slate-100/90 relative">
      {/* Download Direct Link Fallback Banner */}
      {downloadReadyInfo && (
        <div className="bg-emerald-600 text-white px-4 py-2 flex flex-wrap items-center justify-between gap-3 shadow-md z-40 animate-in fade-in slide-in-from-top duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-200 shrink-0" />
            <span className="text-xs sm:text-sm font-medium">
              {language === 'bn'
                ? `আপনার ${downloadReadyInfo.type === 'pdf' ? 'পিডিএফ (PDF)' : 'জেপিজি ছবি (JPG)'} তৈরি হয়েছে! ডাউনলোড শুরু না হলে এখানে ক্লিক করুন:`
                : `Your ${downloadReadyInfo.type.toUpperCase()} is ready! If download didn't start automatically, click:`}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={downloadReadyInfo.url}
              download={downloadReadyInfo.filename}
              className="px-3.5 py-1.5 bg-white text-emerald-900 font-bold rounded-lg text-xs hover:bg-emerald-50 shadow-sm flex items-center gap-1.5 active:scale-95 transition"
            >
              <Download className="w-3.5 h-3.5 text-emerald-700" />
              <span>{language === 'bn' ? 'সরাসরি সেভ করুন' : 'Save File'}</span>
            </a>
            <a
              href={downloadReadyInfo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-medium rounded-lg text-xs flex items-center gap-1 transition"
            >
              <span>{language === 'bn' ? 'নতুন ট্যাবে খুলুন' : 'Open in New Tab'}</span>
            </a>
            <button
              onClick={() => setDownloadReadyInfo(null)}
              className="p-1 hover:bg-emerald-700/60 rounded-md text-emerald-100 transition ml-1"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Top Word-Style Toolbar */}
      <WordToolbar
        language={language}
        zoom={zoom}
        setZoom={setZoom}
        isSaving={isSaving}
        isGeneratingPDF={isGeneratingPDF}
        isGeneratingJPEG={isGeneratingJPEG}
        onDownloadPDF={handleDownloadPDF}
        onDownloadJPEG={handleDownloadJPEG}
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

          {/* Avatar / Photo Selector */}
          <button
            onClick={() => setShowAvatarPicker(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-2xs hover:border-purple-300 transition"
            title={isBangla ? 'সিভির ছবি বা প্রফেশনাল অ্যাভাটার নির্বাচন' : 'Change photo or pick avatar'}
          >
            <UserCircle className="w-3.5 h-3.5 text-purple-600" />
            <span>{isBangla ? 'ছবি / অ্যাভাটার' : 'Avatar / Photo'}</span>
          </button>

          {/* Master Profile & 1-Click Generator */}
          <button
            onClick={() => setShowMasterProfile(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-amber-200 bg-amber-50/70 hover:bg-amber-100 text-xs font-bold text-amber-800 shadow-2xs transition active:scale-95"
            title={isBangla ? 'আপনার মাস্টার প্রোফাইল ডাটাবেজ খুলুন' : 'Open master profile details'}
          >
            <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
            <span>{isBangla ? 'মাস্টার প্রোফাইল' : 'Master Profile'}</span>
          </button>

          {/* Favorite Toggle Button */}
          <button
            onClick={handleToggleFavorite}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold shadow-2xs transition ${
              cv.isFavorite
                ? 'border-amber-300 bg-amber-50 text-amber-800 font-bold'
                : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
            }`}
            title={isBangla ? 'প্রিয় সিভিতে যোগ/বাদ দিন' : 'Toggle favorite'}
          >
            <Star className={`w-3.5 h-3.5 ${cv.isFavorite ? 'text-amber-500 fill-amber-500' : 'text-slate-400'}`} />
            <span>{isBangla ? (cv.isFavorite ? 'পছন্দের সিভি' : 'ফেভারিট করুন') : (cv.isFavorite ? 'Favorited' : 'Favorite')}</span>
          </button>
        </div>

        {/* Live editing reminder tip */}

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

      {/* JPEG Generation Success Toast */}
      {jpegSuccessNotice && (
        <div className="fixed top-28 right-6 z-50 bg-teal-600 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-bold animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>{isBangla ? 'জেপিজি ছবি সফলভাবে ডাউনলোড হয়েছে!' : 'JPG image(s) downloaded successfully!'}</span>
        </div>
      )}

      {/* Main Centerpiece: Live Document Editor */}
      <div className="flex-1 flex overflow-hidden w-full relative">
        {/* Primary Live A4 Canvas (Full focus & Spacious) */}
        <main 
          ref={previewContainerRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="flex-1 overflow-y-auto overflow-x-auto p-3 sm:p-8 flex flex-col items-center bg-slate-200/50 pb-24 lg:pb-8 relative select-none"
          style={{ touchAction: 'pan-x pan-y' }}
        >
          {showPinchBadge && (
            <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[60] bg-slate-900/80 backdrop-blur-md text-white px-4 py-2 rounded-full text-xs font-bold border border-white/20 animate-in fade-in zoom-in duration-200">
              {isBangla ? 'জুম:' : 'Zoom:'} {zoom}%
            </div>
          )}
          <div className="a4-page-scale-wrapper py-4 sm:py-6 flex justify-center w-full">
            <A4Document
              cv={cv}
              setCV={setCV}
              scale={zoom / 100}
              onUpdateField={handleUpdateField}
              isEditable={true}
              onOpenAvatarPicker={() => setShowAvatarPicker(true)}
            />
          </div>
        </main>
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

      {/* Avatar Picker Modal */}
      <AvatarPickerModal
        isOpen={showAvatarPicker}
        onClose={() => setShowAvatarPicker(false)}
        selectedAvatar={cv.photoUrl}
        onSelectAvatar={(uri) => handleUpdateCV({ photoUrl: uri })}
        onUploadCustomPhoto={(dataUrl) => handleUpdateCV({ photoUrl: dataUrl })}
        language={language}
      />

      {/* Master Profile Modal & 1-Click Generator */}
      <MasterProfileModal
        isOpen={showMasterProfile}
        onClose={() => setShowMasterProfile(false)}
        language={language}
        onGenerateCV={(newCV) => setCV(newCV)}
      />

      {/* Image Download Again & Auto-Rename Modal */}
      <ImageDownloadAgainModal
        isOpen={showDownloadAgainModal}
        onClose={() => setShowDownloadAgainModal(false)}
        imageUrl={lastExportedJpeg.url}
        filename={lastExportedJpeg.filename}
        onDownloadAgain={handleDownloadAgain}
        onReExportLatest={handleDownloadJPEG}
        language={language}
        isExporting={isGeneratingJPEG}
      />
    </div>
  );
};
