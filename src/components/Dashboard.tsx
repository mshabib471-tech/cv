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
  Star,
  Zap,
  User,
  LogIn,
  LogOut,
  Edit3,
  Trash2,
  Copy,
  Download,
  UserCircle,
  Smartphone,
  Eye,
  Check,
} from 'lucide-react';
import { CVData, DocumentData, Language, ActiveView } from '../types';
import { StorageService } from '../lib/storage';
import { TEMPLATES_DATA } from '../data/templates';
import { useTranslation } from '../lib/i18n';
import { useAuth } from '../context/AuthContext';
import { UserAuthModal } from './UserAuthModal';
import { MasterProfileModal } from './MasterProfileModal';
import { TemplateLivePreview } from './TemplateLivePreview';

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
  const { user, logout } = useAuth();

  const [cvList, setCvList] = useState<CVData[]>([]);
  const [docList, setDocList] = useState<DocumentData[]>([]);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [showMasterProfileModal, setShowMasterProfileModal] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'all' | 'favorites' | 'docs'>('all');

  const isBangla = language === 'bn';

  const reloadData = () => {
    setCvList(StorageService.getSavedCVs());
    setDocList(StorageService.getSavedDocuments());
  };

  useEffect(() => {
    reloadData();
  }, []);

  const favoriteCVs = cvList.filter((c) => c.isFavorite);
  const masterProfile = StorageService.getMasterProfile();

  const handleToggleFavorite = (cvId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    StorageService.toggleFavoriteCV(cvId);
    reloadData();
  };

  const handleDeleteCV = (cvId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(isBangla ? 'আপনি কি এই সিভিটি মুছে ফেলতে চান?' : 'Are you sure you want to delete this CV draft?')) {
      StorageService.deleteCV(cvId);
      reloadData();
    }
  };

  const handleDuplicateCV = (cvItem: CVData, e: React.MouseEvent) => {
    e.stopPropagation();
    const copy: CVData = {
      ...cvItem,
      id: `cv_${Date.now()}`,
      fullName: `${cvItem.fullName || 'Draft'} (Copy)`,
      lastModified: Date.now(),
    };
    StorageService.saveCV(copy);
    reloadData();
  };

  const handle1ClickGenerate = () => {
    const newCV = StorageService.createCVFromMasterProfile(
      isBangla ? 'bangladeshi-standard' : 'professional-executive'
    );
    onEditCV(newCV);
    setActiveView('cv-builder');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-in fade-in duration-200">
      {/* User Status Bar & Top Greeting */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="flex items-center gap-4 relative z-10">
          {user ? (
            <div className="relative">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'User'}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-500 shadow-md"
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center text-xl font-bold shadow-md">
                  {(user.displayName || user.email || 'U')[0].toUpperCase()}
                </div>
              )}
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></span>
            </div>
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 text-slate-400 flex items-center justify-center shadow-inner">
              <UserCircle className="w-8 h-8 text-slate-400" />
            </div>
          )}

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {user
                  ? `${isBangla ? 'স্বাগতম' : 'Welcome'}, ${user.displayName || user.email?.split('@')[0]}!`
                  : isBangla
                  ? 'আপনার প্রফেশনাল ড্যাশবোর্ড'
                  : 'Your Professional Dashboard'}
              </h1>
            </div>
            <p className="text-slate-600 text-xs sm:text-sm mt-1">
              {user
                ? isBangla
                  ? 'আপনার সম্পাদিত সমস্ত সিভি, পছন্দের তালিকা ও মাস্টার প্রোফাইল এখানে সংরক্ষিত আছে।'
                  : 'All your edited CVs, starred favorites, and master profile data are synced here.'
                : isBangla
                ? 'সিভি চিরতরে সেভ রাখতে ও যেকোনো ডিভাইস থেকে এডিট করতে লগইন করুন।'
                : 'Login to keep all your CVs, favorites, and master profile accessible anywhere.'}
            </p>
          </div>
        </div>

        {/* Auth CTA Actions */}
        <div className="flex items-center gap-2.5 w-full md:w-auto relative z-10">
          {user ? (
            <>
              <button
                onClick={() => setShowMasterProfileModal(true)}
                className="flex-1 md:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 transition shadow-2xs"
              >
                <Zap className="w-4 h-4 text-amber-600 fill-amber-500" />
                <span>{isBangla ? 'মাস্টার প্রোফাইল' : 'Master Profile'}</span>
              </button>
              <button
                onClick={() => logout()}
                className="flex items-center gap-1 px-3 py-2.5 rounded-xl text-xs font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 border border-slate-200 transition"
                title={isBangla ? 'লগআউট' : 'Logout'}
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">{isBangla ? 'লগআউট' : 'Logout'}</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md shadow-blue-500/20 active:scale-95 transition"
            >
              <LogIn className="w-4 h-4" />
              <span>{isBangla ? 'লগইন / অ্যাকাউন্ট তৈরি' : 'Login / Create Account'}</span>
            </button>
          )}

          <button
            onClick={() => setActiveView('cv-builder')}
            className="flex-1 md:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-xs transition active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{isBangla ? 'নতুন সিভি বানান' : 'Create CV'}</span>
          </button>
        </div>
      </div>

      {/* 1-Click Master Profile Quick Banner */}
      <div className="bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-transparent border border-amber-200 rounded-3xl p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md">
            <Zap className="w-5 h-5 fill-current" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <span>{isBangla ? 'মাস্টার প্রোফাইল ও ১-ক্লিক সিভি জেনারেটর' : 'Master Profile & 1-Click Generator'}</span>
              <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[10px] font-bold">
                {masterProfile.fullName ? (isBangla ? 'তথ্য সংরক্ষিত' : 'Ready') : (isBangla ? 'খালি' : 'Empty')}
              </span>
            </h3>
            <p className="text-xs text-slate-600 mt-0.5 max-w-2xl leading-relaxed">
              {isBangla
                ? 'আপনার ব্যক্তিগত ও শিক্ষাগত তথ্য একবার সেভ করে রাখুন। পরবর্তীতে যেকোনো সিভি মাত্র ১ ক্লিকে স্বয়ংক্রিয়ভাবে তৈরি হয়ে যাবে!'
                : 'Save your profile details once. In the future, create tailored CVs in any template with a single click!'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 w-full md:w-auto">
          <button
            onClick={() => setShowMasterProfileModal(true)}
            className="flex-1 md:flex-initial px-3.5 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 shadow-2xs transition"
          >
            {isBangla ? 'প্রোফাইল তথ্য সাজান' : 'Edit Profile Details'}
          </button>
          <button
            onClick={handle1ClickGenerate}
            className="flex-1 md:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-md shadow-amber-500/20 active:scale-95 transition"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>{isBangla ? '১-ক্লিকে সিভি বানান' : '1-Click Make CV'}</span>
          </button>
        </div>
      </div>

      {/* Human-Crafted Guarantee Badge Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
            <Check className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-white">
              {isBangla
                ? '১০০% মানুষের তৈরি প্রফেশনাল স্টাইল — কোনো AI এর ছোঁয়া বোঝা যাবে না'
                : '100% Authentic Human-Crafted Styling — Zero AI Artifacts'}
            </h4>
            <p className="text-[11px] text-slate-300">
              {isBangla
                ? 'বাস্তব বাংলাদেশি ও আন্তর্জাতিক স্ট্যান্ডার্ড মার্জিন, সঠিক ফন্ট হাইরার্কি এবং নিখুঁত এলাইনমেন্ট।'
                : 'Standard tab stops, authentic recruiter spacing, standard passport frames, and clean typography.'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-semibold text-emerald-300 shrink-0">
          <ShieldCheck className="w-4 h-4" />
          <span>{isBangla ? 'এইচআর ও বিডিজবস অনুমোদিত' : 'Recruiter & ATS Verified'}</span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {isBangla ? 'সম্পাদিত সিভি' : 'Edited CVs'}
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mt-2">{cvList.length}</div>
          <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
            <CheckCircle2 className="w-3 h-3" /> {isBangla ? 'লোকালে সংরক্ষিত' : 'Auto-saved locally'}
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {isBangla ? 'প্রিয় সিভি (Favorites)' : 'Favorite CVs'}
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
              <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mt-2">{favoriteCVs.length}</div>
          <span className="text-[11px] text-amber-600 font-semibold mt-1">
            {isBangla ? 'দ্রুত অ্যাক্সেস' : 'Quick access list'}
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {isBangla ? 'অফিসিয়াল ডকুমেন্ট' : 'Official Docs'}
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mt-2">{docList.length}</div>
          <span className="text-[11px] text-slate-500 font-medium mt-1">
            {isBangla ? 'দরখাস্ত ও প্রত্যয়ন' : 'Applications & Certs'}
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {isBangla ? 'মোবাইল লাইভ জুম' : 'Mobile Live Zoom'}
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <Smartphone className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mt-2">Active</div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1">
            {isBangla ? 'স্ক্রল ও জুম এডিটিং' : 'Scroll & touch zoom ready'}
          </span>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'all'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {isBangla ? `সব সিভি (${cvList.length})` : `All CVs (${cvList.length})`}
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'favorites'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>{isBangla ? `প্রিয় সিভি (${favoriteCVs.length})` : `Favorites (${favoriteCVs.length})`}</span>
          </button>
          <button
            onClick={() => setActiveTab('docs')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'docs'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {isBangla ? `ডকুমেন্ট (${docList.length})` : `Official Docs (${docList.length})`}
          </button>
        </div>

        <button
          onClick={() => setActiveView('templates')}
          className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
        >
          <span>{isBangla ? 'নতুন টেমপ্লেট গ্যালারি' : 'Template Marketplace'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Favorites Section when selected or when present */}
      {activeTab === 'favorites' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
              <span>{isBangla ? 'আপনার পছন্দের সিভি সমূহ' : 'Your Favorite CVs'}</span>
            </h3>
          </div>

          {favoriteCVs.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center border border-dashed border-slate-300">
              <Star className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-slate-600 text-sm font-medium">
                {isBangla
                  ? 'এখনো কোনো সিভি প্রিয় তালিকায় যোগ করা হয়নি।'
                  : 'No favorite CVs added yet.'}
              </p>
              <p className="text-slate-400 text-xs mt-1">
                {isBangla
                  ? 'যেকোনো সিভির ডানপাশের স্টার (⭐) বাটনে ক্লিক করে প্রিয় তালিকায় রাখুন।'
                  : 'Click the star icon on any CV to bookmark it here for quick editing.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {favoriteCVs.map((cvItem) => (
                <div
                  key={cvItem.id}
                  className="bg-white rounded-2xl border border-amber-200/90 shadow-xs hover:shadow-md transition p-5 flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {cvItem.photoUrl ? (
                        <img
                          src={cvItem.photoUrl}
                          alt={cvItem.fullName}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 font-bold flex items-center justify-center text-sm border border-blue-100">
                          {cvItem.fullName?.[0] || 'C'}
                        </div>
                      )}
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{cvItem.fullName || 'Untitled CV'}</h4>
                        <p className="text-[11px] text-slate-500">{cvItem.professionalTitle || 'Executive Draft'}</p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => handleToggleFavorite(cvItem.id, e)}
                      className="p-1.5 rounded-lg text-amber-500 hover:bg-amber-50"
                      title="Remove from favorites"
                    >
                      <Star className="w-4 h-4 fill-amber-500" />
                    </button>
                  </div>

                  <div className="mt-4 aspect-[210/297] w-full bg-slate-50 rounded-xl border border-slate-200 overflow-hidden flex items-center justify-center p-3 relative group/preview">
                    <div className="w-full max-w-[100px] shadow-lg transform group-hover/preview:scale-105 transition-transform duration-300">
                      <TemplateLivePreview
                        templateId={cvItem.templateId}
                        accentColor={cvItem.design.primaryColor}
                        language={cvItem.language === 'bn' ? 'Bangla' : 'English'}
                        isATS={cvItem.isATS}
                      />
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500 text-[11px]">
                      {cvItem.lastModified ? new Date(cvItem.lastModified).toLocaleDateString() : 'Recent'}
                    </span>
                    <button
                      onClick={() => {
                        onEditCV(cvItem);
                        setActiveView('cv-builder');
                      }}
                      className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>{isBangla ? 'এডিট করুন' : 'Edit CV'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* All CVs / Edited Drafts Tab */}
      {activeTab === 'all' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <span>{isBangla ? 'আপনার সম্পাদিত সিভি ও ড্রাফট সমূহ' : 'Your Edited CVs & Drafts'}</span>
            </h3>
            <span className="text-xs text-slate-500">
              {cvList.length} {isBangla ? 'টি সিভি সংরক্ষিত' : 'saved CV(s)'}
            </span>
          </div>

          {cvList.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h4 className="font-bold text-slate-800 text-sm">
                {isBangla ? 'কোনো সিভি পাওয়া যায়নি' : 'No CV drafts found'}
              </h4>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                {isBangla
                  ? 'আপনার প্রথম সিভিটি তৈরি করতে "নতুন সিভি বানান" বাটনে ক্লিক করুন।'
                  : 'Start by clicking Create CV or choose from our pre-formatted templates.'}
              </p>
              <button
                onClick={() => setActiveView('cv-builder')}
                className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{isBangla ? 'সিভি তৈরি শুরু করুন' : 'Start Building'}</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {cvList.map((cvItem) => (
                <div
                  key={cvItem.id}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition p-5 flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        {cvItem.photoUrl ? (
                          <img
                            src={cvItem.photoUrl}
                            alt={cvItem.fullName}
                            className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-2xs"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 font-bold flex items-center justify-center text-sm border border-blue-100">
                            {cvItem.fullName?.[0] || 'C'}
                          </div>
                        )}
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition">
                            {cvItem.fullName || 'Untitled CV'}
                          </h4>
                          <p className="text-[11px] text-slate-500">{cvItem.professionalTitle || 'Career Professional'}</p>
                        </div>
                      </div>

                      <button
                        onClick={(e) => handleToggleFavorite(cvItem.id, e)}
                        className={`p-1.5 rounded-lg transition ${
                          cvItem.isFavorite ? 'text-amber-500 hover:bg-amber-50' : 'text-slate-300 hover:text-amber-500'
                        }`}
                        title={cvItem.isFavorite ? 'Remove from favorites' : 'Mark as favorite'}
                      >
                        <Star className={`w-4 h-4 ${cvItem.isFavorite ? 'fill-amber-500' : ''}`} />
                      </button>
                    </div>

                    <div className="mt-4 aspect-[210/297] w-full bg-slate-50 rounded-xl border border-slate-200 overflow-hidden flex items-center justify-center p-3 relative group/preview">
                      <div className="w-full max-w-[100px] shadow-lg transform group-hover/preview:scale-105 transition-transform duration-300">
                        <TemplateLivePreview
                          templateId={cvItem.templateId}
                          accentColor={cvItem.design.primaryColor}
                          language={cvItem.language === 'bn' ? 'Bangla' : 'English'}
                          isATS={cvItem.isATS}
                        />
                      </div>
                    </div>

                    <div className="mt-3 flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-semibold">
                        {cvItem.templateId || 'Standard'}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-semibold">
                        {isBangla ? 'মানব-রচিত স্টাইল' : 'Human Standard'}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {cvItem.pagesCount || 1} {cvItem.pagesCount && cvItem.pagesCount > 1 ? 'Pages' : 'Page'}
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => handleDuplicateCV(cvItem, e)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                        title="Duplicate CV"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => handleDeleteCV(cvItem.id, e)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
                        title="Delete CV"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => {
                        onEditCV(cvItem);
                        setActiveView('cv-builder');
                      }}
                      className="flex items-center gap-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-3.5 py-1.5 rounded-xl shadow-xs transition active:scale-95"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>{isBangla ? 'এডিট করুন' : 'Edit CV'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Official Docs Tab */}
      {activeTab === 'docs' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-indigo-600" />
              <span>{isBangla ? 'অফিসিয়াল দরখাস্ত ও প্রত্যয়নপত্র' : 'Official Applications & Certificates'}</span>
            </h3>
            <button
              onClick={() => setActiveView('doc-builder')}
              className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg"
            >
              + {isBangla ? 'নতুন দরখাস্ত তৈরি' : 'New Document'}
            </button>
          </div>

          {docList.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center border border-slate-200">
              <FileSpreadsheet className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-slate-600 text-xs">
                {isBangla ? 'কোনো অফিসিয়াল ডকুমেন্ট তৈরি করা হয়নি।' : 'No official documents saved yet.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {docList.map((docItem) => (
                <div
                  key={docItem.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col justify-between"
                >
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-900 text-sm">{docItem.title || 'Official Document'}</h4>
                      <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                        <FileSpreadsheet className="w-4 h-4" />
                      </div>
                    </div>
                    
                    <div className="aspect-[210/297] w-full bg-slate-50 rounded-xl border border-slate-200 overflow-hidden flex items-center justify-center p-3 relative group/preview">
                      <div className="w-full max-w-[100px] shadow-lg transform group-hover/preview:scale-105 transition-transform duration-300">
                        <TemplateLivePreview
                          category={docItem.category}
                          language={docItem.language === 'bn' ? 'Bangla' : 'English'}
                          accentColor="#4F46E5"
                        />
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{docItem.subject || docItem.category}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">
                      {docItem.lastModified ? new Date(docItem.lastModified).toLocaleDateString() : 'Saved'}
                    </span>
                    <button
                      onClick={() => {
                        onEditDoc(docItem);
                        setActiveView('doc-builder');
                      }}
                      className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg"
                    >
                      {isBangla ? 'এডিট' : 'Edit'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      <UserAuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        language={language}
      />

      <MasterProfileModal
        isOpen={showMasterProfileModal}
        onClose={() => {
          setShowMasterProfileModal(false);
          reloadData();
        }}
        language={language}
        onGenerateCV={(newCV) => {
          onEditCV(newCV);
          setActiveView('cv-builder');
        }}
      />
    </div>
  );
};
