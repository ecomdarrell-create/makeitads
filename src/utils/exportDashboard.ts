import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';

export async function exportDashboardToPDF(elementId: string = 'dashboard-export-content') {
  const element = document.getElementById(elementId);
  if (!element) throw new Error("Dashboard content not found");

  try {
    // ✅ html-to-image supporte nativement oklch/lab
    const dataUrl = await toPng(element, {
      cacheBust: true,
      pixelRatio: 2,
      backgroundColor: '#0f0f1a',
      style: {
        transform: 'scale(1)',
        transformOrigin: 'top left',
      },
    });

    // Créer le PDF
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    // Charger l'image
    const img = new Image();
    img.src = dataUrl;
    await new Promise((resolve) => { img.onload = resolve; });

    const imgWidth = img.width;
    const imgHeight = img.height;
    const scaledWidth = pdfWidth - 20;
    const scaledHeight = (imgHeight * scaledWidth) / imgWidth;

    let heightLeft = scaledHeight;
    let position = 10;

    // Première page
    pdf.addImage(dataUrl, 'PNG', 10, position, scaledWidth, scaledHeight);
    heightLeft -= (pdfHeight - 20);

    // Pages suivantes
    while (heightLeft > 0) {
      position = heightLeft - scaledHeight + 10;
      pdf.addPage();
      pdf.addImage(dataUrl, 'PNG', 10, position, scaledWidth, scaledHeight);
      heightLeft -= (pdfHeight - 20);
    }

    // Header et footer
    const totalPages = pdf.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      
      // Header
      pdf.setFillColor(15, 15, 26);
      pdf.rect(0, 0, pdfWidth, 15, 'F');
      pdf.setFontSize(10);
      pdf.setTextColor(155, 141, 246);
      pdf.text('MakeItAds', 10, 10);
      pdf.setTextColor(148, 163, 184);
      pdf.setFontSize(8);
      pdf.text('Dashboard Report', 60, 10);
      
      // Footer
      pdf.setFillColor(15, 15, 26);
      pdf.rect(0, pdfHeight - 10, pdfWidth, 10, 'F');
      pdf.setTextColor(148, 163, 184);
      pdf.setFontSize(8);
      pdf.text(`Generated: ${new Date().toLocaleString()}`, pdfWidth / 2, pdfHeight - 3, { align: 'center' });
      pdf.text(`Page ${i} / ${totalPages}`, pdfWidth - 10, pdfHeight - 3, { align: 'right' });
    }

    pdf.save(`MakeItAds_Dashboard_${new Date().toISOString().slice(0, 10)}.pdf`);
    
  } catch (error) {
    console.error("❌ PDF Export failed:", error);
    alert("Failed to export PDF. Check console for details.");
    throw error;
  }
}