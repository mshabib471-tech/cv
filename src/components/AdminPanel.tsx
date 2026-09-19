import React, { useState } from 'react';
import {
  Settings,
  Plus,
  Trash2,
  Edit,
  Save,
  CheckCircle2,
  FileText,
  Layers,
  Palette,
  Eye,
  ExternalLink,
  Globe,
  MapPin,
  Phone,
  Mail,
  Clock,
} from 'lucide-react';
import { DocumentTemplate, TemplateCategory, Language } from '../types';
import { TEMPLATES_DATA } from '../data/templates';
import { StorageService } from '../lib/storage';

interface AdminPanelProps {
  language: Language;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ language }) => {
  const [templates, setTemplates] = useState<DocumentTemplate[]>(TEMPLATES_DATA);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('');

  const [form, setForm] = useState<Partial<DocumentTemplate>>({
    name: '',
    category: 'CV',
    language: 'English',
    pageCount: 1,
    style: 'Modern',
    description: '',
    accentColor: '#2563EB',
    isATS: true,
  });

  const handleSaveTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.description) {
      alert('Please fill in the template name and description.');
      return;
    }

    if (editingId) {
      // Update existing
      setTemplates((prev) =>
        prev.map((t) => (t.id === editingId ? ({ ...t, ...form } as DocumentTemplate) : t))
      );
      setStatusMessage(`Template "${form.name}" updated successfully!`);
    } else {
      // Add new
      const newTmpl: DocumentTemplate = {
        id: 'custom-tmpl-' + Date.now(),
        name: form.name || 'New Template',
        category: (form.category as TemplateCategory) || 'CV',
        language: (form.language as 'English' | 'বাংলা' | 'Bilingual') || 'English',
        pageCount: form.pageCount || 1,
        style: (form.style as any) || 'Modern',
        description: form.description || '',
        accentColor: form.accentColor || '#2563EB',
        isATS: form.isATS ?? true,
      };
      setTemplates((prev) => [newTmpl, ...prev]);
      setStatusMessage(`New template "${newTmpl.name}" registered into marketplace!`);
    }

    // Reset
    setForm({
      name: '',
      category: 'CV',
      language: 'English',
      pageCount: 1,
      style: 'Modern',
      description: '',
      accentColor: '#2563EB',
      isATS: true,
    });
    setEditingId(null);
    setShowAddForm(false);

    setTimeout(() => setStatusMessage(''), 4000);
  };

  const handleEditClick = (tmpl: DocumentTemplate) => {
    setEditingId(tmpl.id);
    setForm(tmpl);
    setShowAddForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteClick = (id: string) => {
    if (confirm('Are you sure you want to delete this template from the repository?')) {
      setTemplates((prev) => prev.filter((t) => t.id !== id));
      setStatusMessage('Template deleted.');
      setTimeout(() => setStatusMessage(''), 3000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-card border border-blue-200 text-xs font-semibold text-blue-700 mb-2">
            <Settings className="w-3.5 h-3.5 text-blue-600" />
            <span>Admin Management Console</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Template & Document Repository Manager
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Add new CV templates, official applications, or update styles, ATS parameters, and metadata.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingId(null);
            setForm({
              name: '',
              category: 'CV',
              language: 'English',
              pageCount: 1,
              style: 'Modern',
              description: '',
              accentColor: '#2563EB',
              isATS: true,
            });
            setShowAddForm(!showAddForm);
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition"
        >
          <Plus className="w-4 h-4" />
          <span>{showAddForm ? 'Close Form' : 'Register New Template'}</span>
        </button>
      </div>

      {/* External Admin Website Card */}
      <div className="glass-card p-6 sm:p-7 rounded-3xl border border-blue-200/80 bg-gradient-to-r from-blue-50/80 via-indigo-50/40 to-white flex flex-col gap-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-100/80 px-2.5 py-0.5 rounded-md">
                  Official Admin Portal
                </span>
                <span className="text-xs text-slate-500 font-medium">https://habibifix.vercel.app/</span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
                HabibiFix Admin & Management Center
              </h2>
              <p className="text-xs text-slate-600 mt-0.5">
                Centralized production administration, template deployments, and account control.
              </p>
            </div>
          </div>

          <a
            id="admin-open-habibifix-website-btn"
            href="https://habibifix.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-xs bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/25 active:scale-95 transition-all shrink-0"
          >
            <span>Open Admin Website (https://habibifix.vercel.app/)</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* Contact & Location Details Grid */}
        <div className="pt-4 border-t border-blue-200/60 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-white/70 border border-blue-100/80">
            <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-800 block text-[11px] uppercase tracking-wider">Our Location</span>
              <p className="text-slate-700 font-medium mt-0.5 leading-snug">House - Habibur Rahman, Gachbaria</p>
              <p className="text-slate-500 text-[11px]">Chattogram, Bangladesh</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-white/70 border border-emerald-100/80">
            <Phone className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-800 block text-[11px] uppercase tracking-wider">Phone Number</span>
              <a href="tel:+8801868461577" className="text-slate-800 hover:text-blue-600 font-semibold block mt-0.5">
                +880 1868 461577
              </a>
              <span className="text-slate-500 text-[11px]">Direct Line / WhatsApp</span>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-white/70 border border-indigo-100/80">
            <Mail className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-800 block text-[11px] uppercase tracking-wider">Email Address</span>
              <a href="mailto:tec.habiburrahman@gmail.com" className="text-slate-800 hover:text-blue-600 font-semibold block mt-0.5 break-all">
                tec.habiburrahman@gmail.com
              </a>
              <span className="text-slate-500 text-[11px]">Admin & Inquiries</span>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-white/70 border border-purple-100/80">
            <Clock className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-800 block text-[11px] uppercase tracking-wider">Working Hours</span>
              <span className="text-slate-800 font-semibold block mt-0.5">Always Open Online</span>
              <span className="text-emerald-600 font-medium text-[11px] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Chat support available 24/7
              </span>
            </div>
          </div>
        </div>
      </div>

      {statusMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Add / Edit Form Modal or Card */}
      {showAddForm && (
        <div className="glass-card p-6 rounded-3xl border border-blue-200 shadow-md">
          <h3 className="font-bold text-lg text-slate-900 mb-4">
            {editingId ? 'Edit Template Definition' : 'Register New Template'}
          </h3>
          <form onSubmit={handleSaveTemplate} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Template Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Modern Executive CV 2026"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value as TemplateCategory })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none bg-white"
                >
                  <option value="CV">CV</option>
                  <option value="Resume">Resume</option>
                  <option value="Marriage CV">Marriage CV (বিবাহের বায়োডাটা)</option>
                  <option value="Application">Application</option>
                  <option value="Experience Certificate">Experience Certificate</option>
                  <option value="Joining Letter">Joining Letter</option>
                  <option value="Resignation Letter">Resignation Letter</option>
                  <option value="Certificate">Certificate</option>
                  <option value="Money Receipt">Money Receipt</option>
                  <option value="Question / Exam">Question / Exam</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Language</label>
                <select
                  value={form.language}
                  onChange={(e) => setForm({ ...form, language: e.target.value as 'English' | 'বাংলা' })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none bg-white"
                >
                  <option value="English">English</option>
                  <option value="বাংলা">বাংলা (Bangla)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Target Page Count</label>
                <select
                  value={form.pageCount}
                  onChange={(e) => setForm({ ...form, pageCount: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none bg-white"
                >
                  <option value={1}>1 Page</option>
                  <option value={2}>2 Pages</option>
                  <option value={3}>3 Pages</option>
                  <option value={4}>4 Pages</option>
                  <option value={5}>5 Pages</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Design Style</label>
                <input
                  type="text"
                  placeholder="e.g. Modern, Minimal, Corporate, Traditional"
                  value={form.style}
                  onChange={(e) => setForm({ ...form, style: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Primary Color Theme</label>
                <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-2 py-1">
                  <input
                    type="color"
                    value={form.accentColor}
                    onChange={(e) => setForm({ ...form, accentColor: e.target.value })}
                    className="w-7 h-7 rounded cursor-pointer border-0 bg-transparent"
                  />
                  <span className="font-mono text-xs">{form.accentColor}</span>
                </div>
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Description & Scope</label>
              <textarea
                rows={2}
                required
                placeholder="Short description of the template purpose and features..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="isATS"
                checked={form.isATS}
                onChange={(e) => setForm({ ...form, isATS: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <label htmlFor="isATS" className="font-medium text-slate-700 cursor-pointer">
                Mark as ATS-Friendly Standard (Recruiter Verified)
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-1.5 shadow-xs"
              >
                <Save className="w-4 h-4" />
                <span>{editingId ? 'Save Changes' : 'Create Template'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Templates Management Table */}
      <div className="glass-card rounded-2xl border border-slate-200/90 overflow-hidden shadow-2xs">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900">
            Registered Templates Repository ({templates.length})
          </h3>
          <span className="text-xs text-slate-500">Live Database</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100/80 text-slate-700 font-bold border-b border-slate-200">
                <th className="p-3">Color</th>
                <th className="p-3">Template Name</th>
                <th className="p-3">Category</th>
                <th className="p-3">Language</th>
                <th className="p-3">Pages</th>
                <th className="p-3">Style</th>
                <th className="p-3">ATS</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {templates.map((tmpl) => (
                <tr key={tmpl.id} className="hover:bg-slate-50/70 transition">
                  <td className="p-3">
                    <div
                      className="w-5 h-5 rounded-md shadow-2xs border border-white"
                      style={{ backgroundColor: tmpl.accentColor }}
                    />
                  </td>
                  <td className="p-3 font-semibold text-slate-900">{tmpl.name}</td>
                  <td className="p-3">{tmpl.category}</td>
                  <td className="p-3">{tmpl.language}</td>
                  <td className="p-3">{tmpl.pageCount}P</td>
                  <td className="p-3">{tmpl.style}</td>
                  <td className="p-3">
                    {tmpl.isATS ? (
                      <span className="text-emerald-600 font-bold">Yes</span>
                    ) : (
                      <span className="text-slate-400">Standard</span>
                    )}
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleEditClick(tmpl)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition"
                        title="Edit Template"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(tmpl.id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition"
                        title="Delete Template"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
