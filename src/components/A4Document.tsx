import React, { useRef } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  Linkedin,
  Github,
  Award,
  GraduationCap,
  Briefcase,
  Layers,
  Heart,
  User,
  CheckCircle,
  Camera,
  Plus,
  Trash2,
  X,
  Sparkles,
  Circle,
  Square,
} from 'lucide-react';
import { CVData, ExperienceItem, EducationItem, ReferenceItem, PersonalInfo } from '../types';
import { CorporateTwoColumnCV } from './templates/CorporateTwoColumnCV';
import { MinimalATSCV } from './templates/MinimalATSCV';
import { MarriageCV } from './templates/MarriageCV';
import { BangladeshiStandardCV } from './templates/BangladeshiStandardCV';

interface A4DocumentProps {
  cv: CVData;
  setCV?: React.Dispatch<React.SetStateAction<CVData>>;
  scale?: number;
  onUpdateField?: (field: keyof CVData, value: any) => void;
  onUpdateNested?: (path: string, value: any) => void;
  isEditable?: boolean;
  onOpenAvatarPicker?: () => void;
}

export const A4Document: React.FC<A4DocumentProps> = ({
  cv,
  setCV,
  scale = 1,
  onUpdateField,
  onUpdateNested,
  isEditable = true,
  onOpenAvatarPicker,
}) => {
  const { design } = cv;
  const primaryColor = design?.primaryColor || '#2563EB';
  const secondaryColor = design?.secondaryColor || '#4F46E5';
  const isBangla = cv.language === 'bn' || cv.design?.fontFamily === 'Noto Sans Bengali';

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Common editable style class
  const editClass = isEditable
    ? 'outline-none cursor-text hover:bg-blue-50/50 hover:ring-1 hover:ring-blue-300 rounded px-1 -mx-1 transition-all focus:bg-blue-50/70 focus:ring-2 focus:ring-blue-500'
    : '';

  // Handle direct text updates on blur
  const handleFieldBlur = (field: keyof CVData, e: React.FocusEvent<HTMLElement>) => {
    if (!isEditable || !onUpdateField) return;
    const text = e.currentTarget.innerText.trim();
    onUpdateField(field, text);
  };

  // Photo upload handler
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
    if (onUpdateField) {
      onUpdateField('photoUrl', '');
    }
  };

  const handleSetPhotoShape = (shape: 'circle' | 'rounded' | 'square', e: React.MouseEvent) => {
    e.stopPropagation();
    if (onUpdateField) {
      onUpdateField('photoShape', shape);
    }
  };

  // Experience handlers
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
      company: isBangla ? 'কোম্পানির নাম' : 'Company Name',
      position: isBangla ? 'পদবী / পদের নাম' : 'Job Title / Position',
      startDate: '2023',
      endDate: isBangla ? 'বর্তমান' : 'Present',
      responsibilities: isBangla
        ? 'প্রধান দায়িত্ব ও অর্জিত সাফল্যসমূহ এখানে উল্লেখ করুন।'
        : 'Key responsibilities, achievements, and contributions.',
    };
    onUpdateField('experience', [...(cv.experience || []), newItem]);
  };

  const handleRemoveExp = (index: number) => {
    if (!onUpdateField) return;
    const list = (cv.experience || []).filter((_, i) => i !== index);
    onUpdateField('experience', list);
  };

  // Education handlers
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
      degree: isBangla ? 'বি.এস.সি / ডিপ্লোমা' : 'B.Sc / Degree',
      institution: isBangla ? 'বিশ্ববিদ্যালয় / কলেজ' : 'University / College',
      boardOrUniversity: isBangla ? 'বোর্ড / বিশ্ববিদ্যালয়' : 'Board / University',
      subject: isBangla ? 'বিষয়' : 'Subject',
      cgpaOrGpa: '3.80',
      passingYear: '2024',
    };
    onUpdateField('education', [...(cv.education || []), newItem]);
  };

  const handleRemoveEdu = (index: number) => {
    if (!onUpdateField) return;
    const list = (cv.education || []).filter((_, i) => i !== index);
    onUpdateField('education', list);
  };

  // Skills handlers
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

  // Computer skills handlers
  const handleUpdateComputerSkill = (index: number, val: string) => {
    if (!onUpdateField) return;
    const list = [...(cv.computerSkills || [])];
    list[index] = val;
    onUpdateField('computerSkills', list);
  };

  const handleAddComputerSkill = () => {
    if (!onUpdateField) return;
    onUpdateField('computerSkills', [
      ...(cv.computerSkills || []),
      isBangla ? 'কম্পিউটার দক্ষতা' : 'Software / Tool',
    ]);
  };

  const handleRemoveComputerSkill = (index: number) => {
    if (!onUpdateField) return;
    const list = (cv.computerSkills || []).filter((_, i) => i !== index);
    onUpdateField('computerSkills', list);
  };

  // Languages handlers
  const handleUpdateLanguage = (index: number, val: string) => {
    if (!onUpdateField) return;
    const list = [...(cv.languages || [])];
    list[index] = val;
    onUpdateField('languages', list);
  };

  const handleAddLanguage = () => {
    if (!onUpdateField) return;
    onUpdateField('languages', [
      ...(cv.languages || []),
      isBangla ? 'বাংলা ও ইংরেজি' : 'English (Fluent)',
    ]);
  };

  const handleRemoveLanguage = (index: number) => {
    if (!onUpdateField) return;
    const list = (cv.languages || []).filter((_, i) => i !== index);
    onUpdateField('languages', list);
  };

  // Personal Info handlers
  const handleUpdatePersonalInfo = (key: keyof PersonalInfo, val: string) => {
    if (!onUpdateField) return;
    onUpdateField('personalInfo', {
      ...(cv.personalInfo || {}),
      [key]: val,
    });
  };

  // References handlers
  const handleUpdateRef = (index: number, key: keyof ReferenceItem, val: string) => {
    if (!onUpdateField) return;
    const list = [...(cv.references || [])];
    if (list[index]) {
      list[index] = { ...list[index], [key]: val };
      onUpdateField('references', list);
    }
  };

  const handleAddRef = () => {
    if (!onUpdateField) return;
    const newItem: ReferenceItem = {
      id: 'ref-' + Date.now(),
      name: isBangla ? 'রেফারেন্স ব্যক্তির নাম' : 'Reference Full Name',
      designation: isBangla ? 'পদবী ও বিভাগ' : 'Senior Manager / Professor',
      organization: isBangla ? 'প্রতিষ্ঠানের নাম' : 'Company / University',
      phone: '+880 1XXXXXXXXX',
      email: 'ref@example.com',
    };
    onUpdateField('references', [...(cv.references || []), newItem]);
  };

  const handleRemoveRef = (index: number) => {
    if (!onUpdateField) return;
    const list = (cv.references || []).filter((_, i) => i !== index);
    onUpdateField('references', list);
  };

  const marginClass =
    design?.pageMargin === 'compact'
      ? 'p-8'
      : design?.pageMargin === 'spacious'
      ? 'p-14'
      : 'p-10';

  const fontClass = isBangla
    ? 'font-bengali'
    : design?.fontFamily === 'Poppins'
    ? 'font-sans'
    : design?.fontFamily === 'serif'
    ? 'font-serif'
    : 'font-sans';

  // Generate pages array based on cv.pagesCount
  const pages = Array.from({ length: Math.max(1, cv.pagesCount || 1) }, (_, i) => i + 1);

  // Photo shape style
  const photoShapeClass =
    cv.photoShape === 'circle'
      ? 'rounded-full'
      : cv.photoShape === 'square'
      ? 'rounded-none'
      : 'rounded-2xl';

  // Specialized layout flags
  const isMarriage =
    cv.category === 'Marriage CV' ||
    cv.templateId?.includes('marriage') ||
    cv.design?.headerStyle === 'marriage';

  const isTwoColumn =
    cv.templateId?.includes('corporate') ||
    cv.templateId?.includes('two-column') ||
    cv.templateId?.includes('executive') ||
    cv.design?.headerStyle === 'sidebar';

  const isMinimalATS =
    cv.templateId?.includes('ats') ||
    cv.templateId === 'cv-minimal' ||
    cv.templateId?.includes('student') ||
    cv.design?.headerStyle === 'minimal' ||
    cv.isATS;

  const isBangladeshiStandard =
    cv.templateId?.includes('habib') ||
    cv.templateId?.includes('bangladeshi') ||
    cv.design?.headerStyle === 'bangladeshi';

  return (
    <div
      className="cv-scale-outer-viewport flex justify-center transition-[width] duration-150 mx-auto"
      style={{
        width: `${210 * scale}mm`,
        minWidth: `${210 * scale}mm`,
      }}
    >
      <div
        id="cv-printable-document-container"
        className="flex flex-col items-center gap-8 print:gap-0 printable-document-container transition-transform origin-top"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'top center',
          width: '210mm',
        }}
      >
        {/* Hidden File Input for Direct Photo Upload */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handlePhotoUpload}
          accept="image/*"
          className="hidden"
        />

        {pages.map((pageNum) => (
          <div
            key={pageNum}
            id={pageNum === 1 ? 'cv-printable-document' : `cv-printable-document-page-${pageNum}`}
            className={`a4-page shadow-2xl print:shadow-none mx-auto text-slate-800 ${fontClass} relative flex flex-col justify-between overflow-hidden bg-white`}
            style={{
              width: '210mm',
              minHeight: '297mm',
              backgroundColor: '#ffffff',
            }}
          >
            {isBangladeshiStandard ? (
              <BangladeshiStandardCV
                cv={cv}
                setCV={
                  setCV ||
                  ((updater) => {
                    if (typeof updater === 'function') {
                      const next = updater(cv);
                      Object.keys(next).forEach((k) =>
                        onUpdateField?.(k as keyof CVData, (next as any)[k])
                      );
                    }
                  })
                }
                language={cv.language || 'en'}
                pageNum={pageNum}
                onOpenAvatarPicker={onOpenAvatarPicker}
              />
            ) : isTwoColumn ? (
            <CorporateTwoColumnCV
              cv={cv}
              isEditable={isEditable}
              onUpdateField={onUpdateField}
            />
          ) : isMarriage ? (
            <MarriageCV
              cv={cv}
              isEditable={isEditable}
              onUpdateField={onUpdateField}
            />
          ) : isMinimalATS ? (
            <MinimalATSCV
              cv={cv}
              isEditable={isEditable}
              onUpdateField={onUpdateField}
            />
          ) : (
            <>
              {/* Main Document Content */}
              <div className={`${marginClass} flex-1 flex flex-col`}>
            {/* Top Header - Rendered on Page 1 */}
            {pageNum === 1 && (
              <>
                {/* Banner Style Header */}
                {cv.design.headerStyle === 'banner' ? (
                  <div
                    className="-mx-10 -mt-10 p-8 mb-6 text-white"
                    style={{ backgroundColor: primaryColor }}
                  >
                    <div className="flex items-center gap-6">
                      {/* Photo Container */}
                      <div className="relative group shrink-0">
                        {cv.photoUrl ? (
                          <div className="relative">
                            <img
                              src={cv.photoUrl}
                              alt={cv.fullName}
                              className={`w-24 h-24 object-cover border-4 border-white shadow-md ${photoShapeClass}`}
                            />
                            {isEditable && (
                              <div
                                onClick={() => fileInputRef.current?.click()}
                                className="no-print absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-[10px] font-semibold cursor-pointer rounded-2xl transition-all"
                                data-html2canvas-ignore="true"
                              >
                                <Camera className="w-4 h-4 mb-0.5" />
                                <span>{isBangla ? 'ছবি পরিবর্তন' : 'Change'}</span>
                              </div>
                            )}
                          </div>
                        ) : (
                          isEditable && (
                            <div
                              onClick={() => fileInputRef.current?.click()}
                              data-html2canvas-ignore="true"
                              className="no-print w-24 h-24 rounded-2xl border-2 border-dashed border-white/70 hover:border-white bg-white/20 hover:bg-white/30 flex flex-col items-center justify-center text-white cursor-pointer transition-all"
                              title={isBangla ? 'ছবি আপলোড করুন' : 'Upload photo'}
                            >
                              <Camera className="w-6 h-6 mb-1 opacity-80" />
                              <span className="text-[10px] font-bold">
                                {isBangla ? '+ ছবি দিন' : '+ Add Photo'}
                              </span>
                            </div>
                          )
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h1
                          contentEditable={isEditable}
                          suppressContentEditableWarning
                          onBlur={(e) => handleFieldBlur('fullName', e)}
                          className={`text-3xl font-extrabold tracking-tight ${editClass}`}
                        >
                          {cv.fullName || 'John Doe'}
                        </h1>
                        <p
                          contentEditable={isEditable}
                          suppressContentEditableWarning
                          onBlur={(e) => handleFieldBlur('professionalTitle', e)}
                          className={`text-base font-medium opacity-90 mt-1 ${editClass}`}
                        >
                          {cv.professionalTitle || 'Software Engineer'}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : cv.design.headerStyle === 'sidebar' ? (
                  /* Sidebar / Two-Column Style Header */
                  <div className="border-b-2 pb-5 mb-6" style={{ borderColor: primaryColor }}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h1
                          contentEditable={isEditable}
                          suppressContentEditableWarning
                          onBlur={(e) => handleFieldBlur('fullName', e)}
                          className={`text-3xl font-bold tracking-tight ${editClass}`}
                          style={{ color: primaryColor }}
                        >
                          {cv.fullName || 'John Doe'}
                        </h1>
                        <p
                          contentEditable={isEditable}
                          suppressContentEditableWarning
                          onBlur={(e) => handleFieldBlur('professionalTitle', e)}
                          className={`text-base font-medium text-slate-600 mt-0.5 ${editClass}`}
                        >
                          {cv.professionalTitle || 'Software Engineer'}
                        </p>
                      </div>

                      {/* Photo */}
                      <div className="relative group shrink-0">
                        {cv.photoUrl ? (
                          <div className="relative">
                            <img
                              src={cv.photoUrl}
                              alt={cv.fullName}
                              className={`w-24 h-24 object-cover border-2 shadow-sm ${photoShapeClass}`}
                              style={{ borderColor: primaryColor }}
                            />
                            {isEditable && (
                              <div
                                onClick={() => fileInputRef.current?.click()}
                                data-html2canvas-ignore="true"
                                className="no-print absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-[10px] font-semibold cursor-pointer rounded-xl transition-all"
                              >
                                <Camera className="w-4 h-4 mb-0.5" />
                                <span>{isBangla ? 'ছবি পরিবর্তন' : 'Change'}</span>
                              </div>
                            )}
                          </div>
                        ) : (
                          isEditable && (
                            <div
                              onClick={() => fileInputRef.current?.click()}
                              data-html2canvas-ignore="true"
                              className="no-print w-22 h-22 rounded-2xl border-2 border-dashed border-slate-300 hover:border-blue-500 bg-slate-50 hover:bg-blue-50/50 flex flex-col items-center justify-center text-slate-500 hover:text-blue-600 cursor-pointer transition-all"
                            >
                              <Camera className="w-5 h-5 mb-1" />
                              <span className="text-[10px] font-bold">
                                {isBangla ? '+ ছবি দিন' : '+ Add Photo'}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Default Modern Header */
                  <div className="border-b pb-5 mb-6 border-slate-200">
                    <div className="flex items-start justify-between gap-5">
                      <div className="flex-1 min-w-0">
                        <h1
                          contentEditable={isEditable}
                          suppressContentEditableWarning
                          onBlur={(e) => handleFieldBlur('fullName', e)}
                          className={`text-3xl font-bold tracking-tight text-slate-900 ${editClass}`}
                        >
                          {cv.fullName || 'John Doe'}
                        </h1>
                        <p
                          contentEditable={isEditable}
                          suppressContentEditableWarning
                          onBlur={(e) => handleFieldBlur('professionalTitle', e)}
                          className={`text-base font-semibold mt-1 ${editClass}`}
                          style={{ color: primaryColor }}
                        >
                          {cv.professionalTitle || 'Senior Software Engineer'}
                        </p>

                        {/* Contact Information Bar */}
                        <div className="flex flex-wrap items-center gap-y-1.5 gap-x-4 mt-3 text-xs text-slate-600">
                          {/* Phone */}
                          <div className="flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span
                              contentEditable={isEditable}
                              suppressContentEditableWarning
                              onBlur={(e) => handleFieldBlur('phone', e)}
                              className={editClass}
                              title={isBangla ? 'ফোন নম্বর এডিট করুন' : 'Click to edit phone'}
                            >
                              {cv.phone || '+880 1XXXXXXXXX'}
                            </span>
                          </div>

                          {/* Email */}
                          <div className="flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span
                              contentEditable={isEditable}
                              suppressContentEditableWarning
                              onBlur={(e) => handleFieldBlur('email', e)}
                              className={editClass}
                              title={isBangla ? 'ইমেইল এডিট করুন' : 'Click to edit email'}
                            >
                              {cv.email || 'email@example.com'}
                            </span>
                          </div>

                          {/* Address */}
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span
                              contentEditable={isEditable}
                              suppressContentEditableWarning
                              onBlur={(e) => handleFieldBlur('address', e)}
                              className={editClass}
                              title={isBangla ? 'ঠিকানা এডিট করুন' : 'Click to edit address'}
                            >
                              {cv.address || 'Dhaka, Bangladesh'}
                            </span>
                          </div>

                          {/* LinkedIn */}
                          <div className="flex items-center gap-1.5">
                            <Linkedin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span
                              contentEditable={isEditable}
                              suppressContentEditableWarning
                              onBlur={(e) => handleFieldBlur('linkedin', e)}
                              className={editClass}
                            >
                              {cv.linkedin || 'linkedin.com/in/username'}
                            </span>
                          </div>

                          {/* GitHub */}
                          <div className="flex items-center gap-1.5">
                            <Github className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span
                              contentEditable={isEditable}
                              suppressContentEditableWarning
                              onBlur={(e) => handleFieldBlur('github', e)}
                              className={editClass}
                            >
                              {cv.github || 'github.com/username'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Photo / Image Upload Container */}
                      <div className="relative group shrink-0">
                        {cv.photoUrl ? (
                          <div className="relative">
                            <img
                              src={cv.photoUrl}
                              alt={cv.fullName}
                              className={`w-24 h-24 object-cover border-2 shadow-sm ${photoShapeClass}`}
                              style={{ borderColor: primaryColor }}
                            />
                            {isEditable && (
                              <div
                                onClick={() => fileInputRef.current?.click()}
                                data-html2canvas-ignore="true"
                                className="no-print absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-[10px] font-semibold cursor-pointer rounded-2xl transition-all"
                                title={isBangla ? 'নতুন ছবি আপলোড করতে ক্লিক করুন' : 'Click to change photo'}
                              >
                                <Camera className="w-4 h-4 mb-0.5" />
                                <span>{isBangla ? 'ছবি পরিবর্তন' : 'Change Photo'}</span>
                              </div>
                            )}

                            {/* Floating controls on hover */}
                            {isEditable && (
                              <div
                                data-html2canvas-ignore="true"
                                className="no-print absolute -bottom-3 left-1/2 -translate-x-1/2 hidden group-hover:flex items-center gap-1 bg-slate-900/90 text-white rounded-lg px-2 py-0.5 shadow-md text-[10px] whitespace-nowrap z-10"
                              >
                                <button
                                  onClick={handleRemovePhoto}
                                  title="Remove photo"
                                  className="hover:text-red-400 p-0.5"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                                <span className="text-slate-500">|</span>
                                <button
                                  onClick={(e) => handleSetPhotoShape('circle', e)}
                                  title="Circle shape"
                                  className="hover:text-blue-400 p-0.5"
                                >
                                  <Circle className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={(e) => handleSetPhotoShape('square', e)}
                                  title="Square shape"
                                  className="hover:text-blue-400 p-0.5"
                                >
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
                              className="no-print w-24 h-24 rounded-2xl border-2 border-dashed border-slate-300 hover:border-blue-500 bg-slate-50 hover:bg-blue-50/50 flex flex-col items-center justify-center text-slate-500 hover:text-blue-600 cursor-pointer transition-all shadow-xs"
                              title={isBangla ? 'ছবি আপলোড করতে ক্লিক করুন' : 'Click to upload your photo'}
                            >
                              <Camera className="w-6 h-6 mb-1 text-slate-400 group-hover:text-blue-500" />
                              <span className="text-[10px] font-bold">
                                {isBangla ? '+ ছবি দিন' : '+ Add Photo'}
                              </span>
                              <span className="text-[9px] text-slate-400">
                                {isBangla ? 'ক্লিক করুন' : 'Click to upload'}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Document Body: Section Layouts */}
            <div className="space-y-5 text-sm">
              {/* Career Objective */}
              <section className="space-y-1.5 relative group">
                <h2
                  className="text-xs font-bold uppercase tracking-wider pb-1 border-b flex items-center gap-1.5"
                  style={{ color: primaryColor, borderColor: `${primaryColor}40` }}
                >
                  <span>{isBangla ? 'ক্যারিয়ার উদ্দেশ্য' : 'Career Objective'}</span>
                </h2>
                <p
                  contentEditable={isEditable}
                  suppressContentEditableWarning
                  onBlur={(e) => handleFieldBlur('careerObjective', e)}
                  className={`text-xs leading-relaxed text-slate-700 text-justify ${editClass}`}
                >
                  {cv.careerObjective ||
                    (isBangla
                      ? 'একটি গতিশীল প্রতিষ্ঠানে নিজের দক্ষতা ও অভিজ্ঞতার সমন্বয়ে অবদান রেখে ক্যারিয়ার বিকাশ করতে আগ্রহী।'
                      : 'Seeking a challenging position in a growth-oriented organization where I can contribute my skills and technical expertise towards achieving organizational objectives.')}
                </p>
              </section>

              {/* Professional Summary */}
              <section className="space-y-1.5 relative group">
                <h2
                  className="text-xs font-bold uppercase tracking-wider pb-1 border-b flex items-center gap-1.5"
                  style={{ color: primaryColor, borderColor: `${primaryColor}40` }}
                >
                  <span>{isBangla ? 'পেশাগত সারসংক্ষেপ' : 'Professional Summary'}</span>
                </h2>
                <p
                  contentEditable={isEditable}
                  suppressContentEditableWarning
                  onBlur={(e) => handleFieldBlur('professionalSummary', e)}
                  className={`text-xs leading-relaxed text-slate-700 text-justify ${editClass}`}
                >
                  {cv.professionalSummary ||
                    (isBangla
                      ? 'অভিজ্ঞ পেশাজীবী, দলগত কাজ এবং সমস্যা সমাধানে দক্ষ।'
                      : 'Results-driven professional with a solid background in delivering high-quality solutions, team leadership, and cross-functional project management.')}
                </p>
              </section>

              {/* Work Experience */}
              <section className="space-y-2.5">
                <div className="flex items-center justify-between pb-1 border-b" style={{ borderColor: `${primaryColor}40` }}>
                  <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: primaryColor }}>
                    {isBangla ? 'কাজের অভিজ্ঞতা (Job Experience)' : 'Job Experience'}
                  </h2>
                  {isEditable && (
                    <button
                      onClick={handleAddExp}
                      data-html2canvas-ignore="true"
                      className="no-print flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold text-blue-600 hover:bg-blue-50 transition"
                    >
                      <Plus className="w-3 h-3" />
                      <span>{isBangla ? '+ অভিজ্ঞতা যোগ' : '+ Add Experience'}</span>
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  {(cv.experience || []).map((exp, idx) => (
                    <div key={exp.id || idx} className="space-y-0.5 relative group pl-1">
                      <div className="flex justify-between items-baseline font-bold text-xs text-slate-900">
                        <span
                          contentEditable={isEditable}
                          suppressContentEditableWarning
                          onBlur={(e) => handleUpdateExp(idx, 'position', e.currentTarget.innerText)}
                          className={editClass}
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
                            className={`text-slate-500 font-medium text-[11px] ${editClass}`}
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
                        className={`text-xs font-semibold ${editClass}`}
                        style={{ color: secondaryColor }}
                      >
                        {exp.company}
                      </div>
                      <p
                        contentEditable={isEditable}
                        suppressContentEditableWarning
                        onBlur={(e) => handleUpdateExp(idx, 'responsibilities', e.currentTarget.innerText)}
                        className={`text-xs text-slate-600 leading-relaxed pt-0.5 ${editClass}`}
                      >
                        {exp.responsibilities}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Scholastic Portfolio / Education Table */}
              <section className="space-y-2">
                <div className="flex items-center justify-between pb-1 border-b" style={{ borderColor: `${primaryColor}40` }}>
                  <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: primaryColor }}>
                    {isBangla ? 'শিক্ষাগত যোগ্যতা (Scholastic Portfolio)' : 'Scholastic Portfolio'}
                  </h2>
                  {isEditable && (
                    <button
                      onClick={handleAddEdu}
                      data-html2canvas-ignore="true"
                      className="no-print flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold text-blue-600 hover:bg-blue-50 transition"
                    >
                      <Plus className="w-3 h-3" />
                      <span>{isBangla ? '+ শিক্ষা যোগ' : '+ Add Education'}</span>
                    </button>
                  )}
                </div>

                <div className="w-full overflow-hidden border border-slate-200 rounded-md">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                        <th className="p-1.5 border-r border-slate-200">
                          {isBangla ? 'ডিগ্রি' : 'Degree / Examination'}
                        </th>
                        <th className="p-1.5 border-r border-slate-200">
                          {isBangla ? 'প্রতিষ্ঠান / বোর্ড' : 'Institution / Board'}
                        </th>
                        <th className="p-1.5 border-r border-slate-200">
                          {isBangla ? 'বিষয়' : 'Subject'}
                        </th>
                        <th className="p-1.5 border-r border-slate-200">
                          {isBangla ? 'ফলাফল' : 'Result'}
                        </th>
                        <th className="p-1.5">{isBangla ? 'সন' : 'Year'}</th>
                        {isEditable && <th className="no-print p-1 w-6" data-html2canvas-ignore="true" />}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-slate-700">
                      {(cv.education || []).map((edu, idx) => (
                        <tr key={edu.id || idx} className="hover:bg-slate-50/50 group">
                          <td
                            contentEditable={isEditable}
                            suppressContentEditableWarning
                            onBlur={(e) => handleUpdateEdu(idx, 'degree', e.currentTarget.innerText)}
                            className={`p-1.5 font-semibold border-r border-slate-200 ${editClass}`}
                          >
                            {edu.degree}
                          </td>
                          <td
                            contentEditable={isEditable}
                            suppressContentEditableWarning
                            onBlur={(e) => handleUpdateEdu(idx, 'institution', e.currentTarget.innerText)}
                            className={`p-1.5 border-r border-slate-200 ${editClass}`}
                          >
                            {edu.institution}
                          </td>
                          <td
                            contentEditable={isEditable}
                            suppressContentEditableWarning
                            onBlur={(e) => handleUpdateEdu(idx, 'subject', e.currentTarget.innerText)}
                            className={`p-1.5 border-r border-slate-200 ${editClass}`}
                          >
                            {edu.subject}
                          </td>
                          <td
                            contentEditable={isEditable}
                            suppressContentEditableWarning
                            onBlur={(e) => handleUpdateEdu(idx, 'cgpaOrGpa', e.currentTarget.innerText)}
                            className={`p-1.5 font-bold border-r border-slate-200 ${editClass}`}
                          >
                            {edu.cgpaOrGpa}
                          </td>
                          <td
                            contentEditable={isEditable}
                            suppressContentEditableWarning
                            onBlur={(e) => handleUpdateEdu(idx, 'passingYear', e.currentTarget.innerText)}
                            className={`p-1.5 ${editClass}`}
                          >
                            {edu.passingYear}
                          </td>
                          {isEditable && (
                            <td className="no-print p-1 text-center" data-html2canvas-ignore="true">
                              <button
                                onClick={() => handleRemoveEdu(idx)}
                                title="Delete row"
                                className="opacity-0 group-hover:opacity-100 p-0.5 text-slate-400 hover:text-red-500"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Skills Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Core Skills */}
                <section className="space-y-1.5">
                  <div className="flex items-center justify-between pb-1 border-b" style={{ borderColor: `${primaryColor}40` }}>
                    <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: primaryColor }}>
                      {isBangla ? 'মূল দক্ষতা সমূহ' : 'Key Skills'}
                    </h2>
                    {isEditable && (
                      <button
                        onClick={handleAddSkill}
                        data-html2canvas-ignore="true"
                        className="no-print flex items-center gap-0.5 text-[10px] font-semibold text-blue-600 hover:text-blue-700"
                      >
                        <Plus className="w-2.5 h-2.5" />
                        <span>{isBangla ? 'যোগ' : 'Add'}</span>
                      </button>
                    )}
                  </div>
                  <ul className="text-xs text-slate-700 space-y-1 pl-1">
                    {(cv.skills || []).map((skill, i) => (
                      <li key={i} className="flex items-center justify-between group">
                        <div className="flex items-center gap-1.5 flex-1 min-w-0">
                          <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: primaryColor }} />
                          <span
                            contentEditable={isEditable}
                            suppressContentEditableWarning
                            onBlur={(e) => handleUpdateSkill(i, e.currentTarget.innerText)}
                            className={`flex-1 ${editClass}`}
                          >
                            {skill}
                          </span>
                        </div>
                        {isEditable && (
                          <button
                            onClick={() => handleRemoveSkill(i)}
                            data-html2canvas-ignore="true"
                            className="no-print opacity-0 group-hover:opacity-100 p-0.5 text-slate-400 hover:text-red-500"
                          >
                            <X className="w-2.5 h-2.5" />
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                </section>

                {/* Computer & Software Skills */}
                <section className="space-y-1.5">
                  <div className="flex items-center justify-between pb-1 border-b" style={{ borderColor: `${primaryColor}40` }}>
                    <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: primaryColor }}>
                      {isBangla ? 'কম্পিউটার ও আইটি দক্ষতা' : 'Computer & Software Skills'}
                    </h2>
                    {isEditable && (
                      <button
                        onClick={handleAddComputerSkill}
                        data-html2canvas-ignore="true"
                        className="no-print flex items-center gap-0.5 text-[10px] font-semibold text-blue-600 hover:text-blue-700"
                      >
                        <Plus className="w-2.5 h-2.5" />
                        <span>{isBangla ? 'যোগ' : 'Add'}</span>
                      </button>
                    )}
                  </div>
                  <ul className="text-xs text-slate-700 space-y-1 pl-1">
                    {(cv.computerSkills || []).map((cskill, i) => (
                      <li key={i} className="flex items-center justify-between group">
                        <div className="flex items-center gap-1.5 flex-1 min-w-0">
                          <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: secondaryColor }} />
                          <span
                            contentEditable={isEditable}
                            suppressContentEditableWarning
                            onBlur={(e) => handleUpdateComputerSkill(i, e.currentTarget.innerText)}
                            className={`flex-1 ${editClass}`}
                          >
                            {cskill}
                          </span>
                        </div>
                        {isEditable && (
                          <button
                            onClick={() => handleRemoveComputerSkill(i)}
                            data-html2canvas-ignore="true"
                            className="no-print opacity-0 group-hover:opacity-100 p-0.5 text-slate-400 hover:text-red-500"
                          >
                            <X className="w-2.5 h-2.5" />
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                </section>
              </div>

              {/* Languages */}
              <section className="space-y-1.5">
                <div className="flex items-center justify-between pb-1 border-b" style={{ borderColor: `${primaryColor}40` }}>
                  <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: primaryColor }}>
                    {isBangla ? 'ভাষাগত দক্ষতা' : 'Language Proficiency'}
                  </h2>
                  {isEditable && (
                    <button
                      onClick={handleAddLanguage}
                      data-html2canvas-ignore="true"
                      className="no-print flex items-center gap-0.5 text-[10px] font-semibold text-blue-600 hover:text-blue-700"
                    >
                      <Plus className="w-2.5 h-2.5" />
                      <span>{isBangla ? 'যোগ' : 'Add'}</span>
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {(cv.languages || []).map((lang, i) => (
                    <div
                      key={i}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-xs font-medium text-slate-800 group"
                    >
                      <span
                        contentEditable={isEditable}
                        suppressContentEditableWarning
                        onBlur={(e) => handleUpdateLanguage(i, e.currentTarget.innerText)}
                        className={editClass}
                      >
                        {lang}
                      </span>
                      {isEditable && (
                        <button
                          onClick={() => handleRemoveLanguage(i)}
                          data-html2canvas-ignore="true"
                          className="no-print opacity-0 group-hover:opacity-100 p-0.5 text-slate-400 hover:text-red-500"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </section>

              {/* Personal Information (Every Field In-place Editable) */}
              <section className="space-y-1.5">
                <h2
                  className="text-xs font-bold uppercase tracking-wider pb-1 border-b"
                  style={{ color: primaryColor, borderColor: `${primaryColor}40` }}
                >
                  {isBangla ? 'ব্যক্তিগত তথ্যাবলী (Personal Information)' : 'Personal Information'}
                </h2>
                <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-xs text-slate-700 pt-1">
                  {/* Father's Name */}
                  <div className="flex items-baseline gap-1">
                    <span className="font-semibold text-slate-900 shrink-0">
                      {isBangla ? 'পিতার নাম:' : "Father's Name:"}
                    </span>
                    <span
                      contentEditable={isEditable}
                      suppressContentEditableWarning
                      onBlur={(e) => handleUpdatePersonalInfo('fatherName', e.currentTarget.innerText)}
                      className={`flex-1 ${editClass}`}
                    >
                      {cv.personalInfo?.fatherName || (isBangla ? 'পিতার নাম লিখুন' : 'Enter father name')}
                    </span>
                  </div>

                  {/* Mother's Name */}
                  <div className="flex items-baseline gap-1">
                    <span className="font-semibold text-slate-900 shrink-0">
                      {isBangla ? 'মাতার নাম:' : "Mother's Name:"}
                    </span>
                    <span
                      contentEditable={isEditable}
                      suppressContentEditableWarning
                      onBlur={(e) => handleUpdatePersonalInfo('motherName', e.currentTarget.innerText)}
                      className={`flex-1 ${editClass}`}
                    >
                      {cv.personalInfo?.motherName || (isBangla ? 'মাতার নাম লিখুন' : 'Enter mother name')}
                    </span>
                  </div>

                  {/* Date of Birth */}
                  <div className="flex items-baseline gap-1">
                    <span className="font-semibold text-slate-900 shrink-0">
                      {isBangla ? 'জন্ম তারিখ:' : 'Date of Birth:'}
                    </span>
                    <span
                      contentEditable={isEditable}
                      suppressContentEditableWarning
                      onBlur={(e) => handleUpdatePersonalInfo('dateOfBirth', e.currentTarget.innerText)}
                      className={`flex-1 ${editClass}`}
                    >
                      {cv.personalInfo?.dateOfBirth || '01 January 1998'}
                    </span>
                  </div>

                  {/* Nationality */}
                  <div className="flex items-baseline gap-1">
                    <span className="font-semibold text-slate-900 shrink-0">
                      {isBangla ? 'জাতীয়তা:' : 'Nationality:'}
                    </span>
                    <span
                      contentEditable={isEditable}
                      suppressContentEditableWarning
                      onBlur={(e) => handleUpdatePersonalInfo('nationality', e.currentTarget.innerText)}
                      className={`flex-1 ${editClass}`}
                    >
                      {cv.personalInfo?.nationality || (isBangla ? 'বাংলাদেশী' : 'Bangladeshi')}
                    </span>
                  </div>

                  {/* Religion */}
                  <div className="flex items-baseline gap-1">
                    <span className="font-semibold text-slate-900 shrink-0">
                      {isBangla ? 'ধর্ম:' : 'Religion:'}
                    </span>
                    <span
                      contentEditable={isEditable}
                      suppressContentEditableWarning
                      onBlur={(e) => handleUpdatePersonalInfo('religion', e.currentTarget.innerText)}
                      className={`flex-1 ${editClass}`}
                    >
                      {cv.personalInfo?.religion || (isBangla ? 'ইসলাম' : 'Islam')}
                    </span>
                  </div>

                  {/* Marital Status */}
                  <div className="flex items-baseline gap-1">
                    <span className="font-semibold text-slate-900 shrink-0">
                      {isBangla ? 'বৈবাহিক অবস্থা:' : 'Marital Status:'}
                    </span>
                    <span
                      contentEditable={isEditable}
                      suppressContentEditableWarning
                      onBlur={(e) => handleUpdatePersonalInfo('maritalStatus', e.currentTarget.innerText)}
                      className={`flex-1 ${editClass}`}
                    >
                      {cv.personalInfo?.maritalStatus || (isBangla ? 'অবিবাহিত' : 'Single')}
                    </span>
                  </div>

                  {/* Blood Group */}
                  <div className="flex items-baseline gap-1">
                    <span className="font-semibold text-slate-900 shrink-0">
                      {isBangla ? 'রক্তের গ্রুপ:' : 'Blood Group:'}
                    </span>
                    <span
                      contentEditable={isEditable}
                      suppressContentEditableWarning
                      onBlur={(e) => handleUpdatePersonalInfo('bloodGroup', e.currentTarget.innerText)}
                      className={`flex-1 ${editClass}`}
                    >
                      {cv.personalInfo?.bloodGroup || 'B+'}
                    </span>
                  </div>

                  {/* National ID */}
                  <div className="flex items-baseline gap-1">
                    <span className="font-semibold text-slate-900 shrink-0">
                      {isBangla ? 'জাতীয় পরিচয়পত্র (NID):' : 'National ID:'}
                    </span>
                    <span
                      contentEditable={isEditable}
                      suppressContentEditableWarning
                      onBlur={(e) => handleUpdatePersonalInfo('nidOrPassport', e.currentTarget.innerText)}
                      className={`flex-1 ${editClass}`}
                    >
                      {cv.personalInfo?.nidOrPassport || '1998XXXXXXXXX'}
                    </span>
                  </div>

                  {/* Permanent Address */}
                  <div className="col-span-2 flex items-baseline gap-1">
                    <span className="font-semibold text-slate-900 shrink-0">
                      {isBangla ? 'স্থায়ী ঠিকানা:' : 'Permanent Address:'}
                    </span>
                    <span
                      contentEditable={isEditable}
                      suppressContentEditableWarning
                      onBlur={(e) => handleUpdatePersonalInfo('permanentAddress', e.currentTarget.innerText)}
                      className={`flex-1 ${editClass}`}
                    >
                      {cv.personalInfo?.permanentAddress ||
                        (isBangla
                          ? 'গ্রাম: গাছবাড়ীয়া, পোস্ট: গাছবাড়ীয়া, চট্টগ্রাম, বাংলাদেশ।'
                          : 'Gachbaria, Chattogram, Bangladesh.')}
                    </span>
                  </div>
                </div>
              </section>

              {/* References */}
              <section className="space-y-1.5">
                <div className="flex items-center justify-between pb-1 border-b" style={{ borderColor: `${primaryColor}40` }}>
                  <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: primaryColor }}>
                    {isBangla ? 'রেফারেন্স / সুপারিশকারী' : 'References'}
                  </h2>
                  {isEditable && (
                    <button
                      onClick={handleAddRef}
                      data-html2canvas-ignore="true"
                      className="no-print flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold text-blue-600 hover:bg-blue-50 transition"
                    >
                      <Plus className="w-3 h-3" />
                      <span>{isBangla ? '+ রেফারেন্স যোগ' : '+ Add Reference'}</span>
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-700 pt-1">
                  {(cv.references || []).map((ref, i) => (
                    <div
                      key={ref.id || i}
                      className="border-l-2 pl-2.5 space-y-0.5 relative group"
                      style={{ borderColor: primaryColor }}
                    >
                      {isEditable && (
                        <button
                          onClick={() => handleRemoveRef(i)}
                          data-html2canvas-ignore="true"
                          className="no-print absolute top-0 right-0 opacity-0 group-hover:opacity-100 p-0.5 text-slate-400 hover:text-red-500"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                      <div
                        contentEditable={isEditable}
                        suppressContentEditableWarning
                        onBlur={(e) => handleUpdateRef(i, 'name', e.currentTarget.innerText)}
                        className={`font-bold text-slate-900 ${editClass}`}
                      >
                        {ref.name}
                      </div>
                      <div
                        contentEditable={isEditable}
                        suppressContentEditableWarning
                        onBlur={(e) => handleUpdateRef(i, 'designation', e.currentTarget.innerText)}
                        className={editClass}
                      >
                        {ref.designation}
                      </div>
                      <div
                        contentEditable={isEditable}
                        suppressContentEditableWarning
                        onBlur={(e) => handleUpdateRef(i, 'organization', e.currentTarget.innerText)}
                        className={`text-slate-600 ${editClass}`}
                      >
                        {ref.organization}
                      </div>
                      <div
                        contentEditable={isEditable}
                        suppressContentEditableWarning
                        onBlur={(e) => {
                          const parts = e.currentTarget.innerText.split('|');
                          handleUpdateRef(i, 'phone', parts[0]?.trim() || ref.phone);
                          if (parts[1]) handleUpdateRef(i, 'email', parts[1]?.trim());
                        }}
                        className={`text-[11px] text-slate-500 ${editClass}`}
                      >
                        {ref.phone} | {ref.email}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Declaration & Signature */}
              <div className="pt-4 mt-auto border-t border-slate-200">
                <p
                  contentEditable={isEditable}
                  suppressContentEditableWarning
                  onBlur={(e) => handleFieldBlur('declaration', e)}
                  className={`text-[11px] italic text-slate-600 leading-relaxed mb-6 ${editClass}`}
                >
                  {cv.declaration ||
                    (isBangla
                      ? 'আমি ঘোষণা করছি যে, উপরে উল্লেখিত সকল তথ্য আমার জ্ঞান ও বিশ্বাস মতে সম্পূর্ণ সত্য ও নির্ভুল।'
                      : 'I hereby declare that all the information mentioned above is true and authentic to the best of my knowledge.')}
                </p>
                <div className="flex justify-between items-end text-xs">
                  <div>
                    <div className="text-slate-600 text-[11px] flex items-center gap-1">
                      <span>{isBangla ? 'তারিখ:' : 'Date:'}</span>
                      <span
                        contentEditable={isEditable}
                        suppressContentEditableWarning
                        onBlur={(e) => handleFieldBlur('signatureDate', e)}
                        className={editClass}
                      >
                        {cv.signatureDate || '19 September 2026'}
                      </span>
                    </div>
                  </div>
                  <div className="text-center">
                    <div
                      contentEditable={isEditable}
                      suppressContentEditableWarning
                      onBlur={(e) => handleFieldBlur('signatureText', e)}
                      className={`font-serif italic text-base font-bold pb-0.5 border-b border-slate-700 px-6 min-w-32 ${editClass}`}
                      style={{ color: primaryColor }}
                    >
                      {cv.signatureText || cv.fullName || 'Signature'}
                    </div>
                    <div className="text-[10px] uppercase font-semibold text-slate-600 pt-0.5">
                      {isBangla ? 'স্বাক্ষর' : 'Signature'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

              {/* Footer page stamp */}
              <div className="px-10 py-3 text-[10px] text-slate-400 border-t border-slate-100 flex justify-between items-center print:border-none">
                <span>SmartCV Online Document Maker</span>
                <span>
                  Page {pageNum} of {pages.length}
                </span>
              </div>
            </>
          )}
        </div>
      ))}
      </div>
    </div>
  );
};
