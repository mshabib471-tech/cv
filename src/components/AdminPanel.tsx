import React, { useState, useEffect } from 'react';
import {
  Home,
  BarChart2,
  FileText,
  Settings,
  Search,
  ChevronDown,
  Layers,
  ArrowLeft,
  ExternalLink,
  Plus,
  Trash2,
  Edit,
  Save,
  CheckCircle2,
  Globe,
  MapPin,
  Phone,
  Mail,
  Clock,
  Sparkles,
  LogOut,
} from 'lucide-react';
import { Language, DocumentTemplate, TemplateCategory } from '../types';
import { TEMPLATES_DATA } from '../data/templates';
import {
  auth,
  signOut,
  onAuthStateChanged,
  AUTHORIZED_ADMIN_EMAIL,
  isAuthorizedAdmin,
} from '../lib/firebase';
import { AdminLogin } from './admin/AdminLogin';
import { AdminHome } from './admin/AdminHome';
import { AdminAnalytics } from './admin/AdminAnalytics';
import { AdminReports } from './admin/AdminReports';
import { AdminSetting } from './admin/AdminSetting';

interface AdminPanelProps {
  language: Language;
  onBackToApp?: () => void;
}

type AdminTab = 'home' | 'analytics' | 'reports' | 'setting' | 'templates';

