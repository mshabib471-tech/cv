import * as htmlToImage from 'html-to-image';
import jsPDF from 'jspdf';

export interface DownloadReadyEventDetail {
  url: string;
  filename: string;
  type: 'pdf' | 'jpg';
  pages?: { url: string; filename: string }[];
}

/**
 * Fallback image placeholder if an external image cannot be loaded due to CORS
 */
const FALLBACK_AVATAR_PLACEHOLDER =
  'data:image/svg+xml;charset=utf-8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="120" height="150" viewBox="0 0 120 150"%3E%3Crect width="120" height="150" fill="%23f1f5f9"/%3E%3Ccircle cx="60" cy="55" r="28" fill="%2394a3b8"/%3E%3Cpath d="M20,135 C20,105 38,95 60,95 C82,95 100,105 100,135 Z" fill="%2394a3b8"/%3E%3C/svg%3E';

/**
 * Robust file downloader that triggers browser download and dispatches an event
 * so UI can offer a direct user-clickable download link if sandbox blocks automatic clicks.
 */
export function triggerFileDownload(urlOrBlob: Blob | string, filename: string): string {
  const url = typeof urlOrBlob === 'string' ? urlOrBlob : URL.createObjectURL(urlOrBlob);

  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = filename;
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
  document.body.appendChild(a);

  try {
    a.click();
  } catch (err) {
    console.warn('Programmatic download click was blocked, dispatching UI download event:', err);
  }

  // Dispatch custom event for UI fallback
  window.dispatchEvent(
    new CustomEvent<DownloadReadyEventDetail>('smartdoc-download-ready', {
      detail: {
        url,
        filename,
        type: filename.toLowerCase().endsWith('.pdf') ? 'pdf' : 'jpg',
      },
    })
  );

  setTimeout(() => {
    if (a.parentNode) {
      a.parentNode.removeChild(a);
    }
    // Only revoke if blob after a long delay
    if (typeof urlOrBlob !== 'string') {
      setTimeout(() => URL.revokeObjectURL(url), 120000);
    }
  }, 2000);

  return url;
}

/**
 * Robust, pixel-perfect PDF generator for A4 CVs and documents.
 * Uses html-to-image engine which fully supports modern CSS (Tailwind v4 oklch colors, fonts, flex/grid).
 */
