import React, { useState, useEffect } from 'react';
import {
  FileText,
  FileSpreadsheet,
  Award,
  Sparkles,
  TrendingUp,
  Clock,
  ArrowRight,
  PlusCircle,
  FolderKanban,
  CheckCircle2,
  HeartHandshake,
  ShieldCheck,
  ExternalLink,
  Globe,
} from 'lucide-react';
import { CVData, DocumentData, Language, ActiveView } from '../types';
import { StorageService } from '../lib/storage';
import { TEMPLATES_DATA } from '../data/templates';
import { useTranslation } from '../lib/i18n';

interface DashboardProps {
  language: Language;
  setActiveView: (view: ActiveView) => void;
  onEditCV: (cv: CVData) => void;
  onEditDoc: (doc: DocumentData) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  language,
  setActiveView,
  onEditCV,
  onEditDoc,
}) => {
  const t = useTranslation(language);
  const [cvList, setCvList] = useState<CVData[]>([]);
  const [docList, setDocList] = useState<DocumentData[]>([]);

  useEffect(() => {
    setCvList(StorageService.getSavedCVs());
    setDocList(StorageService.getSavedDocuments());
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Top Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-card border border-blue-200 text-xs font-semibold text-blue-700 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Workspace Overview</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {t.dashboard}
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Manage your career assets, track document drafts, and deploy ATS-optimized resumes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveView('cv-builder')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-sm shadow-blue-500/20 active:scale-95 transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{t.createCV}</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-blue-100/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">CV Drafts</span>
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mt-2">{cvList.length}</div>
          <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
            <CheckCircle2 className="w-3 h-3" /> Auto-saved locally
          </span>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-indigo-100/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Official Docs</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mt-2">{docList.length}</div>
          <span className="text-[11px] text-slate-500 font-medium mt-1">Applications & Certs</span>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-emerald-100/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Templates</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mt-2">{TEMPLATES_DATA.length}</div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1">Ready for print</span>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-purple-100/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">ATS Score Avg</span>
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mt-2">98.5%</div>
          <span className="text-[11px] text-purple-600 font-semibold mt-1">High recruiter pass rate</span>
        </div>
      </div>

      {/* Quick Launchpad */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-slate-900">Quick Launch Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          <div
            onClick={() => setActiveView('cv-builder')}
            className="glass-card glass-card-hover p-4 rounded-2xl border border-slate-200 cursor-pointer group flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-800 group-hover:text-blue-600 transition">
                  Create Modern CV
                </h4>
                <p className="text-xs text-slate-500">1 or 2 Page Format</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition" />
          </div>

          <div
            onClick={() => setActiveView('doc-builder')}
            className="glass-card glass-card-hover p-4 rounded-2xl border border-slate-200 cursor-pointer group flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-800 group-hover:text-indigo-600 transition">
                  Job Application
                </h4>
                <p className="text-xs text-slate-500">Bangla & English</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition" />
          </div>

          <div
            onClick={() => setActiveView('doc-builder')}
            className="glass-card glass-card-hover p-4 rounded-2xl border border-slate-200 cursor-pointer group flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-800 group-hover:text-emerald-600 transition">
                  Experience Certificate
                </h4>
                <p className="text-xs text-slate-500">Official Company Proof</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition" />
          </div>

          <div
            onClick={() => setActiveView('templates')}
            className="glass-card glass-card-hover p-4 rounded-2xl border border-slate-200 cursor-pointer group flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-pink-600 text-white flex items-center justify-center shadow-xs">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-800 group-hover:text-pink-600 transition">
                  Marriage Biodata
                </h4>
                <p className="text-xs text-slate-500">পাত্র/পাত্রীর জীবনবৃত্তান্ত</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-pink-600 group-hover:translate-x-1 transition" />
          </div>
        </div>
      </div>

      {/* Recent Documents Table / List */}
      <div className="glass-card rounded-2xl border border-slate-200/90 overflow-hidden shadow-2xs">
        <div className="p-5 border-b border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600" />
            <h3 className="font-bold text-slate-900 text-sm">Recent Documents</h3>
          </div>
          <button
            onClick={() => setActiveView('my-docs')}
            className="text-xs font-semibold text-blue-600 hover:underline"
          >
            View all documents →
          </button>
        </div>

        {cvList.length === 0 && docList.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">
            No recent activity. Start editing your CV above!
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {cvList.slice(0, 3).map((cv) => (
              <div
                key={cv.id}
                className="p-4 flex items-center justify-between hover:bg-slate-50/70 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-800">{cv.fullName}</h4>
                    <span className="text-[11px] text-slate-500">
                      CV • Last edited {new Date(cv.lastModified).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    onEditCV(cv);
                    setActiveView('cv-builder');
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-200 hover:bg-blue-50 hover:text-blue-600 transition"
                >
                  Edit in Builder
                </button>
              </div>
            ))}
            {docList.slice(0, 3).map((d) => (
              <div
                key={d.id}
                className="p-4 flex items-center justify-between hover:bg-slate-50/70 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <FileSpreadsheet className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-800">{d.title}</h4>
                    <span className="text-[11px] text-slate-500">
                      {d.category} • Last edited {new Date(d.lastModified).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    onEditDoc(d);
                    setActiveView('doc-builder');
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-200 hover:bg-indigo-50 hover:text-indigo-600 transition"
                >
                  Edit Document
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recruitment & ATS Optimization Tips */}
      <div className="glass-card p-6 rounded-2xl border border-blue-200/60 bg-gradient-to-br from-blue-50/40 via-white to-indigo-50/40 space-y-3">
        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span>Professional Resume Standards (2026 Edition)</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600">
          <div className="p-3 bg-white/80 rounded-xl border border-slate-200/70">
            <h4 className="font-bold text-slate-800 mb-1">Single vs Multi-Page Rule</h4>
            <p>
              Use a 1-page CV for graduates and under 5 years of experience. Use 2-3 pages for senior leadership or extensive technical portfolios.
            </p>
          </div>
          <div className="p-3 bg-white/80 rounded-xl border border-slate-200/70">
            <h4 className="font-bold text-slate-800 mb-1">ATS Friendly Headings</h4>
            <p>
              All templates in SmartCV use standard semantic headers like 'Scholastic Portfolio', 'Job Experience', and 'Personal Information' for 99% ATS parsing accuracy.
            </p>
          </div>
          <div className="p-3 bg-white/80 rounded-xl border border-slate-200/70">
            <h4 className="font-bold text-slate-800 mb-1">Action-Verb Formulation</h4>
            <p>
              Start experience bullet points with strong verbs such as 'Engineered', 'Optimized', 'Managed', 'Supervised', and quantify results wherever possible.
            </p>
          </div>
        </div>
      </div>

      {/* Admin Portal & Partner Deals Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Admin Portal Card */}
        <div className="glass-card p-5 rounded-2xl border border-blue-200/80 bg-gradient-to-r from-blue-50/60 to-white flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900">Admin Website Portal</h4>
              <p className="text-xs text-slate-600">https://habibifix.vercel.app/</p>
              <p className="text-[11px] text-slate-400">Gachbaria, Chattogram • 24/7 Support</p>
            </div>
          </div>
          <a
            id="dashboard-admin-website-btn"
            href="https://habibifix.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition shrink-0"
          >
            <span>Open Admin</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Smartlink Partner Card */}
        <div className="glass-card p-5 rounded-2xl border border-amber-200/80 bg-gradient-to-r from-amber-50/60 to-white flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900">Partner Career Opportunities</h4>
              <p className="text-xs text-slate-500">Sponsored perks, grants & job alerts</p>
            </div>
          </div>
          <a
            id="dashboard-smartlink-btn"
            href="https://www.profitableratecpmnetwork.com/ggjmk8i2j?key=a251b31cdefa0940555facd387b4e6c1"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white shadow-xs transition shrink-0"
          >
            <span>View Offers</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
