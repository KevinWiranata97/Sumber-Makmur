const PDFDocument = require('pdfkit');
const fs = require('fs');

function generateInvoice(invoiceData, filePath) {
  const doc = new PDFDocument({ margin: 50 });

  // Pipe the output to a file
  doc.pipe(fs.createWriteStream(filePath));

  // Header with company information
  doc
    .fontSize(14)
    .font('Helvetica-Bold')
    .text('CV. SUMBER MAKMUR DIESEL', { align: 'center' })
    .moveDown(0.5);

  doc
    .fontSize(12)
    .font('Helvetica-Bold')
    .text('GENERAL SPAREPART & TECHNICAL SUPPLIER', { align: 'center' })
    .moveDown(0.5);

  doc
    .fontSize(10)
    .font('Helvetica')
    .text('Jl. Krekot Raya, Ruko Komplek Krekot Bunder IV No. 34A', { align: 'center' })
    .text('Jakarta Pusat - 10710', { align: 'center' })
    .text('Telp: (021) 34833155 - 157   Fax: (021) 34833158', { align: 'center' })
    .moveDown(1);

  // Separator line
  // doc
  //   .moveTo(50, 120)
  //   .lineTo(550, 120)
  //   .stroke();

  // Invoice details (left side)
  doc
  .fontSize(10)
  .text(`TIPE TRANSAKSI : ${invoiceData.transaction_type|| '-'}`, 50, 135)
  .text(`TGL.TRANSAKSI : ${invoiceData.transaction_date|| '-'}`, 50, 150)
  .text(`TGL.TEMPO : ${invoiceData.transaction_due_date|| '-'}`, 50, 165)
  .text(`INV NO  : ${invoiceData.invoiceNumber}`, 50, 180) // Changed y-coordinate from 100 to 150
  .text(`SJ NO   : ${invoiceData.sjNumber || '-'}`, 50, 195) // Changed y-coordinate from 115 to 165
  .text(`ITEMS   : ${invoiceData.items.length} Items`, 50, 210) // Changed y-coordinate from 130 to 180
  .text(`PO NO   : ${invoiceData.poNumber || 'BY. PHONE'}`, 50, 225) // Changed y-coordinate from 145 to 195

  // Date and recipient info (right side)
  doc
  .fontSize(10)
  .text(`Jakarta, ${invoiceData.transaction_date}`, 400, 150, { align: 'right' }) // Changed y-coordinate from 100 to 150
  .moveDown()
  .text('Kepada Yth,', { align: 'right' })
  .text(`${invoiceData.customer.name}`, { align: 'right' })
  .text(`${invoiceData.customer.address}`, { align: 'right' })
  .moveDown(1);


  // Table Headers
  const tableTop = 250;
  doc
    .fontSize(10)
    .text('NO.', 50, tableTop)
    .text('QTY', 100, tableTop)
    .text('PART NUMBER', 150, tableTop)
    .text('DESCRIPTION', 250, tableTop)
    .text('UNIT PRICE', 400, tableTop, { width: 90, align: 'right' })
    .text('AMOUNT', 490, tableTop, { align: 'right' })
    .moveDown();

  // Draw a line under the headers
  doc.moveTo(50, tableTop + 15).lineTo(600, tableTop + 15).stroke();

  // List the items
  let position = tableTop + 30;
  invoiceData.items.forEach((item, index) => {
    doc
      .fontSize(10)
      .text(index + 1, 50, position)
      .text(item.quantity, 100, position)
      .text(item.partNumber || '', 150, position)
      .text(item.itemName || '', 250, position)
      .text(item.unitCost.toLocaleString(), 400, position, { width: 90, align: 'right' })
      .text(item.total.toLocaleString(), 490, position, { align: 'right' });
    position += 20;
  });

  // TERBILANG and Summary on Same Line
  const summaryTop = position + 30;

  // Draw a line before the "TERBILANG" and "SUB TOTAL" sections
  doc.moveTo(50, summaryTop - 10).lineTo(600, summaryTop - 10).stroke();

  // Render TERBILANG and Summary
  doc
    .fontSize(10)
    .text(`TERBILANG: # ${invoiceData.terbilang} Rupiah #`, 50, summaryTop, { align: 'left' })
    .text('SUB TOTAL', 400, summaryTop, { width: 90, align: 'right' })
    .text(invoiceData.subTotal.toLocaleString(), 490, summaryTop, { align: 'right' })
    .moveDown(0.5)
    .text('DISCOUNT', 400, summaryTop + 15, { width: 90, align: 'right' })
    .text(invoiceData.discount.toLocaleString(), 490, summaryTop + 15, { align: 'right' })
    .text('TOTAL', 400, summaryTop + 30, { width: 90, align: 'right' })
    .text(invoiceData.total.toLocaleString(), 490, summaryTop + 30, { align: 'right' })
    .text('TOTAL PPN', 400, summaryTop + 45, { width: 90, align: 'right' })
    .text(invoiceData.totalPpn.toLocaleString(), 490, summaryTop + 45, { align: 'right' })
    .font('Helvetica-Bold')
    .text('GRAND TTL', 400, summaryTop + 60, { width: 90, align: 'right' })
    .text(invoiceData.grandTotal.toLocaleString(), 490, summaryTop + 60, { align: 'right' });

  // Tanda Terima and Payment Information
  const bottomPosition = summaryTop + 120;
  doc
    .fontSize(10)
    .text('Tanda Terima,', 50, bottomPosition)
    .text('PEMBAYARAN:', 200, bottomPosition)
    .text('Hormat kami,', 400, bottomPosition, { align: 'right' })
    .text(`A/N: ${invoiceData.bank.accountName}`, 200, bottomPosition + 15)
    .text(`AC: ${invoiceData.bank.accountNumber}`, 200, bottomPosition + 30)
    .text(`BANK: ${invoiceData.bank.bankName}, ${invoiceData.bank.bankBranch}`, 200, bottomPosition + 45)
    .text(invoiceData.signature || 'ANTHONI LIE', 400, bottomPosition + 45, { align: 'right' })
    .moveDown();

  // Signature Section for Tanda Terima
  doc
    .fontSize(10)
    .text('__________________', 50, bottomPosition + 60)
    .moveDown();

  // Finalize the PDF
  doc.end();
}
module.exports = generateInvoice;

// Example invoice data (based on the provided structure)
