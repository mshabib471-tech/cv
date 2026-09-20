import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Ensures all images inside an element have crossOrigin set to anonymous
 * and converts remote images to data URLs where possible to avoid canvas taint.
 */
async function sanitizeImagesForCanvas(element: HTMLElement): Promise<() => void> {
  const imgs = Array.from(element.querySelectorAll<HTMLImageElement>('img'));
  const originalSources: { img: HTMLImageElement; src: string; crossOrigin: string | null }[] = [];

  for (const img of imgs) {
    originalSources.push({
      img,
      src: img.src,
      crossOrigin: img.crossOrigin,
    });

    if (!img.crossOrigin) {
      img.crossOrigin = 'anonymous';
    }

    // If it's already a data URL, it's 100% safe
    if (img.src.startsWith('data:')) {
      continue;
    }

    // Attempt to convert remote image to data URL
    try {
      const response = await fetch(img.src, { mode: 'cors' });
      const blob = await response.blob();
      const reader = new FileReader();
      const dataUrl = await new Promise<string>((resolve) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = () => resolve(img.src);
        reader.readAsDataURL(blob);
      });
      img.src = dataUrl;
    } catch {
      // If fetch fails (CORS restriction), keep original and rely on html2canvas useCORS
    }
  }

  // Return restore function
  return () => {
    for (const item of originalSources) {
      item.img.src = item.src;
      if (item.crossOrigin === null) {
        item.img.removeAttribute('crossOrigin');
      } else {
        item.img.crossOrigin = item.crossOrigin;
      }
    }
  };
}

/**
 * Triggers a direct browser file download via Blob URL
 */
function triggerBlobDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    if (a.parentNode) a.parentNode.removeChild(a);
    URL.revokeObjectURL(url);
  }, 2000);
}

/**
 * Robust, pixel-perfect PDF generator for A4 CVs and documents.
 * Directly captures rendered A4 pages at 2x crisp DPI without blank screen glitches.
 */
