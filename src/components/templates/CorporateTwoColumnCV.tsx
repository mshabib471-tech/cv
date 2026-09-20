import React, { useRef } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Github,
  Briefcase,
  GraduationCap,
  Award,
  CheckCircle,
  Camera,
  Plus,
  Trash2,
  X,
  Circle,
  Square,
  Sparkles,
  FileCheck,
} from 'lucide-react';
import { CVData, ExperienceItem, EducationItem } from '../../types';

interface CorporateTwoColumnCVProps {
  cv: CVData;
  isEditable?: boolean;
  onUpdateField?: (field: keyof CVData, value: any) => void;
}

export const CorporateTwoColumnCV: React.FC<CorporateTwoColumnCVProps> = ({
  cv,
  isEditable = true,
  onUpdateField,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const primaryColor = cv.design?.primaryColor || '#1E3A8A';
  const isBangla = cv.language === 'bn' || cv.design?.fontFamily === 'Noto Sans Bengali';

  const editClass = isEditable
    ? 'outline-none cursor-text hover:bg-white/20 hover:ring-1 hover:ring-white/40 rounded px-1 -mx-1 transition-all focus:bg-white/30 focus:ring-2 focus:ring-white'
    : '';

  const editClassDark = isEditable
    ? 'outline-none cursor-text hover:bg-blue-50/70 hover:ring-1 hover:ring-blue-300 rounded px-1 -mx-1 transition-all focus:bg-blue-50 focus:ring-2 focus:ring-blue-500'
    : '';

  const handleFieldBlur = (field: keyof CVData, e: React.FocusEvent<HTMLElement>) => {
    if (!isEditable || !onUpdateField) return;
    const text = e.currentTarget.innerText.trim();
    onUpdateField(field, text);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onUpdateField) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onUpdateField('photoUrl', reader.result);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleRemovePhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onUpdateField) onUpdateField('photoUrl', '');
  };

  const handleSetPhotoShape = (shape: 'circle' | 'rounded' | 'square', e: React.MouseEvent) => {
    e.stopPropagation();
    if (onUpdateField) onUpdateField('photoShape', shape);
  };

  const handleUpdateExp = (index: number, key: keyof ExperienceItem, val: string) => {
    if (!onUpdateField) return;
    const list = [...(cv.experience || [])];
    if (list[index]) {
      list[index] = { ...list[index], [key]: val };
      onUpdateField('experience', list);
    }
  };

  const handleAddExp = () => {
    if (!onUpdateField) return;
    const newItem: ExperienceItem = {
      id: 'exp-' + Date.now(),
      position: isBangla ? 'পদের নাম' : 'Position Title',
      company: isBangla ? 'কোম্পানির নাম' : 'Company Name Ltd.',
      startDate: '2024',
      endDate: isBangla ? 'বর্তমান' : 'Present',
      responsibilities: isBangla
        ? '• গুরুত্বপূর্ণ দায়িত্ব ও সাফল্যের বিবরণ লিখুন।'
        : '• Spearheaded operations and led project development lifecycle with high precision.',
    };
    onUpdateField('experience', [...(cv.experience || []), newItem]);
  };

  const handleRemoveExp = (index: number) => {
    if (!onUpdateField) return;
    const list = (cv.experience || []).filter((_, i) => i !== index);
    onUpdateField('experience', list);
  };

  const handleUpdateEdu = (index: number, key: keyof EducationItem, val: string) => {
    if (!onUpdateField) return;
    const list = [...(cv.education || [])];
    if (list[index]) {
      list[index] = { ...list[index], [key]: val };
      onUpdateField('education', list);
    }
  };

  const handleAddEdu = () => {
    if (!onUpdateField) return;
    const newItem: EducationItem = {
      id: 'edu-' + Date.now(),
      degree: isBangla ? 'ডিগ্রি বা সনদ' : 'B.Sc in Computer Science',
      institution: isBangla ? 'বিশ্ববিদ্যালয় বা প্রতিষ্ঠানের নাম' : 'University of Dhaka',
      passingYear: '2022',
      grade: 'CGPA 3.85',
      board: 'Dhaka',
    };
    onUpdateField('education', [...(cv.education || []), newItem]);
  };

  const handleRemoveEdu = (index: number) => {
    if (!onUpdateField) return;
    const list = (cv.education || []).filter((_, i) => i !== index);
    onUpdateField('education', list);
  };

  const handleUpdateSkill = (index: number, val: string) => {
    if (!onUpdateField) return;
    const list = [...(cv.skills || [])];
    list[index] = val;
    onUpdateField('skills', list);
  };

  const handleAddSkill = () => {
    if (!onUpdateField) return;
    onUpdateField('skills', [...(cv.skills || []), isBangla ? 'নতুন দক্ষতা' : 'New Skill']);
  };

  const handleRemoveSkill = (index: number) => {
    if (!onUpdateField) return;
    const list = (cv.skills || []).filter((_, i) => i !== index);
    onUpdateField('skills', list);
  };

  const photoShapeClass =
    cv.photoShape === 'square'
      ? 'rounded-none'
      : cv.photoShape === 'rounded'
      ? 'rounded-2xl'
      : 'rounded-full';

  return (
    <div className="flex h-full min-h-[297mm] bg-white text-slate-800">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handlePhotoUpload}
        accept="image/*"
        className="hidden"
      />

      {/* LEFT SIDEBAR (34% width) */}
      <div
        className="w-[34%] p-8 text-white flex flex-col justify-between"
        style={{ backgroundColor: primaryColor }}
      >
        <div className="space-y-6">
          {/* Photo Avatar */}
          <div className="flex flex-col items-center">
            <div className="relative group">
              {cv.photoUrl ? (
                <div className="relative">
                  <img
                    src={cv.photoUrl}
                    alt={cv.fullName}
                    className={`w-32 h-32 object-cover border-4 border-white/80 shadow-lg ${photoShapeClass}`}
                  />
                  {isEditable && (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      data-html2canvas-ignore="true"
                      className="no-print absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-xs font-semibold cursor-pointer rounded-full transition-all"
                    >
                      <Camera className="w-5 h-5 mb-1" />
                      <span>{isBangla ? 'ছবি পরিবর্তন' : 'Change Photo'}</span>
                    </div>
                  )}
                  {isEditable && (
                    <div
                      data-html2canvas-ignore="true"
                      className="no-print absolute -bottom-3 left-1/2 -translate-x-1/2 hidden group-hover:flex items-center gap-1 bg-slate-900/90 text-white rounded-lg px-2 py-0.5 shadow-md text-[10px] whitespace-nowrap z-10"
                    >
                      <button onClick={handleRemovePhoto} title="Remove" className="hover:text-red-400 p-0.5">
                        <Trash2 className="w-3 h-3" />
                      </button>
                      <span className="text-slate-500">|</span>
                      <button onClick={(e) => handleSetPhotoShape('circle', e)} title="Circle" className="p-0.5">
                        <Circle className="w-3 h-3" />
                      </button>
                      <button onClick={(e) => handleSetPhotoShape('square', e)} title="Square" className="p-0.5">
                        <Square className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                isEditable && (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    data-html2canvas-ignore="true"
                    className="no-print w-32 h-32 rounded-full border-2 border-dashed border-white/50 hover:border-white bg-white/10 flex flex-col items-center justify-center text-white cursor-pointer transition-all shadow-inner"
                  >
                    <Camera className="w-8 h-8 mb-1 opacity-80" />
                    <span className="text-xs font-bold">{isBangla ? '+ ছবি দিন' : '+ Add Photo'}</span>
                    <span className="text-[10px] opacity-75">{isBangla ? 'ক্লিক করুন' : 'Click to upload'}</span>
                  </div>
                )
              )}
            </div>

            {/* Name & Title */}
            <div className="text-center mt-4">
              <h1
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(e) => handleFieldBlur('fullName', e)}
                className={`text-xl font-extrabold tracking-tight text-white leading-tight ${editClass}`}
              >
                {cv.fullName || (isBangla ? 'আরিফুর রহমান' : 'Arif Hasan')}
              </h1>
              <p
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(e) => handleFieldBlur('professionalTitle', e)}
                className={`text-xs font-medium text-white/80 mt-1 ${editClass}`}
              >
                {cv.professionalTitle || (isBangla ? 'সিনিয়র এক্সিকিউটিভ' : 'Senior Executive')}
              </p>
            </div>
          </div>

          {/* CONTACT INFO */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white/90 pb-1 border-b border-white/30">
              {isBangla ? 'যোগাযোগ' : 'Contact'}
            </h3>
            <div className="space-y-2 text-xs text-white/90">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 shrink-0 opacity-80" />
                <span
                  contentEditable={isEditable}
                  suppressContentEditableWarning
                  onBlur={(e) => handleFieldBlur('phone', e)}
                  className={editClass}
                >
                  {cv.phone || '+880 1868 461577'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 shrink-0 opacity-80" />
                <span
                  contentEditable={isEditable}
                  suppressContentEditableWarning
                  onBlur={(e) => handleFieldBlur('email', e)}
                  className={`truncate ${editClass}`}
                >
                  {cv.email || 'arif@domain.com'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 shrink-0 opacity-80" />
                <span
                  contentEditable={isEditable}
                  suppressContentEditableWarning
                  onBlur={(e) => handleFieldBlur('address', e)}
                  className={editClass}
                >
                  {cv.address || 'Dhaka, Bangladesh'}
                </span>
              </div>
              {cv.linkedin && (
                <div className="flex items-center gap-2">
                  <Linkedin className="w-3.5 h-3.5 shrink-0 opacity-80" />
                  <span
                    contentEditable={isEditable}
                    suppressContentEditableWarning
                    onBlur={(e) => handleFieldBlur('linkedin', e)}
                    className={`truncate ${editClass}`}
                  >
                    {cv.linkedin}
                  </span>
                </div>
              )}
              {cv.github && (
                <div className="flex items-center gap-2">
                  <Github className="w-3.5 h-3.5 shrink-0 opacity-80" />
                  <span
                    contentEditable={isEditable}
                    suppressContentEditableWarning
                    onBlur={(e) => handleFieldBlur('github', e)}
                    className={`truncate ${editClass}`}
                  >
                    {cv.github}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* KEY SKILLS */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between pb-1 border-b border-white/30">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white/90">
                {isBangla ? 'দক্ষতা সমূহ' : 'Skills'}
              </h3>
              {isEditable && (
                <button
                  onClick={handleAddSkill}
                  data-html2canvas-ignore="true"
                  className="no-print p-0.5 rounded text-white/80 hover:text-white hover:bg-white/20 transition"
                  title="Add skill"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {(cv.skills || []).map((skill, idx) => (
                <div
                  key={idx}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/20 text-white text-xs font-medium backdrop-blur-xs group"
                >
                  <span
                    contentEditable={isEditable}
                    suppressContentEditableWarning
                    onBlur={(e) => handleUpdateSkill(idx, e.currentTarget.innerText)}
                    className={editClass}
                  >
                    {skill}
                  </span>
                  {isEditable && (
                    <button
                      onClick={() => handleRemoveSkill(idx)}
                      data-html2canvas-ignore="true"
                      className="no-print opacity-0 group-hover:opacity-100 hover:text-red-300 transition"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* LANGUAGES */}
          <div className="space-y-2 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white/90 pb-1 border-b border-white/30">
              {isBangla ? 'ভাষা' : 'Languages'}
            </h3>
            <div className="space-y-1 text-xs text-white/90">
              {(cv.languages || [isBangla ? 'বাংলা (মাতৃভাষা)' : 'English (Fluent)', isBangla ? 'ইংরেজি' : 'Bengali']).map(
                (lang, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-white/70" />
                    <span>{lang}</span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        {/* Verified Badge */}
        <div className="pt-4 border-t border-white/20 text-center text-[10px] text-white/70 flex items-center justify-center gap-1.5">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
          <span>100% Verified Profile</span>
        </div>
      </div>

      {/* RIGHT MAIN BODY (66% width) */}
      <div className="w-[66%] p-8 flex flex-col justify-between space-y-6">
        <div className="space-y-6">
          {/* PROFESSIONAL SUMMARY */}
          <section className="space-y-2">
            <h2
              className="text-xs font-extrabold uppercase tracking-wider pb-1 border-b flex items-center gap-1.5"
              style={{ color: primaryColor, borderColor: `${primaryColor}30` }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isBangla ? 'পেশাগত সারসংক্ষেপ' : 'Professional Summary'}</span>
            </h2>
            <p
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(e) => handleFieldBlur('professionalSummary', e)}
              className={`text-xs leading-relaxed text-slate-700 text-justify ${editClassDark}`}
            >
              {cv.professionalSummary ||
                (isBangla
                  ? 'দক্ষ ও দূরদর্শী পেশাজীবী, দলগত কাজ এবং আধুনিক প্রযুক্তিগত সমাধানে অভিজ্ঞ।'
                  : 'Accomplished engineering leader with 6+ years of expertise designing resilient microservices, leading cross-functional teams, and optimizing production deployments.')}
            </p>
          </section>

          {/* WORK EXPERIENCE */}
          <section className="space-y-3">
            <div
              className="flex items-center justify-between pb-1 border-b"
              style={{ borderColor: `${primaryColor}30` }}
            >
              <h2
                className="text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5"
                style={{ color: primaryColor }}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>{isBangla ? 'কাজের অভিজ্ঞতা' : 'Work Experience'}</span>
              </h2>
              {isEditable && (
                <button
                  onClick={handleAddExp}
                  data-html2canvas-ignore="true"
                  className="no-print flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold text-blue-600 hover:bg-blue-50 transition"
                >
                  <Plus className="w-3 h-3" />
                  <span>{isBangla ? '+ অভিজ্ঞতা' : '+ Add Experience'}</span>
                </button>
              )}
            </div>

            <div className="space-y-4">
              {(cv.experience || []).map((exp, idx) => (
                <div key={exp.id || idx} className="space-y-1 relative group pl-1">
                  <div className="flex justify-between items-baseline font-bold text-xs text-slate-900">
                    <span
                      contentEditable={isEditable}
                      suppressContentEditableWarning
                      onBlur={(e) => handleUpdateExp(idx, 'position', e.currentTarget.innerText)}
                      className={editClassDark}
                    >
                      {exp.position}
                    </span>
                    <div className="flex items-center gap-2">
                      <span
                        contentEditable={isEditable}
                        suppressContentEditableWarning
                        onBlur={(e) => {
                          const parts = e.currentTarget.innerText.split('–');
                          handleUpdateExp(idx, 'startDate', parts[0]?.trim() || exp.startDate);
                          if (parts[1]) handleUpdateExp(idx, 'endDate', parts[1]?.trim());
                        }}
                        className={`text-slate-500 font-medium text-[11px] ${editClassDark}`}
                      >
                        {exp.startDate} – {exp.endDate}
                      </span>
                      {isEditable && (
                        <button
                          onClick={() => handleRemoveExp(idx)}
                          data-html2canvas-ignore="true"
                          title="Delete experience"
                          className="no-print opacity-0 group-hover:opacity-100 p-0.5 text-slate-400 hover:text-red-600 transition"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                  <div
                    contentEditable={isEditable}
                    suppressContentEditableWarning
                    onBlur={(e) => handleUpdateExp(idx, 'company', e.currentTarget.innerText)}
                    className={`text-xs font-semibold ${editClassDark}`}
                    style={{ color: primaryColor }}
                  >
                    {exp.company}
                  </div>
                  <p
                    contentEditable={isEditable}
                    suppressContentEditableWarning
                    onBlur={(e) => handleUpdateExp(idx, 'responsibilities', e.currentTarget.innerText)}
                    className={`text-xs text-slate-600 leading-relaxed ${editClassDark}`}
                  >
                    {exp.responsibilities}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* EDUCATION */}
          <section className="space-y-3">
            <div
              className="flex items-center justify-between pb-1 border-b"
              style={{ borderColor: `${primaryColor}30` }}
            >
              <h2
                className="text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5"
                style={{ color: primaryColor }}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>{isBangla ? 'শিক্ষাগত যোগ্যতা' : 'Education'}</span>
              </h2>
              {isEditable && (
                <button
                  onClick={handleAddEdu}
                  data-html2canvas-ignore="true"
                  className="no-print flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold text-blue-600 hover:bg-blue-50 transition"
                >
                  <Plus className="w-3 h-3" />
                  <span>{isBangla ? '+ শিক্ষা' : '+ Add Education'}</span>
                </button>
              )}
            </div>

            <div className="space-y-3">
              {(cv.education || []).map((edu, idx) => (
                <div key={edu.id || idx} className="space-y-0.5 relative group pl-1">
                  <div className="flex justify-between items-baseline font-bold text-xs text-slate-900">
                    <span
                      contentEditable={isEditable}
                      suppressContentEditableWarning
                      onBlur={(e) => handleUpdateEdu(idx, 'degree', e.currentTarget.innerText)}
                      className={editClassDark}
                    >
                      {edu.degree}
                    </span>
                    <div className="flex items-center gap-2">
                      <span
                        contentEditable={isEditable}
                        suppressContentEditableWarning
                        onBlur={(e) => handleUpdateEdu(idx, 'passingYear', e.currentTarget.innerText)}
                        className={`text-slate-500 font-medium text-[11px] ${editClassDark}`}
                      >
                        {edu.passingYear}
                      </span>
                      {isEditable && (
                        <button
                          onClick={() => handleRemoveEdu(idx)}
                          data-html2canvas-ignore="true"
                          className="no-print opacity-0 group-hover:opacity-100 p-0.5 text-slate-400 hover:text-red-600 transition"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-slate-600">
                    <span
                      contentEditable={isEditable}
                      suppressContentEditableWarning
                      onBlur={(e) => handleUpdateEdu(idx, 'institution', e.currentTarget.innerText)}
                      className={editClassDark}
                    >
                      {edu.institution}
                    </span>
                    <span
                      contentEditable={isEditable}
                      suppressContentEditableWarning
                      onBlur={(e) => handleUpdateEdu(idx, 'grade', e.currentTarget.innerText)}
                      className={`font-semibold text-slate-800 ${editClassDark}`}
                    >
                      {edu.grade}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* ATS OPTIMIZED FOOTER */}
        <div className="pt-4 border-t border-slate-200 flex justify-between items-center text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <FileCheck className="w-4 h-4 text-slate-400" />
            <span className="font-medium">SmartCV Corporate Document</span>
          </div>
          <div className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px] flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>ATS Optimized • 99%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
