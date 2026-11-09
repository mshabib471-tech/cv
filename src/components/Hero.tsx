import React, { useState } from 'react';
import {
  FileText,
  Search,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  FileSpreadsheet,
  Award,
  HeartHandshake,
  Briefcase,
  ScrollText,
  Eye,
} from 'lucide-react';
import { ActiveView, Language, DocumentTemplate } from '../types';
import { useTranslation } from '../lib/i18n';
import { TemplateLivePreview } from './TemplateLivePreview';
import { TEMPLATES_DATA } from '../data/templates';

interface HeroProps {
  setActiveView: (view: ActiveView) => void;
  language: Language;
  onSearch: (query: string) => void;
  onSelectCategory?: (category: string) => void;
  onSelectTemplate?: (template: DocumentTemplate) => void;
}

export const Hero: React.FC<HeroProps> = ({
  setActiveView,
  language,
  onSearch,
  onSelectCategory,
  onSelectTemplate,
}) => {
  const t = useTranslation(language);
  const [query, setQuery] = useState('');

  const handleCardClick = (templateId: string, fallbackView: ActiveView = 'cv-builder') => {
    const tmpl = TEMPLATES_DATA.find((t) => t.id === templateId);
    if (tmpl && onSelectTemplate) {
      onSelectTemplate(tmpl);
    } else {
      setActiveView(fallbackView);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setActiveView('templates');
    }
  };

  const quickCategories = [
    { label: 'CV / Resume', id: 'CV', icon: <FileText className="w-3.5 h-3.5" /> },
    { label: 'Job Application', id: 'Application', icon: <Briefcase className="w-3.5 h-3.5" /> },
    { label: 'Experience Certificate', id: 'Experience Certificate', icon: <Award className="w-3.5 h-3.5" /> },
    { label: 'Marriage Biodata', id: 'Marriage CV', icon: <HeartHandshake className="w-3.5 h-3.5" /> },
    { label: 'Bangla CV', id: 'CV', icon: <ScrollText className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24">
      {/* Soft Animated Gradient Blobs in background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-gradient-to-tr from-blue-200/45 via-indigo-100/40 to-purple-200/45 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute -top-24 right-10 w-96 h-96 bg-cyan-200/40 rounded-full blur-3xl -z-10 pointer-events-none animate-pulse" />
      <div className="absolute top-1/2 -left-20 w-80 h-80 bg-blue-300/30 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-card border border-blue-200/60 text-xs font-semibold text-blue-700 mb-6 shadow-xs animate-fade-in">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-spin" style={{ animationDuration: '8s' }} />
            <span>Next-Gen Word-Style Editor • 2026 Edition</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15] mb-6">
            {language === 'bn' ? (
              <>
                মিনিটেই তৈরি করুন{' '}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
                  প্রফেশনাল সিভি
                </span>{' '}
                ও অফিশিয়াল ডকুমেন্টস
              </>
            ) : (
              <>
                Create Your Professional{' '}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
                  CV & Documents
                </span>{' '}
                in Minutes
              </>
            )}
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-slate-600 font-normal leading-relaxed mb-8 max-w-2xl mx-auto">
            {t.subtitle}
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-6">
            <button
              id="hero-create-cv-btn"
              onClick={() => setActiveView('cv-builder')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl text-base font-semibold bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/35 active:scale-98 transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>{t.createCV}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              id="hero-browse-templates-btn"
              onClick={() => setActiveView('templates')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl text-base font-semibold glass-card border border-slate-200/80 hover:border-blue-300 text-slate-700 hover:text-blue-600 shadow-sm active:scale-98 transition-all cursor-pointer"
            >
              {t.browseTemplates}
            </button>
          </div>

          {/* Reassurance text */}
          <div className="text-xs sm:text-sm font-medium text-slate-500 flex items-center justify-center gap-2 mb-10">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>{t.heroNotice}</span>
          </div>

          {/* Glass Search Bar */}
          <div className="max-w-2xl mx-auto mb-6">
            <form
              onSubmit={handleSubmit}
              className="glass-card p-2 rounded-2xl border border-white/80 shadow-md shadow-slate-200/40 flex items-center gap-2 focus-within:ring-2 focus-within:ring-blue-500/30 transition"
            >
              <div className="pl-3 text-slate-400">
                <Search className="w-5 h-5 text-blue-600" />
              </div>
              <input
                id="hero-search-input"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full bg-transparent text-sm sm:text-base text-slate-800 placeholder-slate-400 outline-none px-2"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition shrink-0 cursor-pointer"
              >
                {language === 'bn' ? 'খুঁজুন' : 'Search'}
              </button>
            </form>
          </div>

          {/* Category Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 max-w-2xl mx-auto">
            <span className="text-xs font-semibold text-slate-500 mr-1">
              {language === 'bn' ? 'জনপ্রিয়:' : 'Popular:'}
            </span>
            {quickCategories.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (onSelectCategory) onSelectCategory(cat.id);
                  setActiveView('templates');
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-white/70 hover:bg-white text-slate-600 hover:text-blue-600 border border-slate-200/70 shadow-2xs hover:border-blue-300 transition cursor-pointer"
              >
                {cat.icon}
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Floating Glass Document Cards Showcase */}
        <div className="mt-14 relative max-w-6xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
            {/* Card 1: Modern Blue CV */}
            <div
              onClick={() => handleCardClick('cv-modern-blue', 'cv-builder')}
              className="glass-card glass-card-hover p-2.5 sm:p-3 rounded-2xl cursor-pointer border border-blue-200/80 group flex flex-col justify-between hover:shadow-xl hover:shadow-blue-500/15 hover:border-blue-400 transition-all"
            >
              <div className="w-full relative overflow-hidden rounded-xl group-hover:scale-[1.02] transition-transform duration-200">
                <TemplateLivePreview
                  templateId="cv-modern-blue"
                  category="CV"
                  style="Modern"
                  accentColor="#2563EB"
                  name="Modern Blue CV"
                  language="English"
                  isATS={true}
                />
                <div className="absolute inset-0 bg-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                  <span className="px-2.5 py-1 rounded-lg bg-blue-600 text-white font-bold text-[10px] shadow-md flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    <span>Live Edit</span>
                  </span>
                </div>
              </div>
              <div className="mt-2.5 px-0.5">
                <h4 className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition truncate">
                  Modern Blue CV
                </h4>
                <p className="text-[10px] text-slate-500 truncate">Top Banner • ATS 99%</p>
              </div>
            </div>

            {/* Card 2: Corporate 2-Column CV */}
            <div
              onClick={() => handleCardClick('cv-corporate', 'cv-builder')}
              className="glass-card glass-card-hover p-2.5 sm:p-3 rounded-2xl cursor-pointer border border-indigo-200/80 group flex flex-col justify-between hover:shadow-xl hover:shadow-indigo-500/15 hover:border-indigo-400 transition-all"
            >
              <div className="w-full relative overflow-hidden rounded-xl group-hover:scale-[1.02] transition-transform duration-200">
                <TemplateLivePreview
                  templateId="cv-corporate"
                  category="CV"
                  style="Corporate"
                  accentColor="#1E3A8A"
                  name="Corporate Executive"
                  language="English"
                  isATS={true}
                />
                <div className="absolute inset-0 bg-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                  <span className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white font-bold text-[10px] shadow-md flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    <span>Live Edit</span>
                  </span>
                </div>
              </div>
              <div className="mt-2.5 px-0.5">
                <h4 className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 transition truncate">
                  Executive Resume
                </h4>
                <p className="text-[10px] text-slate-500 truncate">2-Column Sidebar</p>
              </div>
            </div>

            {/* Card 3: Professional Cover Letter */}
            <div
              onClick={() => handleCardClick('doc-cover-letter', 'doc-builder')}
              className="glass-card glass-card-hover p-2.5 sm:p-3 rounded-2xl cursor-pointer border border-cyan-200/80 group flex flex-col justify-between hover:shadow-xl hover:shadow-cyan-500/15 hover:border-cyan-400 transition-all"
            >
              <div className="w-full relative overflow-hidden rounded-xl group-hover:scale-[1.02] transition-transform duration-200">
                <TemplateLivePreview
                  templateId="doc-cover-letter"
                  category="Cover Letter"
                  style="Professional"
                  accentColor="#0891B2"
                  name="Cover Letter"
                  language="English"
                />
                <div className="absolute inset-0 bg-cyan-600/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                  <span className="px-2.5 py-1 rounded-lg bg-cyan-600 text-white font-bold text-[10px] shadow-md flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    <span>Live Edit</span>
                  </span>
                </div>
              </div>
              <div className="mt-2.5 px-0.5">
                <h4 className="text-xs font-bold text-slate-800 group-hover:text-cyan-600 transition truncate">
                  Cover Letter
                </h4>
                <p className="text-[10px] text-slate-500 truncate">আবেদনপত্র ও দরখাস্ত</p>
              </div>
            </div>

            {/* Card 4: Experience Certificate */}
            <div
              onClick={() => handleCardClick('doc-experience-cert', 'doc-builder')}
              className="glass-card glass-card-hover p-2.5 sm:p-3 rounded-2xl cursor-pointer border border-amber-200/80 group flex flex-col justify-between hover:shadow-xl hover:shadow-amber-500/15 hover:border-amber-400 transition-all"
            >
              <div className="w-full relative overflow-hidden rounded-xl group-hover:scale-[1.02] transition-transform duration-200">
                <TemplateLivePreview
                  templateId="doc-experience-cert"
                  category="Certificate"
                  style="Classic"
                  accentColor="#D97706"
                  name="Experience Certificate"
                  language="English"
                />
                <div className="absolute inset-0 bg-amber-600/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                  <span className="px-2.5 py-1 rounded-lg bg-amber-600 text-white font-bold text-[10px] shadow-md flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    <span>Live Edit</span>
                  </span>
                </div>
              </div>
              <div className="mt-2.5 px-0.5">
                <h4 className="text-xs font-bold text-slate-800 group-hover:text-amber-600 transition truncate">
                  Experience Cert
                </h4>
                <p className="text-[10px] text-slate-500 truncate">কাজের প্রত্যয়নপত্র</p>
              </div>
            </div>

            {/* Card 5: Marriage Biodata */}
            <div
              onClick={() => handleCardClick('cv-marriage-bn', 'cv-builder')}
              className="glass-card glass-card-hover p-2.5 sm:p-3 rounded-2xl cursor-pointer border border-pink-200/80 group flex flex-col justify-between hover:shadow-xl hover:shadow-pink-500/15 hover:border-pink-400 transition-all"
            >
              <div className="w-full relative overflow-hidden rounded-xl group-hover:scale-[1.02] transition-transform duration-200">
                <TemplateLivePreview
                  templateId="cv-marriage-groom"
                  category="Marriage CV"
                  style="Traditional"
                  accentColor="#E11D48"
                  name="Marriage Biodata"
                  language="Bangla"
                />
                <div className="absolute inset-0 bg-pink-600/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                  <span className="px-2.5 py-1 rounded-lg bg-rose-600 text-white font-bold text-[10px] shadow-md flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    <span>Live Edit</span>
                  </span>
                </div>
              </div>
              <div className="mt-2.5 px-0.5">
                <h4 className="text-xs font-bold text-slate-800 group-hover:text-pink-600 transition truncate">
                  Marriage CV
                </h4>
                <p className="text-[10px] text-slate-500 truncate">পাত্র-পাত্রীর বায়োডাটা</p>
              </div>
            </div>

            {/* Card 6: ATS Friendly Minimal CV */}
            <div
              onClick={() => handleCardClick('cv-ats-friendly', 'cv-builder')}
              className="glass-card glass-card-hover p-2.5 sm:p-3 rounded-2xl cursor-pointer border border-emerald-200/80 group flex flex-col justify-between hover:shadow-xl hover:shadow-emerald-500/15 hover:border-emerald-400 transition-all"
            >
              <div className="w-full relative overflow-hidden rounded-xl group-hover:scale-[1.02] transition-transform duration-200">
                <TemplateLivePreview
                  templateId="cv-ats-friendly"
                  category="CV"
                  style="ATS Friendly"
                  accentColor="#0F766E"
                  name="ATS Master CV"
                  language="English"
                  isATS={true}
                />
                <div className="absolute inset-0 bg-emerald-600/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[10px] shadow-md flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    <span>Live Edit</span>
                  </span>
                </div>
              </div>
              <div className="mt-2.5 px-0.5">
                <h4 className="text-xs font-bold text-slate-800 group-hover:text-emerald-600 transition truncate">
                  ATS Master CV
                </h4>
                <p className="text-[10px] text-slate-500 truncate">Clean Single-Column</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
