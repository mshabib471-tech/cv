import React from 'react';
import { X, HelpCircle, Smartphone, WifiOff, RefreshCw, Trash2, CheckCircle2 } from 'lucide-react';
import { Language } from '../types';

interface HelpModalProps {
  language: Language;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ language, onClose }) => {
  const isBangla = language === 'bn';

  const handleClearCache = () => {
    if (window.caches) {
      caches.keys().then((names) => {
        for (let name of names) {
          caches.delete(name);
        }
      });
    }
    localStorage.clear();
    alert(isBangla ? 'ক্যাশ এবং লোকাল স্টোরেজ সফলভাবে পরিষ্কার করা হয়েছে! পেজটি রিলোড হচ্ছে।' : 'Cache and local storage cleared successfully! Reloading page.');
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">
                {isBangla ? 'সহায়তা ও নির্দেশিকা (Help & Guide)' : 'Help & Offline Guide'}
              </h3>
              <p className="text-xs text-slate-500">
                {isBangla ? 'অফলাইন ব্যবহার এবং ক্যাশ পরিষ্কার করার নিয়ম' : 'PWA offline use and cache clearing instructions'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-5 text-sm text-slate-700">
          {/* Section 1: Offline PWA */}
          <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-blue-900 font-bold text-xs uppercase tracking-wider">
              <Smartphone className="w-4 h-4 text-blue-600" />
              <span>{isBangla ? 'অফলাইনে অ্যাপ ব্যবহার করার নিয়ম' : 'How to Use Offline (PWA)'}</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {isBangla
                ? 'আমাদের এই সাইটটি একটি প্রোগ্রেসিভ ওয়েব অ্যাপ (PWA)। আপনি ব্রোমজার মেনু বা পপআপ থেকে "Install App" এ ক্লিক করে আপনার মোবাইল বা কম্পিউটারে অ্যাপটি ইন্সটল করে নিতে পারেন। ইন্সটল করার পর ইন্টারনেট সংযোগ না থাকলেও আপনি সিভিসমূহ তৈরি, এডিট এবং পিডিএফ ডাউনলোড করতে পারবেন।'
                : 'Our app is a Progressive Web App (PWA). Click "Install App" in the popup or browser menu to install it on your device. Once installed, you can create, edit, and download CVs even without an internet connection.'}
            </p>
          </div>

          {/* Section 2: Clearing Cache */}
          <div className="bg-amber-50/70 border border-amber-100 rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wider">
              <RefreshCw className="w-4 h-4 text-amber-600" />
              <span>{isBangla ? 'ডকুমেন্ট লোডিং সমস্যা ও ক্যাশ ক্লিয়ার' : 'Fixing Loading Issues & Clearing Cache'}</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {isBangla
                ? 'যদি কখনো আপনার ব্রাউজারে সিভি বা ডকুমেন্ট লোড হতে সমস্যা হয় বা পুরোনো পেজ আটকে থাকে, তবে নিচের বাটনে ক্লিক করে অ্যাপ ক্যাশ ও স্টোরেজ পরিষ্কার করে নিতে পারেন।'
                : 'If you experience document loading issues or outdated previews, you can clear the browser cache and application storage instantly using the button below.'}
            </p>
            <button
              onClick={handleClearCache}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition active:scale-95"
            >
              <Trash2 className="w-4 h-4" />
              <span>{isBangla ? 'ক্যাশ ও ডাটা পরিষ্কার করুন (Clear Cache)' : 'Clear App Cache & Data'}</span>
            </button>
          </div>

          {/* Section 3: Partner Ads Note */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-1.5">
            <h4 className="font-bold text-slate-900 text-xs">
              {isBangla ? 'বিজ্ঞাপন সম্পর্কিত তথ্য' : 'About Partner Links'}
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              {isBangla
                ? 'সাইট পরিচালনার সুবিধার্থে মাঝে মাঝে স্পন্সরড অফার লিংক প্রদর্শিত হতে পারে। লিংকে ক্লিক করার পর অন্য পেজে গেলে ব্রাউজারের "Back" বাটনে ক্লিক করে পুনরায় আমাদের সাইটে ফিরে আসতে পারবেন।'
                : 'Occasional partner offers may appear. If a click redirects you to an external page, simply press the browser "Back" button to return to your work.'}
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition"
          >
            {isBangla ? 'বন্ধ করুন' : 'Close Guide'}
          </button>
        </div>
      </div>
    </div>
  );
};
