import React, { useState, useMemo } from 'react';
import {
  Search,
  SlidersHorizontal,
  FileText,
  Briefcase,
  Award,
  HeartHandshake,
  ScrollText,
  FileSpreadsheet,
  CheckCircle2,
  Sparkles,
  Eye,
  Check,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { DocumentTemplate, TemplateCategory, Language, ActiveView, CVData } from '../types';
import { TEMPLATES_DATA } from '../data/templates';
import { useTranslation } from '../lib/i18n';
import { TemplateLivePreview } from './TemplateLivePreview';

interface TemplateMarketplaceProps {
  language: Language;
  onSelectTemplate: (template: DocumentTemplate) => void;
  setActiveView: (view: ActiveView) => void;
  initialSearchQuery?: string;
  initialCategory?: string;
}

export const TemplateMarketplace: React.FC<TemplateMarketplaceProps> = ({
  language,
  onSelectTemplate,
  setActiveView,
  initialSearchQuery = '',
  initialCategory = 'All',
}) => {
  const t = useTranslation(language);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedLangFilter, setSelectedLangFilter] = useState<string>('All');
  const [selectedPageFilter, setSelectedPageFilter] = useState<number | 'All'>('All');
  const [previewTemplate, setPreviewTemplate] = useState<DocumentTemplate | null>(null);

  const categories: { label: string; count: number }[] = [
    { label: 'All', count: TEMPLATES_DATA.length },
    { label: 'CV', count: TEMPLATES_DATA.filter((t) => t.category === 'CV').length },
    { label: 'Resume', count: TEMPLATES_DATA.filter((t) => t.category === 'Resume').length },
    { label: 'Marriage CV', count: TEMPLATES_DATA.filter((t) => t.category === 'Marriage CV').length },
    { label: 'Application', count: TEMPLATES_DATA.filter((t) => t.category === 'Application').length },
    { label: 'Experience Certificate', count: TEMPLATES_DATA.filter((t) => t.category === 'Experience Certificate').length },
    { label: 'Joining Letter', count: TEMPLATES_DATA.filter((t) => t.category === 'Joining Letter').length },
    { label: 'Resignation Letter', count: TEMPLATES_DATA.filter((t) => t.category === 'Resignation Letter').length },
    { label: 'Certificate', count: TEMPLATES_DATA.filter((t) => t.category === 'Certificate').length },
    { label: 'Money Receipt', count: TEMPLATES_DATA.filter((t) => t.category === 'Money Receipt').length },
    { label: 'Question / Exam', count: TEMPLATES_DATA.filter((t) => t.category === 'Question / Exam').length },
  ];

  // Filter templates
  const filteredTemplates = useMemo(() => {
    return TEMPLATES_DATA.filter((item) => {
      // Category match
      if (selectedCategory !== 'All' && item.category !== selectedCategory) {
        return false;
      }
      // Language match
      if (selectedLangFilter !== 'All') {
        if (selectedLangFilter === 'English' && item.language !== 'English') return false;
        if (selectedLangFilter === 'Bangla' && item.language !== 'বাংলা') return false;
      }
      // Page match
      if (selectedPageFilter !== 'All' && item.pageCount !== selectedPageFilter) {
        return false;
      }
      // Search match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          item.name.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          item.style.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [selectedCategory, selectedLangFilter, selectedPageFilter, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-card border border-blue-200/70 text-xs font-semibold text-blue-700 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>35+ Curated Professional Templates</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {t.templates}
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Browse CVs, resumes, marriage biodatas, official applications, experience certificates, and more.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/80 focus:bg-white text-sm text-slate-800 pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-2xs outline-none transition"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-3 text-xs text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Main Layout: Categories Sidebar + Grid */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Sidebar: Categories & Filter Facets */}
        <aside className="w-full lg:w-64 shrink-0 space-y-6">
          {/* Categories List */}
          <div className="glass-card p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2 px-2 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-blue-600" />
              <span>{t.categories}</span>
            </h3>
            {categories.map((cat) => (
              <button
                key={cat.label}
                onClick={() => setSelectedCategory(cat.label)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition ${
                  selectedCategory === cat.label
                    ? 'bg-blue-600 text-white font-semibold shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100/80'
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    selectedCategory === cat.label
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            ))}
          </div>

          {/* Language Filter */}
          <div className="glass-card p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
            <h4 className="font-bold text-slate-800 text-xs">Language</h4>
            <div className="grid grid-cols-3 gap-1">
              {['All', 'English', 'Bangla'].map((lang) => (
                <button
                  key={lang}
                  onClick={() => setSelectedLangFilter(lang)}
                  className={`py-1.5 rounded-lg text-xs font-medium border transition ${
                    selectedLangFilter === lang
                      ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {lang === 'Bangla' ? 'বাংলা' : lang}
                </button>
              ))}
            </div>
          </div>

          {/* Page Count Filter */}
          <div className="glass-card p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-2">
            <h4 className="font-bold text-slate-800 text-xs">Page Count</h4>
            <div className="grid grid-cols-5 gap-1">
              {(['All', 1, 2, 3, 4] as const).map((pages) => (
                <button
                  key={pages}
                  onClick={() => setSelectedPageFilter(pages)}
                  className={`py-1.5 rounded-lg text-xs font-medium border transition ${
                    selectedPageFilter === pages
                      ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {pages === 'All' ? 'All' : `${pages}P`}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Right Grid: Templates Cards */}
        <div className="flex-1">
          {/* Results stats */}
          <div className="flex items-center justify-between mb-4 text-xs text-slate-500 font-medium">
            <span>Showing {filteredTemplates.length} templates</span>
            {(selectedCategory !== 'All' || selectedLangFilter !== 'All' || selectedPageFilter !== 'All' || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSelectedLangFilter('All');
                  setSelectedPageFilter('All');
                  setSearchQuery('');
                }}
                className="text-blue-600 hover:underline font-semibold"
              >
                Reset all filters
              </button>
            )}
          </div>

          {filteredTemplates.length === 0 ? (
            <div className="glass-card p-12 rounded-3xl border border-slate-200 text-center">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="font-bold text-slate-800 text-base">No templates found</h3>
              <p className="text-xs text-slate-500 mt-1">
                Try clearing your search filters or browse other categories.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredTemplates.map((template) => (
                <div
                  key={template.id}
                  className="glass-card glass-card-hover rounded-2xl border border-slate-200/90 overflow-hidden flex flex-col justify-between group"
                >
                  {/* Top Preview Canvas: Real Live CV Preview */}
                  <div className="p-3.5 bg-gradient-to-b from-slate-100/70 to-slate-50/50 border-b border-slate-200/70 flex items-center justify-center relative overflow-hidden group-hover:bg-blue-50/20 transition-colors">
                    <div className="w-full max-w-[180px] transform group-hover:scale-105 transition-transform duration-300 drop-shadow-sm">
                      <TemplateLivePreview
                        templateId={template.id}
                        category={template.category}
                        style={template.style}
                        accentColor={template.accentColor}
                        name={template.name}
                        language={template.language}
                        isATS={template.isATS}
                      />
                    </div>

                    {/* Top Badges */}
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1 z-10">
                      <span className="px-2 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-md text-white text-[9px] font-bold uppercase tracking-wider">
                        {template.category}
                      </span>
                    </div>

                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1 z-10">
                      {template.isATS && (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[9px] font-bold shadow-xs">
                          ATS 99%
                        </span>
                      )}
                    </div>

                    {/* Quick Preview Hover Action */}
                    <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-2xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        onClick={() => setPreviewTemplate(template)}
                        className="px-3 py-1.5 rounded-xl bg-white text-slate-800 text-xs font-semibold shadow-md flex items-center gap-1 hover:bg-slate-50 hover:text-blue-600 transition cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Preview</span>
                      </button>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition">
                        {template.name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {template.description}
                      </p>
                    </div>

                    {/* Card Actions: Use & Preview */}
                    <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                      <button
                        onClick={() => setPreviewTemplate(template)}
                        className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition"
                        title="Preview"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => {
                          onSelectTemplate(template);
                          if (
                            template.category === 'CV' ||
                            template.category === 'Resume' ||
                            template.category === 'Marriage CV'
                          ) {
                            setActiveView('cv-builder');
                          } else {
                            setActiveView('doc-builder');
                          }
                        }}
                        className="flex-1 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition text-center"
                      >
                        {t.useTemplate}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg text-slate-900">{previewTemplate.name}</h3>
                <p className="text-xs text-slate-500">{previewTemplate.category} • {previewTemplate.language}</p>
              </div>
              <button
                onClick={() => setPreviewTemplate(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              <div
                className="w-full h-48 rounded-2xl p-6 text-white flex flex-col justify-between shadow-inner"
                style={{ backgroundColor: previewTemplate.accentColor }}
              >
                <div className="text-xs font-bold uppercase tracking-widest">{previewTemplate.style} Style</div>
                <div>
                  <h2 className="text-2xl font-bold">{previewTemplate.name}</h2>
                  <p className="text-sm opacity-90 mt-1">{previewTemplate.description}</p>
                </div>
                <div className="text-xs opacity-80">
                  {previewTemplate.pageCount} A4 Page(s) • Print Ready • Word-style Editable
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-800 text-sm">Features included:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Standard A4 layout matching modern recruitment standards</li>
                  <li>Fully customizable colors, typography, line height, and margins</li>
                  <li>Instant one-click PDF generation and Microsoft Word export</li>
                  <li>Bilingual compatibility with English and Bangla fonts</li>
                </ul>
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 flex justify-end gap-2 bg-slate-50">
              <button
                onClick={() => setPreviewTemplate(null)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-200"
              >
                Close
              </button>
              <button
                onClick={() => {
                  onSelectTemplate(previewTemplate);
                  setPreviewTemplate(null);
                  if (
                    previewTemplate.category === 'CV' ||
                    previewTemplate.category === 'Resume' ||
                    previewTemplate.category === 'Marriage CV'
                  ) {
                    setActiveView('cv-builder');
                  } else {
                    setActiveView('doc-builder');
                  }
                }}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
              >
                {t.useTemplate}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