export const AdminPanel: React.FC<AdminPanelProps> = ({ language, onBackToApp }) => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('admin_auth_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        return isAuthorizedAdmin(parsed.email);
      }
    } catch {
      // ignore
    }
    return false;
  });

  const [adminUser, setAdminUser] = useState<{
    email: string;
    displayName: string;
    photoURL?: string;
  }>(() => {
    try {
      const saved = localStorage.getItem('admin_auth_user');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return {
      email: AUTHORIZED_ADMIN_EMAIL,
      displayName: 'immi memo',
      photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    };
  });

  // Active Tab inside Admin
  const [activeTab, setActiveTab] = useState<AdminTab>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Template Management State
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

  // Firebase auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && isAuthorizedAdmin(user.email)) {
        setIsAuthenticated(true);
        setAdminUser({
          email: user.email || AUTHORIZED_ADMIN_EMAIL,
          displayName: user.displayName || 'Habibur Rahman',
          photoURL: user.photoURL || undefined,
        });
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLoginSuccess = (email: string, displayName?: string, photoURL?: string) => {
    setIsAuthenticated(true);
    setAdminUser({
      email,
      displayName: displayName || 'Habibur Rahman',
      photoURL,
    });
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('Firebase signout:', e);
    }
    localStorage.removeItem('admin_auth_user');
    setIsAuthenticated(false);
  };

  // Template Handlers
  const handleSaveTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.description) {
      alert('Please fill in the template name and description.');
      return;
    }

    if (editingId) {
      setTemplates((prev) =>
        prev.map((t) => (t.id === editingId ? ({ ...t, ...form } as DocumentTemplate) : t))
      );
      setStatusMessage(`Template "${form.name}" updated successfully!`);
    } else {
      const newTmpl: DocumentTemplate = {
        id: 'custom-tmpl-' + Date.now(),
        name: form.name || 'New Template',
        category: (form.category as TemplateCategory) || 'CV',
        language: (form.language as 'English' | 'বাংলা' | 'Bilingual') || 'English',
        pageCount: form.pageCount || 1,
        style: (form.style as any) || 'Modern',
        description: form.description || '',
        accentColor: form.accentColor || '#F5921E',
        isATS: form.isATS ?? true,
      };
      setTemplates((prev) => [newTmpl, ...prev]);
      setStatusMessage(`New template "${newTmpl.name}" registered into marketplace!`);
    }

    setForm({
      name: '',
      category: 'CV',
      language: 'English',
      pageCount: 1,
      style: 'Modern',
      description: '',
      accentColor: '#F5921E',
      isATS: true,
    });
    setEditingId(null);
    setShowAddForm(false);
    setTimeout(() => setStatusMessage(''), 4000);
  };

  // If NOT authenticated, show the Private Admin Login Screen (Screenshot 5)
  if (!isAuthenticated) {
    return (
      <AdminLogin
        onSuccess={handleLoginSuccess}
        onBackToApp={onBackToApp}
      />
    );
  }

  // If Authenticated as tec.habiburrahman@gmail.com, show Full Admin Dashboard (Screenshots 1-4)
  return (
    <div className="min-h-screen bg-[#FFF9F3] text-slate-800 flex font-sans">
      {/* Sidebar (Matches Screenshots 1-4) */}
      <aside className="w-56 sm:w-64 bg-[#FFF9F3] border-r border-[#FEEAD4] flex flex-col justify-between p-5 shrink-0 hidden md:flex min-h-screen sticky top-0">
        <div>
          {/* Top Logo */}
          <div className="flex items-center gap-2 mb-8 px-2">
            <div className="w-4 h-4 rounded-full bg-[#F5921E]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#FB923C]" />
            <span className="font-black text-xl text-slate-900 tracking-tight ml-1">
              Dashboard
            </span>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1.5">
            <button
              id="admin-nav-home"
              onClick={() => setActiveTab('home')}
              className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition ${
                activeTab === 'home'
                  ? 'bg-[#F5921E] text-white shadow-md shadow-[#F5921E]/25'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
              }`}
            >
              <Home className="w-4 h-4 shrink-0" />
              <span>Home</span>
            </button>

            <button
              id="admin-nav-analytics"
              onClick={() => setActiveTab('analytics')}
              className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition ${
                activeTab === 'analytics'
                  ? 'bg-[#F5921E] text-white shadow-md shadow-[#F5921E]/25'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
              }`}
            >
              <BarChart2 className="w-4 h-4 shrink-0" />
              <span>Analytics</span>
            </button>

            <button
              id="admin-nav-reports"
              onClick={() => setActiveTab('reports')}
              className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition ${
                activeTab === 'reports'
                  ? 'bg-[#F5921E] text-white shadow-md shadow-[#F5921E]/25'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
              }`}
            >
              <FileText className="w-4 h-4 shrink-0" />
              <span>Reports</span>
            </button>

            <button
              id="admin-nav-setting"
              onClick={() => setActiveTab('setting')}
              className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition ${
                activeTab === 'setting'
                  ? 'bg-[#F5921E] text-white shadow-md shadow-[#F5921E]/25'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
              }`}
            >
              <Settings className="w-4 h-4 shrink-0" />
              <span>Setting</span>
            </button>

            <div className="pt-3 my-2 border-t border-[#FEDEBF]/70" />

            <button
              id="admin-nav-templates"
              onClick={() => setActiveTab('templates')}
              className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition ${
                activeTab === 'templates'
                  ? 'bg-[#F5921E] text-white shadow-md shadow-[#F5921E]/25'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
              }`}
            >
              <Layers className="w-4 h-4 shrink-0" />
              <span>CV Templates</span>
            </button>

            {onBackToApp && (
              <button
                onClick={onBackToApp}
                className="w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl font-bold text-xs text-slate-600 hover:text-slate-900 hover:bg-white/80 transition"
              >
                <ArrowLeft className="w-4 h-4 shrink-0" />
                <span>Return to CV Maker</span>
              </button>
            )}
          </nav>
        </div>

        {/* Bottom Profile (Matches Screenshots 1-4) */}
        <div className="pt-4 border-t border-[#FEDEBF]/70">
          <div className="flex items-center justify-between p-2 rounded-2xl hover:bg-white/60 transition cursor-pointer">
            <div className="flex items-center gap-2.5">
              <img
                src={
                  adminUser.photoURL ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
                }
                alt="Admin Avatar"
                className="w-9 h-9 rounded-full object-cover border border-[#FEEAD4]"
              />
              <div className="overflow-hidden">
                <span className="font-bold text-xs text-slate-900 block truncate">
                  {adminUser.displayName || 'immi memo'}
                </span>
                <span className="text-[10px] text-slate-400 font-semibold block uppercase tracking-wider">
                  Admin
                </span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Log Out"
              className="p-1 hover:text-rose-600 text-slate-400 transition"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar / Search Bar (Matches Screenshots 1-4) */}
        <header className="bg-[#FFF9F3] border-b border-[#FEEAD4]/60 px-5 sm:px-8 py-3.5 flex items-center justify-between gap-4 sticky top-0 z-20">
          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700"
            >
              <div className="w-4 h-0.5 bg-slate-800 mb-1" />
              <div className="w-4 h-0.5 bg-slate-800 mb-1" />
              <div className="w-4 h-0.5 bg-slate-800" />
            </button>
            <span className="font-black text-sm text-slate-900">Dashboard</span>
          </div>

          {/* Search Input (Matches Screenshots 1-4) */}
          <div className="flex-1 max-w-xl relative">
            <input
              type="text"
              placeholder="Search......"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-full border border-slate-200 bg-white text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F5921E]/30 focus:border-[#F5921E] shadow-2xs"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          </div>

          {/* Right Header Avatar */}
          <div className="flex items-center gap-3">
            <span className="hidden lg:inline text-xs font-semibold text-emerald-700 bg-emerald-100/70 px-2.5 py-1 rounded-full">
              {AUTHORIZED_ADMIN_EMAIL}
            </span>
            <img
              src={
                adminUser.photoURL ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
              }
              alt="Profile"
              onClick={() => setActiveTab('setting')}
              className="w-8 h-8 rounded-full object-cover border border-[#FEEAD4] cursor-pointer hover:ring-2 hover:ring-[#F5921E] transition"
            />
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 p-4 space-y-2">
            <button
              onClick={() => { setActiveTab('home'); setMobileMenuOpen(false); }}
              className={`w-full text-left px-3 py-2 rounded-lg font-bold text-xs ${activeTab === 'home' ? 'bg-[#F5921E] text-white' : 'text-slate-700'}`}
            >
              Home
            </button>
            <button
              onClick={() => { setActiveTab('analytics'); setMobileMenuOpen(false); }}
              className={`w-full text-left px-3 py-2 rounded-lg font-bold text-xs ${activeTab === 'analytics' ? 'bg-[#F5921E] text-white' : 'text-slate-700'}`}
            >
              Analytics
            </button>
            <button
              onClick={() => { setActiveTab('reports'); setMobileMenuOpen(false); }}
              className={`w-full text-left px-3 py-2 rounded-lg font-bold text-xs ${activeTab === 'reports' ? 'bg-[#F5921E] text-white' : 'text-slate-700'}`}
            >
              Reports
            </button>
            <button
              onClick={() => { setActiveTab('setting'); setMobileMenuOpen(false); }}
              className={`w-full text-left px-3 py-2 rounded-lg font-bold text-xs ${activeTab === 'setting' ? 'bg-[#F5921E] text-white' : 'text-slate-700'}`}
            >
              Setting
            </button>
            <button
              onClick={() => { setActiveTab('templates'); setMobileMenuOpen(false); }}
              className={`w-full text-left px-3 py-2 rounded-lg font-bold text-xs ${activeTab === 'templates' ? 'bg-[#F5921E] text-white' : 'text-slate-700'}`}
            >
              CV Templates
            </button>
            <button
              onClick={handleLogout}
              className="w-full text-left px-3 py-2 rounded-lg font-bold text-xs text-rose-600"
            >
              Log Out
            </button>
          </div>
        )}

        {/* View Switcher Container */}
        <main className="flex-1 p-5 sm:p-8 max-w-6xl w-full mx-auto">
          {activeTab === 'home' && (
            <AdminHome adminName={adminUser.displayName || 'Immi'} />
          )}

          {activeTab === 'analytics' && (
            <AdminAnalytics />
          )}

          {activeTab === 'reports' && (
            <AdminReports />
          )}

          {activeTab === 'setting' && (
            <AdminSetting
              adminName={adminUser.displayName || 'immi memo'}
              adminEmail={adminUser.email || AUTHORIZED_ADMIN_EMAIL}
              adminPhoto={adminUser.photoURL}
              onLogout={handleLogout}
              onOpenTemplates={() => setActiveTab('templates')}
            />
          )}

          {/* Templates & CMS Tab */}
          {activeTab === 'templates' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    CV Templates Manager
                  </h1>
                  <p className="text-slate-500 text-xs sm:text-sm mt-1 font-medium">
                    Create, update, and manage official resume templates.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="px-4 py-2 bg-[#F5921E] hover:bg-[#ea8615] text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-2 active:scale-95 transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>{showAddForm ? 'Close Form' : 'Add New Template'}</span>
                </button>
              </div>

              {statusMessage && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{statusMessage}</span>
                </div>
              )}

              {/* Add / Edit Form */}
              {showAddForm && (
                <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
                  <h3 className="font-bold text-base text-slate-900">
                    {editingId ? 'Edit Template Definition' : 'Register New Template'}
                  </h3>
                  <form onSubmit={handleSaveTemplate} className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">Template Name</label>
                        <input
                          type="text"
                          required
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">Category</label>
                        <select
                          value={form.category}
                          onChange={(e) => setForm({ ...form, category: e.target.value as any })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200"
                        >
                          <option value="CV">CV</option>
                          <option value="Resume">Resume</option>
                          <option value="Bio-data">Bio-data</option>
                          <option value="Document">Document</option>
                        </select>
                      </div>
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">Language</label>
                        <select
                          value={form.language}
                          onChange={(e) => setForm({ ...form, language: e.target.value as any })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200"
                        >
                          <option value="English">English</option>
                          <option value="বাংলা">বাংলা</option>
                          <option value="Bilingual">Bilingual</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Description</label>
                      <input
                        type="text"
                        required
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200"
                      />
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowAddForm(false)}
                        className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-[#F5921E] text-white font-bold shadow-xs"
                      >
                        Save Template
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Template Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {templates.map((tmpl) => (
                  <div key={tmpl.id} className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-100 text-amber-800">
                          {tmpl.category}
                        </span>
                        <span className="text-[11px] font-medium text-slate-400">
                          {tmpl.pageCount} page(s)
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-slate-900">{tmpl.name}</h4>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">{tmpl.description}</p>
                    </div>
                    <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-medium">{tmpl.language}</span>
                      <button
                        onClick={() => {
                          setEditingId(tmpl.id);
                          setForm(tmpl);
                          setShowAddForm(true);
                        }}
                        className="text-[#F5921E] hover:underline font-bold"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
