import React from 'react';
import { Loader2, FileDown, Sparkles } from 'lucide-react';
import { Language } from '../types';

interface GeneratingOverlayProps {
  isVisible: boolean;
  language: Language;
  title?: string;
  subtitle?: string;
}

export const GeneratingOverlay: React.FC<GeneratingOverlayProps> = ({
  isVisible,
  language,
  title,
  subtitle,
}) => {
  if (!isVisible) return null;
  const isBangla = language === 'bn';

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div className="bg-white rounded-3xl p-8 max-w-sm w-full mx-4 shadow-2xl border border-white/20 flex flex-col items-center text-center space-y-5 animate-in zoom-in-95 duration-200">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 animate-pulse">
            <FileDown className="w-10 h-10 animate-bounce" />
          </div>
          <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md">
            <Loader2 className="w-4 h-4 animate-spin" />
          </div>
        </div>

        <div className="space-y-1.5">
          <h3 className="text-lg font-black text-slate-900 tracking-tight">
            {title || (isBangla ? 'পিডিএফ (PDF) তৈরি হচ্ছে...' : 'Generating PDF Document...')}
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            {subtitle || (isBangla 
              ? 'হাই-রেজোলিউশন ভেক্টর পেজ রেন্ডার করা হচ্ছে। অনুগ্রহ করে একটু অপেক্ষা করুন...' 
              : 'Rendering high-resolution vector pages and preparing download. Please do not close or click away.')}
          </p>
        </div>

        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
          <div className="bg-blue-600 h-full rounded-full animate-[indeterminate_1.5s_infinite_linear]" style={{ width: '60%' }}></div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-[11px] font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{isBangla ? 'পিক্সেল-পারফেক্ট কোয়ালিটি' : 'Pixel-Perfect Quality'}</span>
        </div>
      </div>
    </div>
  );
};
