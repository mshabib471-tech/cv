import React, { useState } from 'react';
import {
  User,
  Bell,
  Shield,
  HelpCircle,
  ChevronRight,
  LogOut,
  Edit3,
  CheckCircle2,
  ExternalLink,
  Layers,
  Sparkles,
} from 'lucide-react';
import { AUTHORIZED_ADMIN_EMAIL } from '../../lib/firebase';

interface AdminSettingProps {
  adminName: string;
  adminEmail: string;
  adminPhoto?: string;
  onLogout: () => void;
  onOpenTemplates?: () => void;
}

export const AdminSetting: React.FC<AdminSettingProps> = ({
  adminName,
  adminEmail,
  adminPhoto,
  onLogout,
  onOpenTemplates,
}) => {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [name, setName] = useState(adminName || 'immi memo');
  const [isEditing, setIsEditing] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const settingItems = [
    {
      id: 'account',
      title: 'Account Setting',
      subtitle: 'Update your personal information',
      icon: User,
    },
    {
      id: 'notifications',
      title: 'Notification Setting',
      subtitle: 'Manage your notifications',
      icon: Bell,
    },
    {
      id: 'privacy',
      title: 'Privacy & Security',
      subtitle: 'Control your data and security',
      icon: Shield,
    },
    {
      id: 'help',
      title: 'Help & Support',
      subtitle: 'Get help or contact us',
      icon: HelpCircle,
    },
  ];

  const handleSaveProfile = () => {
    setIsEditing(false);
    const existing = JSON.parse(localStorage.getItem('admin_auth_user') || '{}');
    localStorage.setItem(
      'admin_auth_user',
      JSON.stringify({ ...existing, displayName: name })
    );
    setNotice('Profile updated successfully!');
    setTimeout(() => setNotice(null), 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Setting
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm mt-1 font-medium">
          Manage your account and preferences.
        </p>
      </div>

      {notice && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      {/* User Profile Card (Matches Screenshot 1) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center sm:items-start gap-5">
        {/* Avatar (with avatar photo from screenshot or Google photo) */}
        <div className="relative">
          <img
            src={
              adminPhoto ||
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
            }
            alt="Admin Profile"
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-[#FFF9F3] shadow-md shadow-amber-900/10"
          />
          <span className="absolute bottom-0 right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white" />
        </div>

        {/* Info */}
        <div className="flex-1 text-center sm:text-left">
          {isEditing ? (
            <div className="space-y-2 max-w-xs">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-lg font-bold text-slate-900 border border-slate-300 rounded-lg px-2.5 py-1 w-full"
              />
              <button
                onClick={handleSaveProfile}
                className="px-3 py-1 bg-[#F5921E] text-white text-xs font-bold rounded-lg shadow-2xs"
              >
                Save
              </button>
            </div>
          ) : (
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                {name}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 font-medium mt-0.5 break-all">
                {adminEmail || AUTHORIZED_ADMIN_EMAIL}
              </p>
              <button
                onClick={() => setIsEditing(true)}
                className="mt-3 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold shadow-2xs transition"
              >
                <Edit3 className="w-3 h-3 text-slate-500" />
                <span>Edit Profile</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Setting Items List (Matches Screenshot 1) */}
      <div className="rounded-3xl bg-white border border-slate-200/80 shadow-xs divide-y divide-slate-100 overflow-hidden">
        {settingItems.map((item) => {
          const IconComp = item.icon;
          return (
            <div
              key={item.id}
              onClick={() => setActiveModal(item.id)}
              className="p-4 sm:p-5 hover:bg-slate-50/70 transition flex items-center justify-between cursor-pointer group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-slate-100 group-hover:bg-[#FEEAD4] flex items-center justify-center shrink-0 transition">
                  <IconComp className="w-4 h-4 text-slate-600 group-hover:text-[#F5921E] transition" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-[#F5921E] transition">
                    {item.title}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-slate-400 font-medium">
                    {item.subtitle}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#F5921E] group-hover:translate-x-0.5 transition" />
            </div>
          );
        })}
      </div>

      {/* Extra Admin Quick Management (CV & Website) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {onOpenTemplates && (
          <div
            onClick={onOpenTemplates}
            className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/70 hover:border-amber-400 hover:bg-amber-50 cursor-pointer transition flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#F5921E] text-white flex items-center justify-center shrink-0">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Manage CV Templates</h4>
                <p className="text-[11px] text-slate-500">Edit & deploy CV templates</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-amber-700" />
          </div>
        )}

        <a
          href="https://habibifix.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200/70 hover:border-blue-400 hover:bg-blue-50 transition flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
              <ExternalLink className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">HabibiFix Portal</h4>
              <p className="text-[11px] text-slate-500">https://habibifix.vercel.app/</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-blue-700" />
        </a>
      </div>

      {/* Red Log Out Box (Matches Screenshot 1) */}
      <div
        id="admin-logout-btn"
        onClick={onLogout}
        className="p-4 sm:p-5 rounded-2xl bg-[#FFF1F2] border border-rose-200 hover:bg-rose-100/70 hover:border-rose-300 transition cursor-pointer flex items-center gap-3.5 group"
      >
        <div className="w-8 h-8 rounded-lg bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition">
          <LogOut className="w-4 h-4" />
        </div>
        <span className="text-xs sm:text-sm font-bold text-rose-700 group-hover:text-rose-800">
          Log Out
        </span>
      </div>

      {/* Modal Dialog for Settings */}
      {activeModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900 capitalize">
              {activeModal.replace('-', ' ')} Settings
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Your security and preferences are configured for administrator account{' '}
              <strong className="text-slate-800">{AUTHORIZED_ADMIN_EMAIL}</strong>. Two-factor authentication and role protection are active.
            </p>
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 bg-[#F5921E] text-white text-xs font-bold rounded-xl shadow-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
