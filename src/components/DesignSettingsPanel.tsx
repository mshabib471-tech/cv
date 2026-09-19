import React from 'react';
import {
  Palette,
  Type,
  Maximize2,
  FileText,
  User,
  Sliders,
  Check,
  Plus,
  Trash2,
} from 'lucide-react';
import { CVData } from '../types';
import { useTranslation } from '../lib/i18n';

interface DesignSettingsPanelProps {
  cv: CVData;
  onUpdateCV: (updated: Partial<CVData>) => void;
  onAddPage: () => void;
  onRemovePage: () => void;
}

const COLOR_PRESETS = [
  { name: 'Modern Blue', primary: '#2563EB', secondary: '#4F46E5' },
  { name: 'Indigo Accent', primary: '#4F46E5', secondary: '#7C3AED' },
  { name: 'Emerald Forest', primary: '#059669', secondary: '#047857' },
  { name: 'Crimson Executive', primary: '#BE123C', secondary: '#881337' },
  { name: 'Teal Minimal', primary: '#0D9488', secondary: '#115E59' },
  { name: 'Amber Gold', primary: '#D97706', secondary: '#B45309' },
  { name: 'Classic Slate', primary: '#334155', secondary: '#1E293B' },
  { name: 'Pure Dark', primary: '#0F172A', secondary: '#334155' },
];

