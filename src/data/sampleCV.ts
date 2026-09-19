import { CVData } from '../types';

export const initialSectionsConfig = [
  { id: 'objective', name: 'Career Objective', nameBn: 'ক্যারিয়ার উদ্দেশ্য', visible: true, order: 0 },
  { id: 'summary', name: 'Professional Summary', nameBn: 'পেশাগত সারসংক্ষেপ', visible: true, order: 1 },
  { id: 'experience', name: 'Job Experience', nameBn: 'কাজের অভিজ্ঞতা', visible: true, order: 2 },
  { id: 'education', name: 'Scholastic Portfolio (Education)', nameBn: 'শিক্ষাগত যোগ্যতা', visible: true, order: 3 },
  { id: 'skills', name: 'Key & Technical Skills', nameBn: 'দক্ষতা সমূহ', visible: true, order: 4 },
  { id: 'computerSkills', name: 'Computer & Software Skills', nameBn: 'কম্পিউটার দক্ষতা', visible: true, order: 5 },
  { id: 'interpersonalSkills', name: 'Interpersonal Skills', nameBn: 'পারস্পরিক যোগাযোগ দক্ষতা', visible: true, order: 6 },
  { id: 'languages', name: 'Language Proficiency', nameBn: 'ভাষাগত দক্ষতা', visible: true, order: 7 },
  { id: 'projects', name: 'Key Projects', nameBn: 'উল্লেখযোগ্য প্রকল্প', visible: true, order: 8 },
  { id: 'certifications', name: 'Certifications & Training', nameBn: 'সার্টিফিকেশন ও প্রশিক্ষণ', visible: true, order: 9 },
  { id: 'personalInfo', name: 'Personal Information', nameBn: 'ব্যক্তিগত তথ্য', visible: true, order: 10 },
  { id: 'references', name: 'References', nameBn: 'রেফারেন্স', visible: true, order: 11 },
  { id: 'declaration', name: 'Declaration & Signature', nameBn: 'ঘোষণাপত্র ও স্বাক্ষর', visible: true, order: 12 },
];

export const sampleCV: CVData = {
  id: 'doc-sample-1',
  title: 'Professional CV - John Doe',
  templateId: 'cv-modern-blue',
  language: 'en',
  lastModified: Date.now(),

  fullName: 'John Doe',
  professionalTitle: 'Senior Software Engineer & Tech Lead',
  photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
  photoShape: 'circle',
  phone: '+1 (555) 234-5678',
  email: 'john.doe@example.com',
  address: '42 Silicon Avenue, San Francisco, CA 94107',
  website: 'https://johndoe.dev',
  linkedin: 'linkedin.com/in/johndoe',
  github: 'github.com/johndoe',

  careerObjective:
    'Dedicated and result-driven software engineer with 6+ years of expertise in architecting high-performance distributed systems, leading agile development squads, and driving modern cloud-native product delivery.',
  professionalSummary:
    'Proficient in full-stack architecture, React/Next.js, TypeScript, and microservice topologies. Proven track record of scaling consumer web applications to millions of active users while optimizing infrastructure reliability and developer productivity.',

  skills: [
    'System Architecture',
    'Full-Stack Engineering',
    'Cloud Computing (AWS/GCP)',
    'RESTful & GraphQL APIs',
    'CI/CD Pipeline Automation',
    'Agile Scrum Leadership',
    'Database Optimization',
  ],

  computerSkills: [
    'TypeScript & JavaScript (ES6+)',
    'React, Next.js, Node.js, Express',
    'PostgreSQL, MongoDB, Redis',
    'Docker, Kubernetes, Terraform',
    'Git, GitHub Actions, Linux CLI',
    'MS Office, Figma, Jira',
  ],

  interpersonalSkills: [
    'Cross-functional Team Leadership',
    'Stakeholder Communication & Empathy',
    'Critical Problem Solving',
    'Mentorship & Code Quality Advocacy',
    'Time Management & Prioritization',
  ],

  languages: [
    'English (Fluent / Professional)',
    'Bengali (Native / Bilingual)',
    'Spanish (Conversational)',
  ],

  education: [
    {
      id: 'edu-1',
      degree: 'B.Sc. in Computer Science & Engineering',
      institution: 'University of Engineering and Technology',
      boardOrUniversity: 'Department of CSE',
      subject: 'Computer Science',
      cgpaOrGpa: '3.88 / 4.00',
      passingYear: '2019',
    },
    {
      id: 'edu-2',
      degree: 'Higher Secondary Certificate (HSC)',
      institution: 'City Model College',
      boardOrUniversity: 'Dhaka Board',
      subject: 'Science',
      cgpaOrGpa: '5.00 / 5.00',
      passingYear: '2015',
    },
  ],

  experience: [
    {
      id: 'exp-1',
      company: 'Apex Cloud Technologies Inc.',
      position: 'Senior Software Engineer & Tech Lead',
      startDate: 'Jan 2022',
      endDate: 'Present',
      responsibilities:
        'Led a squad of 8 engineers delivering enterprise SaaS modules. Reduced system latency by 42% and introduced automated integration testing reducing regression defects by 35%.',
    },
    {
      id: 'exp-2',
      company: 'Innovate Digital Labs',
      position: 'Software Developer',
      startDate: 'Aug 2019',
      endDate: 'Dec 2021',
      responsibilities:
        'Architected front-end dashboard applications in React and TypeScript. Collaborated with UX designers to establish design systems and client-side caching strategies.',
    },
  ],

  projects: [
    {
      id: 'proj-1',
      title: 'Smart Cloud Document Automation Suite',
      description: 'End-to-end PDF rendering and document workflow engine serving 100k+ monthly generated documents.',
      technologies: 'React, Node.js, WebAssembly, Canvas, AWS Lambda',
      link: 'https://github.com/johndoe/doc-suite',
    },
    {
      id: 'proj-2',
      title: 'Real-time Analytics Dashboard',
      description: 'High throughput telemetry streaming platform utilizing WebSockets and Redis time-series caches.',
      technologies: 'TypeScript, Next.js, Tailwind CSS, Redis',
      link: 'https://analytics.example.com',
    },
  ],

  certifications: [
    {
      id: 'cert-1',
      title: 'AWS Certified Solutions Architect – Associate',
      issuer: 'Amazon Web Services',
      year: '2023',
    },
    {
      id: 'cert-2',
      title: 'Certified Kubernetes Application Developer (CKAD)',
      issuer: 'Linux Foundation / CNCF',
      year: '2022',
    },
  ],

  personalInfo: {
    fatherName: 'Robert Doe',
    motherName: 'Sarah Doe',
    dateOfBirth: '15 March 1996',
    gender: 'Male',
    nationality: 'Bangladeshi / American',
    religion: 'Islam',
    maritalStatus: 'Single',
    bloodGroup: 'B+ (Positive)',
    permanentAddress: 'House 14, Road 5, Block B, Dhaka, Bangladesh',
    presentAddress: '42 Silicon Avenue, San Francisco, CA 94107',
    nidOrPassport: 'NID: 1996269123456789',
  },

  references: [
    {
      id: 'ref-1',
      name: 'Dr. Alan Vance',
      designation: 'VP of Engineering',
      organization: 'Apex Cloud Technologies Inc.',
      phone: '+1 (555) 789-0123',
      email: 'alan.vance@apexcloud.com',
    },
    {
      id: 'ref-2',
      name: 'Prof. Tariqul Islam',
      designation: 'Professor, Dept. of CSE',
      organization: 'University of Engineering and Technology',
      phone: '+880 1711-234567',
      email: 'tariqul@university.ac.bd',
    },
  ],

  declaration:
    'I hereby declare that all the information mentioned above is true, complete and authentic to the best of my knowledge and belief.',
  signatureText: 'John Doe',
  signatureDate: '19 September 2026',

  sectionsConfig: initialSectionsConfig,

  design: {
    primaryColor: '#2563EB',
    secondaryColor: '#4F46E5',
    fontFamily: 'Inter',
    fontSize: 'medium',
    lineHeight: 'normal',
    pageMargin: 'normal',
    sectionSpacing: 'normal',
    headerStyle: 'modern',
  },

  pagesCount: 1,
};

