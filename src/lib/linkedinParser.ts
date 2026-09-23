import {
  CVData,
  ExperienceItem,
  EducationItem,
  ProjectItem,
  CertificationItem,
} from '../types';

export interface LinkedInParseSummary {
  fullName?: string;
  professionalTitle?: string;
  experienceCount: number;
  educationCount: number;
  skillsCount: number;
  projectsCount: number;
  certificationsCount: number;
  hasSummary: boolean;
  detectedFormat: 'linkedin-json' | 'linkedin-archive' | 'linkedin-text' | 'generic-json' | 'unknown';
}

export interface LinkedInParseResult {
  success: boolean;
  data: Partial<CVData>;
  summary: LinkedInParseSummary;
  errors?: string[];
  warnings?: string[];
}

/**
 * Helper to safely extract string from multiple possible property names (case-insensitive & snake/camel-case)
 */
function getProp(obj: any, ...keys: string[]): any {
  if (!obj || typeof obj !== 'object') return undefined;

  // Direct check
  for (const k of keys) {
    if (obj[k] !== undefined && obj[k] !== null && obj[k] !== '') {
      return obj[k];
    }
  }

  // Normalized key check
  const objKeys = Object.keys(obj);
  for (const k of keys) {
    const targetNorm = k.toLowerCase().replace(/[\s_-]+/g, '');
    for (const ok of objKeys) {
      const currentNorm = ok.toLowerCase().replace(/[\s_-]+/g, '');
      if (currentNorm === targetNorm && obj[ok] !== undefined && obj[ok] !== null && obj[ok] !== '') {
        return obj[ok];
      }
    }
  }

  return undefined;
}

/**
 * Format a LinkedIn date representation (object, string, or number) into human readable "Mon Year" or "Year"
 */
function parseLinkedInDate(dateVal: any, isEndDate = false): string {
  if (!dateVal) {
    return isEndDate ? 'Present' : '';
  }

  if (typeof dateVal === 'string') {
    const trimmed = dateVal.trim();
    if (!trimmed || /present|current|now|আজ পর্যন্ত/i.test(trimmed)) {
      return isEndDate ? 'Present' : '';
    }
    return trimmed;
  }

  if (typeof dateVal === 'number') {
    return String(dateVal);
  }

  if (typeof dateVal === 'object') {
    const year = dateVal.year || dateVal.Year || dateVal.yr;
    const month = dateVal.month || dateVal.Month || dateVal.mo;

    if (!year) {
      return isEndDate ? 'Present' : '';
    }

    if (!month) {
      return String(year);
    }

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthIdx = typeof month === 'number' ? month - 1 : parseInt(month, 10) - 1;
    const monthStr = monthNames[monthIdx] || String(month);

    return `${monthStr} ${year}`;
  }

  return '';
}

/**
 * Extract clean string array from skills data (which may be array of strings or array of objects)
 */
function parseSkillsList(rawSkills: any): string[] {
  if (!rawSkills) return [];

  const list: string[] = [];

  if (Array.isArray(rawSkills)) {
    for (const item of rawSkills) {
      if (typeof item === 'string') {
        const trimmed = item.trim();
        if (trimmed && !list.includes(trimmed)) list.push(trimmed);
      } else if (item && typeof item === 'object') {
        const name = getProp(item, 'name', 'skill', 'Name', 'title');
        if (typeof name === 'string' && name.trim()) {
          const trimmed = name.trim();
          if (!list.includes(trimmed)) list.push(trimmed);
        }
      }
    }
  } else if (typeof rawSkills === 'string') {
    // Delimited string e.g. "React • Node.js • TypeScript" or comma separated
    const parts = rawSkills.split(/[\n,•|·;]+/).map((s) => s.trim()).filter(Boolean);
    parts.forEach((p) => {
      if (!list.includes(p)) list.push(p);
    });
  }

  return list;
}

/**
 * Main JSON Parser: Handles LinkedIn Archive exports, third-party scraper exports, and standard LinkedIn JSON
 */
