import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export async function generateAndDownloadPDF(
  elementIdOrSelector: string,
  filename = 'SmartCV_Document.pdf'
): Promise<boolean> {
  // Try to find the target element
  let element = document.getElementById(elementIdOrSelector);
  if (!element) {
    element = document.querySelector<HTMLElement>(elementIdOrSelector);
  }
  if (!element) {
    // Fallback search
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

  // Find all A4 pages to render (supports multi-page CVs & documents)
  let pages: HTMLElement[] = [];
  if (element.classList.contains('a4-page')) {
    pages = [element];
  } else {
    pages = Array.from(element.querySelectorAll<HTMLElement>('.a4-page'));
    if (pages.length === 0) {
      pages = [element];
    }
  }

  // Find parent container with scale transform if any
  const scaleContainers = Array.from(
    document.querySelectorAll<HTMLElement>('.printable-document-container, [style*="transform"]')
  );
  const savedTransforms = new Map<HTMLElement, string>();

  try {
    // Wait for web fonts (e.g. Noto Sans Bengali, Inter, Poppins) to load
    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }

    // Temporarily reset transforms so html2canvas computes pixel-perfect 1:1 coordinates
    scaleContainers.forEach((container) => {
      savedTransforms.set(container, container.style.transform);
      container.style.transform = 'none';
    });

    // Small delay for DOM reflow
    await new Promise((resolve) => setTimeout(resolve, 60));

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
      const page = pages[i];

      const canvas = await html2canvas(page, {
        scale: 2, // High resolution crisp output
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: '#ffffff',
        onclone: (clonedDoc) => {
          // Reset any transforms and box-shadow in cloned document
          const clonedScaled = clonedDoc.querySelectorAll<HTMLElement>('[style*="transform"]');
          clonedScaled.forEach((el) => {
            el.style.transform = 'none';
          });
          const clonedPages = clonedDoc.querySelectorAll<HTMLElement>('.a4-page');
          clonedPages.forEach((p) => {
            p.style.boxShadow = 'none';
            p.style.margin = '0 auto';
          });
        },
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.98);

      if (i > 0) {
        pdf.addPage('a4', 'portrait');
      }

      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
    }

    const cleanFilename = filename.toLowerCase().endsWith('.pdf') ? filename : `${filename}.pdf`;
    pdf.save(cleanFilename);
    return true;
  } catch (error) {
    console.error('PDF Generation failed, invoking print fallback:', error);
    // Provide graceful fallback
    window.print();
    return false;
  } finally {
    // Restore original zoom transforms
    savedTransforms.forEach((origTransform, container) => {
      container.style.transform = origTransform;
    });
  }
}

export function printDocument(): void {
  window.print();
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

