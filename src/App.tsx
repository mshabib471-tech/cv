import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CVBuilder } from './components/CVBuilder';
import { DocumentBuilder } from './components/DocumentBuilder';
import { TemplateMarketplace } from './components/TemplateMarketplace';
import { MyDocuments } from './components/MyDocuments';
import { Dashboard } from './components/Dashboard';
import { AdminPanel } from './components/AdminPanel';
import { Footer } from './components/Footer';

import { ActiveView, Language, CVData, DocumentData, DocumentTemplate } from './types';
import { SAMPLE_CV_ENGLISH, SAMPLE_CV_BANGLA, SAMPLE_CV_HABIBUR } from './data/sampleCV';
import { SAMPLE_DOCUMENTS } from './data/sampleDocs';
import { TEMPLATES_DATA } from './data/templates';
import { StorageService } from './lib/storage';
import { useTranslation } from './lib/i18n';
import { TemplateLivePreview } from './components/TemplateLivePreview';

import {
  FileText,
  FileSpreadsheet,
  CheckCircle2,
  Sparkles,
  Award,
  ShieldCheck,
  Zap,
  Download,
  ArrowRight,
  Layers,
  HeartHandshake,
  Briefcase,
  Printer,
} from 'lucide-react';

export default function App() {
  const [activeView, setActiveView] = useState<ActiveView>('home');
  const [language, setLanguage] = useState<Language>('en');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  // Active CV state
  const [currentCV, setCurrentCV] = useState<CVData>(() => {
    const saved = StorageService.getSavedCVs();
    return saved.length > 0 ? saved[0] : SAMPLE_CV_ENGLISH;
  });

  // Active Document state
  const [currentDoc, setCurrentDoc] = useState<DocumentData>(() => {
    const saved = StorageService.getSavedDocuments();
    return saved.length > 0 ? saved[0] : SAMPLE_DOCUMENTS[0];
  });

  const t = useTranslation(language);

  // Initialize view from URL hash and listen to browser popstate (back/forward)
  useEffect(() => {
    const validViews: ActiveView[] = [
      'home',
      'cv-builder',
      'doc-builder',
      'templates',
      'my-docs',
      'dashboard',
      'admin',
    ];

    const initialHash = window.location.hash.replace('#', '') as ActiveView;
    if (initialHash && validViews.includes(initialHash)) {
      setActiveView(initialHash);
      window.history.replaceState({ view: initialHash }, '', `#${initialHash}`);
    } else {
      window.history.replaceState({ view: 'home' }, '', '#home');
    }

    const handlePopState = (event: PopStateEvent) => {
      const stateView = event.state?.view as ActiveView | undefined;
      const hashView = window.location.hash.replace('#', '') as ActiveView;
      const targetView = stateView || (validViews.includes(hashView) ? hashView : 'home');
      setActiveView(targetView);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Centralized navigation that pushes state to browser history
  const navigateTo = (view: ActiveView, replace = false) => {
    if (view === activeView) return;
    setActiveView(view);
    const hash = `#${view}`;
    if (replace) {
      window.history.replaceState({ view }, '', hash);
    } else {
      window.history.pushState({ view }, '', hash);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Sync sample CV language if user switches language and hasn't heavily customized
  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    if (lang === 'bn' && currentCV.language !== 'bn') {
      setCurrentCV(SAMPLE_CV_BANGLA);
    } else if (lang === 'en' && currentCV.language !== 'en') {
      setCurrentCV(SAMPLE_CV_ENGLISH);
    }
  };

  const handleSelectTemplate = (template: DocumentTemplate) => {
    if (
      template.category === 'CV' ||
      template.category === 'Resume' ||
      template.category === 'Marriage CV'
    ) {
      if (template.id.includes('bangladeshi') || template.id.includes('habib')) {
        setCurrentCV({
          ...SAMPLE_CV_HABIBUR,
          lastModified: Date.now(),
        });
        navigateTo('cv-builder');
        return;
      }

      const isMarriage =
        template.category === 'Marriage CV' || template.id.includes('marriage');
      const isSidebar =
        template.id.includes('two-column') || template.id.includes('corporate');
      const isMinimalATS =
        template.id.includes('ats') || template.isATS || template.id.includes('minimal');
      const isBanner =
        template.id.includes('creative') || template.id.includes('modern-blue');

      setCurrentCV((prev) => ({
        ...prev,
        templateId: template.id,
        category: template.category,
        language: template.language === 'বাংলা' ? 'bn' : 'en',
        pagesCount: template.pageCount || 1,
        isATS: template.isATS || prev.isATS,
        design: {
          ...prev.design,
          primaryColor:
            template.accentColor ||
            (isMarriage ? '#E11D48' : isSidebar ? '#1E3A8A' : prev.design.primaryColor),
          fontFamily:
            template.language === 'বাংলা' ? 'Noto Sans Bengali' : prev.design.fontFamily,
          headerStyle: isMarriage
            ? 'marriage'
            : isSidebar
            ? 'sidebar'
            : isMinimalATS
            ? 'minimal'
            : isBanner
            ? 'banner'
            : 'modern',
        },
      }));
      navigateTo('cv-builder');
    } else {
      // Find matching document template or create
      const matched = SAMPLE_DOCUMENTS.find((d: DocumentData) => d.id === template.id);
      if (matched) {
        setCurrentDoc(matched);
      } else {
        setCurrentDoc({
          id: 'doc-' + Date.now(),
          title: template.name,
          category: template.category,
          language: template.language === 'বাংলা' ? 'bn' : 'en',
          recipient:
            template.language === 'বাংলা'
              ? 'বরাবর\nমহাব্যবস্থাপক মহোদয়\nঢাকা, বাংলাদেশ'
              : 'To The General Manager\nCompany Name\nCity, Country',
          date: '19 September 2026',
          subject:
            template.language === 'বাংলা'
              ? `বিষয়: ${template.name} প্রসঙ্গে`
              : `Subject: Regarding ${template.name}`,
          salutation: template.language === 'বাংলা' ? 'জনাব,' : 'Dear Sir/Madam,',
          bodyParagraphs: [
            template.language === 'বাংলা'
              ? 'বিনীত নিবেদন এই যে, আমি আপনার প্রতিষ্ঠানে দায়িত্ব পালনে সর্বদা নিষ্ঠাবান ছিলাম।'
              : 'With reference to the official protocols, I am submitting this formal document.',
          ],
          closing:
            template.language === 'বাংলা'
              ? 'বিনীত,\nমুহাম্মদ রফিকুল ইসলাম'
              : 'Sincerely,\nJohn Doe',
          design: {
            fontSize: '12pt',
            fontFamily: template.language === 'বাংলা' ? 'Noto Sans Bengali' : 'Inter',
            lineHeight: '1.6',
            showBorder:
              template.category === 'Experience Certificate' ||
              template.category === 'Certificate',
          },
          lastModified: Date.now(),
        });
      }
      navigateTo('doc-builder');
    }
  };

  const handleHeroSearch = (query: string) => {
    setSearchQuery(query);
    navigateTo('templates');
  };

  const handleSelectCategoryFromHero = (category: string) => {
    setCategoryFilter(category);
    navigateTo('templates');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
      {/* Sticky Glass Navbar */}
      <Navbar
        activeView={activeView}
        setActiveView={navigateTo}
        language={language}
        setLanguage={handleSetLanguage}
        onQuickSearch={handleHeroSearch}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {activeView === 'home' && (
          <div className="space-y-16 lg:space-y-24">
            {/* Full Glass UI Hero */}
            <Hero
              setActiveView={navigateTo}
              onSelectTemplate={handleSelectTemplate}
              language={language}
              onSearch={handleHeroSearch}
              onSelectCategory={handleSelectCategoryFromHero}
            />

            {/* Featured Templates Showcase Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-card border border-blue-200 text-xs font-semibold text-blue-700 mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    <span>Featured Layouts</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                    Trending Professional Templates
                  </h2>
                  <p className="text-slate-600 text-sm mt-1">
                    Recruiter-approved, ATS-tested formats designed to secure interviews.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setCategoryFilter('All');
                    navigateTo('templates');
                  }}
                  className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700 transition"
                >
                  <span>Explore all 35+ templates</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* 6 Featured Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {TEMPLATES_DATA.slice(0, 6).map((tmpl) => (
                  <div
                    key={tmpl.id}
                    className="glass-card glass-card-hover rounded-3xl border border-slate-200/90 overflow-hidden flex flex-col justify-between group hover:shadow-xl hover:shadow-blue-500/10 transition-all"
                  >
                    <div className="p-4 bg-slate-50/80 border-b border-slate-200/80 flex items-center justify-center relative overflow-hidden">
                      <div className="w-full max-w-[200px] transform group-hover:scale-105 transition-transform duration-300">
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
                      <div className="absolute top-3 right-3 flex flex-col gap-1 z-10">
                        <span className="px-2 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider">
                          {tmpl.category}
                        </span>
                        {tmpl.isATS && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold shadow-xs">
                            ATS 99%
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-600 transition">
                          {tmpl.name}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                          {tmpl.description}
                        </p>
                      </div>

                      <button
                        onClick={() => handleSelectTemplate(tmpl)}
                        className="w-full py-2.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition text-center"
                      >
                        {t.useTemplate}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Value Proposition Features Grid */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-3xl mx-auto mb-12">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  Built for Speed, Privacy, and Perfection
                </h2>
                <p className="text-slate-600 text-sm mt-2">
                  Everything you need to produce stunning documents without wrestling with formatting or subscriptions.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card p-6 rounded-3xl border border-slate-200/80 space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center shadow-xs">
                    <FileText className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-base text-slate-900">Word-Style Direct Editing</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Click anywhere on the A4 document to type directly, format text with bold, italic, lists, and watch margins adjust automatically.
                  </p>
                </div>

                <div className="glass-card p-6 rounded-3xl border border-slate-200/80 space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center shadow-xs">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-base text-slate-900">100% Client-Side Privacy</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Your personal information, photos, and job details stay securely in your browser's local storage. No unwanted cloud tracking.
                  </p>
                </div>

                <div className="glass-card p-6 rounded-3xl border border-slate-200/80 space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-xs">
                    <Download className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-base text-slate-900">Pixel-Perfect Vector PDF</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Download crisp, high-resolution A4 PDFs ready for immediate recruiter submission or direct printout without distorted margins.
                  </p>
                </div>
              </div>
            </section>

            {/* Bottom Call to Action Banner */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
              <div className="glass-card p-8 sm:p-12 rounded-3xl border border-blue-200/70 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-blue-500/15">
                <div className="space-y-2 text-center md:text-left">
                  <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                    Ready to build your standout CV?
                  </h3>
                  <p className="text-blue-100 text-sm max-w-xl">
                    Choose from 35+ templates or start fresh in our full-featured online Word-like editor today.
                  </p>
                </div>

                <button
                  onClick={() => navigateTo('cv-builder')}
                  className="px-8 py-3.5 rounded-2xl bg-white text-blue-600 hover:bg-blue-50 font-bold text-sm shadow-lg shadow-black/10 active:scale-95 transition shrink-0"
                >
                  Create Your CV Now →
                </button>
              </div>
            </section>
          </div>
        )}

        {activeView === 'cv-builder' && (
          <CVBuilder
            cv={currentCV}
            setCV={setCurrentCV}
            language={language}
            onBackToHome={() => navigateTo('home')}
          />
        )}

        {activeView === 'templates' && (
          <TemplateMarketplace
            language={language}
            onSelectTemplate={handleSelectTemplate}
            setActiveView={navigateTo}
            initialSearchQuery={searchQuery}
            initialCategory={categoryFilter}
          />
        )}

        {activeView === 'doc-builder' && (
          <DocumentBuilder
            language={language}
            initialDoc={currentDoc}
          />
        )}

        {activeView === 'my-docs' && (
          <MyDocuments
            language={language}
            onEditCV={(cv) => {
              setCurrentCV(cv);
              navigateTo('cv-builder');
            }}
            onEditDoc={(doc) => {
              setCurrentDoc(doc);
              navigateTo('doc-builder');
            }}
            setActiveView={navigateTo}
          />
        )}

        {activeView === 'dashboard' && (
          <Dashboard
            language={language}
            setActiveView={navigateTo}
            onEditCV={(cv) => {
              setCurrentCV(cv);
              navigateTo('cv-builder');
            }}
            onEditDoc={(doc) => {
              setCurrentDoc(doc);
              navigateTo('doc-builder');
            }}
          />
        )}

        {activeView === 'admin' && <AdminPanel language={language} />}
      </main>

      {/* Global Glass Footer (Hidden during full-screen CV & Doc editing) */}
      {activeView !== 'cv-builder' && activeView !== 'doc-builder' && (
        <Footer setActiveView={navigateTo} language={language} />
      )}
    </div>
  );
}
