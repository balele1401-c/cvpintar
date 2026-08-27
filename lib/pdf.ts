import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';

interface ExportPdfOptions {
  filename?: string;
  elementId?: string;
  element?: HTMLElement | null;
}

/**
 * Exports an HTML element directly as a downloaded A4 PDF file.
 * Uses native browser rasterization (html-to-image) to support modern CSS (oklch, flexbox, custom fonts)
 * and jsPDF to save directly without triggering any print dialog.
 */
export async function downloadCvAsPdf({
  filename = 'CV-CVPintar.pdf',
  elementId = 'cv-printable-area',
  element,
}: ExportPdfOptions = {}): Promise<void> {
  const targetElement = element || (elementId ? document.getElementById(elementId) : null);

  if (!targetElement) {
    throw new Error('Target element CV tidak ditemukan untuk diunduh');
  }

  // Generate PNG data URL at 2x pixel ratio for crystal-clear text & lines
  const imgData = await toPng(targetElement, {
    quality: 0.98,
    pixelRatio: 2,
    backgroundColor: '#ffffff',
    cacheBust: true,
  });

  // Standard A4 dimensions in mm
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pdfWidth = 210;
  const pdfHeight = 297;

  const imgProps = pdf.getImageProperties(imgData);
  const calculatedHeight = (imgProps.height * pdfWidth) / imgProps.width;

  // Single page or multi-page handling
  if (calculatedHeight <= pdfHeight) {
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, calculatedHeight, undefined, 'FAST');
  } else {
    let heightLeft = calculatedHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, calculatedHeight, undefined, 'FAST');
    heightLeft -= pdfHeight;

    while (heightLeft > 0) {
      position -= pdfHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, calculatedHeight, undefined, 'FAST');
      heightLeft -= pdfHeight;
    }
  }

  const cleanFilename = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
  pdf.save(cleanFilename);
}