export function parseLinkedInJSON(rawJson: string | object): LinkedInParseResult {
  let parsed: any;
  const warnings: string[] = [];
  const errors: string[] = [];

  if (typeof rawJson === 'string') {
    try {
      parsed = JSON.parse(rawJson);
    } catch (e: any) {
      return {
        success: false,
        data: {},
        summary: {
          experienceCount: 0,
          educationCount: 0,
          skillsCount: 0,
          projectsCount: 0,
          certificationsCount: 0,
          hasSummary: false,
          detectedFormat: 'unknown',
        },
        errors: ['Invalid JSON format: ' + (e?.message || 'Could not parse JSON string.')],
      };
    }
  } else {
    parsed = rawJson;
  }

  if (!parsed || typeof parsed !== 'object') {
    return {
      success: false,
      data: {},
      summary: {
        experienceCount: 0,
        educationCount: 0,
        skillsCount: 0,
        projectsCount: 0,
        certificationsCount: 0,
        hasSummary: false,
        detectedFormat: 'unknown',
      },
      errors: ['Provided data is not a valid JSON object or array.'],
    };
  }

  // Handle if top-level is an array of data or wrap in object
  let root = parsed;
  if (Array.isArray(parsed)) {
    // If it's an array of positions or skills or profiles
    if (parsed.length > 0 && getProp(parsed[0], 'companyName', 'Company Name', 'title', 'Title')) {
      root = { positions: parsed };
    } else if (parsed.length > 0 && getProp(parsed[0], 'schoolName', 'School Name', 'degreeName')) {
      root = { education: parsed };
    } else {
      root = { data: parsed };
    }
  }

  // Extract nested profile object if present (e.g. { profile: {...} } or { person: {...} } or { basicInfo: {...} })
  const profileObj =
    getProp(root, 'profile', 'person', 'basicInfo', 'personalInfo', 'user') || root;

  // 1. Name
  const firstName = getProp(profileObj, 'firstName', 'First Name', 'first_name', 'givenName') || '';
  const lastName = getProp(profileObj, 'lastName', 'Last Name', 'last_name', 'familyName') || '';
  let fullName = getProp(profileObj, 'fullName', 'full_name', 'name', 'Name');
  if (!fullName && (firstName || lastName)) {
    fullName = `${firstName} ${lastName}`.trim();
  }
  fullName = fullName || '';

  // 2. Headline / Professional Title
  const professionalTitle =
    getProp(profileObj, 'headline', 'Headline', 'professionalTitle', 'title', 'occupation', 'jobTitle') || '';

  // 3. Summary / About
  const professionalSummary =
    getProp(profileObj, 'summary', 'Summary', 'about', 'About', 'bio', 'description') || '';

  // 4. Contact & Links
  const email =
    getProp(profileObj, 'email', 'Email', 'emailAddress', 'Email Address') ||
    getProp(root, 'email', 'Email', 'emailAddress') ||
    '';
  const phone =
    getProp(profileObj, 'phone', 'Phone', 'phoneNumber', 'Phone Numbers', 'mobile') ||
    getProp(root, 'phone', 'Phone') ||
    '';

  // Address / Location
  const city = getProp(profileObj, 'city', 'City', 'locationName');
  const country = getProp(profileObj, 'country', 'Country', 'geoCountryName');
  const location =
    getProp(profileObj, 'location', 'Location', 'address', 'Address', 'formattedLocation') ||
    [city, country].filter(Boolean).join(', ') ||
    '';

  // LinkedIn URL & Websites
  const linkedinUrl =
    getProp(profileObj, 'linkedinUrl', 'linkedin', 'publicIdentifier', 'profileUrl', 'vanityName') ||
    getProp(root, 'linkedinUrl', 'linkedin') ||
    '';
  const website =
    getProp(profileObj, 'website', 'Website', 'websites', 'portfolio', 'blog') || '';

  // Photo
  const photoUrl =
    getProp(profileObj, 'photoUrl', 'pictureUrl', 'profilePicUrl', 'avatar', 'picture', 'image') || '';

  // 5. Positions / Experience
  const rawPositions =
    getProp(root, 'positions', 'Positions', 'experience', 'experiences', 'workExperience', 'jobs') ||
    getProp(profileObj, 'positions', 'experience', 'experiences') ||
    [];

  const experience: ExperienceItem[] = [];
  if (Array.isArray(rawPositions)) {
    rawPositions.forEach((pos: any, idx: number) => {
      if (!pos || typeof pos !== 'object') return;

      const title =
        getProp(pos, 'title', 'Title', 'position', 'jobTitle', 'role') || 'Position / Role';
      const company =
        getProp(pos, 'companyName', 'Company Name', 'company', 'company_name', 'employer', 'organization') ||
        'Company';

      // Dates
      const startRaw =
        getProp(pos, 'startedOn', 'Started On', 'startDate', 'start_date', 'starts_at', 'from') ||
        pos.timePeriod?.startDate;
      const endRaw =
        getProp(pos, 'finishedOn', 'Finished On', 'endDate', 'end_date', 'ends_at', 'to') ||
        pos.timePeriod?.endDate;

      const startDate = parseLinkedInDate(startRaw, false) || '2022';
      const endDate = parseLinkedInDate(endRaw, true) || 'Present';

      const desc =
        getProp(pos, 'description', 'Description', 'summary', 'responsibilities') || '';

      experience.push({
        id: `exp-li-${Date.now()}-${idx}`,
        company,
        position: title,
        startDate,
        endDate,
        responsibilities: desc || '• Key accomplishments and strategic responsibilities.',
      });
    });
  }

  // 6. Education
  const rawEducation =
    getProp(root, 'education', 'Education', 'educations', 'schools', 'academic') ||
    getProp(profileObj, 'education', 'educations') ||
    [];

  const education: EducationItem[] = [];
  if (Array.isArray(rawEducation)) {
    rawEducation.forEach((edu: any, idx: number) => {
      if (!edu || typeof edu !== 'object') return;

      const institution =
        getProp(edu, 'schoolName', 'School Name', 'school', 'institution', 'university', 'college') ||
        'University';
      const degree =
        getProp(edu, 'degreeName', 'Degree Name', 'degree', 'degree_name') || 'Degree';
      const fieldOfStudy =
        getProp(edu, 'fieldOfStudy', 'Field of Study', 'field_of_study', 'major', 'subject');

      const startRaw =
        getProp(edu, 'startedOn', 'startDate', 'start_date', 'starts_at', 'from') ||
        edu.timePeriod?.startDate;
      const endRaw =
        getProp(edu, 'endedOn', 'finishedOn', 'endDate', 'end_date', 'ends_at', 'to') ||
        edu.timePeriod?.endDate;

      const passingYear = parseLinkedInDate(endRaw || startRaw, false) || '2023';
      const grade = getProp(edu, 'grade', 'Grade', 'gpa', 'cgpa');
      const notes = getProp(edu, 'notes', 'Notes', 'activities', 'description');

      education.push({
        id: `edu-li-${Date.now()}-${idx}`,
        institution,
        degree: fieldOfStudy ? `${degree} in ${fieldOfStudy}` : degree,
        subject: fieldOfStudy || undefined,
        passingYear,
        grade: grade ? String(grade) : undefined,
        boardOrUniversity: institution,
      });
    });
  }

  // 7. Skills
  const rawSkills =
    getProp(root, 'skills', 'Skills', 'allSkills', 'competencies') ||
    getProp(profileObj, 'skills', 'Skills');
  const skills = parseSkillsList(rawSkills);

  // 8. Certifications
  const rawCerts =
    getProp(root, 'certifications', 'Certifications', 'licenses', 'licensesAndCertifications') ||
    getProp(profileObj, 'certifications');

  const certifications: CertificationItem[] = [];
  if (Array.isArray(rawCerts)) {
    rawCerts.forEach((cert: any, idx: number) => {
      if (!cert || typeof cert !== 'object') return;

      const title = getProp(cert, 'name', 'title', 'Name', 'certificationName') || 'Certification';
      const issuer =
        getProp(cert, 'authority', 'issuer', 'issuingOrganization', 'organization', 'Authority') ||
        'Issuing Organization';
      const startRaw =
        getProp(cert, 'startedOn', 'startDate', 'start_date', 'starts_at', 'issueDate', 'date') ||
        cert.timePeriod?.startDate;
      const year = parseLinkedInDate(startRaw, false) || '2023';

      certifications.push({
        id: `cert-li-${Date.now()}-${idx}`,
        title,
        issuer,
        year,
      });
    });
  }

  // 9. Projects
  const rawProjects =
    getProp(root, 'projects', 'Projects', 'accomplishments') || getProp(profileObj, 'projects');

  const projects: ProjectItem[] = [];
  if (Array.isArray(rawProjects)) {
    rawProjects.forEach((proj: any, idx: number) => {
      if (!proj || typeof proj !== 'object') return;

      const title = getProp(proj, 'title', 'name', 'Title', 'projectName') || 'Project';
      const description = getProp(proj, 'description', 'Description', 'summary') || '';
      const link = getProp(proj, 'url', 'link', 'projectUrl');
      const tech = getProp(proj, 'technologies', 'skills');
      const technologiesStr = Array.isArray(tech)
        ? tech.join(', ')
        : typeof tech === 'string'
        ? tech
        : '';

      projects.push({
        id: `proj-li-${Date.now()}-${idx}`,
        title,
        description: description || '• Project architectural highlights and results.',
        technologies: technologiesStr,
        link: typeof link === 'string' ? link : undefined,
      });
    });
  }

  // 10. Languages
  const rawLanguages =
    getProp(root, 'languages', 'Languages') || getProp(profileObj, 'languages');
  const languagesList: string[] = [];
  if (Array.isArray(rawLanguages)) {
    rawLanguages.forEach((lang: any) => {
      if (typeof lang === 'string') {
        languagesList.push(lang.trim());
      } else if (lang && typeof lang === 'object') {
        const name = getProp(lang, 'name', 'Name', 'language');
        const prof = getProp(lang, 'proficiency', 'Proficiency');
        if (name) {
          languagesList.push(prof ? `${name} (${prof})` : String(name));
        }
      }
    });
  }

  // Detect format
  let detectedFormat: LinkedInParseSummary['detectedFormat'] = 'generic-json';
  if (root.Positions || root['Profile.json'] || (root.positions && root.positions[0]?.['Company Name'])) {
    detectedFormat = 'linkedin-archive';
  } else if (root.profile || root.headline || root.publicIdentifier || root.experiences) {
    detectedFormat = 'linkedin-json';
  }

  const cvDataPartial: Partial<CVData> = {
    fullName: fullName || undefined,
    professionalTitle: professionalTitle || undefined,
    professionalSummary: professionalSummary || undefined,
    email: email || undefined,
    phone: phone || undefined,
    address: location || undefined,
    linkedin: linkedinUrl ? (linkedinUrl.startsWith('http') ? linkedinUrl : `https://linkedin.com/in/${linkedinUrl}`) : undefined,
    website: website || undefined,
    photoUrl: photoUrl || undefined,
    experience: experience.length > 0 ? experience : undefined,
    education: education.length > 0 ? education : undefined,
    skills: skills.length > 0 ? skills : undefined,
    certifications: certifications.length > 0 ? certifications : undefined,
    projects: projects.length > 0 ? projects : undefined,
    languages: languagesList.length > 0 ? languagesList : undefined,
  };

  return {
    success: true,
    data: cvDataPartial,
    summary: {
      fullName,
      professionalTitle,
      experienceCount: experience.length,
      educationCount: education.length,
      skillsCount: skills.length,
      projectsCount: projects.length,
      certificationsCount: certifications.length,
      hasSummary: Boolean(professionalSummary),
      detectedFormat,
    },
    warnings,
    errors,
  };
}

