import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Briefcase,
  GraduationCap,
  Sparkles,
  Save,
  Plus,
  Trash2,
  CheckCircle2,
  Zap,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Layers,
  FileText,
  Image,
} from 'lucide-react';
import { UserProfile, EducationItem, ExperienceItem, CVData, Language } from '../types';
import { StorageService } from '../lib/storage';
import { AvatarPickerModal } from './AvatarPickerModal';
import { DEFAULT_AVATAR } from '../data/avatars';

interface MasterProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onGenerateCV: (newCV: CVData) => void;
}

export const MasterProfileModal: React.FC<MasterProfileModalProps> = ({
  isOpen,
  onClose,
  language,
  onGenerateCV,
}) => {
  const isBangla = language === 'bn';
  const [profile, setProfile] = useState<UserProfile>(() => StorageService.getMasterProfile());
  const [activeTab, setActiveTab] = useState<'basic' | 'experience' | 'education' | 'personal'>('basic');
  const [isSavedNotice, setIsSavedNotice] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setProfile(StorageService.getMasterProfile());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    StorageService.saveMasterProfile(profile);
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 3000);
  };

  const handle1ClickGenerate = (templateId = 'bangladeshi-standard') => {
    StorageService.saveMasterProfile(profile);
    const newCV = StorageService.createCVFromMasterProfile(templateId, language);
    onGenerateCV(newCV);
    onClose();
  };

  // Helper additions
  const addExperience = () => {
    const item: ExperienceItem = {
      id: 'exp-' + Date.now(),
      company: isBangla ? 'কোম্পানি বা প্রতিষ্ঠানের নাম' : 'Company Name',
      position: isBangla ? 'পদবী' : 'Job Title',
      startDate: '2023',
      endDate: isBangla ? 'বর্তমান' : 'Present',
      responsibilities: isBangla
        ? 'দৈনন্দিন প্রজেক্ট সমন্বয় ও দায়িত্ব পালন।'
        : 'Key tasks and contributions.',
    };
    setProfile({ ...profile, experience: [...(profile.experience || []), item] });
  };

  const removeExperience = (idx: number) => {
    setProfile({
      ...profile,
      experience: (profile.experience || []).filter((_, i) => i !== idx),
    });
  };

  const addEducation = () => {
    const item: EducationItem = {
      id: 'edu-' + Date.now(),
      degree: isBangla ? 'ডিগ্রি বা সনদ' : 'Degree / Certificate',
      institution: isBangla ? 'প্রতিষ্ঠান বা বিশ্ববিদ্যালয়' : 'Institution / University',
      passingYear: '2022',
      cgpaOrGpa: 'GPA 5.00',
    };
    setProfile({ ...profile, education: [...(profile.education || []), item] });
  };

  const removeEducation = (idx: number) => {
    setProfile({
      ...profile,
      education: (profile.education || []).filter((_, i) => i !== idx),
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold backdrop-blur-xs mb-2">
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              <span>{isBangla ? 'মাস্টার প্রোফাইল ও ১-ক্লিক সিভি মেকার' : 'Master Profile & 1-Click Generator'}</span>
            </div>
            <h2 className="text-2xl font-black tracking-tight">
              {isBangla ? 'আপনার ব্যক্তিগত মাস্টার প্রোফাইল' : 'Your Master Career Profile'}
            </h2>
            <p className="text-blue-100 text-xs mt-1">
              {isBangla
                ? 'একবার আপনার সকল তথ্য সেভ রাখুন, পরবর্তীতে যেকোনো সময় ১-ক্লিকেই তৈরি হবে নতুন সিভি!'
                : 'Save your complete details once, then generate polished CVs in 1-click anytime!'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handle1ClickGenerate('bangladeshi-standard')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-xs shadow-lg shadow-emerald-500/25 active:scale-95 transition"
            >
              <Zap className="w-4 h-4 fill-current text-amber-200" />
              <span>{isBangla ? '⚡ ১-ক্লিকে সিভি তৈরি করুন' : '⚡ 1-Click Create CV'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-slate-200 bg-slate-50/80 px-4 sm:px-6 flex items-center gap-2 overflow-x-auto">
          {[
            { id: 'basic', label: isBangla ? 'মূল তথ্য ও অ্যাভাটার' : 'Basic & Avatar', icon: <User className="w-4 h-4" /> },
            { id: 'experience', label: isBangla ? 'কাজের অভিজ্ঞতা' : 'Experience', icon: <Briefcase className="w-4 h-4" /> },
            { id: 'education', label: isBangla ? 'শিক্ষাগত যোগ্যতা' : 'Education', icon: <GraduationCap className="w-4 h-4" /> },
            { id: 'personal', label: isBangla ? 'ব্যক্তিগত বায়োডাটা' : 'Personal Details', icon: <FileText className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 py-3 px-3.5 border-b-2 font-semibold text-xs whitespace-nowrap transition ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600 bg-white/70'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Form Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {isSavedNotice && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{isBangla ? 'মাস্টার প্রোফাইল সফলভাবে সংরক্ষিত হয়েছে!' : 'Master profile saved successfully!'}</span>
            </div>
          )}

          {/* TAB 1: BASIC & AVATAR */}
          {activeTab === 'basic' && (
            <div className="space-y-4">
              {/* Avatar Selector Card */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center gap-4">
                <div className="relative group cursor-pointer" onClick={() => setShowAvatarPicker(true)}>
                  <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-blue-500 shadow-md bg-white">
                    <img
                      src={profile.photoUrl || DEFAULT_AVATAR}
                      alt={profile.fullName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition text-white text-[10px] font-bold">
                    {isBangla ? 'পরিবর্তন' : 'Change'}
                  </div>
                </div>

                <div className="flex-1 text-center sm:text-left">
                  <h4 className="text-xs font-bold text-slate-800">
                    {isBangla ? 'সিভির প্রোফাইল ছবি / অ্যাভাটার' : 'CV Profile Photo / Avatar'}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {isBangla
                      ? 'অ্যাভাটার গ্যালারি থেকে পছন্দের প্রফেশনাল অ্যাভাটার নিন অথবা নিজের ছবি আপলোড করুন।'
                      : 'Choose a human-crafted professional avatar or upload your photo.'}
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowAvatarPicker(true)}
                    className="mt-2 px-3 py-1 bg-white border border-slate-200 hover:border-blue-400 rounded-lg text-xs font-semibold text-slate-700 shadow-2xs transition"
                  >
                    {isBangla ? 'অ্যাভাটার গ্যালারি খুলুন' : 'Open Avatar Gallery'}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {isBangla ? 'পূর্ণ নাম *' : 'Full Name *'}
                  </label>
                  <input
                    type="text"
                    value={profile.fullName}
                    onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {isBangla ? 'বর্তমান পদবী / পেশা *' : 'Professional Title *'}
                  </label>
                  <input
                    type="text"
                    value={profile.professionalTitle}
                    onChange={(e) => setProfile({ ...profile, professionalTitle: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {isBangla ? 'মোবাইল নাম্বার *' : 'Phone Number *'}
                  </label>
                  <input
                    type="text"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {isBangla ? 'ইমেইল অ্যাড্রেস *' : 'Email Address *'}
                  </label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {isBangla ? 'বর্তমান ঠিকানা' : 'Address'}
                  </label>
                  <input
                    type="text"
                    value={profile.address}
                    onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {isBangla ? 'ক্যারিয়ার অবজেক্টিভ / প্রফেশনাল সামারি' : 'Career Objective / Summary'}
                  </label>
                  <textarea
                    rows={3}
                    value={profile.careerObjective}
                    onChange={(e) => setProfile({ ...profile, careerObjective: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: EXPERIENCE */}
          {activeTab === 'experience' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">
                  {isBangla ? 'আপনার অতীত ও বর্তমান চাকরির তালিকা' : 'List of jobs and work experiences'}
                </span>
                <button
                  type="button"
                  onClick={addExperience}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold border border-blue-200 transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isBangla ? 'নতুন অভিজ্ঞতা যোগ' : 'Add Experience'}</span>
                </button>
              </div>

              {(profile.experience || []).map((exp, idx) => (
                <div key={exp.id || idx} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3 relative">
                  <button
                    type="button"
                    onClick={() => removeExperience(idx)}
                    className="absolute top-3 right-3 p-1 text-slate-400 hover:text-red-600 transition"
                    title="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-8">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        {isBangla ? 'প্রতিষ্ঠানের নাম' : 'Company Name'}
                      </label>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => {
                          const updated = [...(profile.experience || [])];
                          updated[idx] = { ...updated[idx], company: e.target.value };
                          setProfile({ ...profile, experience: updated });
                        }}
                        className="w-full text-xs px-3 py-1.5 rounded-lg border border-slate-200 bg-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        {isBangla ? 'পদবী' : 'Position'}
                      </label>
                      <input
                        type="text"
                        value={exp.position}
                        onChange={(e) => {
                          const updated = [...(profile.experience || [])];
                          updated[idx] = { ...updated[idx], position: e.target.value };
                          setProfile({ ...profile, experience: updated });
                        }}
                        className="w-full text-xs px-3 py-1.5 rounded-lg border border-slate-200 bg-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        {isBangla ? 'শুরুর তারিখ' : 'Start Date'}
                      </label>
                      <input
                        type="text"
                        value={exp.startDate}
                        onChange={(e) => {
                          const updated = [...(profile.experience || [])];
                          updated[idx] = { ...updated[idx], startDate: e.target.value };
                          setProfile({ ...profile, experience: updated });
                        }}
                        className="w-full text-xs px-3 py-1.5 rounded-lg border border-slate-200 bg-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        {isBangla ? 'শেষের তারিখ' : 'End Date'}
                      </label>
                      <input
                        type="text"
                        value={exp.endDate}
                        onChange={(e) => {
                          const updated = [...(profile.experience || [])];
                          updated[idx] = { ...updated[idx], endDate: e.target.value };
                          setProfile({ ...profile, experience: updated });
                        }}
                        className="w-full text-xs px-3 py-1.5 rounded-lg border border-slate-200 bg-white outline-none"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        {isBangla ? 'দায়িত্ব ও অর্জন' : 'Responsibilities'}
                      </label>
                      <textarea
                        rows={2}
                        value={exp.responsibilities}
                        onChange={(e) => {
                          const updated = [...(profile.experience || [])];
                          updated[idx] = { ...updated[idx], responsibilities: e.target.value };
                          setProfile({ ...profile, experience: updated });
                        }}
                        className="w-full text-xs px-3 py-1.5 rounded-lg border border-slate-200 bg-white outline-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: EDUCATION */}
          {activeTab === 'education' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">
                  {isBangla ? 'ডিগ্রি ও সনদসমূহ' : 'Degrees and qualifications'}
                </span>
                <button
                  type="button"
                  onClick={addEducation}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold border border-indigo-200 transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isBangla ? 'নতুন ডিগ্রি যোগ' : 'Add Degree'}</span>
                </button>
              </div>

              {(profile.education || []).map((edu, idx) => (
                <div key={edu.id || idx} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3 relative">
                  <button
                    type="button"
                    onClick={() => removeEducation(idx)}
                    className="absolute top-3 right-3 p-1 text-slate-400 hover:text-red-600 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-8">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        {isBangla ? 'ডিগ্রি / পরীক্ষার নাম' : 'Degree / Exam'}
                      </label>
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) => {
                          const updated = [...(profile.education || [])];
                          updated[idx] = { ...updated[idx], degree: e.target.value };
                          setProfile({ ...profile, education: updated });
                        }}
                        className="w-full text-xs px-3 py-1.5 rounded-lg border border-slate-200 bg-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        {isBangla ? 'প্রতিষ্ঠান বা বোর্ড / বিশ্ববিদ্যালয়' : 'Institution / University'}
                      </label>
                      <input
                        type="text"
                        value={edu.institution}
                        onChange={(e) => {
                          const updated = [...(profile.education || [])];
                          updated[idx] = { ...updated[idx], institution: e.target.value };
                          setProfile({ ...profile, education: updated });
                        }}
                        className="w-full text-xs px-3 py-1.5 rounded-lg border border-slate-200 bg-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        {isBangla ? 'পাসের সাল' : 'Passing Year'}
                      </label>
                      <input
                        type="text"
                        value={edu.passingYear}
                        onChange={(e) => {
                          const updated = [...(profile.education || [])];
                          updated[idx] = { ...updated[idx], passingYear: e.target.value };
                          setProfile({ ...profile, education: updated });
                        }}
                        className="w-full text-xs px-3 py-1.5 rounded-lg border border-slate-200 bg-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        {isBangla ? 'সিজিপিএ বা জিপিএ' : 'CGPA / Grade'}
                      </label>
                      <input
                        type="text"
                        value={edu.cgpaOrGpa}
                        onChange={(e) => {
                          const updated = [...(profile.education || [])];
                          updated[idx] = { ...updated[idx], cgpaOrGpa: e.target.value };
                          setProfile({ ...profile, education: updated });
                        }}
                        className="w-full text-xs px-3 py-1.5 rounded-lg border border-slate-200 bg-white outline-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: PERSONAL DETAILS */}
          {activeTab === 'personal' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isBangla ? 'পিতার নাম' : "Father's Name"}
                </label>
                <input
                  type="text"
                  value={profile.personalInfo?.fatherName || ''}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      personalInfo: { ...(profile.personalInfo as any), fatherName: e.target.value },
                    })
                  }
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isBangla ? 'মাতার নাম' : "Mother's Name"}
                </label>
                <input
                  type="text"
                  value={profile.personalInfo?.motherName || ''}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      personalInfo: { ...(profile.personalInfo as any), motherName: e.target.value },
                    })
                  }
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isBangla ? 'জন্ম তারিখ' : 'Date of Birth'}
                </label>
                <input
                  type="text"
                  value={profile.personalInfo?.dateOfBirth || ''}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      personalInfo: { ...(profile.personalInfo as any), dateOfBirth: e.target.value },
                    })
                  }
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isBangla ? 'রক্তের গ্রুপ' : 'Blood Group'}
                </label>
                <input
                  type="text"
                  value={profile.personalInfo?.bloodGroup || ''}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      personalInfo: { ...(profile.personalInfo as any), bloodGroup: e.target.value },
                    })
                  }
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isBangla ? 'ধর্ম' : 'Religion'}
                </label>
                <input
                  type="text"
                  value={profile.personalInfo?.religion || ''}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      personalInfo: { ...(profile.personalInfo as any), religion: e.target.value },
                    })
                  }
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isBangla ? 'বৈবাহিক অবস্থা' : 'Marital Status'}
                </label>
                <input
                  type="text"
                  value={profile.personalInfo?.maritalStatus || ''}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      personalInfo: { ...(profile.personalInfo as any), maritalStatus: e.target.value },
                    })
                  }
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isBangla ? 'স্থায়ী ঠিকানা' : 'Permanent Address'}
                </label>
                <input
                  type="text"
                  value={profile.personalInfo?.permanentAddress || ''}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      personalInfo: { ...(profile.personalInfo as any), permanentAddress: e.target.value },
                    })
                  }
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 outline-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs active:scale-95 transition"
          >
            <Save className="w-4 h-4" />
            <span>{isBangla ? 'তথ্য সেভ করুন' : 'Save Profile'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-xl hover:bg-slate-200 transition"
            >
              {isBangla ? 'বন্ধ করুন' : 'Cancel'}
            </button>
            <button
              type="button"
              onClick={() => handle1ClickGenerate('bangladeshi-standard')}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-500/20 active:scale-95 transition"
            >
              <Zap className="w-4 h-4 text-amber-300" />
              <span>{isBangla ? '১-ক্লিকে সিভি তৈরি' : '1-Click Create CV'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Avatar Picker Modal */}
      {showAvatarPicker && (
        <AvatarPickerModal
          isOpen={showAvatarPicker}
          onClose={() => setShowAvatarPicker(false)}
          selectedAvatar={profile.photoUrl}
          onSelectAvatar={(uri) => setProfile({ ...profile, photoUrl: uri })}
          onUploadCustomPhoto={(uri) => setProfile({ ...profile, photoUrl: uri })}
          language={language}
        />
      )}
    </div>
  );
};
