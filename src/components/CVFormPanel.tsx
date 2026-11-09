import React, { useState } from 'react';
import {
  User,
  GraduationCap,
  Briefcase,
  Wrench,
  Languages,
  FileCheck,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  MoveUp,
  MoveDown,
  Eye,
  EyeOff,
  Sparkles,
} from 'lucide-react';
import { CVData, EducationItem, ExperienceItem, ReferenceItem } from '../types';
import { useTranslation } from '../lib/i18n';

interface CVFormPanelProps {
  cv: CVData;
  onUpdateCV: (updated: Partial<CVData>) => void;
}

export const CVFormPanel: React.FC<CVFormPanelProps> = ({ cv, onUpdateCV }) => {
  const t = useTranslation(cv.language);
  const [openSection, setOpenSection] = useState<string>('personal');
  const [skillInput, setSkillInput] = useState('');
  const [compSkillInput, setCompSkillInput] = useState('');
  const [langInput, setLangInput] = useState('');

  const toggleSection = (sec: string) => {
    setOpenSection(openSection === sec ? '' : sec);
  };

  // Image Upload handler
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      alert('Photo size should be less than 3MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      onUpdateCV({ photoUrl: event.target?.result as string });
    };
    reader.readAsDataURL(file);
  };

  // Education Helpers
  const addEducation = () => {
    const newItem: EducationItem = {
      id: 'edu-' + Date.now(),
      degree: 'Degree / Examination',
      institution: 'University / Board Name',
      boardOrUniversity: 'Board / Division',
      subject: 'Major / Group',
      cgpaOrGpa: '3.75 / 4.00',
      passingYear: '2024',
    };
    onUpdateCV({ education: [...(cv.education || []), newItem] });
  };

  const updateEducation = (id: string, field: keyof EducationItem, val: string) => {
    const updated = cv.education.map((item) =>
      item.id === id ? { ...item, [field]: val } : item
    );
    onUpdateCV({ education: updated });
  };

  const removeEducation = (id: string) => {
    onUpdateCV({ education: cv.education.filter((item) => item.id !== id) });
  };

  // Experience Helpers
  const addExperience = () => {
    const newItem: ExperienceItem = {
      id: 'exp-' + Date.now(),
      company: 'Company Name Ltd.',
      position: 'Job Title / Position',
      startDate: 'Jan 2023',
      endDate: 'Present',
      responsibilities: 'Describe key achievements, duties, and project contributions.',
    };
    onUpdateCV({ experience: [...(cv.experience || []), newItem] });
  };

  const updateExperience = (id: string, field: keyof ExperienceItem, val: string) => {
    const updated = cv.experience.map((item) =>
      item.id === id ? { ...item, [field]: val } : item
    );
    onUpdateCV({ experience: updated });
  };

  const removeExperience = (id: string) => {
    onUpdateCV({ experience: cv.experience.filter((item) => item.id !== id) });
  };

  // References Helpers
  const addReference = () => {
    const newItem: ReferenceItem = {
      id: 'ref-' + Date.now(),
      name: 'Referee Full Name',
      designation: 'Senior Designation',
      organization: 'Organization / University',
      phone: '+880 1700-000000',
      email: 'referee@example.com',
    };
    onUpdateCV({ references: [...(cv.references || []), newItem] });
  };

  const updateReference = (id: string, field: keyof ReferenceItem, val: string) => {
    const updated = cv.references.map((item) =>
      item.id === id ? { ...item, [field]: val } : item
    );
    onUpdateCV({ references: updated });
  };

  const removeReference = (id: string) => {
    onUpdateCV({ references: cv.references.filter((item) => item.id !== id) });
  };

  // Skills Helpers
  const addSkill = (type: 'skills' | 'computerSkills' | 'languages') => {
    if (type === 'skills' && skillInput.trim()) {
      onUpdateCV({ skills: [...cv.skills, skillInput.trim()] });
      setSkillInput('');
    } else if (type === 'computerSkills' && compSkillInput.trim()) {
      onUpdateCV({ computerSkills: [...cv.computerSkills, compSkillInput.trim()] });
      setCompSkillInput('');
    } else if (type === 'languages' && langInput.trim()) {
      onUpdateCV({ languages: [...cv.languages, langInput.trim()] });
      setLangInput('');
    }
  };

  const removeSkill = (type: 'skills' | 'computerSkills' | 'languages', index: number) => {
    if (type === 'skills') {
      onUpdateCV({ skills: cv.skills.filter((_, i) => i !== index) });
    } else if (type === 'computerSkills') {
      onUpdateCV({ computerSkills: cv.computerSkills.filter((_, i) => i !== index) });
    } else if (type === 'languages') {
      onUpdateCV({ languages: cv.languages.filter((_, i) => i !== index) });
    }
  };

  return (
    <div className="space-y-3 text-xs">
      {/* 1. Personal & Contact Info Accordion */}
      <div className="bg-white/80 border border-slate-200/80 rounded-2xl overflow-hidden shadow-2xs">
        <button
          onClick={() => toggleSection('personal')}
          className="w-full p-3.5 flex items-center justify-between text-left font-bold text-slate-800 hover:bg-slate-50 transition"
        >
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-blue-600" />
            <span>{t.personalDetails}</span>
          </div>
          {openSection === 'personal' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {openSection === 'personal' && (
          <div className="p-4 pt-1 space-y-3 border-t border-slate-100">
            {/* Photo Upload & Frame */}
            <div className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-xl border border-slate-200/70">
              {cv.photoUrl ? (
                <img
                  src={cv.photoUrl}
                  alt="Profile"
                  className={`w-12 h-12 object-cover border ${
                    cv.photoShape === 'circle' ? 'rounded-full' : 'rounded-lg'
                  }`}
                />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-slate-200 flex items-center justify-center text-slate-400">
                  <ImageIcon className="w-6 h-6" />
                </div>
              )}
              <div className="flex-1">
                <label className="inline-block px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold cursor-pointer shadow-2xs transition">
                  Upload Photo
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                </label>
                {cv.photoUrl && (
                  <button
                    onClick={() => onUpdateCV({ photoUrl: '' })}
                    className="ml-2 text-[11px] text-red-500 hover:underline"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="font-semibold text-slate-600 block mb-1">{t.fullName}</label>
                <input
                  type="text"
                  value={cv.fullName}
                  onChange={(e) => onUpdateCV({ fullName: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-600 block mb-1">{t.jobTitle}</label>
                <input
                  type="text"
                  value={cv.professionalTitle}
                  onChange={(e) => onUpdateCV({ professionalTitle: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-600 block mb-1">{t.phone}</label>
                <input
                  type="text"
                  value={cv.phone}
                  onChange={(e) => onUpdateCV({ phone: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-600 block mb-1">{t.email}</label>
                <input
                  type="email"
                  value={cv.email}
                  onChange={(e) => onUpdateCV({ email: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="font-semibold text-slate-600 block mb-1">{t.address}</label>
                <input
                  type="text"
                  value={cv.address}
                  onChange={(e) => onUpdateCV({ address: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. Career Objective & Summary */}
      <div className="bg-white/80 border border-slate-200/80 rounded-2xl overflow-hidden shadow-2xs">
        <button
          onClick={() => toggleSection('objective')}
          className="w-full p-3.5 flex items-center justify-between text-left font-bold text-slate-800 hover:bg-slate-50 transition"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>{t.careerObjective} & {t.professionalSummary}</span>
          </div>
          {openSection === 'objective' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {openSection === 'objective' && (
          <div className="p-4 pt-1 space-y-3 border-t border-slate-100">
            <div>
              <label className="font-semibold text-slate-600 block mb-1">{t.careerObjective}</label>
              <textarea
                rows={3}
                value={cv.careerObjective}
                onChange={(e) => onUpdateCV({ careerObjective: e.target.value })}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-600 block mb-1">{t.professionalSummary}</label>
              <textarea
                rows={3}
                value={cv.professionalSummary}
                onChange={(e) => onUpdateCV({ professionalSummary: e.target.value })}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
              />
            </div>
          </div>
        )}
      </div>

      {/* 3. Job Experience */}
      <div className="bg-white/80 border border-slate-200/80 rounded-2xl overflow-hidden shadow-2xs">
        <button
          onClick={() => toggleSection('experience')}
          className="w-full p-3.5 flex items-center justify-between text-left font-bold text-slate-800 hover:bg-slate-50 transition"
        >
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-blue-600" />
            <span>{t.experience} ({cv.experience?.length || 0})</span>
          </div>
          {openSection === 'experience' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {openSection === 'experience' && (
          <div className="p-4 pt-1 space-y-3 border-t border-slate-100">
            {cv.experience?.map((exp, idx) => (
              <div key={exp.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 space-y-2 relative">
                <button
                  onClick={() => removeExperience(exp.id)}
                  className="absolute top-2.5 right-2.5 text-slate-400 hover:text-red-500"
                  title="Remove"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <div className="font-semibold text-slate-700">Role #{idx + 1}</div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    placeholder="Company Name"
                    value={exp.company}
                    onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                    className="px-2.5 py-1 rounded bg-white border border-slate-200 outline-none"
                  />
                  <input
                    placeholder="Position / Title"
                    value={exp.position}
                    onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                    className="px-2.5 py-1 rounded bg-white border border-slate-200 outline-none"
                  />
                  <input
                    placeholder="Start Date (e.g. Jan 2022)"
                    value={exp.startDate}
                    onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                    className="px-2.5 py-1 rounded bg-white border border-slate-200 outline-none"
                  />
                  <input
                    placeholder="End Date (e.g. Present)"
                    value={exp.endDate}
                    onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                    className="px-2.5 py-1 rounded bg-white border border-slate-200 outline-none"
                  />
                </div>
                <textarea
                  rows={2}
                  placeholder="Key accomplishments & responsibilities..."
                  value={exp.responsibilities}
                  onChange={(e) => updateExperience(exp.id, 'responsibilities', e.target.value)}
                  className="w-full px-2.5 py-1 rounded bg-white border border-slate-200 outline-none"
                />
              </div>
            ))}
            <button
              onClick={addExperience}
              className="w-full py-2 rounded-xl border border-dashed border-blue-400 text-blue-600 font-semibold hover:bg-blue-50 transition flex items-center justify-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t.addExperience}</span>
            </button>
          </div>
        )}
      </div>

      {/* 4. Scholastic Portfolio (Education) */}
      <div className="bg-white/80 border border-slate-200/80 rounded-2xl overflow-hidden shadow-2xs">
        <button
          onClick={() => toggleSection('education')}
          className="w-full p-3.5 flex items-center justify-between text-left font-bold text-slate-800 hover:bg-slate-50 transition"
        >
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-emerald-600" />
            <span>{t.education} ({cv.education?.length || 0})</span>
          </div>
          {openSection === 'education' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {openSection === 'education' && (
          <div className="p-4 pt-1 space-y-3 border-t border-slate-100">
            {cv.education?.map((edu, idx) => (
              <div key={edu.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 space-y-2 relative">
                <button
                  onClick={() => removeEducation(edu.id)}
                  className="absolute top-2.5 right-2.5 text-slate-400 hover:text-red-500"
                  title="Remove"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <div className="font-semibold text-slate-700">Degree #{idx + 1}</div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    placeholder="Degree Name (e.g. B.Sc in CSE)"
                    value={edu.degree}
                    onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                    className="px-2.5 py-1 rounded bg-white border border-slate-200 outline-none"
                  />
                  <input
                    placeholder="Institution / College"
                    value={edu.institution}
                    onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                    className="px-2.5 py-1 rounded bg-white border border-slate-200 outline-none"
                  />
                  <input
                    placeholder="Subject / Discipline"
                    value={edu.subject}
                    onChange={(e) => updateEducation(edu.id, 'subject', e.target.value)}
                    className="px-2.5 py-1 rounded bg-white border border-slate-200 outline-none"
                  />
                  <input
                    placeholder="Result (e.g. 3.85 / 4.00)"
                    value={edu.cgpaOrGpa}
                    onChange={(e) => updateEducation(edu.id, 'cgpaOrGpa', e.target.value)}
                    className="px-2.5 py-1 rounded bg-white border border-slate-200 outline-none"
                  />
                  <input
                    placeholder="Passing Year"
                    value={edu.passingYear}
                    onChange={(e) => updateEducation(edu.id, 'passingYear', e.target.value)}
                    className="px-2.5 py-1 rounded bg-white border border-slate-200 outline-none col-span-2"
                  />
                </div>
              </div>
            ))}
            <button
              onClick={addEducation}
              className="w-full py-2 rounded-xl border border-dashed border-emerald-400 text-emerald-600 font-semibold hover:bg-emerald-50 transition flex items-center justify-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t.addEducation}</span>
            </button>
          </div>
        )}
      </div>

      {/* 5. Skills & Computer Competencies */}
      <div className="bg-white/80 border border-slate-200/80 rounded-2xl overflow-hidden shadow-2xs">
        <button
          onClick={() => toggleSection('skills')}
          className="w-full p-3.5 flex items-center justify-between text-left font-bold text-slate-800 hover:bg-slate-50 transition"
        >
          <div className="flex items-center gap-2">
            <Wrench className="w-4 h-4 text-purple-600" />
            <span>{t.skills} & IT Competencies</span>
          </div>
          {openSection === 'skills' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {openSection === 'skills' && (
          <div className="p-4 pt-1 space-y-3 border-t border-slate-100">
            {/* Core Skills */}
            <div>
              <label className="font-semibold text-slate-600 block mb-1">{t.skills}</label>
              <div className="flex gap-1.5 mb-2">
                <input
                  type="text"
                  placeholder="e.g. System Architecture"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addSkill('skills')}
                  className="flex-1 px-2.5 py-1 rounded border border-slate-200 outline-none"
                />
                <button
                  onClick={() => addSkill('skills')}
                  className="px-3 py-1 bg-purple-600 text-white font-semibold rounded hover:bg-purple-700"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {cv.skills?.map((s, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200 text-[11px]"
                  >
                    {s}
                    <button onClick={() => removeSkill('skills', idx)} className="hover:text-red-500">
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Computer Skills */}
            <div className="pt-2 border-t border-slate-100">
              <label className="font-semibold text-slate-600 block mb-1">{t.computerSkills}</label>
              <div className="flex gap-1.5 mb-2">
                <input
                  type="text"
                  placeholder="e.g. React, Python, MS Office"
                  value={compSkillInput}
                  onChange={(e) => setCompSkillInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addSkill('computerSkills')}
                  className="flex-1 px-2.5 py-1 rounded border border-slate-200 outline-none"
                />
                <button
                  onClick={() => addSkill('computerSkills')}
                  className="px-3 py-1 bg-indigo-600 text-white font-semibold rounded hover:bg-indigo-700"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {cv.computerSkills?.map((s, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 text-[11px]"
                  >
                    {s}
                    <button onClick={() => removeSkill('computerSkills', idx)} className="hover:text-red-500">
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 6. Personal Info (Father, Mother, DOB, Blood Group, Marital Status) */}
      <div className="bg-white/80 border border-slate-200/80 rounded-2xl overflow-hidden shadow-2xs">
        <button
          onClick={() => toggleSection('personalInfo')}
          className="w-full p-3.5 flex items-center justify-between text-left font-bold text-slate-800 hover:bg-slate-50 transition"
        >
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-amber-600" />
            <span>{t.personalInfo}</span>
          </div>
          {openSection === 'personalInfo' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {openSection === 'personalInfo' && (
          <div className="p-4 pt-1 space-y-2.5 border-t border-slate-100">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-semibold text-slate-600 block mb-0.5">{t.fatherName}</label>
                <input
                  type="text"
                  value={cv.personalInfo?.fatherName || ''}
                  onChange={(e) =>
                    onUpdateCV({
                      personalInfo: { ...cv.personalInfo, fatherName: e.target.value },
                    })
                  }
                  className="w-full px-2.5 py-1 rounded border border-slate-200 outline-none"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-600 block mb-0.5">{t.motherName}</label>
                <input
                  type="text"
                  value={cv.personalInfo?.motherName || ''}
                  onChange={(e) =>
                    onUpdateCV({
                      personalInfo: { ...cv.personalInfo, motherName: e.target.value },
                    })
                  }
                  className="w-full px-2.5 py-1 rounded border border-slate-200 outline-none"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-600 block mb-0.5">{t.dob}</label>
                <input
                  type="text"
                  value={cv.personalInfo?.dateOfBirth || ''}
                  onChange={(e) =>
                    onUpdateCV({
                      personalInfo: { ...cv.personalInfo, dateOfBirth: e.target.value },
                    })
                  }
                  className="w-full px-2.5 py-1 rounded border border-slate-200 outline-none"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-600 block mb-0.5">{t.bloodGroup}</label>
                <input
                  type="text"
                  value={cv.personalInfo?.bloodGroup || ''}
                  onChange={(e) =>
                    onUpdateCV({
                      personalInfo: { ...cv.personalInfo, bloodGroup: e.target.value },
                    })
                  }
                  className="w-full px-2.5 py-1 rounded border border-slate-200 outline-none"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-600 block mb-0.5">{t.maritalStatus}</label>
                <input
                  type="text"
                  value={cv.personalInfo?.maritalStatus || ''}
                  onChange={(e) =>
                    onUpdateCV({
                      personalInfo: { ...cv.personalInfo, maritalStatus: e.target.value },
                    })
                  }
                  className="w-full px-2.5 py-1 rounded border border-slate-200 outline-none"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-600 block mb-0.5">{t.religion}</label>
                <input
                  type="text"
                  value={cv.personalInfo?.religion || ''}
                  onChange={(e) =>
                    onUpdateCV({
                      personalInfo: { ...cv.personalInfo, religion: e.target.value },
                    })
                  }
                  className="w-full px-2.5 py-1 rounded border border-slate-200 outline-none"
                />
              </div>
              <div className="col-span-2">
                <label className="font-semibold text-slate-600 block mb-0.5">{t.permanentAddress}</label>
                <input
                  type="text"
                  value={cv.personalInfo?.permanentAddress || ''}
                  onChange={(e) =>
                    onUpdateCV({
                      personalInfo: { ...cv.personalInfo, permanentAddress: e.target.value },
                    })
                  }
                  className="w-full px-2.5 py-1 rounded border border-slate-200 outline-none"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 7. References */}
      <div className="bg-white/80 border border-slate-200/80 rounded-2xl overflow-hidden shadow-2xs">
        <button
          onClick={() => toggleSection('references')}
          className="w-full p-3.5 flex items-center justify-between text-left font-bold text-slate-800 hover:bg-slate-50 transition"
        >
          <div className="flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-cyan-600" />
            <span>{t.references} ({cv.references?.length || 0})</span>
          </div>
          {openSection === 'references' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {openSection === 'references' && (
          <div className="p-4 pt-1 space-y-3 border-t border-slate-100">
            {cv.references?.map((ref, idx) => (
              <div key={ref.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 space-y-2 relative">
                <button
                  onClick={() => removeReference(ref.id)}
                  className="absolute top-2.5 right-2.5 text-slate-400 hover:text-red-500"
                  title="Remove"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <div className="font-semibold text-slate-700">Referee #{idx + 1}</div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    placeholder="Full Name"
                    value={ref.name}
                    onChange={(e) => updateReference(ref.id, 'name', e.target.value)}
                    className="px-2.5 py-1 rounded bg-white border border-slate-200 outline-none"
                  />
                  <input
                    placeholder="Designation"
                    value={ref.designation}
                    onChange={(e) => updateReference(ref.id, 'designation', e.target.value)}
                    className="px-2.5 py-1 rounded bg-white border border-slate-200 outline-none"
                  />
                  <input
                    placeholder="Organization"
                    value={ref.organization}
                    onChange={(e) => updateReference(ref.id, 'organization', e.target.value)}
                    className="px-2.5 py-1 rounded bg-white border border-slate-200 outline-none"
                  />
                  <input
                    placeholder="Phone / Mobile"
                    value={ref.phone}
                    onChange={(e) => updateReference(ref.id, 'phone', e.target.value)}
                    className="px-2.5 py-1 rounded bg-white border border-slate-200 outline-none"
                  />
                  <input
                    placeholder="Email"
                    value={ref.email}
                    onChange={(e) => updateReference(ref.id, 'email', e.target.value)}
                    className="px-2.5 py-1 rounded bg-white border border-slate-200 outline-none col-span-2"
                  />
                </div>
              </div>
            ))}
            <button
              onClick={addReference}
              className="w-full py-2 rounded-xl border border-dashed border-cyan-400 text-cyan-600 font-semibold hover:bg-cyan-50 transition flex items-center justify-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t.addReference}</span>
            </button>
          </div>
        )}
      </div>

      {/* 8. Declaration & Signature */}
      <div className="bg-white/80 border border-slate-200/80 rounded-2xl p-3.5 shadow-2xs space-y-2">
        <label className="font-bold text-slate-800 block">{t.declaration}</label>
        <textarea
          rows={2}
          value={cv.declaration}
          onChange={(e) => onUpdateCV({ declaration: e.target.value })}
          className="w-full px-2.5 py-1 rounded-lg border border-slate-200 outline-none"
        />
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="font-semibold text-slate-600 block mb-0.5">Signature Name</label>
            <input
              type="text"
              value={cv.signatureText}
              onChange={(e) => onUpdateCV({ signatureText: e.target.value })}
              className="w-full px-2.5 py-1 rounded border border-slate-200 outline-none"
            />
          </div>
          <div>
            <label className="font-semibold text-slate-600 block mb-0.5">Date</label>
            <input
              type="text"
              value={cv.signatureDate}
              onChange={(e) => onUpdateCV({ signatureDate: e.target.value })}
              className="w-full px-2.5 py-1 rounded border border-slate-200 outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
