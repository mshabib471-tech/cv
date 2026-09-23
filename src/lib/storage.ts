import { CVData, GenericDocumentData, DocumentData, DocumentTemplate, UserProfile } from '../types';
import { sampleCV, sampleBanglaCV } from '../data/sampleCV';
import { sampleDocuments, SAMPLE_DOCUMENTS } from '../data/sampleDocs';
import { TEMPLATES_DATA } from '../data/templates';
import { DEFAULT_AVATAR } from '../data/avatars';

const STORAGE_KEYS = {
  CVS: 'smartcv_saved_cvs_v1',
  DOCUMENTS: 'smartcv_saved_docs_v1',
  TEMPLATES: 'smartcv_custom_templates_v1',
  ACTIVE_CV: 'smartcv_current_cv_v1',
  APP_LANG: 'smartcv_app_language_v1',
  MASTER_PROFILE: 'smartcv_master_profile_v1',
  USER_AUTH: 'smartcv_logged_in_user_v1',
};

export const DEFAULT_MASTER_PROFILE: UserProfile = {
  fullName: 'মো: হাবিবুর রহমান (Md. Habibur Rahman)',
  professionalTitle: 'Full-Stack Developer & Software Specialist',
  email: 'habibur.dev@gmail.com',
  phone: '+880 1712-345678',
  address: 'মিরপুর-১০, ঢাকা-১২১৬, বাংলাদেশ',
  website: 'https://habibifix.vercel.app/',
  linkedin: 'https://linkedin.com/in/habibur-dev',
  github: 'https://github.com/habibur-dev',
  photoUrl: DEFAULT_AVATAR,
  photoShape: 'circle',
  careerObjective:
    'তথ্যপ্রযুক্তি ও সফটওয়্যার উন্নয়নে উদ্ভাবনী সমাধান তৈরি করে প্রতিষ্ঠানের অগ্রযাত্রায় ভূমিকা রাখতে আগ্রহী। আধুনিক ওয়েব প্রযুক্তি এবং ইউজার-ফ্রেন্ডলি সিস্টেম তৈরিতে অভিজ্ঞ।',
  professionalSummary:
    'Over 4+ years of hands-on experience building modern, responsive web applications, robust APIs, and high-performance user interfaces.',
  skills: [
    'JavaScript / TypeScript',
    'React.js & Next.js',
    'Node.js & Express',
    'Tailwind CSS',
    'REST APIs',
    'Git & GitHub',
    'Problem Solving',
  ],
  computerSkills: [
    'VS Code',
    'Figma & UI Design',
    'Postman API Testing',
    'MS Office (Word, Excel, PowerPoint)',
  ],
  languages: ['বাংলা (Native)', 'English (Professional Working Proficiency)'],
  education: [
    {
      id: 'edu-1',
      degree: 'B.Sc. in Computer Science & Engineering (CSE)',
      institution: 'Dhaka International University',
      passingYear: '2022',
      cgpaOrGpa: '3.75 / 4.00',
    },
    {
      id: 'edu-2',
      degree: 'Higher Secondary Certificate (HSC) - Science',
      institution: 'Dhaka City College',
      passingYear: '2017',
      cgpaOrGpa: 'GPA 5.00',
    },
  ],
  experience: [
    {
      id: 'exp-1',
      company: 'TechSoft Solutions Ltd.',
      position: 'Senior Frontend Developer',
      startDate: 'Jan 2023',
      endDate: 'Present',
      responsibilities:
        'Designed and deployed responsive web dashboards, optimized core web vitals by 45%, and mentored junior engineers.',
    },
    {
      id: 'exp-2',
      company: 'Nexus Digital Agency',
      position: 'Web Application Developer',
      startDate: 'Jul 2021',
      endDate: 'Dec 2022',
      responsibilities:
        'Built scalable client portals, integrated payment gateways, and worked closely with design teams to ensure pixel-perfect delivery.',
    },
  ],
  personalInfo: {
    fatherName: 'মো: আব্দুল মালেক (Md. Abdul Malek)',
    motherName: 'রাবেয়া খাতুন (Rabeya Khatun)',
    dateOfBirth: '15 October 1998',
    gender: 'Male',
    nationality: 'Bangladeshi',
    religion: 'Islam',
    maritalStatus: 'Single',
    bloodGroup: 'B+',
    permanentAddress: 'গ্রাম: চরলক্ষ্যা, থানা: কর্ণফুলী, জেলা: চট্টগ্রাম',
    presentAddress: 'বাড়ি নং-২৪, রোড নং-০৩, সেক্টর-১০, উত্তরা, ঢাকা-১২৩০',
    nidOrPassport: '19982692800001234',
  },
  references: [
    {
      id: 'ref-1',
      name: 'Dr. Rafiqul Islam',
      designation: 'Professor & Head of CSE',
      organization: 'Dhaka International University',
      phone: '+880 1819-000000',
      email: 'dr.rafiq@university.edu.bd',
    },
  ],
};

