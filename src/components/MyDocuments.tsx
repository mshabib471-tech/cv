import React, { useState, useEffect } from 'react';
import {
  FileText,
  FileSpreadsheet,
  Trash2,
  Copy,
  Edit,
  Download,
  Printer,
  Plus,
  Search,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { CVData, DocumentData, Language, ActiveView } from '../types';
import { StorageService } from '../lib/storage';
import { generateAndDownloadPDF, printDocument } from '../lib/pdf';
import { useTranslation } from '../lib/i18n';
import { TemplateLivePreview } from './TemplateLivePreview';

interface MyDocumentsProps {
  language: Language;
  onEditCV: (cv: CVData) => void;
  onEditDoc: (doc: DocumentData) => void;
  setActiveView: (view: ActiveView) => void;
}

export const MyDocuments: React.FC<MyDocumentsProps> = ({
  language,
  onEditCV,
  onEditDoc,
  setActiveView,
}) => {
  const t = useTranslation(language);
  const [cvList, setCvList] = useState<CVData[]>([]);
  const [docList, setDocList] = useState<DocumentData[]>([]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'cv' | 'doc'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const loadData = () => {
    setCvList(StorageService.getSavedCVs());
    setDocList(StorageService.getSavedDocuments());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDeleteCV = (id: string) => {
    if (confirm('Are you sure you want to delete this CV?')) {
      StorageService.deleteCV(id);
      loadData();
    }
  };

  const handleDeleteDoc = (id: string) => {
    if (confirm('Are you sure you want to delete this document?')) {
      StorageService.deleteDocument(id);
      loadData();
    }
  };

  const handleDuplicateCV = (cv: CVData) => {
    const copy: CVData = {
      ...cv,
      id: 'cv-' + Date.now(),
      fullName: `${cv.fullName} (Copy)`,
      lastModified: Date.now(),
    };
    StorageService.saveCV(copy);
    loadData();
  };

  const handleDuplicateDoc = (doc: DocumentData) => {
    const copy: DocumentData = {
      ...doc,
      id: 'doc-' + Date.now(),
      title: `${doc.title} (Copy)`,
      lastModified: Date.now(),
    };
    StorageService.saveDocument(copy);
    loadData();
  };

  // Filter lists
  const filteredCVs = cvList.filter(
    (c) =>
      c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.professionalTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredDocs = docList.filter(
    (d) =>
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {t.myDocuments}
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Access, edit, duplicate, or download all your locally saved CVs and documents.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveView('cv-builder')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition"
          >
            <Plus className="w-4 h-4" />
            <span>{t.createCV}</span>
          </button>
          <button
            onClick={() => setActiveView('doc-builder')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition"
          >
            <Plus className="w-4 h-4" />
            <span>Create Document</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-1 p-1 bg-white/80 border border-slate-200 rounded-xl shadow-2xs w-full sm:w-auto">
          <button
            onClick={() => setActiveFilter('all')}
            className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeFilter === 'all'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All ({cvList.length + docList.length})
          </button>
          <button
            onClick={() => setActiveFilter('cv')}
            className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeFilter === 'cv'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            CVs ({cvList.length})
          </button>
          <button
            onClick={() => setActiveFilter('doc')}
            className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeFilter === 'doc'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Documents ({docList.length})
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Filter saved documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white text-xs pl-8 pr-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-blue-500 shadow-2xs"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
        </div>
      </div>

      {/* Grid of Saved Items */}
      {cvList.length === 0 && docList.length === 0 ? (
        <div className="glass-card p-12 rounded-3xl border border-slate-200 text-center">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-slate-800 text-base">No saved documents yet</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto mb-6">
            Get started by creating your first CV or professional document. Everything is saved automatically!
          </p>
          <button
            onClick={() => setActiveView('cv-builder')}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20"
          >
            Create Your First CV
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* CV items */}
          {(activeFilter === 'all' || activeFilter === 'cv') &&
            filteredCVs.map((cv) => (
              <div
                key={cv.id}
                className="glass-card glass-card-hover p-5 rounded-2xl border border-slate-200/90 flex flex-col justify-between"
              >
                <div className="flex flex-col gap-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200/50">
                          CV Document
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleDuplicateCV(cv)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
                        title="Duplicate"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteCV(cv.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="aspect-[210/297] w-full bg-slate-50 rounded-xl border border-slate-200 overflow-hidden flex items-center justify-center p-4 relative group">
                    <div className="w-full max-w-[120px] shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                      <TemplateLivePreview
                        templateId={cv.templateId}
                        accentColor={cv.design.primaryColor}
                        language={cv.language === 'bn' ? 'Bangla' : 'English'}
                        isATS={cv.isATS}
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-base text-slate-900 line-clamp-1">{cv.fullName}</h3>
                    <p className="text-xs text-slate-500 font-medium line-clamp-1">{cv.professionalTitle}</p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(cv.lastModified).toLocaleDateString()}
                  </span>

                  <button
                    onClick={() => {
                      onEditCV(cv);
                      setActiveView('cv-builder');
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-2xs transition"
                  >
                    <Edit className="w-3 h-3" />
                    <span>Open Editor</span>
                  </button>
                </div>
              </div>
            ))}

          {/* Document items */}
          {(activeFilter === 'all' || activeFilter === 'doc') &&
            filteredDocs.map((doc) => (
              <div
                key={doc.id}
                className="glass-card glass-card-hover p-5 rounded-2xl border border-slate-200/90 flex flex-col justify-between"
              >
                <div className="flex flex-col gap-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
                        <FileSpreadsheet className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200/50">
                          {doc.category}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleDuplicateDoc(doc)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
                        title="Duplicate"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteDoc(doc.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="aspect-[210/297] w-full bg-slate-50 rounded-xl border border-slate-200 overflow-hidden flex items-center justify-center p-4 relative group">
                    <div className="w-full max-w-[120px] shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                      <TemplateLivePreview
                        category={doc.category}
                        language={doc.language === 'bn' ? 'Bangla' : 'English'}
                        accentColor="#4F46E5"
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-base text-slate-900 line-clamp-1">{doc.title}</h3>
                    <p className="text-xs text-slate-500 font-medium line-clamp-1">{doc.subject}</p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(doc.lastModified).toLocaleDateString()}
                  </span>

                  <button
                    onClick={() => {
                      onEditDoc(doc);
                      setActiveView('doc-builder');
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-2xs transition"
                  >
                    <Edit className="w-3 h-3" />
                    <span>Open Editor</span>
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};
