import React, { useEffect, useState } from 'react';
import {
  FileText,
  CheckCircle2,
  AlertCircle,
  Download,
  ExternalLink,
  X,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { PDFGenerationProgress, DownloadReadyEventDetail } from '../lib/pdf';
import { Language } from '../types';

export interface ToastState {
  status: 'idle' | 'generating' | 'success' | 'error';
  progress: number;
  message: string;
  filename?: string;
  downloadUrl?: string;
  error?: string;
}

interface DownloadProgressToastProps {
  toast: ToastState;
  onClose: () => void;
  language?: Language;
}

export const DownloadProgressToast: React.FC<DownloadProgressToastProps> = ({
  toast,
  onClose,
  language = 'en',
}) => {
  const [autoCloseTimer, setAutoCloseTimer] = useState<number>(6);

  useEffect(() => {
    if (toast.status === 'success') {
      setAutoCloseTimer(6);
      const interval = setInterval(() => {
        setAutoCloseTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            onClose();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [toast.status, onClose]);

  if (toast.status === 'idle') return null;

  const isBn = language === 'bn';

  return (
    <div
      id="pdf-download-progress-toast"
      className="fixed bottom-5 right-5 sm:right-6 z-50 w-[calc(100vw-2.5rem)] sm:w-96 max-w-sm animate-in fade-in slide-in-from-bottom-5 duration-300 select-none"
    >
      <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-2xl p-4 sm:p-5 text-slate-800 relative overflow-hidden ring-1 ring-black/5">
        {/* Top colored accent indicator line */}
        <div
          className={`absolute top-0 left-0 right-0 h-1 transition-all duration-300 ${
            toast.status === 'generating'
              ? 'bg-blue-600'
              : toast.status === 'success'
              ? 'bg-emerald-500'
              : 'bg-rose-500'
          }`}
        />

        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            {toast.status === 'generating' && (
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 shadow-2xs">
                <Loader2 className="w-5 h-5 animate-spin" />
              </div>
            )}
            {toast.status === 'success' && (
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 shadow-2xs animate-in zoom-in-50 duration-200">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            )}
            {toast.status === 'error' && (
              <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 shadow-2xs animate-in zoom-in-50 duration-200">
                <AlertCircle className="w-5 h-5" />
              </div>
            )}

            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight">
                {toast.status === 'generating' &&
                  (isBn ? 'পিডিএফ তৈরি হচ্ছে...' : 'Generating PDF Document...')}
                {toast.status === 'success' &&
                  (isBn ? 'পিডিএফ সফলভাবে তৈরি হয়েছে!' : 'PDF Download Ready!')}
                {toast.status === 'error' &&
                  (isBn ? 'পিডিএফ তৈরিতে ব্যর্থ হয়েছে' : 'PDF Generation Failed')}
              </h4>
              <p className="text-[11px] text-slate-500 font-medium truncate max-w-[200px]">
                {toast.filename || 'SmartCV_Document.pdf'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition shrink-0"
            title="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body content based on status */}
        {toast.status === 'generating' && (
          <div className="mt-3.5 space-y-2">
            {/* Progress Bar */}
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200/60 p-0.5">
              <div
                style={{ width: `${Math.max(5, toast.progress)}%` }}
                className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 h-full rounded-full transition-all duration-300 shadow-xs"
              />
            </div>

            {/* Progress label & message */}
            <div className="flex items-center justify-between text-[11px] font-semibold">
              <span className="text-slate-600 font-medium truncate pr-2">
                {toast.message || (isBn ? 'প্রস্তুত হচ্ছে...' : 'Rendering high-res pages...')}
              </span>
              <span className="text-blue-600 tabular-nums shrink-0">{toast.progress}%</span>
            </div>
          </div>
        )}

        {toast.status === 'success' && (
          <div className="mt-3 space-y-2.5">
            <p className="text-xs text-slate-600 leading-snug">
              {isBn
                ? 'আপনার ফাইলটি ডিভাইসে সেভ করা হয়েছে। ব্রাউজারের ডাউনলোড ফোল্ডার চেক করুন।'
                : 'Your document was successfully compiled and downloaded. You can also save or view it below:'}
            </p>

            {/* Action buttons */}
            <div className="flex items-center gap-2 pt-1">
              {toast.downloadUrl && (
                <>
                  <a
                    href={toast.downloadUrl}
                    download={toast.filename || 'SmartCV.pdf'}
                    className="flex-1 py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs flex items-center justify-center gap-1.5 active:scale-95 transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{isBn ? 'পুনরায় ডাউনলোড' : 'Save File'}</span>
                  </a>
                  <a
                    href={toast.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-1.5 px-3 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center justify-center gap-1 active:scale-95 transition"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                    <span>{isBn ? 'খুলুন' : 'Open'}</span>
                  </a>
                </>
              )}
            </div>

            <div className="text-[10px] text-slate-400 text-right">
              {isBn ? `${autoCloseTimer} সেকেন্ডে বন্ধ হবে` : `Auto-closing in ${autoCloseTimer}s`}
            </div>
          </div>
        )}

        {toast.status === 'error' && (
          <div className="mt-3 space-y-2">
            <p className="text-xs text-rose-700 leading-relaxed font-medium">
              {toast.error ||
                (isBn
                  ? 'কিছু একটা সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।'
                  : 'An unexpected error occurred during rendering. Please retry.')}
            </p>
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition"
              >
                {isBn ? 'বন্ধ করুন' : 'Dismiss'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
