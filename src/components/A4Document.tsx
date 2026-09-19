import React from 'react';
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
} from 'lucide-react';
import { CVData } from '../types';

interface A4DocumentProps {
  cv: CVData;
  scale?: number;
  onUpdateField?: (field: keyof CVData, value: any) => void;
  onUpdateNested?: (path: string, value: any) => void;
  isEditable?: boolean;
}

export const A4Document: React.FC<A4DocumentProps> = ({
  cv,
  scale = 1,
  onUpdateField,
  onUpdateNested,
  isEditable = true,
}) => {
  const { design } = cv;
  const primaryColor = design?.primaryColor || '#2563EB';
  const secondaryColor = design?.secondaryColor || '#4F46E5';
  const isBangla = cv.language === 'bn' || cv.design?.fontFamily === 'Noto Sans Bengali';

  // Helper to handle direct inline editing
  const handleBlur = (field: keyof CVData, e: React.FocusEvent<HTMLElement>) => {
    if (!isEditable || !onUpdateField) return;
    const text = e.currentTarget.innerText;
    onUpdateField(field, text);
  };

  const handleBlurNested = (path: string, e: React.FocusEvent<HTMLElement>) => {
    if (!isEditable || !onUpdateNested) return;
    const text = e.currentTarget.innerText;
    onUpdateNested(path, text);
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

  return (
    <div
      id="cv-printable-document-container"
      className="flex flex-col items-center gap-8 print:gap-0 printable-document-container transition-transform origin-top"
      style={{
        transform: `scale(${scale})`,
        transformOrigin: 'top center',
      }}
    >
      {pages.map((pageNum) => (
        <div
          key={pageNum}
          id={pageNum === 1 ? 'cv-printable-document' : `cv-printable-document-page-${pageNum}`}
          className={`a4-page shadow-2xl print:shadow-none mx-auto text-slate-800 ${fontClass} relative flex flex-col justify-between overflow-hidden`}
          style={{
            width: '210mm',
            minHeight: '297mm',
            backgroundColor: '#ffffff',
          }}
        >
          {/* Main Document Content */}
          <div className={`${marginClass} flex-1 flex flex-col`}>
            {/* Top Header - Rendered on Page 1 */}
            {pageNum === 1 && (
              <>
                {/* Template Specific Header Styles */}
                {cv.design.headerStyle === 'banner' ? (
                  <div
                    className="-mx-10 -mt-10 p-8 mb-6 text-white"
                    style={{ backgroundColor: primaryColor }}
                  >
                    <div className="flex items-center gap-6">
                      {cv.photoUrl && cv.photoShape !== 'none' && (
                        <img
                          src={cv.photoUrl}
                          alt={cv.fullName}
                          className={`w-24 h-24 object-cover border-4 border-white shadow-md ${
                            cv.photoShape === 'circle'
                              ? 'rounded-full'
                              : cv.photoShape === 'rounded'
                              ? 'rounded-2xl'
                              : 'rounded-none'
                          }`}
                        />
                      )}
                      <div>
                        <h1
                          contentEditable={isEditable}
                          suppressContentEditableWarning
                          onBlur={(e) => handleBlur('fullName', e)}
                          className="text-3xl font-extrabold tracking-tight outline-none"
                        >
                          {cv.fullName || 'John Doe'}
                        </h1>
                        <p
                          contentEditable={isEditable}
                          suppressContentEditableWarning
                          onBlur={(e) => handleBlur('professionalTitle', e)}
                          className="text-base font-medium opacity-90 outline-none mt-1"
                        >
                          {cv.professionalTitle || 'Software Engineer'}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : cv.design.headerStyle === 'sidebar' ? (
                  <div className="border-b-2 pb-5 mb-6" style={{ borderColor: primaryColor }}>
                    <div className="flex items-start justify-between">
                      <div>
                        <h1
                          contentEditable={isEditable}
                          suppressContentEditableWarning
                          onBlur={(e) => handleBlur('fullName', e)}
                          className="text-3xl font-bold tracking-tight outline-none"
                          style={{ color: primaryColor }}
                        >
                          {cv.fullName || 'John Doe'}
                        </h1>
                        <p
                          contentEditable={isEditable}
                          suppressContentEditableWarning
                          onBlur={(e) => handleBlur('professionalTitle', e)}
                          className="text-base font-medium text-slate-600 outline-none mt-0.5"
                        >
                          {cv.professionalTitle || 'Software Engineer'}
                        </p>
                      </div>
                      {cv.photoUrl && cv.photoShape !== 'none' && (
                        <img
                          src={cv.photoUrl}
                          alt={cv.fullName}
                          className={`w-20 h-20 object-cover border-2 border-slate-200 shadow-sm ${
                            cv.photoShape === 'circle'
                              ? 'rounded-full'
                              : cv.photoShape === 'rounded'
                              ? 'rounded-xl'
                              : 'rounded-none'
                          }`}
                        />
                      )}
                    </div>
                  </div>
                ) : (
                  // Default Modern Header
                  <div className="border-b pb-5 mb-6 border-slate-200">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h1
                          contentEditable={isEditable}
                          suppressContentEditableWarning
                          onBlur={(e) => handleBlur('fullName', e)}
                          className="text-3xl font-bold tracking-tight text-slate-900 outline-none"
                        >
                          {cv.fullName || 'John Doe'}
                        </h1>
                        <p
                          contentEditable={isEditable}
                          suppressContentEditableWarning
                          onBlur={(e) => handleBlur('professionalTitle', e)}
                          className="text-base font-semibold outline-none mt-1"
                          style={{ color: primaryColor }}
                        >
                          {cv.professionalTitle || 'Senior Software Engineer'}
                        </p>

                        {/* Contact info bar */}
                        <div className="flex flex-wrap items-center gap-y-1.5 gap-x-4 mt-3 text-xs text-slate-600">
                          {cv.phone && (
                            <div className="flex items-center gap-1.5">
                              <Phone className="w-3.5 h-3.5 text-slate-400" />
                              <span
                                contentEditable={isEditable}
                                suppressContentEditableWarning
                                onBlur={(e) => handleBlur('phone', e)}
                                className="outline-none"
                              >
                                {cv.phone}
                              </span>
                            </div>
                          )}
                          {cv.email && (
                            <div className="flex items-center gap-1.5">
                              <Mail className="w-3.5 h-3.5 text-slate-400" />
                              <span
                                contentEditable={isEditable}
                                suppressContentEditableWarning
                                onBlur={(e) => handleBlur('email', e)}
                                className="outline-none"
                              >
                                {cv.email}
                              </span>
                            </div>
                          )}
                          {cv.address && (
                            <div className="flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-slate-400" />
                              <span
                                contentEditable={isEditable}
                                suppressContentEditableWarning
                                onBlur={(e) => handleBlur('address', e)}
                                className="outline-none"
                              >
                                {cv.address}
                              </span>
                            </div>
                          )}
                          {cv.linkedin && (
                            <div className="flex items-center gap-1.5">
                              <Linkedin className="w-3.5 h-3.5 text-slate-400" />
                              <span
                                contentEditable={isEditable}
                                suppressContentEditableWarning
                                onBlur={(e) => handleBlur('linkedin', e)}
                                className="outline-none"
                              >
                                {cv.linkedin}
                              </span>
                            </div>
                          )}
                          {cv.github && (
                            <div className="flex items-center gap-1.5">
                              <Github className="w-3.5 h-3.5 text-slate-400" />
                              <span
                                contentEditable={isEditable}
                                suppressContentEditableWarning
                                onBlur={(e) => handleBlur('github', e)}
                                className="outline-none"
                              >
                                {cv.github}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {cv.photoUrl && cv.photoShape !== 'none' && (
                        <div className="shrink-0">
                          <img
                            src={cv.photoUrl}
                            alt={cv.fullName}
                            className={`w-24 h-24 object-cover border-2 shadow-sm ${
                              cv.photoShape === 'circle'
                                ? 'rounded-full'
                                : cv.photoShape === 'rounded'
                                ? 'rounded-xl'
                                : 'rounded-none'
                            }`}
                            style={{ borderColor: primaryColor }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Document Body: Section Layouts */}
            <div className="space-y-5 text-sm">
              {/* Career Objective */}
              {cv.careerObjective && (
                <section className="space-y-1.5">
                  <h2
                    className="text-xs font-bold uppercase tracking-wider pb-1 border-b flex items-center gap-1.5"
                    style={{ color: primaryColor, borderColor: `${primaryColor}40` }}
                  >
                    <span>{isBangla ? 'ক্যারিয়ার উদ্দেশ্য' : 'Career Objective'}</span>
                  </h2>
                  <p
                    contentEditable={isEditable}
                    suppressContentEditableWarning
                    onBlur={(e) => handleBlur('careerObjective', e)}
                    className="text-xs leading-relaxed text-slate-700 outline-none text-justify"
                  >
                    {cv.careerObjective}
                  </p>
                </section>
              )}

              {/* Professional Summary */}
              {cv.professionalSummary && (
                <section className="space-y-1.5">
                  <h2
                    className="text-xs font-bold uppercase tracking-wider pb-1 border-b flex items-center gap-1.5"
                    style={{ color: primaryColor, borderColor: `${primaryColor}40` }}
                  >
                    <span>{isBangla ? 'পেশাগত সারসংক্ষেপ' : 'Professional Summary'}</span>
                  </h2>
                  <p
                    contentEditable={isEditable}
                    suppressContentEditableWarning
                    onBlur={(e) => handleBlur('professionalSummary', e)}
                    className="text-xs leading-relaxed text-slate-700 outline-none text-justify"
                  >
                    {cv.professionalSummary}
                  </p>
                </section>
              )}

              {/* Work Experience */}
              {cv.experience && cv.experience.length > 0 && (
                <section className="space-y-2.5">
                  <h2
                    className="text-xs font-bold uppercase tracking-wider pb-1 border-b"
                    style={{ color: primaryColor, borderColor: `${primaryColor}40` }}
                  >
                    {isBangla ? 'কাজের অভিজ্ঞতা (Job Experience)' : 'Job Experience'}
                  </h2>
                  <div className="space-y-3">
                    {cv.experience.map((exp, idx) => (
                      <div key={exp.id || idx} className="space-y-0.5">
                        <div className="flex justify-between items-baseline font-bold text-xs text-slate-900">
                          <span>{exp.position}</span>
                          <span className="text-slate-500 font-medium text-[11px]">
                            {exp.startDate} – {exp.endDate}
                          </span>
                        </div>
                        <div className="text-xs font-semibold" style={{ color: secondaryColor }}>
                          {exp.company}
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed pt-0.5">
                          {exp.responsibilities}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Scholastic Portfolio / Education */}
              {cv.education && cv.education.length > 0 && (
                <section className="space-y-2">
                  <h2
                    className="text-xs font-bold uppercase tracking-wider pb-1 border-b"
                    style={{ color: primaryColor, borderColor: `${primaryColor}40` }}
                  >
                    {isBangla ? 'শিক্ষাগত যোগ্যতা (Scholastic Portfolio)' : 'Scholastic Portfolio'}
                  </h2>
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
                          <th className="p-1.5">{isBangla ? 'পাসের সন' : 'Year'}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 text-slate-700">
                        {cv.education.map((edu, idx) => (
                          <tr key={edu.id || idx} className="hover:bg-slate-50/50">
                            <td className="p-1.5 font-semibold border-r border-slate-200">{edu.degree}</td>
                            <td className="p-1.5 border-r border-slate-200">{edu.institution}</td>
                            <td className="p-1.5 border-r border-slate-200">{edu.subject}</td>
                            <td className="p-1.5 font-bold border-r border-slate-200">{edu.cgpaOrGpa}</td>
                            <td className="p-1.5">{edu.passingYear}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              )}

              {/* Skills Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Core Skills */}
                {cv.skills && cv.skills.length > 0 && (
                  <section className="space-y-1.5">
                    <h2
                      className="text-xs font-bold uppercase tracking-wider pb-1 border-b"
                      style={{ color: primaryColor, borderColor: `${primaryColor}40` }}
                    >
                      {isBangla ? 'মূল দক্ষতা সমূহ' : 'Key Skills'}
                    </h2>
                    <ul className="text-xs text-slate-700 space-y-1 list-disc pl-4">
                      {cv.skills.map((skill, i) => (
                        <li key={i}>{skill}</li>
                      ))}
                    </ul>
                  </section>
                )}

                {/* Computer & Software Skills */}
                {cv.computerSkills && cv.computerSkills.length > 0 && (
                  <section className="space-y-1.5">
                    <h2
                      className="text-xs font-bold uppercase tracking-wider pb-1 border-b"
                      style={{ color: primaryColor, borderColor: `${primaryColor}40` }}
                    >
                      {isBangla ? 'কম্পিউটার ও আইটি দক্ষতা' : 'Computer & Software Skills'}
                    </h2>
                    <ul className="text-xs text-slate-700 space-y-1 list-disc pl-4">
                      {cv.computerSkills.map((cskill, i) => (
                        <li key={i}>{cskill}</li>
                      ))}
                    </ul>
                  </section>
                )}
              </div>

              {/* Languages & Interpersonal Skills */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {cv.interpersonalSkills && cv.interpersonalSkills.length > 0 && (
                  <section className="space-y-1.5">
                    <h2
                      className="text-xs font-bold uppercase tracking-wider pb-1 border-b"
                      style={{ color: primaryColor, borderColor: `${primaryColor}40` }}
                    >
                      {isBangla ? 'পারস্পরিক যোগাযোগ দক্ষতা' : 'Interpersonal Skills'}
                    </h2>
                    <ul className="text-xs text-slate-700 space-y-1 list-disc pl-4">
                      {cv.interpersonalSkills.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </section>
                )}

                {cv.languages && cv.languages.length > 0 && (
                  <section className="space-y-1.5">
                    <h2
                      className="text-xs font-bold uppercase tracking-wider pb-1 border-b"
                      style={{ color: primaryColor, borderColor: `${primaryColor}40` }}
                    >
                      {isBangla ? 'ভাষাগত দক্ষতা' : 'Language Proficiency'}
                    </h2>
                    <ul className="text-xs text-slate-700 space-y-1 list-disc pl-4">
                      {cv.languages.map((lang, i) => (
                        <li key={i}>{lang}</li>
                      ))}
                    </ul>
                  </section>
                )}
              </div>

              {/* Personal Information */}
              {cv.personalInfo && (
                <section className="space-y-1.5">
                  <h2
                    className="text-xs font-bold uppercase tracking-wider pb-1 border-b"
                    style={{ color: primaryColor, borderColor: `${primaryColor}40` }}
                  >
                    {isBangla ? 'ব্যক্তিগত তথ্যাবলী' : 'Personal Information'}
                  </h2>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs text-slate-700">
                    <div>
                      <span className="font-semibold text-slate-900">
                        {isBangla ? "পিতার নাম: " : "Father's Name: "}
                      </span>
                      <span>{cv.personalInfo.fatherName}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-900">
                        {isBangla ? "মাতার নাম: " : "Mother's Name: "}
                      </span>
                      <span>{cv.personalInfo.motherName}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-900">
                        {isBangla ? 'জন্ম তারিখ: ' : 'Date of Birth: '}
                      </span>
                      <span>{cv.personalInfo.dateOfBirth}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-900">
                        {isBangla ? 'জাতীয়তা: ' : 'Nationality: '}
                      </span>
                      <span>{cv.personalInfo.nationality}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-900">
                        {isBangla ? 'ধর্ম: ' : 'Religion: '}
                      </span>
                      <span>{cv.personalInfo.religion}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-900">
                        {isBangla ? 'বৈবাহিক অবস্থা: ' : 'Marital Status: '}
                      </span>
                      <span>{cv.personalInfo.maritalStatus}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-900">
                        {isBangla ? 'রক্তের গ্রুপ: ' : 'Blood Group: '}
                      </span>
                      <span>{cv.personalInfo.bloodGroup}</span>
                    </div>
                    {cv.personalInfo.nidOrPassport && (
                      <div>
                        <span className="font-semibold text-slate-900">
                          {isBangla ? 'এনআইডি: ' : 'National ID: '}
                        </span>
                        <span>{cv.personalInfo.nidOrPassport}</span>
                      </div>
                    )}
                    <div className="col-span-2">
                      <span className="font-semibold text-slate-900">
                        {isBangla ? 'স্থায়ী ঠিকানা: ' : 'Permanent Address: '}
                      </span>
                      <span>{cv.personalInfo.permanentAddress}</span>
                    </div>
                  </div>
                </section>
              )}

              {/* References */}
              {cv.references && cv.references.length > 0 && (
                <section className="space-y-1.5">
                  <h2
                    className="text-xs font-bold uppercase tracking-wider pb-1 border-b"
                    style={{ color: primaryColor, borderColor: `${primaryColor}40` }}
                  >
                    {isBangla ? 'রেফারেন্স / সুপারিশকারী' : 'References'}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-700">
                    {cv.references.map((ref, i) => (
                      <div key={ref.id || i} className="border-l-2 pl-2.5 space-y-0.5" style={{ borderColor: primaryColor }}>
                        <div className="font-bold text-slate-900">{ref.name}</div>
                        <div>{ref.designation}</div>
                        <div className="text-slate-600">{ref.organization}</div>
                        <div className="text-[11px] text-slate-500">{ref.phone} | {ref.email}</div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Declaration & Signature */}
              <div className="pt-4 mt-auto border-t border-slate-200">
                <p className="text-[11px] italic text-slate-600 leading-relaxed mb-6">
                  {cv.declaration ||
                    'I hereby declare that all the information mentioned above is true and authentic.'}
                </p>
                <div className="flex justify-between items-end text-xs">
                  <div>
                    <div className="text-slate-500 text-[11px]">
                      {isBangla ? 'তারিখ:' : 'Date:'} {cv.signatureDate || '19 September 2026'}
                    </div>
                  </div>
                  <div className="text-center">
                    <div
                      className="font-serif italic text-base font-bold pb-0.5 border-b border-slate-700 px-6 min-w-32"
                      style={{ color: primaryColor }}
                    >
                      {cv.signatureText || cv.fullName}
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
        </div>
      ))}
    </div>
  );
};
