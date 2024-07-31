const PDFDocument = require('pdfkit');
const fs = require('fs');

function generateInvoice(invoice, filePath) {
    let doc = new PDFDocument({ size: "A4", layout: "landscape", margin: 50 });

  generateHeader(doc, invoice);
  generateCustomerInformation(doc, invoice);
  generateInvoiceTable(doc, invoice);
  generateFooter(doc);

  doc.end();
  doc.pipe(fs.createWriteStream(filePath));
}

function generateHeader(doc, invoice) {
  doc
    .fillColor('#000000')
    .fontSize(12)
    .text('FAKTUR SERVICE', 200, 40, { align: 'center' })
    .fontSize(10)
    .text(`Tanggal: ${invoice.date}`, 50, 80)
    .text(`No. Invoice: ${invoice.invoiceNumber}`, 50, 95)
    .text(`Order No.: ${invoice.orderNumber}`, 50, 110)
    .text(`No. Polisi: ${invoice.licensePlate}`, 50, 125)
    .text(`Nama: ${invoice.customer.name}`, 50, 140)
    .text(`Alamat: ${invoice.customer.address}`, 50, 155)
    .text(`Mobile: ${invoice.customer.mobile}`, 50, 170)
    .text(`Technician: ${invoice.technician}`, 300, 80)
    .text(`Members: ${invoice.members}`, 300, 95)
    .text(`${invoice.company.name}`, 300, 110, { align: 'right' })
    .text(`${invoice.company.address}`, 300, 125, { align: 'right' })
    .text(`NPWP No.: ${invoice.company.taxId}`, 300, 140, { align: 'right' })
    .text(`Tipe Motor: ${invoice.motorType}`, 300, 155, { align: 'right' })
    .moveDown();
}

function generateCustomerInformation(doc, invoice) {
  // Customer information already included in the header for this layout.
}

function generateInvoiceTable(doc, invoice) {
  let i;
  const invoiceTableTop = 200;

  doc.font('Helvetica-Bold');
  generateTableRow(
    doc,
    invoiceTableTop,
    'No.',
    'Package',
    'Nomor Item',
    'Nama Item',
    'Harga Satuan',
    'Discount%',
    'Qty',
    'Total',
    50
  );
  generateHr(doc, invoiceTableTop + 20);
  doc.font('Helvetica');

  for (i = 0; i < invoice.items.length; i++) {
    const item = invoice.items[i];
    const position = invoiceTableTop + (i + 1) * 30;
    generateTableRow(
      doc,
      position,
      item.no,
      item.package,
      item.itemNumber,
      item.itemName,
      formatCurrency(item.unitCost),
      item.discount,
      item.quantity,
      formatCurrency(item.total)
    );

    generateHr(doc, position + 20);
  }

  const subtotalPosition = invoiceTableTop + (i + 1) * 30;
  generateTableRow(
    doc,
    subtotalPosition,
    '',
    '',
    '',
    '',
    '',
    '',
    'Total Service',
    formatCurrency(invoice.totalService)
  );

  const totalSparePartPosition = subtotalPosition + 20;
  generateTableRow(
    doc,
    totalSparePartPosition,
    '',
    '',
    '',
    '',
    '',
    '',
    'Total Spare Part',
    formatCurrency(invoice.totalSparePart)
  );

  const memberBenefitAmountPosition = totalSparePartPosition + 20;
  generateTableRow(
    doc,
    memberBenefitAmountPosition,
    '',
    '',
    '',
    '',
    '',
    '',
    'Member Benefit Amount',
    formatCurrency(invoice.memberBenefitAmount)
  );

  const totalPosition = memberBenefitAmountPosition + 30;
  doc.font('Helvetica-Bold');
  generateTableRow(
    doc,
    totalPosition,
    '',
    '',
    '',
    '',
    '',
    '',
    'Total Bayar',
    formatCurrency(invoice.totalBayar)
  );
  doc.font('Helvetica');
}

function generateFooter(doc) {
  doc
    .fontSize(10)
    .text('Harga sudah termasuk PPN 11%', 50, 450)
    .text('Comment for customer:', 50, 480)
    .text('Service Advisor: ____________________', 50, 520)
    .text('Konsumen: Kevin Wiranata', 300, 520)
    .text('Cashier:  (            )', 500, 520)
    .moveDown();
}

function generateTableRow(doc, y, no, pkg, itemNum, itemName, unitCost, discount, qty, total) {
    const columnMargin = 10; // Margin space between columns in points
    const columnWidths = {
      no: 30,           // Width for No. column
      pkg: 80,          // Width for Package column
      itemNum: 100,      // Width for Nomor Item column
      itemName: 130,    // Width for Nama Item column
      unitCost: 100,     // Width for Harga Satuan column
      discount: 60,     // Width for Discount% column
      qty: 100,          // Width for Qty column
      total: 100         // Width for Total column
    };
  
    doc
      .fontSize(10)
      .text(no, 50, y, { width: columnWidths.no, align: 'right' })
      .text(pkg, 50 + columnWidths.no + columnMargin, y, { width: columnWidths.pkg, align: 'left' })
      .text(itemNum, 50 + columnWidths.no + columnWidths.pkg + 2 * columnMargin, y, { width: columnWidths.itemNum, align: 'left' })
      .text(itemName, 50 + columnWidths.no + columnWidths.pkg + columnWidths.itemNum + 3 * columnMargin, y, { width: columnWidths.itemName, align: 'left' })
      .text(unitCost, 50 + columnWidths.no + columnWidths.pkg + columnWidths.itemNum + columnWidths.itemName + 4 * columnMargin, y, { width: columnWidths.unitCost, align: 'right' })
      .text(discount, 50 + columnWidths.no + columnWidths.pkg + columnWidths.itemNum + columnWidths.itemName + columnWidths.unitCost + 5 * columnMargin, y, { width: columnWidths.discount, align: 'right' })
      .text(qty, 50 + columnWidths.no + columnWidths.pkg + columnWidths.itemNum + columnWidths.itemName + columnWidths.unitCost + columnWidths.discount + 6 * columnMargin, y, { width: columnWidths.qty, align: 'right' })
      .text(total, 50 + columnWidths.no + columnWidths.pkg + columnWidths.itemNum + columnWidths.itemName + columnWidths.unitCost + columnWidths.discount + columnWidths.qty + 7 * columnMargin, y, { width: columnWidths.total, align: 'right' });
  }
  
  
function generateHr(doc, y) {
  doc
    .strokeColor('#aaaaaa')
    .lineWidth(1)
    .moveTo(50, y)
    .lineTo(850, y)
    .stroke();
}

function formatCurrency(value) {
  return 'Rp. ' + value.toFixed(2);
}

module.exports = generateInvoice;
