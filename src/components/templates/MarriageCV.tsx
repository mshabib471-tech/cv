import React, { useRef } from 'react';
import {
  Heart,
  User,
  GraduationCap,
  Briefcase,
  MapPin,
  Phone,
  Camera,
  Trash2,
  Plus,
  X,
  Sparkles,
  CheckCircle,
} from 'lucide-react';
import { CVData, EducationItem } from '../../types';

interface MarriageCVProps {
  cv: CVData;
  isEditable?: boolean;
  onUpdateField?: (field: keyof CVData, value: any) => void;
}

export const MarriageCV: React.FC<MarriageCVProps> = ({
  cv,
  isEditable = true,
  onUpdateField,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const primaryColor = cv.design?.primaryColor || '#E11D48';

  const editClass = isEditable
    ? 'outline-none cursor-text hover:bg-rose-50 hover:ring-1 hover:ring-rose-300 rounded px-1 -mx-1 transition-all focus:bg-rose-100/60 focus:ring-2 focus:ring-rose-500'
    : '';

  const handleFieldBlur = (field: keyof CVData, e: React.FocusEvent<HTMLElement>) => {
    if (!isEditable || !onUpdateField) return;
    const text = e.currentTarget.innerText.trim();
    onUpdateField(field, text);
  };

  const handleUpdatePersonalInfo = (key: string, val: string) => {
    if (!onUpdateField) return;
    onUpdateField('personalInfo', {
      ...(cv.personalInfo || {}),
      [key]: val,
    });
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
      degree: 'বি.এস.সি / ফাজিল',
      institution: 'বিশ্ববিদ্যালয় / মাদ্রাসা',
      passingYear: '২০২২',
      grade: 'সিজিপিএ ৩.৮০',
      board: 'চট্টগ্রাম',
    };
    onUpdateField('education', [...(cv.education || []), newItem]);
  };

  const handleRemoveEdu = (index: number) => {
    if (!onUpdateField) return;
    const list = (cv.education || []).filter((_, i) => i !== index);
    onUpdateField('education', list);
  };

  const pInfo = cv.personalInfo || {};

  return (
    <div className="h-full min-h-[297mm] p-8 bg-[#FFFBF7] text-slate-800 flex flex-col justify-between border-4 border-double border-rose-300 font-bengali">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handlePhotoUpload}
        accept="image/*"
        className="hidden"
      />

      <div className="space-y-4">
        {/* ISLAMIC / TRADITIONAL HEADER */}
        <div className="text-center pb-2 border-b-2 border-rose-300">
          <div className="text-sm font-bold text-rose-700 tracking-widest mb-1">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            {cv.templateId?.includes('bride') ? 'পাত্রীর জীবনবৃত্তান্ত (বায়োডাটা)' : 'পাত্রের জীবনবৃত্তান্ত (Marriage Biodata)'}
          </h1>
          <p className="text-xs text-rose-600 font-medium mt-0.5">
            বিবাহ সংক্রান্ত তথ্যাবলী • দ্বীনি ও আদর্শ পরিবার গঠনের প্রত্যয়ে
          </p>
        </div>

        {/* PROFILE BANNER WITH PHOTO */}
        <div className="flex items-center gap-5 bg-rose-50/70 p-3.5 rounded-2xl border border-rose-200/80">
          <div className="relative group shrink-0">
            {cv.photoUrl ? (
              <div className="relative">
                <img
                  src={cv.photoUrl}
                  alt={cv.fullName}
                  className="w-24 h-24 rounded-full object-cover border-3 border-rose-500 shadow-md"
                />
                {isEditable && (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    data-html2canvas-ignore="true"
                    className="no-print absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-[10px] font-bold rounded-full cursor-pointer transition-all"
                  >
                    <Camera className="w-4 h-4 mb-0.5" />
                    <span>ছবি পরিবর্তন</span>
                  </div>
                )}
                {isEditable && (
                  <button
                    onClick={handleRemovePhoto}
                    data-html2canvas-ignore="true"
                    className="no-print absolute -top-1 -right-1 bg-white text-red-500 hover:text-red-700 p-1 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            ) : (
              isEditable && (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  data-html2canvas-ignore="true"
                  className="no-print w-24 h-24 rounded-full border-2 border-dashed border-rose-300 hover:border-rose-500 bg-white flex flex-col items-center justify-center text-rose-600 cursor-pointer shadow-xs transition"
                >
                  <Camera className="w-6 h-6 mb-1 text-rose-400" />
                  <span className="text-[10px] font-bold">+ ছবি দিন</span>
                </div>
              )
            )}
          </div>

          <div className="flex-1 min-w-0 space-y-1">
            <h2
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(e) => handleFieldBlur('fullName', e)}
              className={`text-lg font-bold text-slate-900 ${editClass}`}
            >
              {cv.fullName || 'মোহাম্মদ আরিফুর রহমান'}
            </h2>
            <div
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(e) => handleFieldBlur('professionalTitle', e)}
              className={`text-xs font-semibold text-rose-700 ${editClass}`}
            >
              {cv.professionalTitle || 'বি.এস.সি (কম্পিউটার সায়েন্স) • সিনিয়র সফটওয়্যার ইঞ্জিনিয়ার'}
            </div>
            <div className="text-xs text-slate-600 flex flex-wrap gap-x-3 gap-y-0.5 pt-0.5">
              <span>বৈবাহিক অবস্থা: {pInfo.maritalStatus || 'অবিবাহিত'}</span>
              <span>•</span>
              <span>রক্তের গ্রুপ: {pInfo.bloodGroup || 'B+ (পজিটিভ)'}</span>
              <span>•</span>
              <span>ধর্ম: {pInfo.religion || 'ইসলাম (সুন্নি)'}</span>
            </div>
          </div>
        </div>

        {/* SECTION 1: PERSONAL & PHYSICAL INFORMATION */}
        <div className="bg-white p-3.5 rounded-xl border border-rose-200 shadow-2xs space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-rose-700 pb-1 border-b border-rose-100">
            <Heart className="w-3.5 h-3.5" />
            <span>১. ব্যক্তিগত ও শারীরিক তথ্যাবলী</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs text-slate-700">
            <div>
              <span className="text-slate-400 block text-[10px]">জন্ম তারিখ:</span>
              <span
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(e) => handleUpdatePersonalInfo('dateOfBirth', e.currentTarget.innerText)}
                className={editClass}
              >
                {pInfo.dateOfBirth || '১৫ মে ১৯৯৬ (বয়স ২৮ বছর)'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">উচ্চতা:</span>
              <span
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(e) => handleUpdatePersonalInfo('height', e.currentTarget.innerText)}
                className={editClass}
              >
                {pInfo.height || '৫ ফুট ৭ ইঞ্চি'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">গায়ের রঙ:</span>
              <span
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(e) => handleUpdatePersonalInfo('complexion', e.currentTarget.innerText)}
                className={editClass}
              >
                {pInfo.complexion || 'উজ্জ্বল শ্যামবর্ণ'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">ওজন:</span>
              <span
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(e) => handleUpdatePersonalInfo('weight', e.currentTarget.innerText)}
                className={editClass}
              >
                {pInfo.weight || '৬৮ কেজি'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">ধর্ম ও মাযহাব:</span>
              <span
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(e) => handleUpdatePersonalInfo('religion', e.currentTarget.innerText)}
                className={editClass}
              >
                {pInfo.religion || 'ইসলাম (হানাফী)'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">জাতীয়তা:</span>
              <span
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(e) => handleUpdatePersonalInfo('nationality', e.currentTarget.innerText)}
                className={editClass}
              >
                {pInfo.nationality || 'বাংলাদেশী'}
              </span>
            </div>
          </div>
        </div>

        {/* SECTION 2: FAMILY BACKGROUND */}
        <div className="bg-white p-3.5 rounded-xl border border-rose-200 shadow-2xs space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-rose-700 pb-1 border-b border-rose-100">
            <User className="w-3.5 h-3.5" />
            <span>২. পারিবারিক পরিচিতি</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
            <div>
              <span className="text-slate-400 block text-[10px]">পিতার নাম ও পেশা:</span>
              <span
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(e) => handleUpdatePersonalInfo('fatherName', e.currentTarget.innerText)}
                className={editClass}
              >
                {pInfo.fatherName || 'হাজী রফিকুল ইসলাম (অবসরপ্রাপ্ত সরকারি কর্মকর্তা)'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">মাতার নাম ও পেশা:</span>
              <span
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(e) => handleUpdatePersonalInfo('motherName', e.currentTarget.innerText)}
                className={editClass}
              >
                {pInfo.motherName || 'জাহানারা বেগম (গৃহিণী)'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">স্থায়ী ঠিকানা:</span>
              <span
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(e) => handleUpdatePersonalInfo('permanentAddress', e.currentTarget.innerText)}
                className={editClass}
              >
                {pInfo.permanentAddress || 'গ্রাম: গাছবাড়ীয়া, চন্দনাইশ, চট্টগ্রাম।'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">বর্তমান ঠিকানা:</span>
              <span
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(e) => handleUpdatePersonalInfo('presentAddress', e.currentTarget.innerText)}
                className={editClass}
              >
                {pInfo.presentAddress || 'বাসা #১২, রোড #০৫, ধানমন্ডি, ঢাকা।'}
              </span>
            </div>
          </div>
        </div>

        {/* SECTION 3: EDUCATIONAL QUALIFICATIONS */}
        <div className="bg-white p-3.5 rounded-xl border border-rose-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between pb-1 border-b border-rose-100">
            <div className="flex items-center gap-1.5 text-xs font-bold text-rose-700">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>৩. শিক্ষাগত যোগ্যতা</span>
            </div>
            {isEditable && (
              <button
                onClick={handleAddEdu}
                data-html2canvas-ignore="true"
                className="no-print text-[11px] text-rose-600 hover:text-rose-800 font-semibold flex items-center gap-0.5"
              >
                <Plus className="w-3 h-3" />
                <span>+ শিক্ষা যোগ</span>
              </button>
            )}
          </div>
          <table className="w-full text-xs text-left">
            <thead className="bg-rose-50 text-slate-700 font-semibold">
              <tr>
                <th className="p-1.5">পরীক্ষা / ডিগ্রি</th>
                <th className="p-1.5">প্রতিষ্ঠান / বোর্ড</th>
                <th className="p-1.5">পাসের সাল</th>
                <th className="p-1.5 text-right">ফলাফল</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {(cv.education || []).map((edu, idx) => (
                <tr key={edu.id || idx} className="hover:bg-rose-50/50 relative group">
                  <td className="p-1.5 font-medium text-slate-900">
                    <span
                      contentEditable={isEditable}
                      suppressContentEditableWarning
                      onBlur={(e) => handleUpdateEdu(idx, 'degree', e.currentTarget.innerText)}
                      className={editClass}
                    >
                      {edu.degree}
                    </span>
                  </td>
                  <td className="p-1.5">
                    <span
                      contentEditable={isEditable}
                      suppressContentEditableWarning
                      onBlur={(e) => handleUpdateEdu(idx, 'institution', e.currentTarget.innerText)}
                      className={editClass}
                    >
                      {edu.institution}
                    </span>
                  </td>
                  <td className="p-1.5">
                    <span
                      contentEditable={isEditable}
                      suppressContentEditableWarning
                      onBlur={(e) => handleUpdateEdu(idx, 'passingYear', e.currentTarget.innerText)}
                      className={editClass}
                    >
                      {edu.passingYear}
                    </span>
                  </td>
                  <td className="p-1.5 text-right font-semibold text-rose-700">
                    <span
                      contentEditable={isEditable}
                      suppressContentEditableWarning
                      onBlur={(e) => handleUpdateEdu(idx, 'grade', e.currentTarget.innerText)}
                      className={editClass}
                    >
                      {edu.grade}
                    </span>
                    {isEditable && (
                      <button
                        onClick={() => handleRemoveEdu(idx)}
                        data-html2canvas-ignore="true"
                        className="no-print opacity-0 group-hover:opacity-100 ml-1 text-red-500"
                      >
                        <X className="w-3 h-3 inline" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* SECTION 4: PRESENT PROFESSION */}
        <div className="bg-white p-3.5 rounded-xl border border-rose-200 shadow-2xs space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-rose-700 pb-1 border-b border-rose-100">
            <Briefcase className="w-3.5 h-3.5" />
            <span>৪. বর্তমান পেশা ও কর্মক্ষেত্র</span>
          </div>
          <p
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(e) => handleFieldBlur('careerObjective', e)}
            className={`text-xs text-slate-700 leading-relaxed ${editClass}`}
          >
            {cv.careerObjective ||
              'একটি স্বনামধন্য আইটি কোম্পানিতে সিনিয়র সফটওয়্যার ইঞ্জিনিয়ার হিসেবে স্থায়ীভাবে কর্মরত। মাসিক আয় সম্মানজনক ও আলহামদুলিল্লাহ সচ্ছল।'}
          </p>
        </div>

        {/* SECTION 5: EXPECTATIONS FROM PARTNER */}
        <div className="bg-white p-3.5 rounded-xl border border-rose-200 shadow-2xs space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-rose-700 pb-1 border-b border-rose-100">
            <Sparkles className="w-3.5 h-3.5" />
            <span>৫. যেমন জীবনসঙ্গী প্রত্যাশা করি</span>
          </div>
          <p
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(e) => handleFieldBlur('professionalSummary', e)}
            className={`text-xs text-slate-700 leading-relaxed ${editClass}`}
          >
            {cv.professionalSummary ||
              'দ্বীনদার, ৫ ওয়াক্ত নামাজী, মার্জিত চরিত্রের অধিকারী এবং পরিবারের প্রতি শ্রদ্ধাশীল সুশিক্ষিত জীবনসঙ্গী প্রত্যাশা করি।'}
          </p>
        </div>
      </div>

      {/* GUARDIAN CONTACT FOOTER */}
      <div className="pt-3 border-t-2 border-rose-300 text-center text-xs text-slate-800 bg-rose-50/60 p-2.5 rounded-xl">
        <div className="font-bold text-rose-700 mb-0.5">যোগাযোগের ঠিকানা (অভিভাবক):</div>
        <div className="flex justify-center items-center gap-4 text-xs font-medium">
          <span>ফোন: +৮৮০ ১৮৬৮ ৪৬১৫৭৭ / +৮৮০ ১৭XXXXXXXX</span>
          <span>•</span>
          <span>ইমেইল: arif.family@domain.com</span>
        </div>
      </div>
    </div>
  );
};
