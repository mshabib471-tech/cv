import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Robust, pixel-perfect PDF generator for A4 CVs and documents.
 * Renders each A4 page into an isolated off-screen sandbox to avoid
 * viewport clipping, transform scale offsets, and blank white screenshots.
 */
export async function generateAndDownloadPDF(
  elementIdOrSelector: string,
  filename = 'SmartCV_Document.pdf'
): Promise<boolean> {
  // 1. Locate the target element
  let element = document.getElementById(elementIdOrSelector);
  if (!element) {
    element = document.querySelector<HTMLElement>(elementIdOrSelector);
  }
  if (!element) {
    element =
      document.querySelector<HTMLElement>('#cv-printable-document-container') ||
      document.querySelector<HTMLElement>('#general-doc-printable') ||
      document.querySelector<HTMLElement>('.printable-document-container');
  }

  if (!element) {
    console.error(`Element ${elementIdOrSelector} not found for PDF export.`);
    window.print();
    return false;
  }

  // 2. Identify all A4 pages to render
  let pages: HTMLElement[] = [];
  if (element.classList.contains('a4-page')) {
    pages = [element];
  } else {
    pages = Array.from(element.querySelectorAll<HTMLElement>('.a4-page'));
    if (pages.length === 0) {
      pages = [element];
    }
  }

  // 3. Create an isolated offscreen sandbox to prevent layout shift & white canvas bugs
  const sandbox = document.createElement('div');
  sandbox.id = 'pdf-isolated-export-sandbox';
  sandbox.style.position = 'fixed';
  sandbox.style.left = '-12000px';
  sandbox.style.top = '0';
  sandbox.style.width = '794px'; // 210mm at standard 96 DPI
  sandbox.style.backgroundColor = '#ffffff';
  sandbox.style.zIndex = '-99999';
  sandbox.style.opacity = '1';
  sandbox.style.pointerEvents = 'none';
  sandbox.style.margin = '0';
  sandbox.style.padding = '0';
  sandbox.style.overflow = 'visible';
  document.body.appendChild(sandbox);

  try {
    // Ensure all web fonts are loaded
    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }

    // Initialize A4 Portrait jsPDF (210mm x 297mm)
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    const pdfWidth = 210; // mm
    const pdfHeight = 297; // mm

    for (let i = 0; i < pages.length; i++) {
      const origPage = pages[i];

      // Clone page into sandbox
      const clonedPage = origPage.cloneNode(true) as HTMLElement;

      // Remove non-printable interactive controls (add buttons, delete icons, file inputs)
      const nonPrintables = clonedPage.querySelectorAll<HTMLElement>(
        'button, .no-print, [data-html2canvas-ignore], input, .interactive-edit-control'
      );
      nonPrintables.forEach((el) => el.remove());

      // Disable contentEditable on cloned element so focus rings or carets don't render
      const editables = clonedPage.querySelectorAll<HTMLElement>('[contenteditable]');
      editables.forEach((el) => {
        el.removeAttribute('contenteditable');
        el.style.outline = 'none';
        el.style.border = 'none';
        el.style.boxShadow = 'none';
      });

      // Normalize geometry for 794px A4 pixel canvas
      clonedPage.style.transform = 'none';
      clonedPage.style.webkitTransform = 'none';
      clonedPage.style.boxShadow = 'none';
      clonedPage.style.margin = '0 auto';
      clonedPage.style.width = '794px';
      clonedPage.style.minHeight = '1123px';
      clonedPage.style.height = '1123px';
      clonedPage.style.position = 'relative';
      clonedPage.style.backgroundColor = '#ffffff';
      clonedPage.style.overflow = 'hidden';

      sandbox.innerHTML = '';
      sandbox.appendChild(clonedPage);

      // Brief delay for styles and DOM attachment to settle
      await new Promise((resolve) => setTimeout(resolve, 80));

      const pageHeight = clonedPage.offsetHeight || 1123;

      const canvas = await html2canvas(clonedPage, {
        scale: 2, // 2x retina crisp quality
        useCORS: true,
        allowTaint: false, // Disallow taint to avoid toDataURL security errors
        logging: false,
        backgroundColor: '#ffffff',
        width: 794,
        height: pageHeight,
        windowWidth: 794,
        windowHeight: pageHeight,
        x: 0,
        y: 0,
        scrollX: 0,
        scrollY: 0,
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);

      if (i > 0) {
        pdf.addPage('a4', 'portrait');
      }

      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
    }

    const cleanFilename = filename.toLowerCase().endsWith('.pdf') ? filename : `${filename}.pdf`;
    
    // Set document title dynamically so browser print/save defaults to this clean filename
    const previousTitle = document.title;
    document.title = cleanFilename.replace(/\.pdf$/i, '');
    
    pdf.save(cleanFilename);
    
    // Restore document title after short delay
    setTimeout(() => {
      document.title = previousTitle;
    }, 1000);

    return true;
  } catch (error) {
    console.error('PDF Generation failed, triggering print fallback:', error);
    const cleanFilename = filename.toLowerCase().endsWith('.pdf') ? filename : `${filename}.pdf`;
    const previousTitle = document.title;
    document.title = cleanFilename.replace(/\.pdf$/i, '');
    window.print();
    setTimeout(() => {
      document.title = previousTitle;
    }, 2000);
    return false;
  } finally {
    if (sandbox && sandbox.parentNode) {
      sandbox.parentNode.removeChild(sandbox);
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

export function downloadAsDocx(title: string, htmlContent: string): void {
  const header = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${title}</title><style>
    body { font-family: 'Arial', sans-serif; line-height: 1.5; color: #1e293b; padding: 20px; }
    h1, h2, h3 { color: #1e3a8a; }
    table { width: 100%; border-collapse: collapse; margin-top: 10px; }
    th, td { border: 1px solid #cbd5e1; padding: 8px; text-align: left; }
  </style></head><body>`;
  const footer = `</body></html>`;
  const blob = new Blob(['\ufeff', header + htmlContent + footer], {
    type: 'application/msword;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${title.replace(/[^a-zA-Z0-9_\-\u0980-\u09FF]/g, '_')}.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

