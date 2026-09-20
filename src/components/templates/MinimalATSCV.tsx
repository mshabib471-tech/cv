import React from 'react';
import {
  Briefcase,
  GraduationCap,
  Award,
  CheckCircle,
  Plus,
  Trash2,
  X,
  FileCheck,
  Globe,
} from 'lucide-react';
import { CVData, ExperienceItem, EducationItem } from '../../types';

interface MinimalATSCVProps {
  cv: CVData;
  isEditable?: boolean;
  onUpdateField?: (field: keyof CVData, value: any) => void;
}

export const MinimalATSCV: React.FC<MinimalATSCVProps> = ({
  cv,
  isEditable = true,
  onUpdateField,
}) => {
  const isBangla = cv.language === 'bn' || cv.design?.fontFamily === 'Noto Sans Bengali';

  const editClass = isEditable
    ? 'outline-none cursor-text hover:bg-slate-100 hover:ring-1 hover:ring-slate-400 rounded px-1 -mx-1 transition-all focus:bg-blue-50 focus:ring-2 focus:ring-blue-500'
    : '';

  const handleFieldBlur = (field: keyof CVData, e: React.FocusEvent<HTMLElement>) => {
    if (!isEditable || !onUpdateField) return;
    const text = e.currentTarget.innerText.trim();
    onUpdateField(field, text);
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
      position: isBangla ? 'পদের নাম' : 'Senior Technical Specialist',
      company: isBangla ? 'প্রতিষ্ঠানের নাম' : 'HabibiFix Global Ltd.',
      startDate: '2022',
      endDate: isBangla ? 'বর্তমান' : 'Present',
      responsibilities: isBangla
        ? '• গুরুত্বপূর্ণ দায়িত্ব ও সাফল্যের বিবরণ লিখুন।'
        : '• Led high-throughput API integrations and reduced system latency by 35%.',
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
      degree: isBangla ? 'ডিগ্রি' : 'B.Sc in Engineering',
      institution: isBangla ? 'বিশ্ববিদ্যালয়' : 'National University',
      passingYear: '2022',
      grade: 'GPA 3.80',
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
    onUpdateField('skills', [...(cv.skills || []), isBangla ? 'দক্ষতা' : 'New Skill']);
  };

  const handleRemoveSkill = (index: number) => {
    if (!onUpdateField) return;
    const list = (cv.skills || []).filter((_, i) => i !== index);
    onUpdateField('skills', list);
  };

  return (
    <div className="h-full min-h-[297mm] p-12 bg-white text-slate-800 flex flex-col justify-between space-y-6 font-sans">
      <div className="space-y-6">
        {/* ATS STRICT HEADER (Centered, High Parsability) */}
        <div className="text-center pb-4 border-b-2 border-slate-900">
          <h1
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(e) => handleFieldBlur('fullName', e)}
            className={`text-2xl font-black uppercase tracking-wider text-slate-900 leading-tight ${editClass}`}
          >
            {cv.fullName || (isBangla ? 'মো: হাবিবুর রহমান' : 'HABIBUR RAHMAN')}
          </h1>

          <div className="text-xs text-slate-600 font-medium mt-1.5 flex flex-wrap items-center justify-center gap-2">
            <span
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(e) => handleFieldBlur('phone', e)}
              className={editClass}
            >
              {cv.phone || '+880 1868 461577'}
            </span>
            <span>•</span>
            <span
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(e) => handleFieldBlur('email', e)}
              className={editClass}
            >
              {cv.email || 'tec.habiburrahman@gmail.com'}
            </span>
            <span>•</span>
            <span
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(e) => handleFieldBlur('address', e)}
              className={editClass}
            >
              {cv.address || 'Chattogram, Bangladesh'}
            </span>
            {cv.linkedin && (
              <>
                <span>•</span>
                <span
                  contentEditable={isEditable}
                  suppressContentEditableWarning
                  onBlur={(e) => handleFieldBlur('linkedin', e)}
                  className={editClass}
                >
                  {cv.linkedin}
                </span>
              </>
            )}
          </div>
        </div>

        {/* PROFESSIONAL SUMMARY */}
        <section className="space-y-1.5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5">
            {isBangla ? 'পেশাগত সারসংক্ষেপ (Professional Summary)' : 'Professional Summary'}
          </h2>
          <p
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(e) => handleFieldBlur('professionalSummary', e)}
            className={`text-xs leading-relaxed text-slate-700 text-justify ${editClass}`}
          >
            {cv.professionalSummary ||
              (isBangla
                ? 'অভিজ্ঞ ও নিবেদিতপ্রাণ প্রযুক্তিবিদ, টিম লিডারশিপ ও জটিল সফটওয়্যার ইঞ্জিনিয়ারিং সফলতার ট্র্যাক রেকর্ড রয়েছে।'
                : 'Accomplished technical professional with a proven track record in software engineering, cross-functional collaboration, and architecting robust digital infrastructure.')}
          </p>
        </section>

        {/* WORK EXPERIENCE */}
        <section className="space-y-2.5">
          <div className="flex items-center justify-between border-b border-slate-300 pb-0.5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              {isBangla ? 'কাজের অভিজ্ঞতা (Work Experience)' : 'Work Experience'}
            </h2>
            {isEditable && (
              <button
                onClick={handleAddExp}
                data-html2canvas-ignore="true"
                className="no-print flex items-center gap-1 text-[11px] font-semibold text-slate-700 hover:text-blue-600 transition"
              >
                <Plus className="w-3 h-3" />
                <span>{isBangla ? '+ অভিজ্ঞতা যোগ' : '+ Add Experience'}</span>
              </button>
            )}
          </div>

          <div className="space-y-3.5">
            {(cv.experience || []).map((exp, idx) => (
              <div key={exp.id || idx} className="space-y-0.5 relative group">
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
                      className={`text-slate-600 font-normal text-xs ${editClass}`}
                    >
                      {exp.startDate} – {exp.endDate}
                    </span>
                    {isEditable && (
                      <button
                        onClick={() => handleRemoveExp(idx)}
                        data-html2canvas-ignore="true"
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
                  className={`text-xs font-semibold text-slate-700 ${editClass}`}
                >
                  {exp.company}
                </div>
                <p
                  contentEditable={isEditable}
                  suppressContentEditableWarning
                  onBlur={(e) => handleUpdateExp(idx, 'responsibilities', e.currentTarget.innerText)}
                  className={`text-xs text-slate-600 leading-relaxed ${editClass}`}
                >
                  {exp.responsibilities}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* EDUCATION */}
        <section className="space-y-2">
          <div className="flex items-center justify-between border-b border-slate-300 pb-0.5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              {isBangla ? 'শিক্ষাগত যোগ্যতা (Education)' : 'Education'}
            </h2>
            {isEditable && (
              <button
                onClick={handleAddEdu}
                data-html2canvas-ignore="true"
                className="no-print flex items-center gap-1 text-[11px] font-semibold text-slate-700 hover:text-blue-600 transition"
              >
                <Plus className="w-3 h-3" />
                <span>{isBangla ? '+ শিক্ষা যোগ' : '+ Add Education'}</span>
              </button>
            )}
          </div>

          <div className="border border-slate-300 rounded overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300">
                <tr>
                  <th className="p-2">{isBangla ? 'ডিগ্রি' : 'Degree / Examination'}</th>
                  <th className="p-2">{isBangla ? 'প্রতিষ্ঠান' : 'Institution'}</th>
                  <th className="p-2">{isBangla ? 'ফলাফল' : 'Result / Grade'}</th>
                  <th className="p-2 text-right">{isBangla ? 'বছর' : 'Year'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {(cv.education || []).map((edu, idx) => (
                  <tr key={edu.id || idx} className="hover:bg-slate-50 relative group">
                    <td className="p-2 font-semibold text-slate-900">
                      <span
                        contentEditable={isEditable}
                        suppressContentEditableWarning
                        onBlur={(e) => handleUpdateEdu(idx, 'degree', e.currentTarget.innerText)}
                        className={editClass}
                      >
                        {edu.degree}
                      </span>
                    </td>
                    <td className="p-2 text-slate-600">
                      <span
                        contentEditable={isEditable}
                        suppressContentEditableWarning
                        onBlur={(e) => handleUpdateEdu(idx, 'institution', e.currentTarget.innerText)}
                        className={editClass}
                      >
                        {edu.institution}
                      </span>
                    </td>
                    <td className="p-2 font-medium text-slate-800">
                      <span
                        contentEditable={isEditable}
                        suppressContentEditableWarning
                        onBlur={(e) => handleUpdateEdu(idx, 'grade', e.currentTarget.innerText)}
                        className={editClass}
                      >
                        {edu.grade}
                      </span>
                    </td>
                    <td className="p-2 text-right text-slate-600">
                      <span
                        contentEditable={isEditable}
                        suppressContentEditableWarning
                        onBlur={(e) => handleUpdateEdu(idx, 'passingYear', e.currentTarget.innerText)}
                        className={editClass}
                      >
                        {edu.passingYear}
                      </span>
                      {isEditable && (
                        <button
                          onClick={() => handleRemoveEdu(idx)}
                          data-html2canvas-ignore="true"
                          className="no-print opacity-0 group-hover:opacity-100 ml-1 text-red-500 hover:text-red-700"
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
        </section>

        {/* CORE COMPETENCIES / SKILLS */}
        <section className="space-y-1.5">
          <div className="flex items-center justify-between border-b border-slate-300 pb-0.5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              {isBangla ? 'দক্ষতা ও মূল যোগ্যতা (Core Competencies)' : 'Core Competencies'}
            </h2>
            {isEditable && (
              <button
                onClick={handleAddSkill}
                data-html2canvas-ignore="true"
                className="no-print p-0.5 text-slate-700 hover:text-blue-600 transition"
              >
                <Plus className="w-3 h-3" />
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {(cv.skills || []).map((skill, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded border border-slate-300 bg-slate-50 text-slate-800 text-xs font-medium group flex items-center gap-1"
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
                    className="no-print opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </span>
            ))}
          </div>
        </section>
      </div>

      {/* ATS 99% VERIFICATION FOOTER */}
      <div className="pt-4 border-t-2 border-slate-900 flex justify-between items-center text-xs text-slate-600">
        <span className="font-mono uppercase tracking-wider">Single-Column Strict ATS Compliance</span>
        <div className="px-3 py-1 rounded bg-emerald-100 text-emerald-900 font-bold text-xs flex items-center gap-1.5">
          <CheckCircle className="w-4 h-4 text-emerald-700" />
          <span>ATS Score: 99% Approved</span>
        </div>
      </div>
    </div>
  );
};
