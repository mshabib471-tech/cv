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
} from 'lucide-react';
import { ActiveView, Language } from '../types';
import { useTranslation } from '../lib/i18n';

interface HeroProps {
  setActiveView: (view: ActiveView) => void;
  language: Language;
  onSearch: (query: string) => void;
  onSelectCategory?: (category: string) => void;
}

export const Hero: React.FC<HeroProps> = ({
  setActiveView,
  language,
  onSearch,
  onSelectCategory,
}) => {
  const t = useTranslation(language);
  const [query, setQuery] = useState('');

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
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {/* Card 1: Modern CV */}
            <div
              onClick={() => setActiveView('cv-builder')}
              className="glass-card glass-card-hover p-4 rounded-2xl cursor-pointer border border-blue-100/70 group"
            >
              <div className="w-full aspect-[1/1.3] bg-gradient-to-br from-blue-50 to-indigo-50/50 rounded-xl p-3 flex flex-col justify-between border border-blue-100/40 relative overflow-hidden shadow-inner">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <div className="h-2 w-16 bg-blue-600 rounded-full" />
                  <div className="h-1.5 w-12 bg-blue-300 rounded-full" />
                  <div className="h-1.5 w-20 bg-slate-200 rounded-full" />
                </div>
                <div className="space-y-1 pt-2 border-t border-blue-100">
                  <div className="h-1.5 w-full bg-slate-200 rounded-full" />
                  <div className="h-1.5 w-3/4 bg-slate-200 rounded-full" />
                </div>
                <div className="absolute -right-4 -bottom-4 w-12 h-12 bg-blue-500/10 rounded-full blur-sm" />
              </div>
              <div className="mt-3">
                <h4 className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition truncate">
                  1 & 2 Page CV
                </h4>
                <p className="text-[11px] text-slate-500 truncate">Modern & ATS Ready</p>
              </div>
            </div>

            {/* Card 2: Resume */}
            <div
              onClick={() => setActiveView('cv-builder')}
              className="glass-card glass-card-hover p-4 rounded-2xl cursor-pointer border border-indigo-100/70 group"
            >
              <div className="w-full aspect-[1/1.3] bg-gradient-to-br from-indigo-50 to-purple-50/50 rounded-xl p-3 flex flex-col justify-between border border-indigo-100/40 relative overflow-hidden shadow-inner">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                  <Briefcase className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <div className="h-2 w-14 bg-indigo-600 rounded-full" />
                  <div className="h-1.5 w-10 bg-indigo-300 rounded-full" />
                </div>
                <div className="space-y-1 pt-2 border-t border-indigo-100">
                  <div className="h-1.5 w-full bg-slate-200 rounded-full" />
                  <div className="h-1.5 w-4/5 bg-slate-200 rounded-full" />
                </div>
              </div>
              <div className="mt-3">
                <h4 className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 transition truncate">
                  Executive Resume
                </h4>
                <p className="text-[11px] text-slate-500 truncate">Corporate Standard</p>
              </div>
            </div>

            {/* Card 3: Cover Letter */}
            <div
              onClick={() => setActiveView('doc-builder')}
              className="glass-card glass-card-hover p-4 rounded-2xl cursor-pointer border border-cyan-100/70 group"
            >
              <div className="w-full aspect-[1/1.3] bg-gradient-to-br from-cyan-50 to-blue-50/50 rounded-xl p-3 flex flex-col justify-between border border-cyan-100/40 relative overflow-hidden shadow-inner">
                <div className="w-8 h-8 rounded-lg bg-cyan-600 text-white flex items-center justify-center shadow-xs">
                  <ScrollText className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <div className="h-2 w-12 bg-cyan-600 rounded-full" />
                  <div className="h-1.5 w-8 bg-cyan-300 rounded-full" />
                </div>
                <div className="space-y-1 pt-2 border-t border-cyan-100">
                  <div className="h-1.5 w-full bg-slate-200 rounded-full" />
                  <div className="h-1.5 w-3/4 bg-slate-200 rounded-full" />
                  <div className="h-1.5 w-2/3 bg-slate-200 rounded-full" />
                </div>
              </div>
              <div className="mt-3">
                <h4 className="text-xs font-bold text-slate-800 group-hover:text-cyan-600 transition truncate">
                  Cover Letter
                </h4>
                <p className="text-[11px] text-slate-500 truncate">Application Letter</p>
              </div>
            </div>

            {/* Card 4: Experience Certificate */}
            <div
              onClick={() => setActiveView('doc-builder')}
              className="glass-card glass-card-hover p-4 rounded-2xl cursor-pointer border border-emerald-100/70 group"
            >
              <div className="w-full aspect-[1/1.3] bg-gradient-to-br from-emerald-50 to-teal-50/50 rounded-xl p-3 flex flex-col justify-between border border-emerald-100/40 relative overflow-hidden shadow-inner">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                  <Award className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <div className="h-2 w-14 bg-emerald-600 rounded-full" />
                  <div className="h-1.5 w-10 bg-emerald-300 rounded-full" />
                </div>
                <div className="space-y-1 pt-2 border-t border-emerald-100">
                  <div className="h-1.5 w-full bg-slate-200 rounded-full" />
                  <div className="h-1.5 w-3/4 bg-slate-200 rounded-full" />
                </div>
              </div>
              <div className="mt-3">
                <h4 className="text-xs font-bold text-slate-800 group-hover:text-emerald-600 transition truncate">
                  Experience Cert
                </h4>
                <p className="text-[11px] text-slate-500 truncate">Service & Tenure</p>
              </div>
            </div>

            {/* Card 5: Marriage CV */}
            <div
              onClick={() => setActiveView('templates')}
              className="glass-card glass-card-hover p-4 rounded-2xl cursor-pointer border border-pink-100/70 group"
            >
              <div className="w-full aspect-[1/1.3] bg-gradient-to-br from-pink-50 to-rose-50/50 rounded-xl p-3 flex flex-col justify-between border border-pink-100/40 relative overflow-hidden shadow-inner">
                <div className="w-8 h-8 rounded-lg bg-pink-600 text-white flex items-center justify-center shadow-xs">
                  <HeartHandshake className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <div className="h-2 w-14 bg-pink-600 rounded-full" />
                  <div className="h-1.5 w-8 bg-pink-300 rounded-full" />
                </div>
                <div className="space-y-1 pt-2 border-t border-pink-100">
                  <div className="h-1.5 w-full bg-slate-200 rounded-full" />
                  <div className="h-1.5 w-2/3 bg-slate-200 rounded-full" />
                </div>
              </div>
              <div className="mt-3">
                <h4 className="text-xs font-bold text-slate-800 group-hover:text-pink-600 transition truncate">
                  Marriage CV
                </h4>
                <p className="text-[11px] text-slate-500 truncate">বিবাহের বায়োডাটা</p>
              </div>
            </div>

            {/* Card 6: Application & Forms */}
            <div
              onClick={() => setActiveView('doc-builder')}
              className="glass-card glass-card-hover p-4 rounded-2xl cursor-pointer border border-amber-100/70 group"
            >
              <div className="w-full aspect-[1/1.3] bg-gradient-to-br from-amber-50 to-orange-50/50 rounded-xl p-3 flex flex-col justify-between border border-amber-100/40 relative overflow-hidden shadow-inner">
                <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center shadow-xs">
                  <FileSpreadsheet className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <div className="h-2 w-14 bg-amber-600 rounded-full" />
                  <div className="h-1.5 w-10 bg-amber-300 rounded-full" />
                </div>
                <div className="space-y-1 pt-2 border-t border-amber-100">
                  <div className="h-1.5 w-full bg-slate-200 rounded-full" />
                  <div className="h-1.5 w-4/5 bg-slate-200 rounded-full" />
                </div>
              </div>
              <div className="mt-3">
                <h4 className="text-xs font-bold text-slate-800 group-hover:text-amber-600 transition truncate">
                  Joining & Forms
                </h4>
                <p className="text-[11px] text-slate-500 truncate">Official Letters</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
