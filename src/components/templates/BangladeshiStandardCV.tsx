import React, { useRef } from 'react';
import { CVData, Language, EducationItem } from '../../types';
import { Camera, Plus, Trash2 } from 'lucide-react';

interface BangladeshiStandardCVProps {
  cv: CVData;
  setCV: React.Dispatch<React.SetStateAction<CVData>>;
  language: Language;
  pageNum: number;
  onOpenAvatarPicker?: () => void;
}

export const BangladeshiStandardCV: React.FC<BangladeshiStandardCVProps> = ({
  cv,
  setCV,
  pageNum,
  onOpenAvatarPicker,
}) => {
  const photoInputRef = useRef<HTMLInputElement>(null);

  // Field update helpers
  const handleUpdate = (field: keyof CVData, value: any) => {
    setCV((prev) => ({
      ...prev,
      [field]: value,
      lastModified: Date.now(),
    }));
  };

  const handleUpdatePersonalInfo = (field: string, value: string) => {
    setCV((prev) => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value,
      },
      lastModified: Date.now(),
    }));
  };

  const handleUpdateEducation = (index: number, field: keyof EducationItem, value: string) => {
    setCV((prev) => {
      const nextEdu = [...prev.education];
      if (nextEdu[index]) {
        nextEdu[index] = { ...nextEdu[index], [field]: value };
      }
      return { ...prev, education: nextEdu, lastModified: Date.now() };
    });
  };

  const handleAddEducation = () => {
    setCV((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        {
          id: 'edu-' + Date.now(),
          degree: 'Degree Title / Examination Name',
          institution: 'Institution / College Name',
          boardOrUniversity: 'Board / University',
          subject: 'Major / Group',
          cgpaOrGpa: 'Result / GPA',
          passingYear: '2024',
        },
      ],
      lastModified: Date.now(),
    }));
  };

  const handleRemoveEducation = (index: number) => {
    setCV((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
      lastModified: Date.now(),
    }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        handleUpdate('photoUrl', reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Section Header Component styled with dark grey/silver shaded bar and black borders
  const ShadedSectionHeader = ({ title }: { title: string }) => (
    <div className="bg-[#B8B8B8] border border-black px-2.5 py-0.5 my-2.5 shadow-2xs">
      <h2 className="text-[13px] font-bold text-black uppercase tracking-wider font-serif">
        {title}
      </h2>
    </div>
  );

  // PAGE 1 CONTENT
  if (pageNum === 1) {
    return (
      <div className="p-8 sm:p-10 font-serif text-[#111111] leading-relaxed flex flex-col justify-between h-full bg-white">
        <div>
          {/* Top Centered Header: Resume of [FULL NAME] */}
          <div className="text-center mb-3">
            <p className="text-[14px] text-black font-serif italic mb-0.5">Resume of</p>
            <h1
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => handleUpdate('fullName', e.currentTarget.textContent || '')}
              className="text-[22px] font-extrabold tracking-wide uppercase text-black font-serif outline-none border-b border-transparent hover:border-blue-400 focus:border-blue-600 inline-block px-2"
            >
              {cv.fullName || 'HABIBUR RAHMAN'}
            </h1>
          </div>

          {/* Centered Passport Photo with Solid Black Border */}
          <div className="flex justify-center mb-4 relative">
            <input
              type="file"
              ref={photoInputRef}
              onChange={handlePhotoUpload}
              accept="image/*"
              className="hidden"
            />
            <div
              onClick={() => (onOpenAvatarPicker ? onOpenAvatarPicker() : photoInputRef.current?.click())}
              className="relative group cursor-pointer border border-black bg-white p-0.5 shadow-xs"
              style={{ width: '130px', height: '160px' }}
              title="Click to choose avatar or photo"
            >
              {cv.photoUrl ? (
                <img
                  src={cv.photoUrl}
                  alt={cv.fullName}
                  className="w-full h-full object-cover object-top"
                  crossOrigin="anonymous"
                />
              ) : (
                <div className="w-full h-full bg-slate-100 flex flex-col items-center justify-center text-slate-400">
                  <Camera className="w-8 h-8 mb-1" />
                  <span className="text-[10px]">Photo / Avatar</span>
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[11px] font-medium no-print">
                <Camera className="w-4 h-4 mr-1" /> Change
              </div>
            </div>
          </div>

          {/* Contact Details (Left aligned) */}
          <div className="text-[12px] leading-snug space-y-0.5 mb-3 font-serif">
            <p
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => handleUpdate('fullName', e.currentTarget.textContent || '')}
              className="font-bold text-[13px] outline-none hover:bg-blue-50/50"
            >
              {cv.fullName || 'Habibur Rahman'}
            </p>
            <div
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => handleUpdate('address', e.currentTarget.textContent || '')}
              className="outline-none hover:bg-blue-50/50 whitespace-pre-line"
            >
              {cv.address || 'North Hashimpur Syedabad,\nGachbaria (4381) Chandanish,Chattogram.'}
            </div>
            <p className="flex items-center gap-1">
              <span>Phone No. : </span>
              <span
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => handleUpdate('phone', e.currentTarget.textContent || '')}
                className="outline-none hover:bg-blue-50/50 font-sans"
              >
                {cv.phone || '01868461577'}
              </span>
            </p>
            <p className="flex items-center gap-1">
              <span>E-mail: </span>
              <span
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => handleUpdate('email', e.currentTarget.textContent || '')}
                className="outline-none hover:bg-blue-50/50 text-blue-900 font-sans"
              >
                {cv.email || 'mshabib471@gmail.com'}
              </span>
            </p>
          </div>

          {/* 1. CAREER OBJECTIVE */}
          <ShadedSectionHeader title="CAREER OBJECTIVE" />
          <p
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => handleUpdate('careerObjective', e.currentTarget.textContent || '')}
            className="text-[11.5px] leading-relaxed text-justify outline-none hover:bg-blue-50/50 px-0.5"
          >
            {cv.careerObjective ||
              'To pursue a challenging career at top-level management and utilize my skills and experiences to make extensive contribution to company’s long-term goal and to obtain a position in an organization where there is an opportunity to work in an environment of excellence and passion and where honesty, commitment, hard work and performances are the key factors of career development.'}
          </p>

          {/* 2. INTERPERSONAL SKILLS */}
          <ShadedSectionHeader title="INTERPERSONAL SKILLS" />
          <ul className="text-[11.5px] leading-relaxed space-y-1 pl-3 font-serif">
            {(cv.interpersonalSkills && cv.interpersonalSkills.length > 0
              ? cv.interpersonalSkills
              : [
                  'Ability to work in a group.',
                  'Ability to work under challenging, stressed conditions and long hours always approachable to suggestion, advice and guidance.',
                  'Quick adjustment with surrounding and competent to cope with the sudden change of environment.',
                  'Willing to learn and open to new ideas.',
                  'Ability to handle multiple tasks and work under pressure.',
                ]
            ).map((skill, sIdx) => (
              <li key={sIdx} className="flex items-start gap-2">
                <span className="text-[12px] font-bold mt-[-1px]">•</span>
                <span
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => {
                    const next = [...(cv.interpersonalSkills || [])];
                    next[sIdx] = e.currentTarget.textContent || '';
                    handleUpdate('interpersonalSkills', next);
                  }}
                  className="flex-1 outline-none hover:bg-blue-50/50"
                >
                  {skill}
                </span>
              </li>
            ))}
          </ul>

          {/* 3. SCHOLASTIC PORTFOLIO (First 2 degrees on Page 1) */}
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <ShadedSectionHeader title="SCHOLASTIC PORTFOLIO" />
            </div>
            <button
              onClick={handleAddEducation}
              className="no-print ml-2 text-[11px] text-blue-600 hover:text-blue-800 flex items-center gap-0.5"
            >
              <Plus className="w-3 h-3" /> Add Exam
            </button>
          </div>

          <div className="space-y-3 font-serif text-[11.5px]">
            {cv.education.slice(0, 2).map((edu, idx) => (
              <div key={edu.id || idx} className="pl-2 relative group">
                <div className="flex items-start gap-1.5 font-bold mb-1">
                  <span className="text-[13px]">•</span>
                  <span
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) =>
                      handleUpdateEducation(idx, 'degree', e.currentTarget.textContent || '')
                    }
                    className="outline-none hover:bg-blue-50/50 flex-1"
                  >
                    {edu.degree}
                  </span>
                  <button
                    onClick={() => handleRemoveEducation(idx)}
                    className="no-print opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>

                <div className="pl-4 space-y-0.5 text-[11.5px]">
                  <div className="grid grid-cols-[130px_15px_1fr] items-center">
                    <span>Institution</span>
                    <span>:</span>
                    <span
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) =>
                        handleUpdateEducation(idx, 'institution', e.currentTarget.textContent || '')
                      }
                      className="outline-none hover:bg-blue-50/50"
                    >
                      {edu.institution}
                    </span>
                  </div>

                  <div className="grid grid-cols-[130px_15px_1fr] items-center">
                    <span>Board/University</span>
                    <span>:</span>
                    <span
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) =>
                        handleUpdateEducation(
                          idx,
                          'boardOrUniversity',
                          e.currentTarget.textContent || ''
                        )
                      }
                      className="outline-none hover:bg-blue-50/50"
                    >
                      {edu.boardOrUniversity || 'National University'}
                    </span>
                  </div>

                  {edu.subject && (
                    <div className="grid grid-cols-[130px_15px_1fr] items-center">
                      <span>Subject / Group</span>
                      <span>:</span>
                      <span
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) =>
                          handleUpdateEducation(idx, 'subject', e.currentTarget.textContent || '')
                        }
                        className="outline-none hover:bg-blue-50/50"
                      >
                        {edu.subject}
                      </span>
                    </div>
                  )}

                  <div className="grid grid-cols-[130px_15px_1fr] items-center">
                    <span>CGPA / GPA</span>
                    <span>:</span>
                    <span
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) =>
                        handleUpdateEducation(idx, 'cgpaOrGpa', e.currentTarget.textContent || '')
                      }
                      className="outline-none hover:bg-blue-50/50 font-sans"
                    >
                      {edu.cgpaOrGpa || 'Running'}
                    </span>
                  </div>

                  <div className="grid grid-cols-[130px_15px_1fr] items-center">
                    <span>Passing Year</span>
                    <span>:</span>
                    <span
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) =>
                        handleUpdateEducation(idx, 'passingYear', e.currentTarget.textContent || '')
                      }
                      className="outline-none hover:bg-blue-50/50 font-sans"
                    >
                      {edu.passingYear || '-'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Page 1 Bottom Indicator */}
        <div className="text-right text-[10px] text-slate-400 font-sans mt-4 pt-2 border-t border-slate-100">
          Page 1 of 2
        </div>
      </div>
    );
  }

  // PAGE 2 CONTENT
  return (
    <div className="p-8 sm:p-10 font-serif text-[#111111] leading-relaxed flex flex-col justify-between h-full bg-white">
      <div>
        {/* Continuation of SCHOLASTIC PORTFOLIO (Remaining Degrees e.g. S.S.C) */}
        {cv.education.length > 2 && (
          <div className="space-y-3 font-serif text-[11.5px] mb-4">
            {cv.education.slice(2).map((edu, idx) => {
              const actualIdx = idx + 2;
              return (
                <div key={edu.id || actualIdx} className="pl-2 relative group">
                  <div className="flex items-start gap-1.5 font-bold mb-1">
                    <span className="text-[13px]">•</span>
                    <span
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) =>
                        handleUpdateEducation(actualIdx, 'degree', e.currentTarget.textContent || '')
                      }
                      className="outline-none hover:bg-blue-50/50 flex-1"
                    >
                      {edu.degree}
                    </span>
                    <button
                      onClick={() => handleRemoveEducation(actualIdx)}
                      className="no-print opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="pl-4 space-y-0.5 text-[11.5px]">
                    <div className="grid grid-cols-[130px_15px_1fr] items-center">
                      <span>Institution</span>
                      <span>:</span>
                      <span
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) =>
                          handleUpdateEducation(
                            actualIdx,
                            'institution',
                            e.currentTarget.textContent || ''
                          )
                        }
                        className="outline-none hover:bg-blue-50/50"
                      >
                        {edu.institution}
                      </span>
                    </div>

                    <div className="grid grid-cols-[130px_15px_1fr] items-center">
                      <span>Board</span>
                      <span>:</span>
                      <span
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) =>
                          handleUpdateEducation(
                            actualIdx,
                            'boardOrUniversity',
                            e.currentTarget.textContent || ''
                          )
                        }
                        className="outline-none hover:bg-blue-50/50"
                      >
                        {edu.boardOrUniversity || 'Chattogram'}
                      </span>
                    </div>

                    {edu.subject && (
                      <div className="grid grid-cols-[130px_15px_1fr] items-center">
                        <span>Group / Subject</span>
                        <span>:</span>
                        <span
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={(e) =>
                            handleUpdateEducation(
                              actualIdx,
                              'subject',
                              e.currentTarget.textContent || ''
                            )
                          }
                          className="outline-none hover:bg-blue-50/50"
                        >
                          {edu.subject}
                        </span>
                      </div>
                    )}

                    <div className="grid grid-cols-[130px_15px_1fr] items-center">
                      <span>GPA</span>
                      <span>:</span>
                      <span
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) =>
                          handleUpdateEducation(
                            actualIdx,
                            'cgpaOrGpa',
                            e.currentTarget.textContent || ''
                          )
                        }
                        className="outline-none hover:bg-blue-50/50 font-sans"
                      >
                        {edu.cgpaOrGpa || '3.06(Out of 5.00 scales)'}
                      </span>
                    </div>

                    <div className="grid grid-cols-[130px_15px_1fr] items-center">
                      <span>Passing Year</span>
                      <span>:</span>
                      <span
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) =>
                          handleUpdateEducation(
                            actualIdx,
                            'passingYear',
                            e.currentTarget.textContent || ''
                          )
                        }
                        className="outline-none hover:bg-blue-50/50 font-sans"
                      >
                        {edu.passingYear || '2021.'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 4. COMPUTER SKILLS */}
        <ShadedSectionHeader title="COMPUTER SKILLS" />
        <div className="space-y-1 font-serif text-[11.5px] pl-3">
          {(cv.computerSkills && cv.computerSkills.length > 0
            ? cv.computerSkills
            : [
                'Operating System : Windows , 2007,2008,2010, XP',
                'Application packages : MS Word, MS Excel, MS Power Point.',
                'Internet : Internet Browsing, E-Mail Writing, Social media.',
              ]
          ).map((item, cIdx) => (
            <div key={cIdx} className="flex items-start gap-2">
              <span className="text-[12px] font-bold mt-[-1px]">•</span>
              <span
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => {
                  const next = [...(cv.computerSkills || [])];
                  next[cIdx] = e.currentTarget.textContent || '';
                  handleUpdate('computerSkills', next);
                }}
                className="flex-1 outline-none hover:bg-blue-50/50"
              >
                {item}
              </span>
            </div>
          ))}
        </div>

        {/* 5. JOB EXPERIENCE */}
        <ShadedSectionHeader title="Job Experience" />
        <div className="space-y-1 font-serif text-[11.5px] pl-3">
          {cv.experience && cv.experience.length > 0 ? (
            cv.experience.map((exp, eIdx) => (
              <div key={exp.id || eIdx} className="flex items-start gap-2">
                <span className="text-[12px] font-bold mt-[-1px]">•</span>
                <span
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => {
                    const next = [...cv.experience];
                    next[eIdx] = { ...next[eIdx], responsibilities: e.currentTarget.textContent || '' };
                    handleUpdate('experience', next);
                  }}
                  className="flex-1 outline-none hover:bg-blue-50/50"
                >
                  {exp.responsibilities ||
                    `${exp.position || 'Mobile repair'} - ${exp.company || 'Chattogram'}`}
                </span>
              </div>
            ))
          ) : (
            <div className="flex items-start gap-2">
              <span className="text-[12px] font-bold mt-[-1px]">•</span>
              <span
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) =>
                  handleUpdate('experience', [
                    {
                      id: 'exp-1',
                      company: 'Chattogram',
                      position: 'Technician',
                      startDate: '2018',
                      endDate: 'Present',
                      responsibilities: e.currentTarget.textContent || '',
                    },
                  ])
                }
                className="flex-1 outline-none hover:bg-blue-50/50"
              >
                Mobile phone repair in chattogram 6 year experience.
              </span>
            </div>
          )}
        </div>

        {/* 6. LANGUAGE PROFICIENCY */}
        <ShadedSectionHeader title="LANGUAGE PROFICIENCY" />
        <div className="space-y-1 font-serif text-[11.5px] pl-3">
          {(cv.languages && cv.languages.length > 0
            ? cv.languages
            : [
                'Bengali : Excellent listening, speaking, reading and Writing abilities.',
                'English : Fair listening, speaking, reading and Writing abilities.',
              ]
          ).map((lang, lIdx) => (
            <div key={lIdx} className="flex items-start gap-2">
              <span className="text-[12px] font-bold mt-[-1px]">•</span>
              <span
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => {
                  const next = [...(cv.languages || [])];
                  next[lIdx] = e.currentTarget.textContent || '';
                  handleUpdate('languages', next);
                }}
                className="flex-1 outline-none hover:bg-blue-50/50"
              >
                {lang}
              </span>
            </div>
          ))}
        </div>

        {/* 7. PERSONAL INFORMATION */}
        <ShadedSectionHeader title="PERSONAL INFORMATION" />
        <div className="pl-3 font-serif text-[11.5px] space-y-1">
          <div className="grid grid-cols-[140px_15px_1fr] items-start">
            <span>Father’s Name</span>
            <span>:</span>
            <span
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => handleUpdatePersonalInfo('fatherName', e.currentTarget.textContent || '')}
              className="outline-none hover:bg-blue-50/50"
            >
              {cv.personalInfo?.fatherName || 'Abul Khalam'}
            </span>
          </div>

          <div className="grid grid-cols-[140px_15px_1fr] items-start">
            <span>Mother’s Name</span>
            <span>:</span>
            <span
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => handleUpdatePersonalInfo('motherName', e.currentTarget.textContent || '')}
              className="outline-none hover:bg-blue-50/50"
            >
              {cv.personalInfo?.motherName || 'Johora Khatun'}
            </span>
          </div>

          <div className="grid grid-cols-[140px_15px_1fr] items-start">
            <span>Date of Birth</span>
            <span>:</span>
            <span
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => handleUpdatePersonalInfo('dateOfBirth', e.currentTarget.textContent || '')}
              className="outline-none hover:bg-blue-50/50 font-sans"
            >
              {cv.personalInfo?.dateOfBirth || '23th February 2005'}
            </span>
          </div>

          <div className="grid grid-cols-[140px_15px_1fr] items-start">
            <span>Present Address</span>
            <span>:</span>
            <span
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => handleUpdatePersonalInfo('presentAddress', e.currentTarget.textContent || '')}
              className="outline-none hover:bg-blue-50/50 whitespace-pre-line"
            >
              {cv.personalInfo?.presentAddress ||
                'North Hashimpur Syedabad,\n Gachbaria (4381) Chandanish,Chattogram.'}
            </span>
          </div>

          <div className="grid grid-cols-[140px_15px_1fr] items-start">
            <span>Permanent Address</span>
            <span>:</span>
            <span
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => handleUpdatePersonalInfo('permanentAddress', e.currentTarget.textContent || '')}
              className="outline-none hover:bg-blue-50/50"
            >
              {cv.personalInfo?.permanentAddress || 'Do.'}
            </span>
          </div>

          <div className="grid grid-cols-[140px_15px_1fr] items-start">
            <span>Nationality</span>
            <span>:</span>
            <span
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => handleUpdatePersonalInfo('nationality', e.currentTarget.textContent || '')}
              className="outline-none hover:bg-blue-50/50"
            >
              {cv.personalInfo?.nationality || 'Bangladeshi.'}
            </span>
          </div>

          <div className="grid grid-cols-[140px_15px_1fr] items-start">
            <span>Religion</span>
            <span>:</span>
            <span
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => handleUpdatePersonalInfo('religion', e.currentTarget.textContent || '')}
              className="outline-none hover:bg-blue-50/50"
            >
              {cv.personalInfo?.religion || 'Islam.'}
            </span>
          </div>

          <div className="grid grid-cols-[140px_15px_1fr] items-start">
            <span>Marital Status</span>
            <span>:</span>
            <span
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => handleUpdatePersonalInfo('maritalStatus', e.currentTarget.textContent || '')}
              className="outline-none hover:bg-blue-50/50"
            >
              {cv.personalInfo?.maritalStatus || 'Unmarried.'}
            </span>
          </div>

          <div className="grid grid-cols-[140px_15px_1fr] items-start">
            <span>Blood Group</span>
            <span>:</span>
            <span
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => handleUpdatePersonalInfo('bloodGroup', e.currentTarget.textContent || '')}
              className="outline-none hover:bg-blue-50/50 font-sans"
            >
              {cv.personalInfo?.bloodGroup || 'B+'}
            </span>
          </div>
        </div>

        {/* Signature Area (Bottom of Page 2) */}
        <div className="mt-12 pl-3">
          <p
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => handleUpdate('signatureText', e.currentTarget.textContent || '')}
            className="text-[20px] text-slate-800 font-serif italic outline-none hover:bg-blue-50/50 font-['Dancing_Script',cursive,'Brush_Script_MT']"
            style={{ fontFamily: "'Brush Script MT', 'Dancing Script', cursive" }}
          >
            {cv.signatureText || cv.fullName || 'Habibur Rahman'}
          </p>
          <p
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => handleUpdate('fullName', e.currentTarget.textContent || '')}
            className="font-bold text-[13px] text-black font-serif mt-1 outline-none hover:bg-blue-50/50"
          >
            {cv.fullName || 'Habibur Rahman'}
          </p>
        </div>
      </div>

      {/* Page 2 Bottom Indicator */}
      <div className="text-right text-[10px] text-slate-400 font-sans mt-4 pt-2 border-t border-slate-100">
        Page 2 of 2
      </div>
    </div>
  );
};
