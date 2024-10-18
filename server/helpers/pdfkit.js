const PDFDocument = require('pdfkit');
const fs = require('fs');


// function generateInvoice(invoiceData, filePath) {
//   const doc = new PDFDocument({
//     size: [684, 396],
//     layout: 'potrait'
//   });


//   // Pipe the output to a file
//   doc.pipe(fs.createWriteStream(filePath));

//   // Header with company information
//   doc
//     .fontSize(14)
//     .font('Helvetica-Bold')
//     .text(`${invoiceData.companyName || 'CV. SUMBER MAKMUR DIESEL'}`, { align: 'center' })
//     .moveDown(0.5);

//   doc
//     .fontSize(12)
//     .font('Helvetica-Bold')
//     .text('GENERAL SPAREPART & TECHNICAL SUPPLIER', { align: 'center' })
//     .moveDown(0.5);

//   doc
//     .fontSize(10)
//     .font('Helvetica')
//     .text(`${invoiceData.companyAddress || 'Jl. Krekot Raya, Ruko Komplek Krekot Bunder IV No. 34A'}`, { align: 'center' })
//     .text(`${invoiceData.cityPostalCode || 'Jakarta Pusat - 10710'}`, { align: 'center' })
//     .text(`Telp: ${invoiceData.companyPhone || '(021) 34833155 - 157'}   Fax: ${invoiceData.companyFax || '(021) 34833158'} `, { align: 'center' })
//     .moveDown(1);

//   // Separator line
//   // doc
//   //   .moveTo(50, 120)
//   //   .lineTo(550, 120)
//   //   .stroke();

//   // Invoice details (left side)
//   doc
//     .fontSize(10)
//     .text(`Tgl. Transaksi : ${invoiceData.transaction_date || '-'}`, 50, 150)
//     .text(`Tgl. Tempo : ${invoiceData.transaction_due_date || '-'}`, 50, 165)
//     .text(`Inv No  : ${invoiceData.invoiceNumber}`, 50, 180) // Changed y-coordinate from 100 to 150
//     .text(`SJ No  : ${invoiceData.sjNumber || '-'}`, 50, 195) // Changed y-coordinate from 115 to 165
//     .text(`Items   : ${invoiceData.items.length} Items`, 50, 210) // Changed y-coordinate from 130 to 180
//     .text(`PO No   : ${invoiceData.poNumber || 'BY. PHONE'}`, 50, 225) // Changed y-coordinate from 145 to 195

//   // Date and recipient info (right side)
//   doc
//     .fontSize(10)
//     .text(`Jakarta, ${invoiceData.transaction_date}`, 400, 150, { align: 'right' }) // Changed y-coordinate from 100 to 150
//     .moveDown()
//     .text('Kepada Yth,', { align: 'right' })
//     .text(`${invoiceData.customer.name}`, { align: 'right' })
//     .text(`${invoiceData.customer.address}`, { align: 'right' })
//     .moveDown(1);


//   // Table Headers
//   const tableTop = 250;
//   doc
//     .fontSize(10)
//     .text('NO.', 50, tableTop)
//     .text('QTY', 100, tableTop)
//     .text('PART NUMBER', 150, tableTop)
//     .text('DESCRIPTION', 250, tableTop)
//     .text('UNIT PRICE', 500, tableTop)
//     .text('AMOUNT', 670, tableTop)
//     .moveDown();

//   // Draw a line under the headers
//   doc.moveTo(50, tableTop + 15).lineTo(750, tableTop + 15).stroke();

//   // List the items
//   let position = tableTop + 30;
//   invoiceData.items.forEach((item, index) => {
//     doc
//       .fontSize(10)
//       .text(index + 1, 50, position)
//       .text(item.quantity + ' ' + item.unit_code, 100, position)
//       .text(item.partNumber || '', 150, position)
//       .text(item.itemName || '', 250, position)
//       .text(`Rp.` + item.unitCost.toLocaleString(), 500, position)
//       .text(`Rp.` + item.total.toLocaleString(), 660, position)
//     position += 20;
//   });

