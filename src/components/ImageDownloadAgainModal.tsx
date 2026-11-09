import React from 'react';
import {
  X,
  Download,
  ExternalLink,
  CheckCircle2,
  RefreshCw,
  Image as ImageIcon,
  Sparkles,
  FileCheck,
} from 'lucide-react';
import { Language } from '../types';

interface ImageDownloadAgainModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  filename: string;
  onDownloadAgain: () => void;
  onReExportLatest: () => void;
  language: Language;
  isExporting?: boolean;
}

export const ImageDownloadAgainModal: React.FC<ImageDownloadAgainModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  filename,
  onDownloadAgain,
  onReExportLatest,
  language,
  isExporting = false,
}) => {
  const isBangla = language === 'bn';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-200 flex flex-col animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-xs">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-black tracking-tight">
                {isBangla ? 'জেপিজি (JPG) ছবি তৈরি সম্পন্ন!' : 'JPG Image Ready!'}
              </h3>
              <p className="text-teal-100 text-xs">
                {isBangla ? 'হাই-রেজোলিউশন প্রিন্ট কোয়ালিটি' : 'High Resolution Print Quality'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Preview Image Box */}
          <div className="p-3 rounded-2xl bg-slate-100 border border-slate-200 flex flex-col items-center justify-center">
            {imageUrl ? (
              <div className="max-h-60 w-full overflow-hidden rounded-xl shadow-inner flex items-center justify-center bg-white">
                <img
                  src={imageUrl}
                  alt={filename}
                  className="max-h-56 w-auto object-contain shadow-sm"
                />
              </div>
            ) : (
              <div className="py-12 flex flex-col items-center text-slate-400">
                <ImageIcon className="w-12 h-12 mb-2" />
                <span className="text-xs">{isBangla ? 'ছবি প্রস্তুত হচ্ছে...' : 'Rendering image...'}</span>
              </div>
            )}
            <div className="mt-3 w-full flex items-center justify-between text-xs text-slate-600 px-1">
              <span className="font-semibold truncate max-w-[260px] text-slate-800" title={filename}>
                📁 {filename}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                JPG 2X
              </span>
            </div>
          </div>

          <div className="bg-blue-50/70 border border-blue-200/70 rounded-2xl p-3.5 text-xs text-blue-800 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">
                {isBangla
                  ? 'সিভিতে নাম বা তথ্য পরিবর্তন করলে নতুন নামে স্বয়ংক্রিয়ভাবে সেভ হবে।'
                  : 'Editing any name or text automatically updates the filename on next save.'}
              </p>
              <p className="text-[11px] text-blue-600/90 mt-0.5">
                {isBangla
                  ? 'আপনি যতবার ইচ্ছা ততবার পুনরায় সেভ করতে পারেন, কোনো সীমাবদ্ধতা নেই!'
                  : 'You can save again as many times as you want without limits!'}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={onDownloadAgain}
              className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-500/20 active:scale-95 transition"
            >
              <Download className="w-4 h-4" />
              <span>{isBangla ? 'পুনরায় ডাউনলোড করুন' : 'Download Again'}</span>
            </button>

            <a
              href={imageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs shadow-2xs hover:border-slate-300 active:scale-95 transition"
            >
              <ExternalLink className="w-4 h-4 text-slate-500" />
              <span>{isBangla ? 'নতুন ট্যাবে দেখুন' : 'Open in New Tab'}</span>
            </a>
          </div>

          {/* Re-export Button if changes made */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              disabled={isExporting}
              onClick={onReExportLatest}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isExporting ? 'animate-spin text-blue-600' : ''}`} />
              <span>
                {isExporting
                  ? isBangla
                    ? 'নতুন ছবি তৈরি হচ্ছে...'
                    : 'Re-exporting latest changes...'
                  : isBangla
                  ? '🔄 সাম্প্রতিক এডিটের নতুন ছবি সেভ করুন (Auto-Rename)'
                  : '🔄 Re-export with latest edits (Auto-Rename)'}
              </span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-xl hover:bg-slate-200 transition"
          >
            {isBangla ? 'ঠিক আছে' : 'Done'}
          </button>
        </div>
      </div>
    </div>
  );
};