/**
 * Text-based LinkedIn Parser: Handles copy-pasted public LinkedIn profile text
 */
export function parseLinkedInPublicText(rawText: string): LinkedInParseResult {
  const lines = rawText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  if (lines.length < 3) {
    return {
      success: false,
      data: {},
      summary: {
        experienceCount: 0,
        educationCount: 0,
        skillsCount: 0,
        projectsCount: 0,
        certificationsCount: 0,
        hasSummary: false,
        detectedFormat: 'unknown',
      },
      errors: ['Provided text is too short to be a valid LinkedIn profile.'],
    };
  }

  let fullName = '';
  let professionalTitle = '';
  let address = '';
  let professionalSummary = '';
  const skills: string[] = [];
  const experience: ExperienceItem[] = [];
  const education: EducationItem[] = [];
  const certifications: CertificationItem[] = [];

  // Header detection: Line 0 is usually name, Line 1 is headline, Line 2 is location
  let currentSection = 'header';
  const sectionKeywords: Record<string, RegExp> = {
    about: /^(about|summary|professional summary|ক্যারিয়ার অবজেক্টিভ|সারাংশ)$/i,
    experience: /^(experience|work experience|employment history|চাকরির অভিজ্ঞতা)$/i,
    education: /^(education|scholastic portfolio|academic background|শিক্ষাগত যোগ্যতা)$/i,
    skills: /^(skills|top skills|skills & endorsements|দক্ষতা)$/i,
    certifications: /^(licenses & certifications|certifications|সনদপত্র)$/i,
  };

  let aboutBuffer: string[] = [];
  let expBuffer: string[] = [];
  let eduBuffer: string[] = [];
  let certBuffer: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check for section header switch
    let switched = false;
    for (const [sec, regex] of Object.entries(sectionKeywords)) {
      if (regex.test(line)) {
        currentSection = sec;
        switched = true;
        break;
      }
    }

    if (switched) continue;

    if (currentSection === 'header') {
      if (!fullName) {
        fullName = line;
      } else if (!professionalTitle) {
        professionalTitle = line;
      } else if (!address && /[\w\s]+,\s*[\w\s]+/i.test(line)) {
        address = line.replace(/·.*$/, '').trim();
      }
    } else if (currentSection === 'about') {
      aboutBuffer.push(line);
    } else if (currentSection === 'experience') {
      expBuffer.push(line);
    } else if (currentSection === 'education') {
      eduBuffer.push(line);
    } else if (currentSection === 'skills') {
      // Skills might be bulleted or delimited
      const extracted = parseSkillsList(line);
      extracted.forEach((s) => {
        if (!skills.includes(s)) skills.push(s);
      });
    } else if (currentSection === 'certifications') {
      certBuffer.push(line);
    }
  }

  professionalSummary = aboutBuffer.join('\n');

  // Simple heuristic parser for experience blocks
  // Group lines between job titles or companies
  if (expBuffer.length > 0) {
    let currentExp: Partial<ExperienceItem> | null = null;
    for (let i = 0; i < expBuffer.length; i++) {
      const line = expBuffer[i];
      // Date pattern like "Jan 2021 - Present" or "2018 - 2022"
      const dateMatch = line.match(/(\w+\s+\d{4}|\d{4})\s*[-–—]\s*(\w+\s+\d{4}|\d{4}|present|current)/i);

      if (dateMatch) {
        if (!currentExp) {
          currentExp = {
            id: `exp-text-${Date.now()}-${experience.length}`,
            position: expBuffer[i - 2] || expBuffer[i - 1] || 'Professional Role',
            company: expBuffer[i - 1] || 'Company Name',
            startDate: dateMatch[1],
            endDate: dateMatch[2],
            responsibilities: '',
          };
        } else {
          currentExp.startDate = dateMatch[1];
          currentExp.endDate = dateMatch[2];
        }
      } else if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*')) {
        if (currentExp) {
          currentExp.responsibilities = currentExp.responsibilities
            ? `${currentExp.responsibilities}\n${line}`
            : line;
        }
      } else if (currentExp && currentExp.startDate) {
        // We reached next entry
        experience.push(currentExp as ExperienceItem);
        currentExp = {
          id: `exp-text-${Date.now()}-${experience.length}`,
          position: line,
          company: expBuffer[i + 1] || 'Company',
          startDate: '2022',
          endDate: 'Present',
          responsibilities: '',
        };
      }
    }
    if (currentExp && currentExp.position) {
      if (!currentExp.responsibilities) {
        currentExp.responsibilities = '• Key responsibilities and project leadership.';
      }
      experience.push(currentExp as ExperienceItem);
    }
  }

  // Simple heuristic parser for education blocks
  if (eduBuffer.length > 0) {
    for (let i = 0; i < eduBuffer.length; i += 2) {
      const inst = eduBuffer[i];
      const deg = eduBuffer[i + 1] || 'Graduation';
      if (inst) {
        education.push({
          id: `edu-text-${Date.now()}-${education.length}`,
          institution: inst,
          degree: deg,
          passingYear: '2022',
        });
      }
    }
  }

  return {
    success: true,
    data: {
      fullName: fullName || undefined,
      professionalTitle: professionalTitle || undefined,
      address: address || undefined,
      professionalSummary: professionalSummary || undefined,
      skills: skills.length > 0 ? skills : undefined,
      experience: experience.length > 0 ? experience : undefined,
      education: education.length > 0 ? education : undefined,
    },
    summary: {
      fullName,
      professionalTitle,
      experienceCount: experience.length,
      educationCount: education.length,
      skillsCount: skills.length,
      projectsCount: 0,
      certificationsCount: 0,
      hasSummary: Boolean(professionalSummary),
      detectedFormat: 'linkedin-text',
    },
  };
}

