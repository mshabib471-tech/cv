import React, { useState, useRef, useEffect } from 'react';
import {
  FileSpreadsheet,
  Download,
  Printer,
  FileText,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Plus,
  Trash2,
  Stamp,
  Sliders,
  Sparkles,
  Loader2,
  Image as ImageIcon,
  X,
} from 'lucide-react';
import { DocumentData, Language, DocumentTemplate } from '../types';
import { SAMPLE_DOCUMENTS } from '../data/sampleDocs';
import { TEMPLATES_DATA } from '../data/templates';
import { StorageService } from '../lib/storage';
import { generateAndDownloadPDF, exportDocumentAsJPEG, printDocument, DownloadReadyEventDetail } from '../lib/pdf';
import { useTranslation } from '../lib/i18n';

interface DocumentBuilderProps {
  language: Language;
  initialDoc?: DocumentData;
}

export const DocumentBuilder: React.FC<DocumentBuilderProps> = ({
  language,
  initialDoc,
}) => {
  const t = useTranslation(language);
  const [doc, setDoc] = useState<DocumentData>(
    initialDoc || SAMPLE_DOCUMENTS[0] || {
      id: 'doc-' + Date.now(),
      title: 'Official Job Application',
      category: 'Application',
      language: 'en',
      recipient: 'The Managing Director\nTech Innovations Ltd.\nDhaka, Bangladesh',
      date: '19 September 2026',
      subject: 'Application for the position of Senior Executive',
      salutation: 'Respected Sir,',
      bodyParagraphs: [
        'With reference to your job advertisement published on 15 September 2026, I would like to offer myself as an applicant for the above-mentioned post.',
        'I have completed my Master of Business Administration and have accumulated over 4 years of solid practical experience in operations and management.',
        'Therefore, I pray and hope that you would be kind enough to grant me an interview so that I may explain my suitability further.',
      ],
      closing: 'Yours faithfully,\n\nJohn Doe',
      design: {
        fontSize: '12pt',
        fontFamily: 'Inter',
        lineHeight: '1.6',
        showBorder: false,
        headerLogo: '',
      },
      lastModified: Date.now(),
    }
  );

  const [activeTab, setActiveTab] = useState<'editor' | 'templates'>('editor');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState<boolean>(false);
  const [isGeneratingJPEG, setIsGeneratingJPEG] = useState<boolean>(false);
  const [downloadReadyInfo, setDownloadReadyInfo] = useState<DownloadReadyEventDetail | null>(null);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleReady = (e: Event) => {
      const customEvt = e as CustomEvent<DownloadReadyEventDetail>;
      if (customEvt.detail) {
        setDownloadReadyInfo(customEvt.detail);
      }
    };
    window.addEventListener('smartdoc-download-ready', handleReady);
    return () => window.removeEventListener('smartdoc-download-ready', handleReady);
  }, []);

  const handleUpdate = (updatedFields: Partial<DocumentData>) => {
    setIsSaving(true);
    setDoc((prev: DocumentData) => {
      const next = {
        ...prev,
        ...updatedFields,
        lastModified: Date.now(),
      };
      if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
      autoSaveTimerRef.current = setTimeout(() => {
        StorageService.saveDocument(next);
        setIsSaving(false);
      }, 1000);
      return next;
    });
  };

  const handleAddParagraph = () => {
    handleUpdate({
      bodyParagraphs: [...doc.bodyParagraphs, 'Enter new paragraph text here...'],
    });
  };

  const handleUpdateParagraph = (idx: number, text: string) => {
    const updated = [...doc.bodyParagraphs];
    updated[idx] = text;
    handleUpdate({ bodyParagraphs: updated });
  };

  const handleRemoveParagraph = (idx: number) => {
    handleUpdate({
      bodyParagraphs: doc.bodyParagraphs.filter((_: string, i: number) => i !== idx),
    });
  };

  const handleSelectTemplate = (tmpl: DocumentTemplate) => {
    const matchedSample = SAMPLE_DOCUMENTS.find((d: DocumentData) => d.id === tmpl.id);
    if (matchedSample) {
      setDoc({ ...matchedSample, lastModified: Date.now() });
    } else {
      setDoc({
        id: 'doc-' + Date.now(),
        title: tmpl.name,
        category: tmpl.category,
        language: tmpl.language === 'বাংলা' ? 'bn' : 'en',
        recipient: tmpl.language === 'বাংলা' ? 'বরাবর\nমহাব্যবস্থাপক মহোদয়\nঢাকা, বাংলাদেশ' : 'To The General Manager\nCompany Name\nCity, Country',
        date: '19 September 2026',
        subject: tmpl.language === 'বাংলা' ? `বিষয়: ${tmpl.name} প্রসঙ্গে` : `Subject: Regarding ${tmpl.name}`,
        salutation: tmpl.language === 'বাংলা' ? 'জনাব,' : 'Dear Sir/Madam,',
        bodyParagraphs: [
          tmpl.language === 'বাংলা'
            ? 'বিনীত নিবেদন এই যে, আমি আপনার প্রতিষ্ঠানে দায়িত্ব পালনে সর্বদা নিষ্ঠাবান ছিলাম।'
            : 'With reference to the official protocols, I am submitting this formal document.',
        ],
        closing: tmpl.language === 'বাংলা' ? 'বিনীত,\nমুহাম্মদ রফিকুল ইসলাম' : 'Sincerely,\nJohn Doe',
        design: {
          fontSize: '12pt',
          fontFamily: tmpl.language === 'বাংলা' ? 'Noto Sans Bengali' : 'Inter',
          lineHeight: '1.6',
          showBorder: tmpl.category === 'Experience Certificate' || tmpl.category === 'Certificate',
        },
        lastModified: Date.now(),
      });
    }
    setActiveTab('editor');
  };

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const filename = `${doc.title.replace(/\s+/g, '_')}_SmartDoc.pdf`;
      await generateAndDownloadPDF('general-doc-printable', filename);
    } catch (err) {
      console.error('PDF generation error:', err);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleDownloadJPEG = async () => {
    setIsGeneratingJPEG(true);
    try {
      const filename = `${doc.title.replace(/\s+/g, '_')}_SmartDoc`;
      await exportDocumentAsJPEG('general-doc-printable', filename);
    } catch (err) {
      console.error('JPEG generation error:', err);
    } finally {
      setIsGeneratingJPEG(false);
    }
  };

  const isBangla = doc.language === 'bn' || doc.design?.fontFamily === 'Noto Sans Bengali';

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col bg-slate-100/70">
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

      {/* Top Action Bar */}
      <div className="glass-panel border-b border-slate-200/80 px-4 py-2.5 sticky top-16 z-30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-200">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-slate-900 text-sm">{doc.title}</h2>
            <p className="text-[11px] text-slate-500">{doc.category} • Word-style Editable Document</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab(activeTab === 'editor' ? 'templates' : 'editor')}
            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-2xs transition"
          >
            {activeTab === 'editor' ? 'Browse Doc Templates' : 'Back to Editor'}
          </button>

          <button
            onClick={() => printDocument(`${doc.title}_SmartDoc`)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-2xs transition"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.print}</span>
          </button>

          {/* JPG Download */}
          <button
            onClick={handleDownloadJPEG}
            disabled={isGeneratingJPEG}
            title={language === 'bn' ? 'জেপিজি ছবি হিসেবে সেভ করুন' : 'Save as JPG / JPEG'}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-xs font-semibold text-emerald-800 shadow-2xs transition active:scale-95"
          >
            {isGeneratingJPEG ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                <span className="hidden sm:inline">{language === 'bn' ? 'তৈরি হচ্ছে...' : 'Saving...'}</span>
              </>
            ) : (
              <>
                <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
                <span>{language === 'bn' ? 'জেপিজি ছবি (JPG)' : 'JPG Image'}</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownloadPDF}
            disabled={isGeneratingPDF}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-white text-xs font-semibold shadow-xs transition ${
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

      {activeTab === 'templates' ? (
        /* Document Templates Browser */
        <div className="max-w-7xl mx-auto p-6 sm:p-8 w-full">
          <div className="mb-6">
            <h2 className="text-2xl font-extrabold text-slate-900">Document Templates Collection</h2>
            <p className="text-sm text-slate-600">
              Select any official application, experience certificate, joining letter, resignation, or voucher.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {TEMPLATES_DATA.filter((t) => t.category !== 'CV' && t.category !== 'Resume' && t.category !== 'Marriage CV').map((tmpl) => (
              <div
                key={tmpl.id}
                onClick={() => handleSelectTemplate(tmpl)}
                className="glass-card glass-card-hover p-4 rounded-2xl border border-slate-200 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    {tmpl.category}
                  </span>
                  <h4 className="font-bold text-sm text-slate-800 mt-2">{tmpl.name}</h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{tmpl.description}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                  <span>{tmpl.language}</span>
                  <span className="text-blue-600 font-semibold">Load Template →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Editor & Live A4 Document Split */
        <div className="flex-1 flex flex-col lg:flex-row max-w-[1920px] mx-auto w-full">
          {/* Left Form Controls */}
          <aside className="w-full lg:w-96 bg-white/70 border-r border-slate-200/80 p-4 overflow-y-auto space-y-4 text-xs">
            <div className="bg-white/80 border border-slate-200/80 rounded-2xl p-4 shadow-2xs space-y-3">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-blue-600" />
                <span>Document Settings</span>
              </h3>

              <div>
                <label className="font-semibold text-slate-600 block mb-1">Document Title</label>
                <input
                  type="text"
                  value={doc.title}
                  onChange={(e) => handleUpdate({ title: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-600 block mb-1">Date</label>
                  <input
                    type="text"
                    value={doc.date}
                    onChange={(e) => handleUpdate({ date: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-600 block mb-1">Font</label>
                  <select
                    value={doc.design?.fontFamily}
                    onChange={(e) =>
                      handleUpdate({ design: { ...doc.design, fontFamily: e.target.value } })
                    }
                    className="w-full px-2 py-1.5 rounded-lg border border-slate-200 outline-none bg-white"
                  >
                    <option value="Inter">Inter (Clean)</option>
                    <option value="Noto Sans Bengali">Noto Sans Bengali (বাংলা)</option>
                    <option value="serif">Times / Serif (Formal)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <span className="font-semibold text-slate-700">Official Border Frame</span>
                <input
                  type="checkbox"
                  checked={doc.design?.showBorder}
                  onChange={(e) =>
                    handleUpdate({
                      design: { ...doc.design, showBorder: e.target.checked },
                    })
                  }
                  className="w-4 h-4 rounded text-blue-600 cursor-pointer"
                />
              </div>
            </div>

            {/* Recipient & Subject */}
            <div className="bg-white/80 border border-slate-200/80 rounded-2xl p-4 shadow-2xs space-y-3">
              <div>
                <label className="font-semibold text-slate-600 block mb-1">
                  {isBangla ? 'বরাবর / প্রাপকের বিবরণ' : 'To / Recipient Details'}
                </label>
                <textarea
                  rows={3}
                  value={doc.recipient}
                  onChange={(e) => handleUpdate({ recipient: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-600 block mb-1">
                  {isBangla ? 'বিষয় (Subject)' : 'Subject Line'}
                </label>
                <input
                  type="text"
                  value={doc.subject}
                  onChange={(e) => handleUpdate({ subject: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-600 block mb-1">
                  {isBangla ? 'সম্বোধন (Salutation)' : 'Salutation'}
                </label>
                <input
                  type="text"
                  value={doc.salutation}
                  onChange={(e) => handleUpdate({ salutation: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 outline-none"
                />
              </div>
            </div>

            {/* Paragraphs Editor */}
            <div className="bg-white/80 border border-slate-200/80 rounded-2xl p-4 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-800">Body Paragraphs</label>
                <button
                  onClick={handleAddParagraph}
                  className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 text-[11px]"
                >
                  <Plus className="w-3 h-3" /> Add Paragraph
                </button>
              </div>

              {doc.bodyParagraphs?.map((para: string, idx: number) => (
                <div key={idx} className="relative group">
                  <textarea
                    rows={3}
                    value={para}
                    onChange={(e) => handleUpdateParagraph(idx, e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none text-slate-700"
                  />
                  {doc.bodyParagraphs.length > 1 && (
                    <button
                      onClick={() => handleRemoveParagraph(idx)}
                      className="absolute top-2 right-2 p-1 rounded bg-white/90 text-red-500 hover:text-red-700 shadow-2xs"
                      title="Delete Paragraph"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Closing & Signatures */}
            <div className="bg-white/80 border border-slate-200/80 rounded-2xl p-4 shadow-2xs space-y-2">
              <label className="font-bold text-slate-800 block">Closing & Signatures</label>
              <textarea
                rows={3}
                value={doc.closing}
                onChange={(e) => handleUpdate({ closing: e.target.value })}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 outline-none"
              />
            </div>
          </aside>

          {/* Right Live A4 Sheet Preview */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center bg-slate-200/60">
            <div
              id="general-doc-printable"
              className={`a4-page shadow-2xl bg-white text-slate-900 mx-auto flex flex-col justify-between ${
                isBangla ? 'font-bengali' : doc.design?.fontFamily === 'serif' ? 'font-serif' : 'font-sans'
              }`}
              style={{
                width: '210mm',
                minHeight: '297mm',
                padding: '25mm',
                border: doc.design?.showBorder ? '4px double #1e293b' : 'none',
              }}
            >
              {/* Document Header */}
              <div>
                {/* Optional Certificate Center Heading */}
                {doc.category === 'Experience Certificate' || doc.category === 'Certificate' ? (
                  <div className="text-center pb-6 border-b-2 border-slate-800 mb-8">
                    <h1 className="text-2xl font-extrabold uppercase tracking-widest text-slate-900">
                      {doc.title}
                    </h1>
                    <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider">
                      To Whom It May Concern
                    </p>
                  </div>
                ) : null}

                {/* Date & Recipient */}
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-baseline text-xs text-slate-600">
                    <span>{doc.date}</span>
                  </div>

                  <div className="whitespace-pre-line text-sm text-slate-800 leading-relaxed font-medium">
                    {doc.recipient}
                  </div>

                  {doc.subject && (
                    <div className="font-bold text-sm text-slate-900 pt-2 border-b pb-1">
                      {doc.subject}
                    </div>
                  )}

                  {doc.salutation && (
                    <div className="text-sm font-semibold text-slate-800">
                      {doc.salutation}
                    </div>
                  )}
                </div>

                {/* Body Paragraphs */}
                <div className="space-y-4 text-sm text-slate-800 leading-relaxed text-justify">
                  {doc.bodyParagraphs?.map((para: string, idx: number) => (
                    <p key={idx} className="indent-6">
                      {para}
                    </p>
                  ))}
                </div>
              </div>

              {/* Bottom Sign-off */}
              <div className="pt-12 mt-auto">
                <div className="whitespace-pre-line text-sm text-slate-800 leading-relaxed">
                  {doc.closing}
                </div>
              </div>
            </div>
          </main>
        </div>
      )}
    </div>
  );
};