//   // TERBILANG and Summary on Same Line
//   const summaryTop = position + 30;

//   // Draw a line before the "TERBILANG" and "SUB TOTAL" sections
//   doc.moveTo(50, summaryTop - 10).lineTo(750, summaryTop - 10).stroke();

//   // Render TERBILANG and Summary
//   doc
//     .fontSize(10)
//     .text(`TERBILANG: # ${invoiceData.terbilang} Rupiah #`, 50, summaryTop, { align: 'left' })
//     .text('SUB TOTAL', 470, summaryTop, { width: 90, align: 'right' })
//     .text(`Rp.` + invoiceData.subTotal.toLocaleString(), 450, summaryTop, { align: 'right' })
//     .moveDown(0.5)
//     .text('DISCOUNT', 470, summaryTop + 15, { width: 90, align: 'right' })
//     .text(`Rp.` + invoiceData.discount.toLocaleString(), 450, summaryTop + 15, { align: 'right' })
//     .text('TOTAL', 470, summaryTop + 30, { width: 90, align: 'right' })
//     .text(`Rp.` + invoiceData.total.toLocaleString(), 450, summaryTop + 30, { align: 'right' })
//     .text('TOTAL PPN', 470, summaryTop + 45, { width: 90, align: 'right' })
//     .text(`Rp.` + invoiceData.totalPpn.toLocaleString(), 450, summaryTop + 45, { align: 'right' })
//     .font('Helvetica-Bold')
//     .text('GRAND TTL', 470, summaryTop + 60, { width: 90, align: 'right' })
//     .text(`Rp.` + invoiceData.grandTotal.toLocaleString(), 450, summaryTop + 60, { align: 'right' });

//   // Tanda Terima and Payment Information
//   const bottomPosition = summaryTop + 120;
//   doc
//     .fontSize(10)
//     .text('Tanda Terima,', 50, bottomPosition)
//     .text('PEMBAYARAN:', 200, bottomPosition)
//     .text('Hormat kami,', 400, bottomPosition, { align: 'right' })
//     .text(`A/N: ${invoiceData.bank.accountName}`, 200, bottomPosition + 15)
//     .text(`AC: ${invoiceData.bank.accountNumber}`, 200, bottomPosition + 30)
//     .text(`BANK: ${invoiceData.bank.bankName}, ${invoiceData.bank.bankBranch}`, 200, bottomPosition + 45)
//     .text(invoiceData.signature || 'ANTHONI LIE', 400, bottomPosition + 45, { align: 'right' })
//     .moveDown();

//   // Signature Section for Tanda Terima
//   doc
//     .fontSize(10)
//     .text('__________________', 50, bottomPosition + 60)
//     .moveDown();

//   // Finalize the PDF
//   doc.end();
// }

