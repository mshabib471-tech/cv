import React from 'react';
import {
  FileText,
  ShieldCheck,
  Globe,
  Printer,
  Sparkles,
  Heart,
  ExternalLink,
  MapPin,
  Phone,
  Mail,
  Clock,
} from 'lucide-react';
import { ActiveView, Language } from '../types';
import { useTranslation } from '../lib/i18n';

interface FooterProps {
  setActiveView: (view: ActiveView) => void;
  language: Language;
}

export const Footer: React.FC<FooterProps> = ({ setActiveView, language }) => {
  const t = useTranslation(language);

  return (
    <footer className="glass-panel border-t border-slate-200/80 mt-auto text-xs text-slate-600 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-xs">
                <FileText className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-base tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-800">
                SmartCV Pro
              </span>
            </div>
            <p className="text-slate-500 leading-relaxed text-xs">
              Next-generation Word-style document and CV editor. Design, customize, and export career-defining documents in minutes.
            </p>
            <div className="flex items-center gap-1.5 text-emerald-700 font-semibold text-[11px]">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>100% Client-Side Privacy</span>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="font-bold text-slate-900 mb-3 uppercase tracking-wider text-[11px]">
              CV Templates
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setActiveView('templates')}
                  className="hover:text-blue-600 transition"
                >
                  1-Page ATS Friendly CV
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('templates')}
                  className="hover:text-blue-600 transition"
                >
                  2 & 3 Page Executive Resumes
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('templates')}
                  className="hover:text-blue-600 transition"
                >
                  বাংলা জীবনবৃত্তান্ত (Bangla CV)
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('templates')}
                  className="hover:text-blue-600 transition"
                >
                  Marriage CV (বিবাহের বায়োডাটা)
                </button>
              </li>
            </ul>
          </div>

          {/* Official Documents */}
          <div>
            <h4 className="font-bold text-slate-900 mb-3 uppercase tracking-wider text-[11px]">
              Official Documents
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setActiveView('doc-builder')}
                  className="hover:text-blue-600 transition"
                >
                  Job Applications (English & Bangla)
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('doc-builder')}
                  className="hover:text-blue-600 transition"
                >
                  Experience Certificates
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('doc-builder')}
                  className="hover:text-blue-600 transition"
                >
                  Joining & Resignation Letters
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('doc-builder')}
                  className="hover:text-blue-600 transition"
                >
                  Money Receipts & Exam Papers
                </button>
              </li>
            </ul>
          </div>

          {/* Admin & Partner Resources */}
          <div>
            <h4 className="font-bold text-slate-900 mb-3 uppercase tracking-wider text-[11px]">
              Admin & Partner Links
            </h4>
            <ul className="space-y-2 text-slate-600">
              <li>
                <a
                  id="footer-admin-website-link"
                  href="https://www.habibifix.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-semibold"
                >
                  <span>Admin Website (habibifix)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  id="footer-smartlink-partner-link"
                  href="https://www.profitableratecpmnetwork.com/ggjmk8i2j?key=a251b31cdefa0940555facd387b4e6c1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-amber-700 hover:text-amber-800 font-semibold"
                >
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>Partner Career Deals (Smartlink)</span>
                </a>
              </li>
              <li className="pt-1 text-slate-400 text-[11px]">• Microsoft Word-style In-Place Editing</li>
              <li className="text-slate-400 text-[11px]">• Crisp A4 Vector PDF Generation</li>
              <li className="text-slate-400 text-[11px]">• Progressive Web App (PWA) Offline Ready</li>
            </ul>
          </div>
        </div>

        {/* Contact, Location & Working Hours Section */}
        <div className="my-8 p-6 rounded-3xl glass-card border border-blue-200/80 bg-gradient-to-br from-white/95 via-blue-50/30 to-indigo-50/40 shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Location */}
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <h5 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Our Location</h5>
                <p className="text-slate-700 text-xs font-medium mt-1 leading-snug">
                  House - Habibur Rahman, Gachbaria
                </p>
                <p className="text-slate-500 text-xs">Chattogram, Bangladesh</p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <h5 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Phone Number</h5>
                <a
                  href="tel:+8801868461577"
                  className="inline-block text-slate-800 hover:text-blue-600 text-xs font-semibold mt-1 transition"
                >
                  +880 1868 461577
                </a>
                <p className="text-slate-400 text-[11px]">Direct Support & WhatsApp</p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <h5 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Email Address</h5>
                <a
                  href="mailto:tec.habiburrahman@gmail.com"
                  className="inline-block text-slate-800 hover:text-blue-600 text-xs font-semibold mt-1 transition break-all"
                >
                  tec.habiburrahman@gmail.com
                </a>
                <p className="text-slate-400 text-[11px]">Online inquiries & feedback</p>
              </div>
            </div>

            {/* Working Hours */}
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0 mt-0.5">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h5 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Working Hours</h5>
                <p className="text-slate-800 text-xs font-semibold mt-1">Always Open Online</p>
                <p className="text-emerald-600 text-[11px] font-medium flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Chat support available 24/7
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-slate-200/70 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-[11px]">
          <div>
            © 2026 Smart CV & Document Maker • <a href="https://habibifix.vercel.app/" target="_blank" rel="noopener noreferrer" className="hover:underline text-blue-600 font-medium">Admin: https://habibifix.vercel.app/</a>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              Crafted with <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> for job seekers & professionals
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
