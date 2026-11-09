import React, { useState, useEffect } from 'react';
import { Download, X, AlertCircle, Sparkles, Smartphone } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Language } from '../types';

interface PWAInstallPopupProps {
  language: Language;
}

export const PWAInstallPopup: React.FC<PWAInstallPopupProps> = ({ language }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [isVisible, setIsVisible] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const isBangla = language === 'bn';

  useEffect(() => {
    // Show popup after 3 seconds if not installed
    if (!isInstalled && (isInstallable || isIOS)) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 3000);

      // Auto-close after 15 seconds
      const autoCloseTimer = setTimeout(() => {
        setIsVisible(false);
      }, 18000); // 3s delay + 15s show time

      return () => {
        clearTimeout(timer);
        clearTimeout(autoCloseTimer);
      };
    }
  }, [isInstalled, isInstallable, isIOS]);

  if (!isVisible || isInstalled) return null;

  const handleInstall = async () => {
    if (isInstallable) {
      const success = await install();
      if (success) setIsVisible(false);
    } else if (isIOS) {
      setShowIOSGuide(true);
    }
  };

  return (
    <>
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[92%] max-w-md animate-in slide-in-from-bottom-8 duration-500">
        <div className="bg-white rounded-3xl shadow-2xl border border-blue-100 overflow-hidden ring-1 ring-black/5">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-4 flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
                <Smartphone className="w-4 h-4" />
              </div>
              <h3 className="font-black text-sm tracking-tight uppercase">
                {isBangla ? 'স্মার্টসিভি অ্যাপ ইন্সটল করুন' : 'Install SmartCV App'}
              </h3>
            </div>
            <button 
              onClick={() => setIsVisible(false)}
              className="p-1 hover:bg-white/20 rounded-lg transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-5 space-y-4">
            <div className="flex gap-3">
              <div className="w-10 h-10 shrink-0 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-800">
                  {isBangla ? 'অফলাইনে সিভি তৈরি করুন' : 'Create CVs without Internet'}
                </p>
                <p className="text-[11px] leading-relaxed text-slate-500">
                  {isBangla 
                    ? 'অ্যাপটি ইন্সটল করলে আপনি ইন্টারনেট ছাড়াই যেকোনো সময় প্রফেশনাল সিভি ও ডকুমেন্ট তৈরি করতে পারবেন।'
                    : 'Install the app to access all features offline and enjoy a faster, smoother experience.'}
                </p>
              </div>
            </div>

            {/* Ads Notice */}
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-3.5 flex gap-2.5 items-start">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-[10px] text-amber-800 font-medium leading-relaxed">
                {isBangla 
                  ? 'বিজ্ঞপ্তি: মাঝে মাঝে কিছু বিজ্ঞাপন (Ads) আসতে পারে। আপনার ক্লিকের সাথে সাথে অন্য পেজে গেলে "Back" বাটনে ক্লিক করলে পুনরায় ঠিক জায়গায় ফিরে আসবেন।'
                  : 'Notice: Occasional ads may appear. If a click takes you to another page, simply press "Back" to return to where you were.'}
              </p>
            </div>

            <button
              onClick={handleInstall}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-xs shadow-lg shadow-blue-500/30 transition active:scale-[0.98]"
            >
              <Download className="w-4 h-4" />
              <span>
                {isBangla ? 'অ্যাপটি ইন্সটল করুন (APK/Web)' : 'Install App Now (APK/Web)'}
              </span>
            </button>
            
            <p className="text-center text-[10px] text-slate-400 font-medium">
              {isBangla ? 'এই পপআপটি ১৫ সেকেন্ড পর নিজে থেকেই চলে যাবে' : 'This popup will auto-close in 15 seconds'}
            </p>
          </div>
        </div>
      </div>

      {/* iOS Guide Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-black text-slate-900 tracking-tight mb-2">
              {isBangla ? 'আইফোনে ইন্সটল করার নিয়ম' : 'Install on iPhone / iPad'}
            </h3>
            <div className="space-y-4 text-sm text-slate-600">
              <p className="flex items-start gap-3">
                <span className="w-6 h-6 shrink-0 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                <span>
                  {isBangla 
                    ? 'প্রথমে নিচের "Share" বাটনে ক্লিক করুন।' 
                    : 'Tap the "Share" button in your browser toolbar.'}
                </span>
              </p>
              <p className="flex items-start gap-3">
                <span className="w-6 h-6 shrink-0 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                <span>
                  {isBangla 
                    ? 'একটু নিচে গিয়ে "Add to Home Screen" অপশনে ক্লিক করুন।' 
                    : 'Scroll down and tap "Add to Home Screen".'}
                </span>
              </p>
            </div>
            <button
              onClick={() => setShowIOSGuide(false)}
              className="mt-6 w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-sm transition"
            >
              {isBangla ? 'বুঝেছি' : 'Got it'}
            </button>
          </div>
        </div>
      )}
    </>
  );
};