function generateInvoice(invoiceData, filePath) {
  const doc = new PDFDocument({
    size: 'legal', // Set the custom size
    layout: 'landscape', // Landscape layout for a wider format
    margins: { top: 20, bottom: 20, left: 20, right: 20 } // Adjust margins for the page
  });

  // Pipe the output to a file
  doc.pipe(fs.createWriteStream(filePath));

  // Header with company information
  doc
    .fontSize(16)
    .font('Helvetica-Bold')
    .text(`${invoiceData.companyName || 'CV. SUMBER MAKMUR DIESEL'}`, { align: 'center' })
    .moveDown(0.3);

  doc
    .fontSize(14)
    .font('Helvetica-Bold')
    .text('GENERAL SPAREPART & TECHNICAL SUPPLIER', { align: 'center' })
    .moveDown(0.3);

  doc
    .fontSize(14)
    .font('Helvetica')
    .text(`${invoiceData.companyAddress || 'Jl. Krekot Raya, Ruko Komplek Krekot Bunder IV No. 34A'}`, { align: 'center' })
    .text(`${invoiceData.cityPostalCode || 'Jakarta Pusat - 10710'}`, { align: 'center' })
    .text(`Telp: ${invoiceData.companyPhone || '(021) 34833155 - 157'}   Fax: ${invoiceData.companyFax || '(021) 34833158'}`, { align: 'center' })
    .moveDown(0.5);

  // Invoice details (left side)
  doc
    .fontSize(16)
    .text(`Tgl. Transaksi : ${invoiceData.transaction_date || '-'}`, 10, 120)
    .text(`Tgl. Tempo : ${invoiceData.transaction_due_date || '-'}`, 10, 135)
    .text(`Inv No  : ${invoiceData.invoiceNumber}`, 10, 150)
    .text(`SJ No   : ${invoiceData.sjNumber || '-'}`, 10, 165)
    .text(`Items   : ${invoiceData.items.length} Items`, 10, 180)
    .text(`PO No   : ${invoiceData.poNumber || 'BY. PHONE'}`, 10, 195);

  // Date and recipient info (right side)
  doc
    .fontSize(16)
    .text(`Jakarta, ${invoiceData.transaction_date}`, 300, 120, { align: 'right' })
    .moveDown(0.5)
    .text('Kepada Yth,', { align: 'right' })
    .text(`${invoiceData.customer.name}`, { align: 'right' })
    .text(`${invoiceData.customer.address}`, { align: 'right' })
    .moveDown(1);

  // Table Headers
  const tableTop = 220;
  doc
    .fontSize(16)
    .text('NO.', 10, tableTop)
    .text('QTY', 100, tableTop)
    .text('PART NUMBER', 250, tableTop)
    .text('DESCRIPTION', 400, tableTop)
    .text('UNIT PRICE', 650, tableTop)
    .text('AMOUNT', 850, tableTop);

  // Draw a line under the headers
  doc.moveTo(10, tableTop + 15).lineTo(998, tableTop + 15).stroke();

  // List the items
  let position = tableTop + 25;
  invoiceData.items.forEach((item, index) => {
    doc
      .fontSize(16)
      .text(index + 1, 10, position)
      .text(item.quantity + ' ' + item.unit_code, 100, position)
      .text(item.partNumber || '', 250, position)
      .text(item.itemName || '', 400, position)
      .text(`Rp.` + item.unitCost.toLocaleString(), 750, position)
      .text(`Rp.` + item.total.toLocaleString(), 850  , position);
    position += 15;
  });

  // TERBILANG and Summary on Same Line
  const summaryTop = position + 10;

  // Draw a line before the "TERBILANG" and "SUB TOTAL" sections
  doc.moveTo(10, summaryTop - 10).lineTo(998, summaryTop - 10).stroke();

  // Render TERBILANG and Summary
  doc
    .fontSize(16)
    .text(`TERBILANG: # ${invoiceData.terbilang} Rupiah #`, 30, summaryTop)
    .text('SUB TOTAL', 700, summaryTop,)
    .text(`Rp.` + invoiceData.subTotal.toLocaleString(), 900, summaryTop)
    .moveDown(0.3)
    .text('DISCOUNT', 700, summaryTop + 20,)
    .text(`Rp.` + invoiceData.discount.toLocaleString(), 900, summaryTop + 20)
    .text('TOTAL', 700, summaryTop + 40, )
    .text(`Rp.` + invoiceData.total.toLocaleString(), 900, summaryTop + 40)
    .text('TOTAL PPN', 700, summaryTop + 60,)
    .text(`Rp.` + invoiceData.totalPpn.toLocaleString(), 900, summaryTop + 60)
    .font('Helvetica-Bold')
    .text('GRAND TTL', 700, summaryTop + 80,)
    .text(`Rp.` + invoiceData.grandTotal.toLocaleString(), 900, summaryTop + 80);

  // Tanda Terima and Payment Information
  const bottomPosition = summaryTop + 200;
  doc
    .fontSize(16)
    .text('Tanda Terima,', 20, bottomPosition)
    .text('PEMBAYARAN:', 400, bottomPosition)
    .text('Hormat kami,', 900, bottomPosition)
    .text(`A/N: ${invoiceData.bank.accountName}`, 400, bottomPosition + 15)
    .text(`AC: ${invoiceData.bank.accountNumber}`, 400, bottomPosition + 30)
    .text(`BANK: ${invoiceData.bank.bankName}, ${invoiceData.bank.bankBranch}`, 400, bottomPosition + 45)
    .text(invoiceData.signature || 'ANTHONI LIE', 900, bottomPosition + 45);

  // Signature Section for Tanda Terima
  doc
    .fontSize(16)
    .text('__________________', 20, bottomPosition + 40)
    .moveDown();

  // Finalize the PDF
  doc.end();
}