/**
 * Universal LinkedIn Parser Entry Point:
 * Intelligently routes raw input to JSON parser or Text parser.
 */
export function parseLinkedInData(input: string): LinkedInParseResult {
  const trimmed = input.trim();
  if (!trimmed) {
    return {
      success: false,
      data: {},
      summary: {
        experienceCount: 0,
        educationCount: 0,
        skillsCount: 0,
        projectsCount: 0,
        certificationsCount: 0,
        hasSummary: false,
        detectedFormat: 'unknown',
      },
      errors: ['Input is empty. Please paste your LinkedIn JSON or profile text.'],
    };
  }

  // Try JSON first if it begins with { or [
  if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
    return parseLinkedInJSON(trimmed);
  }

  // Otherwise, fallback to text parser
  return parseLinkedInPublicText(trimmed);
}

/**
 * High quality sample LinkedIn JSON data for immediate demonstration and testing
 */
export const SAMPLE_LINKEDIN_PROFILE_JSON = JSON.stringify(
  {
    profile: {
      firstName: 'Sophia',
      lastName: 'Al-Mansoor',
      headline: 'Principal Enterprise Solutions Architect & Cloud Engineering Lead',
      summary:
        'Results-oriented Cloud & Enterprise Solutions Architect with 10+ years architecting fault-tolerant distributed platforms on AWS and Google Cloud. Spearheaded digital modernization for Fortune 500 financial clients, reducing infrastructure expenditures by 32% while sustaining 99.999% SLA reliability.',
      email: 'sophia.almansoor@cloudinnovate.io',
      phone: '+1 (555) 890-4321',
      location: 'San Francisco, CA',
      linkedinUrl: 'https://linkedin.com/in/sophia-almansoor-architect',
      website: 'sophia-architect.tech',
    },
    positions: [
      {
        companyName: 'CloudInnovate Systems',
        title: 'Principal Cloud Architect',
        startedOn: { month: 4, year: 2021 },
        finishedOn: null,
        description:
          '• Architected zero-trust multi-region Kubernetes platform serving 8M+ daily API transactions across EMEA and US.\n• Directed engineering squad of 18 cloud architects and DevOps engineers, achieving 4x deployment frequency.\n• Implemented automated FinOps cost governance resulting in $1.2M annual cloud optimization.',
      },
      {
        companyName: 'Vanguard Fintech Group',
        title: 'Senior Solutions Architect',
        startedOn: { month: 1, year: 2018 },
        finishedOn: { month: 3, year: 2021 },
        description:
          '• Migrated legacy monolithic core banking services to event-driven microservices architecture using Apache Kafka and Go.\n• Designed automated disaster recovery pipelines with sub-2-minute RTO and zero data loss RPO.',
      },
      {
        companyName: 'NexGen Digital Labs',
        title: 'Full-Stack Software Engineer',
        startedOn: { month: 6, year: 2014 },
        finishedOn: { month: 12, year: 2017 },
        description:
          '• Built real-time analytics telemetry dashboards utilizing React, Node.js, and Redis caching layers.\n• Collaborated closely with security teams to pass strict SOC2 Type II and ISO 27001 compliance audits.',
      },
    ],
    education: [
      {
        schoolName: 'University of California, Berkeley',
        degreeName: 'Master of Science (M.S.)',
        fieldOfStudy: 'Computer Science & Distributed Systems',
        endedOn: { month: 5, year: 2014 },
        grade: '3.92 / 4.00',
      },
      {
        schoolName: 'University of California, Davis',
        degreeName: 'Bachelor of Science (B.S.)',
        fieldOfStudy: 'Computer Engineering',
        endedOn: { month: 6, year: 2012 },
        grade: 'Summa Cum Laude (GPA 3.96)',
      },
    ],
    skills: [
      'Amazon Web Services (AWS)',
      'Google Cloud Platform (GCP)',
      'Kubernetes & Docker',
      'Microservices Architecture',
      'Terraform (Infrastructure as Code)',
      'Apache Kafka & Event-Driven Systems',
      'TypeScript & Node.js',
      'Go (Golang)',
      'FinOps & Cost Governance',
      'Zero Trust Security',
    ],
    certifications: [
      {
        name: 'AWS Certified Solutions Architect - Professional',
        authority: 'Amazon Web Services (AWS)',
        startedOn: { month: 8, year: 2023 },
      },
      {
        name: 'Google Cloud Certified Fellow: Hybrid Multi-cloud',
        authority: 'Google Cloud',
        startedOn: { month: 2, year: 2022 },
      },
    ],
    projects: [
      {
        title: 'KubeSecure - Open Source Cluster Audit Tool',
        description:
          '• Automated security scanning engine for Kubernetes manifest misconfigurations with 2,400+ GitHub stars.',
        technologies: 'Go, Kubernetes API, Docker',
        link: 'https://github.com/sophia-almansoor/kubesecure',
      },
    ],
    languages: [
      { name: 'English', proficiency: 'Native or Bilingual' },
      { name: 'Arabic', proficiency: 'Professional Working' },
    ],
  },
  null,
  2
);