export const DesignSettingsPanel: React.FC<DesignSettingsPanelProps> = ({
  cv,
  onUpdateCV,
  onAddPage,
  onRemovePage,
}) => {
  const t = useTranslation(cv.language);
  const design = cv.design;

  const updateDesign = (field: keyof CVData['design'], value: any) => {
    onUpdateCV({
      design: {
        ...cv.design,
        [field]: value,
      },
    });
  };

  return (
    <div className="space-y-4 text-xs">
      {/* 1. Color Palettes & Custom Picker */}
      <div className="bg-white/80 border border-slate-200/80 rounded-2xl p-4 shadow-2xs space-y-3">
        <div className="flex items-center gap-2 font-bold text-slate-800">
          <Palette className="w-4 h-4 text-blue-600" />
          <span>{t.colors}</span>
        </div>

        {/* Preset Circles */}
        <div className="grid grid-cols-4 gap-2">
          {COLOR_PRESETS.map((preset, idx) => {
            const isSelected = design.primaryColor === preset.primary;
            return (
              <button
                key={idx}
                onClick={() =>
                  onUpdateCV({
                    design: {
                      ...design,
                      primaryColor: preset.primary,
                      secondaryColor: preset.secondary,
                    },
                  })
                }
                title={preset.name}
                className={`p-2 rounded-xl border flex flex-col items-center gap-1.5 transition ${
                  isSelected ? 'border-blue-500 bg-blue-50/60 ring-2 ring-blue-500/20' : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center shadow-xs"
                  style={{ backgroundColor: preset.primary }}
                >
                  {isSelected && <Check className="w-3 h-3 text-white stroke-[3]" />}
                </div>
                <span className="text-[10px] text-slate-600 truncate w-full text-center">
                  {preset.name.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Custom Hex Color Pickers */}
        <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2">
          <div>
            <label className="text-[11px] font-semibold text-slate-600 block mb-1">Primary Color</label>
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg p-1">
              <input
                type="color"
                value={design.primaryColor}
                onChange={(e) => updateDesign('primaryColor', e.target.value)}
                className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
              />
              <span className="font-mono text-[11px] text-slate-700">{design.primaryColor}</span>
            </div>
          </div>
          <div>
            <label className="text-[11px] font-semibold text-slate-600 block mb-1">Secondary Color</label>
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg p-1">
              <input
                type="color"
                value={design.secondaryColor}
                onChange={(e) => updateDesign('secondaryColor', e.target.value)}
                className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
              />
              <span className="font-mono text-[11px] text-slate-700">{design.secondaryColor}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Typography & Fonts */}
      <div className="bg-white/80 border border-slate-200/80 rounded-2xl p-4 shadow-2xs space-y-3">
        <div className="flex items-center gap-2 font-bold text-slate-800">
          <Type className="w-4 h-4 text-indigo-600" />
          <span>{t.font}</span>
        </div>

        <select
          value={design.fontFamily}
          onChange={(e) => updateDesign('fontFamily', e.target.value)}
          className="w-full p-2 rounded-xl border border-slate-200 bg-white font-medium text-slate-700 outline-none"
        >
          <option value="Inter">Inter (Professional Standard)</option>
          <option value="Noto Sans Bengali">Noto Sans Bengali (বাংলা উপযোগী)</option>
          <option value="Poppins">Poppins (Clean & Modern)</option>
          <option value="Roboto">Roboto (Google Tech)</option>
          <option value="serif">Classic Times / Serif (Formal)</option>
        </select>

        {/* Font Size & Line Height */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <div>
            <label className="text-[11px] font-semibold text-slate-600 block mb-1">{t.fontSize}</label>
            <div className="grid grid-cols-3 gap-1">
              {(['small', 'medium', 'large'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => updateDesign('fontSize', s)}
                  className={`py-1 rounded-lg border capitalize font-semibold transition ${
                    design.fontSize === s
                      ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  {s[0].toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-600 block mb-1">{t.lineHeight}</label>
            <div className="grid grid-cols-3 gap-1">
              {(['tight', 'normal', 'relaxed'] as const).map((lh) => (
                <button
                  key={lh}
                  onClick={() => updateDesign('lineHeight', lh)}
                  className={`py-1 rounded-lg border capitalize font-semibold transition ${
                    design.lineHeight === lh
                      ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  {lh === 'tight' ? '1.2' : lh === 'normal' ? '1.5' : '1.8'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Margins & Photo Framing */}
      <div className="bg-white/80 border border-slate-200/80 rounded-2xl p-4 shadow-2xs space-y-3">
        <div className="flex items-center gap-2 font-bold text-slate-800">
          <Sliders className="w-4 h-4 text-emerald-600" />
          <span>{t.pageMargin} & Framing</span>
        </div>

        {/* Page Margins */}
        <div>
          <label className="text-[11px] font-semibold text-slate-600 block mb-1">{t.pageMargin}</label>
          <div className="grid grid-cols-3 gap-1.5">
            {(['compact', 'normal', 'spacious'] as const).map((m) => (
              <button
                key={m}
                onClick={() => updateDesign('pageMargin', m)}
                className={`py-1.5 rounded-lg border capitalize font-medium transition ${
                  design.pageMargin === m
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Photo Shape */}
        <div>
          <label className="text-[11px] font-semibold text-slate-600 block mb-1">{t.photoShape}</label>
          <div className="grid grid-cols-4 gap-1.5">
            {(['circle', 'rounded', 'square', 'none'] as const).map((shape) => (
              <button
                key={shape}
                onClick={() => onUpdateCV({ photoShape: shape })}
                className={`py-1.5 rounded-lg border capitalize font-medium transition ${
                  cv.photoShape === shape
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                {shape}
              </button>
            ))}
          </div>
        </div>

        {/* Header Style */}
        <div>
          <label className="text-[11px] font-semibold text-slate-600 block mb-1">{t.headerStyle}</label>
          <div className="grid grid-cols-3 gap-1.5">
            {(['modern', 'banner', 'sidebar'] as const).map((hstyle) => (
              <button
                key={hstyle}
                onClick={() => updateDesign('headerStyle', hstyle)}
                className={`py-1.5 rounded-lg border capitalize font-medium transition ${
                  design.headerStyle === hstyle
                    ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                {hstyle}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Page Management (Add page, Delete page, Auto break) */}
      <div className="bg-white/80 border border-slate-200/80 rounded-2xl p-4 shadow-2xs space-y-3">
        <div className="flex items-center justify-between font-bold text-slate-800">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-purple-600" />
            <span>A4 Document Pages</span>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 font-bold border border-purple-200">
            {cv.pagesCount || 1} Page{(cv.pagesCount || 1) > 1 ? 's' : ''}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onAddPage}
            className="flex-1 py-2 rounded-xl bg-blue-50 text-blue-600 font-semibold border border-blue-200 hover:bg-blue-100 flex items-center justify-center gap-1.5 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t.addPage}</span>
          </button>

          {(cv.pagesCount || 1) > 1 && (
            <button
              onClick={onRemovePage}
              className="py-2 px-3 rounded-xl bg-red-50 text-red-600 font-semibold border border-red-200 hover:bg-red-100 flex items-center justify-center gap-1 transition"
              title="Remove Last Page"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