export async function generateAndDownloadPDF(
  elementIdOrSelector: string,
  filename = 'SmartCV_Document.pdf'
): Promise<boolean> {
  // 1. Locate container
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
    window.print();
    return false;
  }

  // 2. Identify all A4 pages to render
  let pages: HTMLElement[] = [];
  if (container.classList.contains('a4-page')) {
    pages = [container];
  } else {
    pages = Array.from(container.querySelectorAll<HTMLElement>('.a4-page'));
    if (pages.length === 0) {
      pages = [container];
    }
  }

  // 3. Temporarily reset zoom/scale transform so html2canvas renders exact 1:1 pixels
  const savedTransform = container.style.transform;
  const savedTransformOrigin = container.style.transformOrigin;
  container.style.transform = 'none';
  container.style.transformOrigin = 'top center';

  // 4. Inject temporary export styles to hide controls and remove edit outlines
  const tempStyle = document.createElement('style');
  tempStyle.id = 'temp-pdf-export-styles';
  tempStyle.innerHTML = `
    .no-print, [data-html2canvas-ignore], button.interactive-edit-control, input.hidden-file-input {
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

  const restoreImages = await sanitizeImagesForCanvas(container);

  try {
    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }

    // Wait a moment for DOM to settle
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Initialize A4 Portrait jsPDF (210mm x 297mm)
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

      // Render canvas with html2canvas directly
      const canvas = await html2canvas(pageEl, {
        scale: 2, // 2x Retina resolution
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#ffffff',
        logging: false,
        width: pageEl.offsetWidth || 794,
        height: pageEl.offsetHeight || 1123,
      });

      let imgData = '';
      try {
        imgData = canvas.toDataURL('image/jpeg', 0.98);
      } catch (e) {
        console.warn('Canvas toDataURL failed with high quality, retrying fallback', e);
        imgData = canvas.toDataURL('image/png');
      }

      if (i > 0) {
        pdf.addPage('a4', 'portrait');
      }

      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
    }

    const cleanFilename = filename.toLowerCase().endsWith('.pdf') ? filename : `${filename}.pdf`;

    // Download PDF via Blob to ensure it works across all browsers and iframes
    const pdfBlob = pdf.output('blob');
    triggerBlobDownload(pdfBlob, cleanFilename);

    return true;
  } catch (error) {
    console.error('PDF Generation failed, triggering print fallback:', error);
    const previousTitle = document.title;
    document.title = filename.replace(/\.pdf$/i, '');
    window.print();
    setTimeout(() => {
      document.title = previousTitle;
    }, 2000);
    return false;
  } finally {
    // Restore original state
    container.style.transform = savedTransform;
    container.style.transformOrigin = savedTransformOrigin;
    if (tempStyle.parentNode) {
      tempStyle.parentNode.removeChild(tempStyle);
    }
    restoreImages();
  }
}

/**
 * Exports each page of the document as high-resolution JPG / JPEG image(s).
 * Multi-page documents download individual page images sequentially.
 */
export async function exportDocumentAsJPEG(
  elementIdOrSelector: string,
  baseFilename = 'SmartCV'
): Promise<boolean> {
  // 1. Locate container
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

  // 2. Identify all A4 pages to render
  let pages: HTMLElement[] = [];
  if (container.classList.contains('a4-page')) {
    pages = [container];
  } else {
    pages = Array.from(container.querySelectorAll<HTMLElement>('.a4-page'));
    if (pages.length === 0) {
      pages = [container];
    }
  }

  // 3. Temporarily reset zoom/scale transform
  const savedTransform = container.style.transform;
  const savedTransformOrigin = container.style.transformOrigin;
  container.style.transform = 'none';
  container.style.transformOrigin = 'top center';

  // 4. Inject temporary export styles
  const tempStyle = document.createElement('style');
  tempStyle.id = 'temp-jpeg-export-styles';
  tempStyle.innerHTML = `
    .no-print, [data-html2canvas-ignore], button.interactive-edit-control, input.hidden-file-input {
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

  const restoreImages = await sanitizeImagesForCanvas(container);

  try {
    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }

    await new Promise((resolve) => setTimeout(resolve, 100));

    const cleanBaseName = baseFilename
      .replace(/\.(pdf|jpe?g|doc|docx)$/i, '')
      .replace(/[\s\W]+/g, '_')
      .replace(/^_+|_+$/g, '') || 'Document';

    for (let i = 0; i < pages.length; i++) {
      const pageEl = pages[i];
      const canvas = await html2canvas(pageEl, {
        scale: 2, // 2x high resolution
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#ffffff',
        logging: false,
        width: pageEl.offsetWidth || 794,
        height: pageEl.offsetHeight || 1123,
      });

      const pageSuffix = pages.length > 1 ? `_Page_${i + 1}` : '';
      const imageFilename = `${cleanBaseName}${pageSuffix}.jpg`;

      await new Promise<void>((resolve) => {
        canvas.toBlob(
          (blob) => {
            if (blob) {
              triggerBlobDownload(blob, imageFilename);
            }
            resolve();
          },
          'image/jpeg',
          0.98
        );
      });

      // Brief delay between multi-page downloads so browser does not block popups
      if (i < pages.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 400));
      }
    }

    return true;
  } catch (error) {
    console.error('JPEG Export failed:', error);
    return false;
  } finally {
    container.style.transform = savedTransform;
    container.style.transformOrigin = savedTransformOrigin;
    if (tempStyle.parentNode) {
      tempStyle.parentNode.removeChild(tempStyle);
    }
    restoreImages();
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
  // Strip buttons, no-print elements, and edit controls from Word HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlContent;
  tempDiv.querySelectorAll('button, .no-print, [data-html2canvas-ignore], input').forEach((el) => el.remove());

  const cleanContent = tempDiv.innerHTML;

  const header = `<!DOCTYPE html><html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
  <head>
    <meta charset="utf-8">
    <title>${title}</title>
    <!--[if gte mso 9]>
    <xml>
      <w:WordDocument>
        <w:View>Print</w:View>
        <w:Zoom>100</w:Zoom>
        <w:DoNotOptimizeForBrowser/>
      </w:WordDocument>
    </xml>
    <![endif]-->
    <style>
      @page {
        size: 21cm 29.7cm;
        margin: 2cm 2cm 2cm 2cm;
        mso-page-orientation: portrait;
      }
      body {
        font-family: 'Calibri', 'Arial', sans-serif;
        font-size: 11pt;
        line-height: 1.4;
        color: #111827;
      }
      h1, h2, h3 {
        color: #1e3a8a;
        margin-top: 14pt;
        margin-bottom: 6pt;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 8pt;
        margin-bottom: 8pt;
      }
      th, td {
        border: 1px solid #94a3b8;
        padding: 6pt;
        text-align: left;
      }
      th {
        background-color: #f1f5f9;
        font-weight: bold;
      }
    </style>
  </head>
  <body>`;
  const footer = `</body></html>`;

  const blob = new Blob(['\ufeff', header + cleanContent + footer], {
    type: 'application/msword;charset=utf-8',
  });

  const cleanFilename = `${title.replace(/[^a-zA-Z0-9_\-\u0980-\u09FF]/g, '_')}.doc`;
  triggerBlobDownload(blob, cleanFilename);
}
