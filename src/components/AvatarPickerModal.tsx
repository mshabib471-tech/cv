import React, { useRef } from 'react';
import { X, Upload, Check, User, Sparkles, Image } from 'lucide-react';
import { PROFESSIONAL_AVATARS, AvatarOption } from '../data/avatars';
import { Language } from '../types';

interface AvatarPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedAvatar?: string;
  onSelectAvatar: (avatarUri: string) => void;
  onUploadCustomPhoto: (dataUrl: string) => void;
  language: Language;
}

export const AvatarPickerModal: React.FC<AvatarPickerModalProps> = ({
  isOpen,
  onClose,
  selectedAvatar,
  onSelectAvatar,
  onUploadCustomPhoto,
  language,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isBangla = language === 'bn';

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onUploadCustomPhoto(reader.result);
        onClose();
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[11px] font-bold mb-1">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>{isBangla ? 'সিভি প্রোফাইল ছবি ও অ্যাভাটার' : 'CV Photo & Avatar'}</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              {isBangla ? 'প্রফেশনাল অ্যাভাটার নির্বাচন করুন' : 'Choose a Professional Avatar'}
            </h3>
            <p className="text-xs text-slate-500">
              {isBangla
                ? 'সিভিতে আসল ছবির বদলে আধুনিক অ্যাভাটার অথবা আপনার নিজস্ব ছবি যোগ করুন।'
                : 'Select a clean professional avatar or upload your personal photo.'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-5">
          {/* Custom Upload Button */}
          <div className="p-4 rounded-2xl border-2 border-dashed border-blue-200 bg-blue-50/50 hover:bg-blue-50 text-center transition flex flex-col items-center justify-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-sm">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">
                {isBangla ? 'আপনার নিজের ছবি আপলোড করুন' : 'Upload Your Real Photo'}
              </p>
              <p className="text-[11px] text-slate-500">
                {isBangla ? 'JPG, PNG বা WEBP (সর্বোচ্চ ৫ মেগাবাইট)' : 'JPG, PNG or WEBP (Max 5MB)'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs active:scale-95 transition"
            >
              {isBangla ? 'গ্যালারি থেকে নির্বাচন' : 'Browse Gallery'}
            </button>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              {isBangla ? 'রেডিমেড প্রফেশনাল অ্যাভাটারসমূহ' : 'Ready-to-Use Avatars'}
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {PROFESSIONAL_AVATARS.map((av) => {
                const isSelected = selectedAvatar === av.svgDataUri;
                return (
                  <button
                    key={av.id}
                    type="button"
                    onClick={() => {
                      onSelectAvatar(av.svgDataUri);
                      onClose();
                    }}
                    className={`relative p-3 rounded-2xl border text-center transition flex flex-col items-center gap-2 group ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20 shadow-sm'
                        : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-slate-200 group-hover:scale-105 transition-transform shadow-2xs">
                      <img src={av.svgDataUri} alt={av.name} className="w-full h-full object-cover" />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-700 leading-tight">
                      {isBangla ? av.nameBn : av.name}
                    </span>
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-xl hover:bg-slate-200/60 transition"
          >
            {isBangla ? 'বাতিল' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