export const sampleBanglaCV: CVData = {
  ...sampleCV,
  id: 'doc-sample-bn-1',
  title: 'জীবনবৃত্তান্ত - জন ডো',
  templateId: 'cv-simple-bangla',
  language: 'bn',
  fullName: 'জন ডো',
  professionalTitle: 'সিনিয়র সফটওয়্যার ইঞ্জিনিয়ার',
  address: 'বাড়ি নং ১৪, রোড ৫, মিরপুর, ঢাকা-১২১৬',
  careerObjective:
    'তথ্যপ্রযুক্তি ক্ষেত্রে ৬ বছরের বাস্তব অভিজ্ঞতাসম্পন্ন একজন একাগ্র ও দায়িত্বশীল সফটওয়্যার ইঞ্জিনিয়ার হিসেবে একটি উদ্ভাবনী প্রতিষ্ঠানে আধুনিক প্রযুক্তি ও সফটওয়্যার স্থাপত্যে নেতৃত্ব প্রদান করতে আগ্রহী।',
  professionalSummary:
    'ওয়েব অ্যাপ্লিকেশন, ক্লাউড কম্পিউটিং এবং উচ্চ ক্ষমতাসম্পন্ন সিস্টেম তৈরিতে পারদর্শী। ইতিপূর্বে আন্তর্জাতিক টিমের সাথে সফলভাবে বিভিন্ন বড় মাপের প্রজেক্ট বাস্তবায়ন করেছি।',
  declaration:
    'আমি প্রত্যয়ন করছি যে, এই জীবনবৃত্তান্তে উল্লেখিত সকল তথ্য আমার জ্ঞান ও বিশ্বাস মতে সম্পূর্ণ সত্য ও নির্ভুল।',
  signatureText: 'জন ডো',
  signatureDate: '১৯ সেপ্টেম্বর ২০২৬',
  personalInfo: {
    fatherName: 'রবার্ট ডো',
    motherName: 'সারা ডো',
    dateOfBirth: '১৫ মার্চ ১৯৯৬',
    gender: 'পুরুষ',
    nationality: 'বাংলাদেশী',
    religion: 'ইসলাম',
    maritalStatus: 'অবিবাহিত',
    bloodGroup: 'বি পজিটিভ (B+)',
    permanentAddress: 'গ্রাম: শ্যামপুর, থানা: কোতোয়ালী, জেলা: ঢাকা',
    presentAddress: 'বাড়ি নং ১৪, রোড ৫, মিরপুর-১০, ঢাকা-১২১৬',
    nidOrPassport: 'এনআইডি: ১৯৯৬২৬৯১২৩৪৫৬৭৮৯',
  },
  design: {
    ...sampleCV.design,
    fontFamily: 'Noto Sans Bengali',
  },
};

export const SAMPLE_CV_ENGLISH = sampleCV;
export const SAMPLE_CV_BANGLA = sampleBanglaCV;
