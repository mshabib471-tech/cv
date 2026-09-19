import { CVData, GenericDocumentData, DocumentData, DocumentTemplate } from '../types';
import { sampleCV, sampleBanglaCV } from '../data/sampleCV';
import { sampleDocuments, SAMPLE_DOCUMENTS } from '../data/sampleDocs';
import { TEMPLATES_DATA } from '../data/templates';

const STORAGE_KEYS = {
  CVS: 'smartcv_saved_cvs_v1',
  DOCUMENTS: 'smartcv_saved_docs_v1',
  TEMPLATES: 'smartcv_custom_templates_v1',
  ACTIVE_CV: 'smartcv_current_cv_v1',
  APP_LANG: 'smartcv_app_language_v1',
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
};