export const StorageService = {
  // ------------------ CV STORAGE ------------------
  getSavedCVs(): CVData[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CVS);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Failed to load CVs from localStorage:', e);
    }
    // Seed with sample CVs
    const defaultCVs = [sampleCV, sampleBanglaCV];
    this.setSavedCVs(defaultCVs);
    return defaultCVs;
  },

  setSavedCVs(cvs: CVData[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CVS, JSON.stringify(cvs));
    } catch (e) {
      console.error('Failed to save CVs to localStorage:', e);
    }
  },

  saveCV(cv: CVData): void {
    const cvs = this.getSavedCVs();
    const index = cvs.findIndex((item) => item.id === cv.id);
    const updatedCV = { ...cv, lastModified: Date.now() };
    if (index >= 0) {
      cvs[index] = updatedCV;
    } else {
      cvs.unshift(updatedCV);
    }
    this.setSavedCVs(cvs);
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_CV, JSON.stringify(updatedCV));
    } catch (e) {
      console.error(e);
    }
  },

  deleteCV(id: string): CVData[] {
    const cvs = this.getSavedCVs().filter((item) => item.id !== id);
    this.setSavedCVs(cvs);
    return cvs;
  },

  duplicateCV(id: string): CVData | null {
    const cvs = this.getSavedCVs();
    const source = cvs.find((c) => c.id === id);
    if (!source) return null;
    const duplicated: CVData = {
      ...source,
      id: 'cv-' + Date.now(),
      title: `${source.title} (Copy)`,
      lastModified: Date.now(),
    };
    cvs.unshift(duplicated);
    this.setSavedCVs(cvs);
    return duplicated;
  },

  // ------------------ GENERIC DOCUMENTS STORAGE ------------------
  getSavedDocs(): GenericDocumentData[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DOCUMENTS);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Failed to load documents:', e);
    }
    // Seed with sample docs
    const defaults = Object.values(sampleDocuments);
    this.setSavedDocs(defaults);
    return defaults;
  },

  setSavedDocs(docs: GenericDocumentData[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(docs));
    } catch (e) {
      console.error('Failed to save documents:', e);
    }
  },

  saveDoc(doc: GenericDocumentData): void {
    const docs = this.getSavedDocs();
    const index = docs.findIndex((item) => item.id === doc.id);
    const updated = { ...doc, lastModified: Date.now() };
    if (index >= 0) {
      docs[index] = updated;
    } else {
      docs.unshift(updated);
    }
    this.setSavedDocs(docs);
  },

  deleteDoc(id: string): GenericDocumentData[] {
    const docs = this.getSavedDocs().filter((item) => item.id !== id);
    this.setSavedDocs(docs);
    return docs;
  },

  duplicateDoc(id: string): GenericDocumentData | null {
    const docs = this.getSavedDocs();
    const source = docs.find((d) => d.id === id);
    if (!source) return null;
    const duplicated: GenericDocumentData = {
      ...source,
      id: 'doc-' + Date.now(),
      title: `${source.title} (Copy)`,
      lastModified: Date.now(),
    };
    docs.unshift(duplicated);
    this.setSavedDocs(docs);
    return duplicated;
  },

  // DocumentData API
  getSavedDocuments(): DocumentData[] {
    try {
      const data = localStorage.getItem('smartcv_typed_docs_v1');
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error(e);
    }
    this.setSavedDocuments(SAMPLE_DOCUMENTS);
    return SAMPLE_DOCUMENTS;
  },

  setSavedDocuments(docs: DocumentData[]): void {
    try {
      localStorage.setItem('smartcv_typed_docs_v1', JSON.stringify(docs));
    } catch (e) {
      console.error(e);
    }
  },

  saveDocument(doc: DocumentData): void {
    const list = this.getSavedDocuments();
    const idx = list.findIndex((d) => d.id === doc.id);
    const updated = { ...doc, lastModified: Date.now() };
    if (idx >= 0) {
      list[idx] = updated;
    } else {
      list.unshift(updated);
    }
    this.setSavedDocuments(list);
  },

  deleteDocument(id: string): DocumentData[] {
    const list = this.getSavedDocuments().filter((d) => d.id !== id);
    this.setSavedDocuments(list);
    return list;
  },

  duplicateDocument(id: string): DocumentData | null {
    const list = this.getSavedDocuments();
    const source = list.find((d) => d.id === id);
    if (!source) return null;
    const duplicated: DocumentData = {
      ...source,
      id: 'doc-' + Date.now(),
      title: `${source.title} (Copy)`,
      lastModified: Date.now(),
    };
    list.unshift(duplicated);
    this.setSavedDocuments(list);
    return duplicated;
  },

  // ------------------ CUSTOM TEMPLATES (ADMIN) ------------------
  getAllTemplates(): DocumentTemplate[] {
    try {
      const custom = localStorage.getItem(STORAGE_KEYS.TEMPLATES);
      const customTemplates: DocumentTemplate[] = custom ? JSON.parse(custom) : [];
      return [...TEMPLATES_DATA, ...customTemplates];
    } catch {
      return TEMPLATES_DATA;
    }
  },

  saveCustomTemplate(template: DocumentTemplate): void {
    try {
      const custom = localStorage.getItem(STORAGE_KEYS.TEMPLATES);
      const list: DocumentTemplate[] = custom ? JSON.parse(custom) : [];
      const index = list.findIndex((t) => t.id === template.id);
      if (index >= 0) {
        list[index] = template;
      } else {
        list.push(template);
      }
      localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(list));
    } catch (e) {
      console.error('Failed to save custom template:', e);
    }
  },

  deleteCustomTemplate(templateId: string): void {
    try {
      const custom = localStorage.getItem(STORAGE_KEYS.TEMPLATES);
      if (!custom) return;
      const list: DocumentTemplate[] = JSON.parse(custom);
      const filtered = list.filter((t) => t.id !== templateId);
      localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(filtered));
    } catch (e) {
      console.error('Failed to delete custom template:', e);
    }
  },

  // ------------------ FAVORITE CVs ------------------
  toggleFavoriteCV(id: string): CVData[] {
    const cvs = this.getSavedCVs();
    const target = cvs.find((c) => c.id === id);
    if (target) {
      target.isFavorite = !target.isFavorite;
      target.lastModified = Date.now();
      this.setSavedCVs(cvs);
    }
    return cvs;
  },

  getFavoriteCVs(): CVData[] {
    return this.getSavedCVs().filter((c) => Boolean(c.isFavorite));
  },

  // ------------------ USER MASTER PROFILE & 1-CLICK CV ------------------
  getMasterProfile(): UserProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MASTER_PROFILE);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Failed to load master profile:', e);
    }
    this.saveMasterProfile(DEFAULT_MASTER_PROFILE);
    return DEFAULT_MASTER_PROFILE;
  },

  saveMasterProfile(profile: UserProfile): void {
    try {
      localStorage.setItem(STORAGE_KEYS.MASTER_PROFILE, JSON.stringify(profile));
    } catch (e) {
      console.error('Failed to save master profile:', e);
    }
  },

  /**
   * Generates a complete, authentic, human-style CV in 1-click using the user's master profile.
   */
  createCVFromMasterProfile(templateId = 'bangladeshi-standard', language: 'en' | 'bn' = 'bn'): CVData {
    const profile = this.getMasterProfile();
    const newId = 'cv-profile-' + Date.now();

    const newCV: CVData = {
      id: newId,
      title: `${profile.fullName} - ${language === 'bn' ? 'সিভি' : 'Resume'}`,
      templateId,
      language,
      lastModified: Date.now(),
      isATS: templateId.includes('ats'),
      isFavorite: false,

      fullName: profile.fullName || 'মো: হাবিবুর রহমান',
      professionalTitle: profile.professionalTitle || 'Software Engineer',
      photoUrl: profile.photoUrl || DEFAULT_AVATAR,
      photoShape: profile.photoShape || 'circle',
      phone: profile.phone || '+880 1712-345678',
      email: profile.email || 'user@example.com',
      address: profile.address || 'Dhaka, Bangladesh',
      website: profile.website || '',
      linkedin: profile.linkedin || '',
      github: profile.github || '',

      careerObjective: profile.careerObjective || '',
      professionalSummary: profile.professionalSummary || '',
      skills: profile.skills && profile.skills.length > 0 ? profile.skills : ['JavaScript', 'HTML/CSS', 'Communication'],
      computerSkills: profile.computerSkills || ['MS Word', 'Internet Browsing'],
      interpersonalSkills: ['Problem Solving', 'Team Collaboration', 'Time Management'],
      languages: profile.languages && profile.languages.length > 0 ? profile.languages : ['বাংলা', 'English'],
      education: profile.education || [],
      experience: profile.experience || [],
      projects: profile.projects || [],
      certifications: profile.certifications || [],
      personalInfo: profile.personalInfo || {
        fatherName: '',
        motherName: '',
        dateOfBirth: '',
        gender: '',
        nationality: 'Bangladeshi',
        religion: '',
        maritalStatus: 'Single',
        bloodGroup: '',
        permanentAddress: '',
        presentAddress: '',
      },
      references: profile.references || [],
      declaration:
        language === 'bn'
          ? 'আমি প্রত্যয়ন করছি যে, এই বিবরণীতে প্রদত্ত তথ্যাদি আমার জ্ঞান ও বিশ্বাসমতে সম্পূর্ণরূপে সত্য ও সঠিক।'
          : 'I hereby declare that all the information provided above is true and accurate to the best of my knowledge.',
      signatureText: profile.fullName,
      signatureDate: new Date().toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),

      sectionsConfig: [
        { id: 'objective', name: 'Career Objective', nameBn: 'ক্যারিয়ার অবজেক্টিভ', visible: true, order: 1 },
        { id: 'experience', name: 'Work Experience', nameBn: 'কাজের অভিজ্ঞতা', visible: true, order: 2 },
        { id: 'education', name: 'Academic Qualifications', nameBn: 'শিক্ষাগত যোগ্যতা', visible: true, order: 3 },
        { id: 'skills', name: 'Skills & Proficiencies', nameBn: 'দক্ষতা ও পারদর্শিতা', visible: true, order: 4 },
        { id: 'personal', name: 'Personal Details', nameBn: 'ব্যক্তিগত তথ্যাবলী', visible: true, order: 5 },
        { id: 'references', name: 'References', nameBn: 'রেফারেন্স', visible: true, order: 6 },
        { id: 'declaration', name: 'Declaration', nameBn: 'ঘোষণাপত্র', visible: true, order: 7 },
      ],

      design: {
        primaryColor: '#2563EB',
        secondaryColor: '#1E40AF',
        fontFamily: language === 'bn' ? 'Noto Sans Bengali' : 'Inter',
        fontSize: 'medium',
        lineHeight: 'normal',
        pageMargin: 'normal',
        sectionSpacing: 'normal',
        headerStyle: templateId.includes('bangladeshi')
          ? 'bangladeshi'
          : templateId.includes('corporate')
          ? 'sidebar'
          : 'classic',
      },

      pagesCount: 1,
    };

    this.saveCV(newCV);
    return newCV;
  },
};

