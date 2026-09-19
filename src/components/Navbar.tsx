import React, { useState } from 'react';
import {
  FileText,
  FileSpreadsheet,
  LayoutTemplate,
  FolderKanban,
  LayoutDashboard,
  Settings,
  Globe,
  Menu,
  X,
  Search,
  PlusCircle,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { ActiveView, Language } from '../types';
import { useTranslation } from '../lib/i18n';

interface NavbarProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  onQuickSearch?: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  setActiveView,
  language,
  setLanguage,
  onQuickSearch,
}) => {
  const t = useTranslation(language);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onQuickSearch) {
      onQuickSearch(searchQuery);
      setActiveView('templates');
    }
  };

  const navItems: { view: ActiveView; label: string; icon: React.ReactNode }[] = [
    { view: 'home', label: t.home, icon: <FileText className="w-4 h-4" /> },
    { view: 'cv-builder', label: t.cvBuilder, icon: <PlusCircle className="w-4 h-4" /> },
    { view: 'templates', label: t.templates, icon: <LayoutTemplate className="w-4 h-4" /> },
    { view: 'doc-builder', label: t.documents, icon: <FileSpreadsheet className="w-4 h-4" /> },
    { view: 'my-docs', label: t.myDocuments, icon: <FolderKanban className="w-4 h-4" /> },
    { view: 'dashboard', label: t.dashboard, icon: <LayoutDashboard className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-50 glass-nav transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Brand Logo */}
          <div
            id="brand-logo"
            onClick={() => setActiveView('home')}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-700 to-purple-800">
                SmartCV
              </span>
              <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-widest text-blue-600/80 bg-blue-50 px-1.5 py-0.5 rounded ml-1.5 border border-blue-200/50">
                Pro 2026
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.view}
                id={`nav-link-${item.view}`}
                onClick={() => setActiveView(item.view)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  activeView === item.view
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Right Controls: Search, Language Switcher, Action Button */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Quick Search */}
            <form onSubmit={handleSearchSubmit} className="relative hidden xl:block w-48">
              <input
                type="text"
                placeholder={language === 'bn' ? 'অনুসন্ধান...' : 'Search...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-xs text-slate-800 pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </form>

            {/* Language Switcher */}
            <button
              id="lang-toggle-btn"
              onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 bg-white/70 hover:bg-white text-slate-700 hover:border-blue-300 shadow-2xs transition"
              title="Toggle Language / ভাষা পরিবর্তন"
            >
              <Globe className="w-3.5 h-3.5 text-blue-600" />
              <span>{language === 'en' ? 'বাংলা' : 'English'}</span>
            </button>

            {/* Smartlink_1 Partner Link */}
            <a
              id="nav-partner-deals-link"
              href="https://www.profitableratecpmnetwork.com/ggjmk8i2j?key=a251b31cdefa0940555facd387b4e6c1"
              target="_blank"
              rel="noopener noreferrer"
              title="Partner Deals & Career Offers"
              className="hidden xl:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 shadow-2xs transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{language === 'bn' ? 'অফার' : 'Offers'}</span>
            </a>

            {/* External Admin Website: habibifix.vercel.app */}
            <a
              id="nav-admin-website-btn"
              href="https://habibifix.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              title="Open Admin Website: https://habibifix.vercel.app/"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-blue-200 bg-blue-50/80 hover:bg-blue-100 text-blue-700 text-xs font-semibold shadow-2xs transition"
            >
              <span>Admin Web</span>
              <ExternalLink className="w-3 h-3 text-blue-600" />
            </a>

            {/* Admin Panel Link */}
            <button
              id="nav-admin-btn"
              onClick={() => setActiveView('admin')}
              title={t.admin}
              className={`p-2 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-white transition ${
                activeView === 'admin' ? 'bg-slate-200 text-slate-900' : 'bg-white/60'
              }`}
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Primary Action Button */}
            <button
              id="nav-create-cv-btn"
              onClick={() => setActiveView('cv-builder')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 active:scale-95 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{t.createCV}</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}
              className="px-2 py-1 rounded text-xs font-semibold border border-slate-200 bg-white/80 text-slate-700"
            >
              {language === 'en' ? 'বাংলা' : 'EN'}
            </button>
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-white/80 transition"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden glass-panel border-t border-slate-200 px-4 pt-3 pb-5 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.view}
              onClick={() => {
                setActiveView(item.view);
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                activeView === item.view
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
          <div className="pt-2 flex flex-col gap-2">
            <a
              id="mobile-nav-admin-website-btn"
              href="https://habibifix.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border border-blue-200 text-blue-700 bg-blue-50/80"
            >
              <span>Open Admin Website (https://habibifix.vercel.app/)</span>
              <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
            </a>

            <a
              id="mobile-nav-partner-deals-link"
              href="https://www.profitableratecpmnetwork.com/ggjmk8i2j?key=a251b31cdefa0940555facd387b4e6c1"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border border-amber-200 text-amber-800 bg-amber-50"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{language === 'bn' ? 'স্পেশাল পার্টনার অফার (Smartlink)' : 'Special Partner Offers'}</span>
            </a>

            <button
              onClick={() => {
                setActiveView('admin');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-medium border border-slate-200 text-slate-700 bg-white"
            >
              <Settings className="w-4 h-4" />
              <span>{t.admin}</span>
            </button>
            <button
              onClick={() => {
                setActiveView('cv-builder');
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 rounded-xl text-sm font-semibold bg-blue-600 text-white shadow-md shadow-blue-500/20 text-center"
            >
              {t.createCV}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
