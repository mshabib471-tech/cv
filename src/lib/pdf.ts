import * as htmlToImage from 'html-to-image';
import jsPDF from 'jspdf';

export interface DownloadReadyEventDetail {
  url: string;
  filename: string;
  type: 'pdf' | 'jpg';
  pages?: { url: string; filename: string }[];
}

export interface PDFGenerationProgress {
  progress: number; // 0 to 100
  message: string;
  stage: 'preparing' | 'rendering' | 'assembling' | 'saving' | 'complete' | 'error';
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
  filename = 'SmartCV_Document.pdf',
  onProgress?: (progress: PDFGenerationProgress) => void
): Promise<boolean> {
  onProgress?.({
    progress: 5,
    message: 'Initializing high-resolution PDF exporter...',
    stage: 'preparing',
  });

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
    onProgress?.({
      progress: 0,
      message: 'Document container element could not be found.',
      stage: 'error',
    });
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
    onProgress?.({
      progress: 15,
      message: 'Loading fonts and preparing print canvas...',
      stage: 'preparing',
    });

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
      const pageProgress = Math.round(20 + (i / pages.length) * 60);

      onProgress?.({
        progress: pageProgress,
        message: `Rendering page ${i + 1} of ${pages.length} in 2x print quality...`,
        stage: 'rendering',
      });

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

    onProgress?.({
      progress: 88,
      message: 'Assembling document pages into vector PDF...',
      stage: 'assembling',
    });

    const cleanFilename = filename.toLowerCase().endsWith('.pdf') ? filename : `${filename}.pdf`;
    const pdfBlob = pdf.output('blob');

    onProgress?.({
      progress: 96,
      message: 'Finalizing PDF file and initiating download...',
      stage: 'saving',
    });

    triggerFileDownload(pdfBlob, cleanFilename);

    onProgress?.({
      progress: 100,
      message: 'PDF generated successfully!',
      stage: 'complete',
    });

    return true;
  } catch (error: any) {
    console.error('PDF Generation error:', error);
    onProgress?.({
      progress: 0,
      message: error?.message || 'Failed to generate PDF.',
      stage: 'error',
    });
    return false;
  } finally {
    container.style.transform = savedTransform;
    container.style.transformOrigin = savedTransformOrigin;
    if (tempStyle.parentNode) {
      tempStyle.parentNode.removeChild(tempStyle);
    }
  }
}

export interface JPEGExportResult {
  success: boolean;
  dataUrl?: string;
  filename?: string;
}

/**
 * Exports each page of the document as high-resolution JPG / JPEG image(s).
 * Multi-page documents download individual page images.
 * Returns result object with dataUrl and filename for preview and re-download.
 */
export async function exportDocumentAsJPEG(
  elementIdOrSelector: string,
  baseFilename = 'SmartCV'
): Promise<JPEGExportResult> {
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
    return { success: false };
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

    let lastDataUrl = '';
    let lastFilename = '';

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
      lastDataUrl = dataUrl;
      lastFilename = imageFilename;

      // Convert data URL to Blob for reliable cross-browser download
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      triggerFileDownload(blob, imageFilename);

      if (i < pages.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 400));
      }
    }

    return {
      success: true,
      dataUrl: lastDataUrl,
      filename: lastFilename,
    };
  } catch (error) {
    console.error('JPEG Export error:', error);
    return { success: false };
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