function generateInvoiceNonPPN(invoiceData, filePath) {
  const doc = new PDFDocument({
    size: [ 684,396],
    layout: 'landscape',
    
  });


  // Pipe the output to a file
  doc.pipe(fs.createWriteStream(filePath));

  // Header with company information
  doc
  .fontSize(25)
  .font('Helvetica-Bold')
  .text('INVOICE', 100, 100, { align: 'center' })  // Start at y-coordinate 100
  .moveDown(1);  // Further move down by one line



  // Separator line
  // doc
  //   .moveTo(50, 120)
  //   .lineTo(550, 120)
  //   .stroke();

  // Invoice details (left side)
  doc
    .fontSize(10).font('Helvetica')
    .text(`Tgl. Transaksi : ${invoiceData.transaction_date || '-'}`, 50, 150)
    .text(`Tgl. Tempo : ${invoiceData.transaction_due_date || '-'}`, 50, 165)
    .text(`Inv No  : ${invoiceData.invoiceNumber}`, 50, 180) // Changed y-coordinate from 100 to 150
    .text(`SJ No  : ${invoiceData.sjNumber || '-'}`, 50, 195) // Changed y-coordinate from 115 to 165
    .text(`Items   : ${invoiceData.items.length} Items`, 50, 210) // Changed y-coordinate from 130 to 180
    .text(`PO No  : ${invoiceData.poNumber || 'BY. PHONE'}`, 50, 225) // Changed y-coordinate from 145 to 195

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
    .text('PART NUMBER', 250, tableTop)
    .text('DESCRIPTION', 450, tableTop)
    .text('UNIT PRICE', 600, tableTop)
    .text('AMOUNT', 850, tableTop)
    .moveDown();

  // Draw a line under the headers
  doc.moveTo(50, tableTop + 15).lineTo(750, tableTop + 15).stroke();

  // List the items
  let position = tableTop + 30;
  invoiceData.items.forEach((item, index) => {
    doc
      .fontSize(10)
      .text(index + 1, 50, position)
      .text(item.quantity + ' ' + item.unit_code, 100, position)
      .text(item.partNumber || '', 250, position)
      .text(item.itemName || '', 450, position)
      .text(`Rp.` + item.unitCost.toLocaleString(), 600, position)
      .text(`Rp.` + item.total.toLocaleString(), 850, position)
    position += 20;
  });

  // TERBILANG and Summary on Same Line
  const summaryTop = position + 30;

  // Draw a line before the "TERBILANG" and "SUB TOTAL" sections
  doc.moveTo(50, summaryTop - 10).lineTo(750, summaryTop - 10).stroke();

  // Render TERBILANG and Summary
  doc
    .fontSize(10)
    .text(`TERBILANG: # ${invoiceData.terbilang} Rupiah #`, 50, summaryTop, { align: 'left' })
    .text('SUB TOTAL', 350, summaryTop, { width: 90, align: 'right' })
    .text(`Rp.` + invoiceData.subTotal.toLocaleString(), 450, summaryTop, { align: 'right' })
    .moveDown(0.5)
    .text('DISCOUNT', 350, summaryTop + 15, { width: 90, align: 'right' })
    .text(`Rp.` + invoiceData.discount.toLocaleString(), 450, summaryTop + 15, { align: 'right' })
    .text('TOTAL', 350, summaryTop + 30, { width: 90, align: 'right' })
    .text(`Rp.` + invoiceData.total.toLocaleString(), 450, summaryTop + 30, { align: 'right' })
    .text('TOTAL PPN', 350, summaryTop + 45, { width: 90, align: 'right' })
    .text(`Rp.` + invoiceData.totalPpn.toLocaleString(), 450, summaryTop + 45, { align: 'right' })
    .font('Helvetica-Bold')
    .text('GRAND TTL', 350, summaryTop + 60, { width: 90, align: 'right' })
    .text(`Rp.` + invoiceData.grandTotal.toLocaleString(), 450, summaryTop + 60, { align: 'right' });

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

function generateSuratJalan(invoiceData, filePath) {
  const doc = new PDFDocument({
    size: [684, 792],
    layout: 'landscape'
  });


  // Pipe the output to a file
  doc.pipe(fs.createWriteStream(filePath));

  doc
    .fontSize(14)
    .font('Helvetica-Bold')
    .text(`${invoiceData.companyName || 'CV. SUMBER MAKMUR DIESEL'}`, { align: 'center' })
    .moveDown(0.5);

  doc
    .fontSize(12)
    .font('Helvetica-Bold')
    .text('GENERAL SPAREPART & TECHNICAL SUPPLIER', { align: 'center' })
    .moveDown(0.5);

  doc
    .fontSize(10)
    .font('Helvetica')
    .text(`${invoiceData.companyAddress || 'Jl. Krekot Raya, Ruko Komplek Krekot Bunder IV No. 34A'}`, { align: 'center' })
    .text(`${invoiceData.cityPostalCode || 'Jakarta Pusat - 10710'}`, { align: 'center' })
    .text(`Telp: ${invoiceData.companyPhone || '(021) 34833155 - 157'}   Fax: ${invoiceData.companyFax || '(021) 34833158'} `, { align: 'center' })
    .moveDown(1);


  // Separator line
  // doc
  //   .moveTo(50, 120)
  //   .lineTo(550, 120)
  //   .stroke();

  // Invoice details (left side)
  doc
    .fontSize(10).font('Helvetica')
    .text(`Tgl. Transaksi : ${invoiceData.transaction_date || '-'}`, 50, 150)
    .text(`Tgl. Tempo : ${invoiceData.transaction_due_date || '-'}`, 50, 165)
    .text(`Inv No  : ${invoiceData.invoiceNumber}`, 50, 180) // Changed y-coordinate from 100 to 150
    .text(`SJ No  : ${invoiceData.sjNumber || '-'}`, 50, 195) // Changed y-coordinate from 115 to 165
    .text(`Items   : ${invoiceData.items.length} Items`, 50, 210) // Changed y-coordinate from 130 to 180
    .text(`PO No   : ${invoiceData.poNumber || 'BY. PHONE'}`, 50, 225) // Changed y-coordinate from 145 to 195

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
    .text('QTY', 140, tableTop)
    .text('NAMA BARANG', 240, tableTop)
    .text('PART NUMBER', 400, tableTop)
    .text('KETERANGAN', 600, tableTop)
 
    .moveDown();

  // Draw a line under the headers
  doc.moveTo(50, tableTop + 15).lineTo(750, tableTop + 15).stroke();

  // List the items
  let position = tableTop + 30;
  invoiceData.items.forEach((item, index) => {
    doc
      .fontSize(10)
      .text(index + 1, 50, position)
      .text(item.quantity + ' ' + item.unit_code, 140, position)
      .text(item.partNumber || '', 240, position)
      .text(item.itemName || '', 400, position)
      .text(item.note || '', 600, position)
    position += 20;
  });

  // TERBILANG and Summary on Same Line
  const summaryTop = position + 30;

  // Draw a line before the "TERBILANG" and "SUB TOTAL" sections
  doc.moveTo(50, summaryTop - 10).lineTo(750, summaryTop - 10).stroke();

  // Render TERBILANG and Summary

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


function generateInvoiceBuy(invoiceData, filePath) {
  const doc = new PDFDocument({
    size: [684, 792],
    layout: 'landscape'
  });


  // Pipe the output to a file
  doc.pipe(fs.createWriteStream(filePath));

  // Header with company information
  doc
  .fontSize(25)
  .font('Helvetica-Bold')
  .text('PEMBELIAN BARANG', 100, 100, { align: 'center' })  // Start at y-coordinate 100
  .moveDown(1);  // Further move down by one line



  // Separator line
  // doc
  //   .moveTo(50, 120)
  //   .lineTo(550, 120)
  //   .stroke();

  // Invoice details (left side)
  doc
    .fontSize(10).font('Helvetica')
    .text(`No.Bukti  : ${invoiceData.proofNumber}`, 50, 150,{ align: 'right' }) // Changed y-coordinate from 100 to 150
    .text(`Tgl. Transaksi : ${invoiceData.transaction_date || '-'}`, 50, 165,{ align: 'right' })
    .text(`Tgl. Tempo : ${invoiceData.transaction_due_date || '-'}`, 50, 180,{ align: 'right' })
   
  
  // Date and recipient info (right side)
  doc
    .fontSize(10)
    .text(`Supplier: ${invoiceData.customer.name}`)
    .text(`${invoiceData.customer.address}`)
    .moveDown(1);


  // Table Headers
  const tableTop = 250;
  doc
    .fontSize(10)
    .text('NO.', 50, tableTop)
    .text('QTY', 100, tableTop)
    .text('PART NUMBER', 150, tableTop)
    .text('DESCRIPTION', 250, tableTop)
    .text('UNIT PRICE', 500, tableTop)
    .text('AMOUNT', 670, tableTop)
    .moveDown();

  // Draw a line under the headers
  doc.moveTo(50, tableTop + 15).lineTo(750, tableTop + 15).stroke();

  // List the items
  let position = tableTop + 30;
  invoiceData.items.forEach((item, index) => {
    doc
      .fontSize(10)
      .text(index + 1, 50, position)
      .text(item.quantity + ' ' + item.unit_code, 100, position)
      .text(item.partNumber || '', 150, position)
      .text(item.itemName || '', 250, position)
      .text(`Rp.` + item.unitCost.toLocaleString(), 500, position)
      .text(`Rp.` + item.total.toLocaleString(), 660, position)
    position += 20;
  });

  // TERBILANG and Summary on Same Line
  const summaryTop = position + 30;

  // Draw a line before the "TERBILANG" and "SUB TOTAL" sections
  doc.moveTo(50, summaryTop - 10).lineTo(750, summaryTop - 10).stroke();

  // Render TERBILANG and Summary
  doc
    .fontSize(10)
    .text(`TERBILANG: # ${invoiceData.terbilang} Rupiah #`, 50, summaryTop, { align: 'left' })
    .text('SUB TOTAL', 470, summaryTop, { width: 90, align: 'right' })
    .text(`Rp.` + invoiceData.subTotal.toLocaleString(), 450, summaryTop, { align: 'right' })
    .moveDown(0.5)
    .text('DISCOUNT', 470, summaryTop + 15, { width: 90, align: 'right' })
    .text(`Rp.` + invoiceData.discount.toLocaleString(), 450, summaryTop + 15, { align: 'right' })
    .text('TOTAL', 470, summaryTop + 30, { width: 90, align: 'right' })
    .text(`Rp.` + invoiceData.total.toLocaleString(), 450, summaryTop + 30, { align: 'right' })
    .text('TOTAL PPN', 470, summaryTop + 45, { width: 90, align: 'right' })
    .text(`Rp.` + invoiceData.totalPpn.toLocaleString(), 450, summaryTop + 45, { align: 'right' })
    .font('Helvetica-Bold')
    .text('GRAND TTL', 470, summaryTop + 60, { width: 90, align: 'right' })
    .text(`Rp.` + invoiceData.grandTotal.toLocaleString(), 450, summaryTop + 60, { align: 'right' });

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


// module.exports = { generateInvoice, generateInvoiceNonPPN,generateSuratJalan,generateInvoiceBuy }

// Example invoice data (based on the provided structure)
