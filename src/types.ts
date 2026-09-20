export type Language = 'en' | 'bn';

export type TemplateCategory =
  | 'CV'
  | 'Resume'
  | 'Marriage CV'
  | 'Cover Letter'
  | 'Application'
  | 'Experience Certificate'
  | 'Joining Letter'
  | 'Resignation Letter'
  | 'Certificate'
  | 'Form'
  | 'Money Receipt'
  | 'Question / Exam'
  | 'Other';

export type TemplateStyle =
  | 'Professional'
  | 'Modern'
  | 'Simple'
  | 'Corporate'
  | 'Creative'
  | 'Traditional'
  | 'ATS Friendly'
  | 'Minimal'
  | 'Executive'
  | 'Elegant'
  | 'Bangladeshi Standard';

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  boardOrUniversity?: string;
  board?: string;
  subject?: string;
  cgpaOrGpa?: string;
  grade?: string;
  passingYear: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  responsibilities: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  technologies: string;
  link?: string;
}

export interface CertificationItem {
  id: string;
  title: string;
  issuer: string;
  year: string;
}

export interface ReferenceItem {
  id: string;
  name: string;
  designation: string;
  organization: string;
  phone: string;
  email: string;
}

export interface PersonalInfo {
  fatherName: string;
  motherName: string;
  dateOfBirth: string;
  gender: string;
  nationality: string;
  religion: string;
  maritalStatus: string;
  bloodGroup: string;
  permanentAddress: string;
  presentAddress: string;
  height?: string;
  complexion?: string;
  weight?: string;
  nidOrPassport?: string;
}

export interface CVSectionConfig {
  id: string;
  name: string;
  nameBn: string;
  visible: boolean;
  order: number;
}

export interface CVData {
  id: string;
  title: string;
  templateId: string;
  category?: string;
  language: Language;
  lastModified: number;
  isATS?: boolean;

  // Header / Contact
  fullName: string;
  professionalTitle: string;
  photoUrl?: string;
  photoShape: 'circle' | 'square' | 'rounded' | 'none';
  phone: string;
  email: string;
  address: string;
  website?: string;
  linkedin?: string;
  github?: string;

  // Sections
  careerObjective: string;
  professionalSummary: string;
  skills: string[];
  computerSkills: string[];
  interpersonalSkills: string[];
  languages: string[];
  education: EducationItem[];
  experience: ExperienceItem[];
  projects: ProjectItem[];
  certifications: CertificationItem[];
  personalInfo: PersonalInfo;
  references: ReferenceItem[];
  declaration: string;
  signatureText: string;
  signatureDate: string;

  // Custom ordering and visibility
  sectionsConfig: CVSectionConfig[];

  // Styling properties
  design: {
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
    fontSize: 'small' | 'medium' | 'large';
    lineHeight: 'tight' | 'normal' | 'relaxed';
    pageMargin: 'compact' | 'normal' | 'spacious';
    sectionSpacing: 'compact' | 'normal' | 'spacious';
    headerStyle: 'modern' | 'classic' | 'minimal' | 'banner' | 'sidebar' | 'marriage' | 'bangladeshi';
  };

  pagesCount: number;
}

export interface GenericDocumentField {
  id: string;
  label: string;
  labelBn: string;
  value: string;
  type: 'text' | 'textarea' | 'date' | 'number' | 'table';
}

export interface GenericDocumentData {
  id: string;
  title: string;
  templateId: string;
  category: TemplateCategory;
  language: Language;
  lastModified: number;
  recipientName?: string;
  recipientDesignation?: string;
  organizationName?: string;
  organizationAddress?: string;
  date: string;
  subject?: string;
  salutation?: string;
  bodyParagraphs: string[];
  closingText?: string;
  senderName?: string;
  senderTitle?: string;
  senderContact?: string;
  customFields?: Record<string, string>;
  tableData?: Array<Record<string, string>>;
  design: {
    primaryColor: string;
    fontFamily: string;
    fontSize: 'small' | 'medium' | 'large';
    lineHeight: 'tight' | 'normal' | 'relaxed';
    watermark?: string;
    showBorder: boolean;
  };
}

export interface DocumentData {
  id: string;
  title: string;
  category: string;
  language: Language;
  recipient: string;
  date: string;
  subject: string;
  salutation: string;
  bodyParagraphs: string[];
  closing: string;
  design?: {
    fontSize?: string;
    fontFamily?: string;
    lineHeight?: string;
    showBorder?: boolean;
    headerLogo?: string;
  };
  lastModified: number;
}

export interface DocumentTemplate {
  id: string;
  name: string;
  nameBn?: string;
  category: TemplateCategory;
  language: 'English' | 'বাংলা' | 'Bilingual';
  pageCount: number;
  style: TemplateStyle;
  description: string;
  descriptionBn?: string;
  isATS: boolean;
  thumbnailColor?: string;
  accentColor: string;
  previewUrl?: string;
  defaultData?: Partial<CVData> | Partial<GenericDocumentData>;
}

export type ActiveView = 'home' | 'templates' | 'cv-builder' | 'doc-builder' | 'my-docs' | 'dashboard' | 'admin';
