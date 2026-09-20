import React from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Award,
  CheckCircle,
  FileText,
  User,
  Heart,
  ScrollText,
  Building2,
  Stamp,
} from 'lucide-react';

interface TemplateLivePreviewProps {
  templateId?: string;
  category?: string;
  style?: string;
  accentColor?: string;
  name?: string;
  language?: string;
  isATS?: boolean;
  className?: string;
}

export const TemplateLivePreview: React.FC<TemplateLivePreviewProps> = ({
  templateId = 'cv-modern-blue',
  category = 'CV',
  style = 'Modern',
  accentColor = '#2563EB',
  name = 'Modern Blue CV',
  language = 'English',
  isATS = false,
  className = '',
}) => {
  const isBangla = language === 'Bangla' || language === 'বাংলা' || templateId.includes('bangla') || templateId.includes('marriage');
  const isMarriage = category === 'Marriage CV' || templateId.includes('marriage');
  const isCoverLetter = category === 'Cover Letter' || templateId.includes('cover');
  const isCertificate = category === 'Certificate' || templateId.includes('cert') || templateId.includes('experience');
  const isForm = category === 'Applications' || category === 'Office Form' || templateId.includes('form') || templateId.includes('joining');
  const isTwoColumn = style === 'Two Column' || style === 'Corporate' || templateId.includes('two-column') || templateId.includes('corporate');
  const isMinimal = style === 'Minimal' || style === 'ATS Friendly' || isATS;

  // Render specific layout variations
  return (
    <div
      className={`relative w-full aspect-[210/297] bg-white rounded-lg shadow-md overflow-hidden select-none border border-slate-200/90 text-slate-800 ${className}`}
      style={{ fontSize: '7px' }}
    >
      {/* 1. MARRIAGE BIODATA / পাত্র-পাত্রীর বায়োডাটা */}
      {isMarriage ? (
        <div className="h-full flex flex-col justify-between p-2.5 bg-[#FFFBF7] border-2 border-[#E11D48]/30 relative">
          {/* Islamic / Traditional Top Heading */}
          <div className="text-center pb-1 border-b border-[#E11D48]/30">
            <span className="text-[6px] font-bold text-[#E11D48] tracking-widest block">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </span>
            <span className="text-[7.5px] font-extrabold text-slate-900 block mt-0.5">
              {templateId.includes('bride') ? 'পাত্রীর জীবনবৃত্তান্ত (বায়োডাটা)' : 'পাত্রের জীবনবৃত্তান্ত (Marriage CV)'}
            </span>
          </div>

          {/* Photo & Basic Details */}
          <div className="flex gap-2 items-center my-1">
            <div className="w-10 h-10 rounded-full border-2 border-[#E11D48] bg-rose-100/70 shrink-0 overflow-hidden flex items-center justify-center shadow-xs">
              <User className="w-6 h-6 text-[#E11D48]" />
            </div>
            <div className="space-y-0.5 flex-1 min-w-0">
              <div className="font-extrabold text-[8px] text-slate-900 truncate">
                {templateId.includes('bride') ? 'মোসাম্মৎ ফাতিমা আক্তার' : 'মোহাম্মদ আরিফুর রহমান'}
              </div>
              <div className="text-[6px] text-rose-700 font-semibold">
                বি.এস.সি (কম্পিউটার সায়েন্স) • সিনিয়র ইঞ্জিনিয়ার
              </div>
              <div className="text-[5.5px] text-slate-500 flex items-center gap-1">
                <span>উচ্চতা: ৫ ফুট ৭ ইঞ্চি</span>
                <span>•</span>
                <span>রক্ত: B+</span>
              </div>
            </div>
          </div>

          {/* Table / Details Grid */}
          <div className="space-y-1 my-1 flex-1">
            <div className="bg-rose-50/70 p-1 rounded border border-rose-200/50">
              <div className="font-bold text-[6px] text-[#E11D48] mb-0.5 flex items-center gap-0.5">
                <Heart className="w-2 h-2" />
                <span>ব্যক্তিগত ও ধর্মীয় তথ্য</span>
              </div>
              <div className="grid grid-cols-2 gap-x-1 gap-y-0.5 text-[5px] text-slate-700">
                <div>পিতার নাম: হাজী রফিকুল ইসলাম</div>
                <div>মাতার নাম: জাহানারা বেগম</div>
                <div>স্থায়ী ঠিকানা: চট্টগ্রাম, বাংলাদেশ</div>
                <div>ধর্ম: ইসলাম (সুন্নি)</div>
              </div>
            </div>

            <div className="bg-white p-1 rounded border border-slate-200">
              <div className="font-bold text-[6px] text-slate-800 mb-0.5">শিক্ষাগত যোগ্যতা</div>
              <div className="grid grid-cols-3 text-[5px] text-slate-600 border-t pt-0.5">
                <span className="font-medium">B.Sc (CSE)</span>
                <span>CUET</span>
                <span className="font-semibold text-rose-600">CGPA 3.82</span>
              </div>
            </div>
          </div>

          {/* Footer Contact */}
          <div className="pt-1 border-t border-rose-200 text-center text-[5.5px] text-slate-600 font-medium">
            যোগাযোগ (অভিভাবক): +880 18XXXXXXXXX
          </div>
        </div>
      ) : isCoverLetter ? (
        /* 2. COVER LETTER / আবেদনপত্র */
        <div className="h-full flex flex-col justify-between p-3 bg-white">
          {/* Letterhead */}
          <div className="flex justify-between items-start pb-1.5 border-b" style={{ borderColor: accentColor }}>
            <div>
              <div className="font-extrabold text-[8.5px] text-slate-900">Arif Hasan</div>
              <div className="text-[5.5px] text-slate-500 font-medium">Software Engineer</div>
            </div>
            <div className="text-right text-[5px] text-slate-500 space-y-0.5">
              <div>Dhaka, Bangladesh</div>
              <div>contact@arifhasan.com</div>
            </div>
          </div>

          {/* Recipient & Date */}
          <div className="my-1.5 space-y-0.5 text-[5.5px] text-slate-700">
            <div className="text-slate-400">September 19, 2026</div>
            <div className="font-bold text-slate-900 mt-1">To: The Hiring Committee</div>
            <div>Apex Technologies Ltd.</div>
            <div className="font-bold mt-1 text-[6.5px]" style={{ color: accentColor }}>
              Subject: Application for Senior Full Stack Engineer
            </div>
          </div>

          {/* Letter Body Lines */}
          <div className="space-y-1 text-[5px] leading-relaxed text-slate-600 flex-1 my-1">
            <p>Dear Hiring Manager,</p>
            <p>
              I am writing to express my strong enthusiasm for the Senior Software Engineer position. With 5+ years of production experience in architecting high-scale web platforms...
            </p>
            <p>
              In my previous tenure, I spearheaded cloud migration and achieved a 40% reduction in response latencies while mentoring engineering teams...
            </p>
            <p>
              Thank you for considering my application. I look forward to discussing how my skills align with your goals.
            </p>
          </div>

          {/* Sign-off */}
          <div className="pt-1 border-t border-slate-100 flex justify-between items-end">
            <div className="text-[5px] text-slate-600">
              <div>Sincerely,</div>
              <div className="font-serif italic font-bold text-[7px] text-slate-900 mt-0.5">Arif Hasan</div>
            </div>
            <div className="w-8 h-2.5 rounded bg-slate-100 flex items-center justify-center text-[4px] text-slate-400 font-bold">
              ENCLOSED: CV
            </div>
          </div>
        </div>
      ) : isCertificate ? (
        /* 3. EXPERIENCE CERTIFICATE / প্রত্যয়নপত্র */
        <div className="h-full flex flex-col justify-between p-2.5 bg-gradient-to-br from-amber-50/40 via-white to-amber-50/20 border-4 border-double border-amber-600/40 m-0.5">
          {/* Certificate Header */}
          <div className="text-center pt-1 pb-1.5 border-b border-amber-300">
            <div className="w-5 h-5 mx-auto rounded-full bg-amber-600 text-white flex items-center justify-center mb-0.5 shadow-2xs">
              <Building2 className="w-3 h-3" />
            </div>
            <div className="font-extrabold text-[8px] tracking-wider text-slate-900 uppercase">
              GLOBAL TECH SOLUTIONS LTD.
            </div>
            <div className="text-[5px] text-amber-700 font-semibold uppercase tracking-widest mt-0.5">
              Certificate of Experience • প্রত্যয়নপত্র
            </div>
          </div>

          {/* Certificate Body */}
          <div className="my-1.5 space-y-1 text-[5.5px] text-slate-700 text-center px-1 flex-1">
            <div className="text-[5px] font-bold text-slate-400">TO WHOM IT MAY CONCERN</div>
            <p className="leading-relaxed">
              This is to officially certify that <strong className="text-slate-900">Engr. Arif Hasan</strong> served as a permanent <strong className="text-amber-800">Lead System Architect</strong> from 2021 to 2026.
            </p>
            <p className="text-[5px] text-slate-500">
              During his tenure, he demonstrated exceptional dedication, high ethical standards, and leadership.
            </p>
          </div>

          {/* Signatures & Seal */}
          <div className="pt-1.5 border-t border-amber-200 flex justify-between items-end px-2">
            <div className="text-center">
              <div className="text-[5px] text-slate-400">Date: 19/09/2026</div>
              <div className="text-[5.5px] font-bold text-slate-800 mt-0.5">HR Director</div>
            </div>
            <div className="w-7 h-7 rounded-full border border-dashed border-amber-600/60 flex items-center justify-center text-[4px] font-bold text-amber-700 rotate-[-12deg] bg-amber-50">
              OFFICIAL SEAL
            </div>
            <div className="text-center">
              <div className="font-serif italic text-[6px] text-slate-800">H. Rahman</div>
              <div className="text-[5.5px] font-bold text-slate-800 mt-0.5">Managing Director</div>
            </div>
          </div>
        </div>
      ) : isTwoColumn ? (
        /* 4. TWO-COLUMN / CORPORATE EXECUTIVE CV */
        <div className="h-full flex">
          {/* Left Sidebar */}
          <div
            className="w-[36%] p-2 text-white flex flex-col justify-between"
            style={{ backgroundColor: accentColor }}
          >
            <div>
              {/* Photo Avatar */}
              <div className="w-10 h-10 mx-auto rounded-full bg-white/20 border-2 border-white/80 overflow-hidden flex items-center justify-center shadow-xs mb-1.5">
                <User className="w-6 h-6 text-white" />
              </div>
              <div className="text-center">
                <div className="font-extrabold text-[7.5px] tracking-tight leading-tight">
                  {isBangla ? 'আরিফুর রহমান' : 'Arif Hasan'}
                </div>
                <div className="text-[5px] text-white/80 font-medium mt-0.5">
                  Senior Executive
                </div>
              </div>

              {/* Sidebar Sections */}
              <div className="mt-2 space-y-1.5 text-[5px]">
                <div>
                  <div className="font-bold uppercase tracking-wider text-white/90 text-[5.5px] pb-0.5 border-b border-white/30 mb-0.5">
                    Contact
                  </div>
                  <div className="text-white/80 space-y-0.5">
                    <div>+880 1868 461577</div>
                    <div className="truncate">arif@domain.com</div>
                    <div>Dhaka, BD</div>
                  </div>
                </div>

                <div>
                  <div className="font-bold uppercase tracking-wider text-white/90 text-[5.5px] pb-0.5 border-b border-white/30 mb-0.5">
                    Skills
                  </div>
                  <div className="flex flex-wrap gap-0.5">
                    <span className="px-1 py-0.2 bg-white/20 rounded text-[4.5px]">React</span>
                    <span className="px-1 py-0.2 bg-white/20 rounded text-[4.5px]">Node.js</span>
                    <span className="px-1 py-0.2 bg-white/20 rounded text-[4.5px]">Cloud</span>
                    <span className="px-1 py-0.2 bg-white/20 rounded text-[4.5px]">SQL</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar Bottom badge */}
            <div className="text-[4.5px] text-white/70 text-center">
              100% Verified Profile
            </div>
          </div>

          {/* Right Main Body */}
          <div className="w-[64%] p-2 flex flex-col justify-between bg-white text-slate-800">
            <div>
              <div className="font-bold uppercase tracking-wider text-[6px] pb-0.5 border-b text-slate-900 mb-1 flex items-center gap-0.5" style={{ color: accentColor }}>
                <Briefcase className="w-2 h-2" />
                <span>Experience</span>
              </div>
              <div className="space-y-1 text-[5px]">
                <div>
                  <div className="font-bold text-slate-900 text-[5.5px] flex justify-between">
                    <span>Lead Architect</span>
                    <span className="text-slate-400 font-normal">2023–Now</span>
                  </div>
                  <div className="text-slate-500 font-medium">Fintech Corp</div>
                  <div className="text-[4.5px] text-slate-600 mt-0.2 leading-tight">
                    • Directed core platform architecture with 99.99% uptime.
                  </div>
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-[5.5px] flex justify-between">
                    <span>Software Engineer</span>
                    <span className="text-slate-400 font-normal">2020–23</span>
                  </div>
                  <div className="text-slate-500 font-medium">SoftTech Global</div>
                  <div className="text-[4.5px] text-slate-600 mt-0.2 leading-tight">
                    • Built microservices and streamlined API integrations.
                  </div>
                </div>
              </div>

              {/* Education */}
              <div className="font-bold uppercase tracking-wider text-[6px] pb-0.5 border-b text-slate-900 mt-1.5 mb-1 flex items-center gap-0.5" style={{ color: accentColor }}>
                <GraduationCap className="w-2 h-2" />
                <span>Education</span>
              </div>
              <div className="text-[5px] space-y-0.5">
                <div className="font-bold text-slate-900">B.Sc in Computer Science</div>
                <div className="text-slate-500 flex justify-between">
                  <span>University of Dhaka</span>
                  <span className="font-semibold text-slate-700">CGPA 3.85</span>
                </div>
              </div>
            </div>

            {/* Bottom ATS Indicator */}
            <div className="flex justify-between items-center pt-1 border-t border-slate-100 text-[4.5px] text-slate-400">
              <span>SmartCV Document</span>
              <span className="font-semibold text-emerald-600">ATS Optimized</span>
            </div>
          </div>
        </div>
      ) : isMinimal ? (
        /* 5. ATS FRIENDLY / MINIMAL CLEAN CV */
        <div className="h-full flex flex-col justify-between p-3 bg-white font-sans">
          {/* Header */}
          <div className="text-center pb-1.5 border-b border-slate-300">
            <h1 className="font-extrabold text-[9px] tracking-wide text-slate-900 uppercase">
              {isBangla ? 'মো: হাবিবুর রহমান' : 'HABIBUR RAHMAN'}
            </h1>
            <div className="text-[5px] text-slate-600 font-medium mt-0.5 flex items-center justify-center gap-1">
              <span>+880 1868 461577</span>
              <span>•</span>
              <span>tec.habiburrahman@gmail.com</span>
              <span>•</span>
              <span>Chattogram, BD</span>
            </div>
          </div>

          {/* Objective */}
          <div className="my-1">
            <div className="font-bold text-[5.5px] uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-0.2 mb-0.5">
              Professional Summary
            </div>
            <div className="text-[4.8px] text-slate-600 leading-tight">
              Accomplished technical professional with proven track record in software development, project management, and scalable system architectures.
            </div>
          </div>

          {/* Experience */}
          <div className="my-0.5">
            <div className="font-bold text-[5.5px] uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-0.2 mb-0.5">
              Work Experience
            </div>
            <div className="space-y-0.8 text-[5px]">
              <div>
                <div className="flex justify-between font-bold text-slate-800">
                  <span>Senior Technical Specialist</span>
                  <span className="font-normal text-slate-500">2022 – Present</span>
                </div>
                <div className="text-slate-600 text-[4.8px]">HabibiFix Global Ltd.</div>
                <div className="text-[4.5px] text-slate-500">• Led high-throughput API integrations and reduced latency by 35%.</div>
              </div>
            </div>
          </div>

          {/* Education Table */}
          <div className="my-0.5">
            <div className="font-bold text-[5.5px] uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-0.2 mb-0.5">
              Education
            </div>
            <div className="grid grid-cols-4 text-[4.8px] text-slate-700 border border-slate-200 p-0.5 rounded bg-slate-50/50">
              <span className="font-bold">B.Sc Engineering</span>
              <span>National University</span>
              <span className="font-semibold text-slate-900">GPA 3.80</span>
              <span className="text-right">2022</span>
            </div>
          </div>

          {/* Skills */}
          <div className="my-0.5">
            <div className="font-bold text-[5.5px] uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-0.2 mb-0.5">
              Core Competencies
            </div>
            <div className="text-[4.8px] text-slate-600">
              Full Stack Development, SQL Databases, System Architecture, Agile Leadership.
            </div>
          </div>

          {/* ATS 99% Badge Stamp */}
          <div className="pt-1 border-t border-slate-200 flex justify-between items-center text-[4.5px] text-slate-500">
            <span className="font-mono">Single-Column Strict ATS</span>
            <span className="px-1 py-0.2 rounded bg-emerald-100 text-emerald-800 font-bold">
              ATS Score: 99%
            </span>
          </div>
        </div>
      ) : (
        /* 6. DEFAULT / MODERN BLUE CV (Banner or Top Header) */
        <div className="h-full flex flex-col justify-between bg-white">
          {/* Top Banner Header */}
          <div
            className="p-2.5 text-white flex items-center justify-between"
            style={{ backgroundColor: accentColor }}
          >
            <div className="flex items-center gap-1.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-white/25 border border-white/80 overflow-hidden flex items-center justify-center shrink-0 shadow-xs">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0">
                <div className="font-extrabold text-[8px] leading-tight truncate">
                  {isBangla ? 'মো: হাবিবুর রহমান' : 'Habibur Rahman'}
                </div>
                <div className="text-[5.5px] text-white/90 font-medium">
                  {isBangla ? 'সফটওয়্যার ডেভেলপার' : 'Software Engineer'}
                </div>
              </div>
            </div>

            <div className="text-[4.5px] text-white/80 text-right space-y-0.2 shrink-0">
              <div>+880 1868 461577</div>
              <div>Chattogram, BD</div>
            </div>
          </div>

          {/* Document Content */}
          <div className="p-2 flex-1 flex flex-col justify-between text-[5px] text-slate-700 space-y-1">
            {/* Summary */}
            <div>
              <div className="font-bold text-[5.8px] uppercase tracking-wider pb-0.5 border-b mb-0.5" style={{ color: accentColor, borderColor: `${accentColor}40` }}>
                {isBangla ? 'ক্যারিয়ার উদ্দেশ্য' : 'Career Objective'}
              </div>
              <div className="text-[4.8px] text-slate-600 leading-tight">
                {isBangla
                  ? 'গতিশীল প্রতিষ্ঠানে দক্ষতা ও উদ্ভাবনী মেধার সমন্বয়ে অবদান রাখতে আগ্রহী।'
                  : 'Dedicated engineer passionate about delivering scalable web applications and high-impact digital products.'}
              </div>
            </div>

            {/* Experience */}
            <div>
              <div className="font-bold text-[5.8px] uppercase tracking-wider pb-0.5 border-b mb-0.5" style={{ color: accentColor, borderColor: `${accentColor}40` }}>
                {isBangla ? 'কাজের অভিজ্ঞতা' : 'Experience'}
              </div>
              <div className="space-y-0.8">
                <div>
                  <div className="flex justify-between font-bold text-slate-800 text-[5.2px]">
                    <span>Senior Web Developer</span>
                    <span className="font-normal text-slate-400">2023–26</span>
                  </div>
                  <div className="text-slate-500 text-[4.8px] font-medium">Tech Solutions BD</div>
                </div>
              </div>
            </div>

            {/* Education Table */}
            <div>
              <div className="font-bold text-[5.8px] uppercase tracking-wider pb-0.5 border-b mb-0.5" style={{ color: accentColor, borderColor: `${accentColor}40` }}>
                {isBangla ? 'শিক্ষাগত যোগ্যতা' : 'Education'}
              </div>
              <div className="border border-slate-200 rounded text-[4.5px] overflow-hidden">
                <div className="bg-slate-100 font-semibold p-0.5 flex justify-between text-slate-700">
                  <span>Degree</span>
                  <span>Board/Inst</span>
                  <span>GPA</span>
                </div>
                <div className="p-0.5 flex justify-between text-slate-600 border-t border-slate-100">
                  <span className="font-medium">B.Sc (Engg)</span>
                  <span>Chattogram</span>
                  <span className="font-bold text-blue-600">3.85</span>
                </div>
              </div>
            </div>

            {/* Skills Badges */}
            <div>
              <div className="font-bold text-[5.8px] uppercase tracking-wider pb-0.5 border-b mb-0.5" style={{ color: accentColor, borderColor: `${accentColor}40` }}>
                {isBangla ? 'দক্ষতা' : 'Key Skills'}
              </div>
              <div className="flex flex-wrap gap-0.5">
                <span className="px-1 py-0.2 rounded bg-blue-50 text-blue-700 text-[4.5px] font-semibold border border-blue-200/60">
                  React
                </span>
                <span className="px-1 py-0.2 rounded bg-indigo-50 text-indigo-700 text-[4.5px] font-semibold border border-indigo-200/60">
                  Node.js
                </span>
                <span className="px-1 py-0.2 rounded bg-emerald-50 text-emerald-700 text-[4.5px] font-semibold border border-emerald-200/60">
                  TypeScript
                </span>
                <span className="px-1 py-0.2 rounded bg-amber-50 text-amber-700 text-[4.5px] font-semibold border border-amber-200/60">
                  UI/UX
                </span>
              </div>
            </div>
          </div>

          {/* Footer Page Stamp */}
          <div className="px-2 py-0.8 bg-slate-50 border-t border-slate-100 flex justify-between items-center text-[4.5px] text-slate-400">
            <span>A4 Document Format</span>
            <span className="font-medium text-blue-600">SmartCV Live</span>
          </div>
        </div>
      )}
    </div>
  );
};