export async function generateAndDownloadPDF(
  elementIdOrSelector: string,
  filename = 'SmartCV_Document.pdf'
): Promise<boolean> {
  let container = document.getElementById(elementIdOrSelector);
  if (!container) {
    container = document.querySelector<HTMLElement>(elementIdOrSelector);
  }
  if (!container) {
    container =
      document.querySelector<HTMLElement>('#cv-printable-document-container') ||
      document.querySelector<HTMLElement>('#general-doc-printable') ||
      document.querySelector<HTMLElement>('.printable-document-container');
  }

  if (!container) {
    console.error(`Element ${elementIdOrSelector} not found for PDF export.`);
    return false;
  }

  // Find pages to render
  let pages: HTMLElement[] = [];
  if (container.classList.contains('a4-page')) {
    pages = [container];
  } else {
    pages = Array.from(container.querySelectorAll<HTMLElement>('.a4-page'));
    if (pages.length === 0) {
      pages = [container];
    }
  }

  // Temporarily reset transform zoom
  const savedTransform = container.style.transform;
  const savedTransformOrigin = container.style.transformOrigin;
  container.style.transform = 'none';
  container.style.transformOrigin = 'top center';

  // Inject temporary export style overrides
  const tempStyle = document.createElement('style');
  tempStyle.id = 'temp-pdf-export-styles';
  tempStyle.innerHTML = `
    .no-print, [data-html2canvas-ignore], button.interactive-edit-control, input[type="file"] {
      display: none !important;
    }
    [contenteditable] {
      outline: none !important;
      border-color: transparent !important;
      box-shadow: none !important;
    }
    .a4-page {
      box-shadow: none !important;
    }
  `;
  document.head.appendChild(tempStyle);

  try {
    // Wait for fonts with timeout
    if (document.fonts && document.fonts.ready) {
      await Promise.race([
        document.fonts.ready,
        new Promise((resolve) => setTimeout(resolve, 400)),
      ]);
    }

    await new Promise((resolve) => setTimeout(resolve, 100));

    // A4 dimensions: 210mm x 297mm
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    const pdfWidth = 210;
    const pdfHeight = 297;

    for (let i = 0; i < pages.length; i++) {
      const pageEl = pages[i];

      const dataUrl = await htmlToImage.toJpeg(pageEl, {
        quality: 0.95,
        pixelRatio: 2, // 2x crisp DPI for text & graphics
        backgroundColor: '#ffffff',
        cacheBust: true,
        imagePlaceholder: FALLBACK_AVATAR_PLACEHOLDER,
        filter: (domNode) => {
          if (domNode instanceof HTMLElement) {
            if (
              domNode.classList.contains('no-print') ||
              domNode.hasAttribute('data-html2canvas-ignore') ||
              domNode.tagName === 'INPUT'
            ) {
              return false;
            }
          }
          return true;
        },
      });

      if (i > 0) {
        pdf.addPage('a4', 'portrait');
      }

      pdf.addImage(dataUrl, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
    }

    const cleanFilename = filename.toLowerCase().endsWith('.pdf') ? filename : `${filename}.pdf`;
    const pdfBlob = pdf.output('blob');
    triggerFileDownload(pdfBlob, cleanFilename);

    return true;
  } catch (error) {
    console.error('PDF Generation error:', error);
    return false;
  } finally {
    container.style.transform = savedTransform;
    container.style.transformOrigin = savedTransformOrigin;
    if (tempStyle.parentNode) {
      tempStyle.parentNode.removeChild(tempStyle);
    }
  }
}

/**
 * Exports each page of the document as high-resolution JPG / JPEG image(s).
 * Multi-page documents download individual page images.
 */
export async function exportDocumentAsJPEG(
  elementIdOrSelector: string,
  baseFilename = 'SmartCV'
): Promise<boolean> {
  let container = document.getElementById(elementIdOrSelector);
  if (!container) {
    container = document.querySelector<HTMLElement>(elementIdOrSelector);
  }
  if (!container) {
    container =
      document.querySelector<HTMLElement>('#cv-printable-document-container') ||
      document.querySelector<HTMLElement>('#general-doc-printable') ||
      document.querySelector<HTMLElement>('.printable-document-container');
  }

  if (!container) {
    console.error(`Element ${elementIdOrSelector} not found for JPEG export.`);
    return false;
  }

  let pages: HTMLElement[] = [];
  if (container.classList.contains('a4-page')) {
    pages = [container];
  } else {
    pages = Array.from(container.querySelectorAll<HTMLElement>('.a4-page'));
    if (pages.length === 0) {
      pages = [container];
    }
  }

  const savedTransform = container.style.transform;
  const savedTransformOrigin = container.style.transformOrigin;
  container.style.transform = 'none';
  container.style.transformOrigin = 'top center';

  const tempStyle = document.createElement('style');
  tempStyle.id = 'temp-jpeg-export-styles';
  tempStyle.innerHTML = `
    .no-print, [data-html2canvas-ignore], button.interactive-edit-control, input[type="file"] {
      display: none !important;
    }
    [contenteditable] {
      outline: none !important;
      border-color: transparent !important;
      box-shadow: none !important;
    }
    .a4-page {
      box-shadow: none !important;
    }
  `;
  document.head.appendChild(tempStyle);

  try {
    if (document.fonts && document.fonts.ready) {
      await Promise.race([
        document.fonts.ready,
        new Promise((resolve) => setTimeout(resolve, 400)),
      ]);
    }

    await new Promise((resolve) => setTimeout(resolve, 100));

    const cleanBaseName =
      baseFilename
        .replace(/\.(pdf|jpe?g|doc|docx)$/i, '')
        .replace(/[\s\W]+/g, '_')
        .replace(/^_+|_+$/g, '') || 'SmartDocument';

    for (let i = 0; i < pages.length; i++) {
      const pageEl = pages[i];

      const dataUrl = await htmlToImage.toJpeg(pageEl, {
        quality: 0.96,
        pixelRatio: 2, // 2x high resolution
        backgroundColor: '#ffffff',
        cacheBust: true,
        imagePlaceholder: FALLBACK_AVATAR_PLACEHOLDER,
        filter: (domNode) => {
          if (domNode instanceof HTMLElement) {
            if (
              domNode.classList.contains('no-print') ||
              domNode.hasAttribute('data-html2canvas-ignore') ||
              domNode.tagName === 'INPUT'
            ) {
              return false;
            }
          }
          return true;
        },
      });

      const pageSuffix = pages.length > 1 ? `_Page_${i + 1}` : '';
      const imageFilename = `${cleanBaseName}${pageSuffix}.jpg`;

      // Convert data URL to Blob for reliable cross-browser download
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      triggerFileDownload(blob, imageFilename);

      if (i < pages.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 400));
      }
    }

    return true;
  } catch (error) {
    console.error('JPEG Export error:', error);
    return false;
  } finally {
    container.style.transform = savedTransform;
    container.style.transformOrigin = savedTransformOrigin;
    if (tempStyle.parentNode) {
      tempStyle.parentNode.removeChild(tempStyle);
    }
  }
}

export function printDocument(customTitle = 'SmartCV_Document'): void {
  const previousTitle = document.title;
  document.title = customTitle.replace(/[\s\W]+/g, '_');
  window.print();
  setTimeout(() => {
    document.title = previousTitle;
  }, 2000);
}
