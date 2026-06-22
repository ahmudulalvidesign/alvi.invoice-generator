import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

/**
 * Renders a DOM node (the invoice preview) to a multi-page A4 PDF.
 * Uses a high scale factor for crisp text/logo rendering.
 */
export async function exportNodeToPDF(node, filename = 'invoice.pdf') {
  if (!node) throw new Error('No invoice node to export')

  const canvas = await html2canvas(node, {
    scale: 3,
    useCORS: true,
    backgroundColor: '#ffffff',
    logging: false,
  })

  const imgData = canvas.toDataURL('image/png')

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  })

  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()

  const imgWidth = pageWidth
  const imgHeight = (canvas.height * imgWidth) / canvas.width

  let heightLeft = imgHeight
  let position = 0

  pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST')
  heightLeft -= pageHeight

  // Only add another page if there is meaningful content remaining (> 5mm threshold)
  while (heightLeft > 5) {
    position = heightLeft - imgHeight
    pdf.addPage()
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST')
    heightLeft -= pageHeight
  }

  pdf.save(filename)
}
