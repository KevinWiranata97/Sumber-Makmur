const ExcelJS = require('exceljs');

// Create a new workbook and add a worksheet



function generateInvoiceExcel(invoiceData, filePath){
  const workbook = new ExcelJS.Workbook();
const worksheet = workbook.addWorksheet('Sheet1 (7)');

// Set up column widths for better layout
worksheet.columns = [
  { width: 4.57 },   // A
  { width: 5.86 },   // B
  { width: 4.29 },   // C
  { width: 14.29 },  // D
  { width: 30 },  // E
  { width: 4.2 },      // F
  { width: 14.29 },  // G
  { width: 5.86 },   // H
  { width: 20 }   // I
];
  worksheet.mergeCells('A1:E1');
  worksheet.getCell('A1').value = `${invoiceData.companyName ||'CV. SUMBER MAKMUR DIESEL' }`;
  worksheet.getCell('A1').font = { name: "Courier New", size: 12 };
  worksheet.getCell('A1').alignment = { horizontal: 'center', vertical: 'top' };
  
  worksheet.mergeCells('A2:E2');
  worksheet.getCell('A2').value = 'GENERAL SPAREPART & TECHNICAL SUPPLIER';
  worksheet.getCell('A2').font = { name: "Courier New", size: 12 };
  worksheet.getCell('A2').alignment = { horizontal: 'center' };
  
  worksheet.mergeCells('A3:E3');
  worksheet.getCell('A3').value = `${invoiceData.companyAddress || 'Jl. Krekot Raya, Ruko Komplek Krekot Bunder IV No. 34A'}`;
  worksheet.getCell('A3').font = { name: "Courier New", size: 10 };
  worksheet.getCell('A3').alignment = { horizontal: 'center' };
  
  worksheet.mergeCells('A4:E4');
  worksheet.getCell('A4').value = `Telp: ${invoiceData.companyPhone || '(021) 34833155 - 157'}   Fax: ${invoiceData.companyFax || '(021) 34833158'}`
  worksheet.getCell('A4').font = { name: "Courier New", size: 10 };
  worksheet.getCell('A4').alignment = { horizontal: 'center' };
  
  worksheet.mergeCells('A5:E5');
  worksheet.getCell('A5').value = `Email : ${invoiceData.companyEmail || "smdmrn@yahoo.com"} `;
  worksheet.getCell('A5').font = { name: "Courier New", size: 10 };
  worksheet.getCell('A5').alignment = { horizontal: 'center' };
  
  worksheet.mergeCells('A6:E6');
  worksheet.getCell('A6').value = `INVOICE NO. ${invoiceData.invoiceNumber}`;
  worksheet.getCell('A6').font = { name: "Courier New", size: 12 };
  
  worksheet.mergeCells('A7:E7');
  worksheet.getCell('A7').value = `${invoiceData.poNumber || 'BY. PHONE'}`
  worksheet.getCell('A7').font = { name: "Courier New", size: 14 };
  
  // Recipient Information on the right side
  worksheet.mergeCells('G1:I1');
  worksheet.getCell('G1').value = `Jakarta, ${invoiceData.transaction_date}`;
  worksheet.getCell('G1').alignment = { horizontal: 'left' };
  worksheet.getCell('G1').font = { name: "Courier New", size: 10 };
  
  worksheet.mergeCells('G3:I3');
  worksheet.getCell('G3').value = 'Kepada Yth,';
  worksheet.getCell('G3').alignment = { horizontal: 'left' };
  worksheet.getCell('G3').font = { name: "Courier New", size: 10 };
  
  worksheet.mergeCells('G4:I4');
  worksheet.getCell('G4').value = `${invoiceData.customer.name}`;
  worksheet.getCell('G4').alignment = { horizontal: 'left' };
  worksheet.getCell('G4').font = { name: "Courier New", size: 10 };
  
  worksheet.mergeCells('G5:I6');
  worksheet.getCell('G5').value = `${invoiceData.customer.address}`;
  worksheet.getCell('G5').alignment = { horizontal: 'left',wrapText:"true",vertical:"middle" };
  worksheet.getCell('G5').font = { name: "Courier New", size: 10 };
  
  // worksheet.mergeCells('G6:I6');
  // worksheet.getCell('G6').value = `${invoiceData.customer.address_2}`;
  // worksheet.getCell('G6').alignment = { horizontal: 'left' };
  // worksheet.getCell('G6').font = { name: "Courier New", size: 10 };
  
  worksheet.mergeCells('G7:I7');
  worksheet.getCell('G7').value = `${invoiceData.customer.address_2}`;
  worksheet.getCell('G7').alignment = { horizontal: 'left' };
  worksheet.getCell('G7').font = { name: "Courier New", size: 10 };
  
  // Set the row height only for rows with content
  

  worksheet.addRow(['No', 'Qty', '', 'PART NUMBER', 'DESCRIPTION', 'UNIT', 'PRICE', 'AMOUNT']);
  
  // Merge cells for the header as needed
  worksheet.mergeCells('A8:A9'); // Merge cells for "No"
  worksheet.mergeCells('B8:C9'); // Merge cells for "Qty"
  // worksheet.mergeCells('C8:C9'); // Merge cells for "Unit"
  worksheet.mergeCells('D8:D9'); // Merge cells for "PART NUMBER"
  worksheet.mergeCells('E8:E9'); // Merge cells for "DESCRIPTION"
  worksheet.mergeCells('F8:G8'); // Merge cells across F8 to G9 for "UNIT PRICE"
  worksheet.mergeCells('F9:G9'); // Merge cells across F8 to G9 for "UNIT PRICE"
  worksheet.mergeCells('H8:I9'); // Merge cells for "AMOUNT"
  
  // Set values for the merged cells
  worksheet.getCell('F8').value = 'UNIT'; // Use a line break to separate "UNIT" and "PRICE"
  worksheet.getCell('F9').value = 'PRICE'; // Use a line break to separate "UNIT" and "PRICE"
  worksheet.getCell('F9').alignment = { horizontal: "center", vertical: "middle" } 
  worksheet.getCell('H8').value = 'AMOUNT'; // Set the value for "AMOUNT"
  
  // Format "UNIT PRICE" and "AMOUNT" cells to wrap text and align
  worksheet.getCell('F8').alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
  worksheet.getCell('H8').alignment = { horizontal: 'center', vertical: 'middle' , wrapText: true };
  
  // Apply font and border formatting for the header row (Row 8)
  const headerRow = worksheet.getRow(8);
  headerRow.font = { size: 10, name: "Courier New" };
  headerRow.eachCell((cell, colNumber) => {
    // Skip formatting for the "UNIT PRICE" cell located in F8 (column 6)
  
    cell.alignment = { horizontal: "center", vertical: "middle" }; // Apply to each cell except "UNIT PRICE"
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      right: { style: 'thin' }
    };
  });
  
  // Add table data below the header
  const items = invoiceData.items.map((item, index) => [
    index + 1,                           // No
    item.quantity,                       // Qty
    item.unit_code || '',                // Unit (can be empty if not specified)
    item.partNumber,                     // PART NUMBER
    item.itemName,                       // DESCRIPTION
    'Rp.',                               // UNIT (Currency label)
    item.unitCost.toLocaleString('id-ID'), // PRICE (formatted with thousands separator)
    'Rp.',                               // CURRENCY LABEL (for amount)
    item.total.toLocaleString('id-ID')   // AMOUNT (formatted with thousands separator)
  ]);


  
// Add the data to the worksheet
items.forEach((item, rowIndex) => {
  const row = worksheet.addRow(item);
  row.height = 25;

  row.eachCell((cell, colIndex) => {
    let border = {};

    // Apply border to the outer part of the table
    if (rowIndex === 0) {
      border.top = { style: 'thin' }; // Top border for the first row
    }
    if (rowIndex === items.length - 1) {
      border.bottom = { style: 'thin' }; // Bottom border for the last row
    }
    if (colIndex === 1) {
      border.left = { style: 'thin' }; // Left border for the first column
    }
    if (colIndex === row.cellCount) {
      border.right = { style: 'thin' }; // Right border for the last column
    }

    // Apply the border to each cell
    cell.border = border;

    // Apply alignment to specific columns
    if (colIndex === 7 || colIndex === 9) { // Columns 7 and 9 (unitCost and total) to align left
      cell.alignment = { horizontal: 'left', vertical: 'middle', wrapText: true };
    } else {
      cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    }

    // Apply font to each cell
    cell.font = { bold: true, size: 10, name: "Courier New" };
  });
});

  
  
  // Determine the start row for financial summary based on the items data length
  const summaryStartRow = items.length + 10;
  const summaryStartRowTotal = items.length + 10;
  // Subtotal, Tax, and Grand Total
  
  
  worksheet.mergeCells(`A${summaryStartRow }:F${summaryStartRow + 2}`);
  worksheet.getCell(`A${summaryStartRow }`).value = `TERBILANG : # ${invoiceData.terbilang} Rupiah #`;
  worksheet.getCell(`A${summaryStartRow }`).font = { bold: true, size: 10, name:"Courier New" ,underline:"true"};
  worksheet.getCell(`A${summaryStartRow }`).alignment = {horizontal: 'center', vertical: 'middle',wrapText: true };
  
  // Financial Summary
  // Sub Total
  worksheet.mergeCells(`G${summaryStartRowTotal}:H${summaryStartRowTotal}`);
  worksheet.getCell(`G${summaryStartRowTotal}`).value = 'SUB TOTAL';
  worksheet.getCell(`G${summaryStartRowTotal}`).alignment = { horizontal: 'right' };
  worksheet.getCell(`G${summaryStartRowTotal}`).font = { bold: true, size: 10, name:"Courier New" };
  worksheet.getCell(`I${summaryStartRowTotal}`).value = `Rp.${invoiceData.subTotal.toLocaleString('id-ID')}`;
  worksheet.getCell(`I${summaryStartRowTotal}`).font = { bold: true, size: 10, name:"Courier New" };
  // Add border to Sub Total cells
  worksheet.getCell(`G${summaryStartRowTotal}`).border = {
  
    left: { style: 'thin' },
    
    right: { style: 'thin' }
  };
  worksheet.getCell(`H${summaryStartRowTotal}`).border = {
  
    left: { style: 'thin' },
    
    right: { style: 'thin' }
  };
  worksheet.getCell(`I${summaryStartRowTotal}`).border = {
  
    left: { style: 'thin' },
    
    right: { style: 'thin' }
  };
  worksheet.mergeCells(`G${summaryStartRowTotal + 1}:H${summaryStartRowTotal + 1}`);
  worksheet.getCell(`G${summaryStartRowTotal + 1}`).value = `Discount ${invoiceData.discountPercentage}%`;
  worksheet.getCell(`G${summaryStartRowTotal + 1}`).font = { bold: true, size: 10, name:"Courier New" };
  worksheet.getCell(`G${summaryStartRowTotal + 1}`).alignment = { horizontal: 'right' };
  worksheet.getCell(`I${summaryStartRowTotal + 1}`).value = `Rp.${invoiceData.discount.toLocaleString('id-ID')}`;
  worksheet.getCell(`I${summaryStartRowTotal + 1}`).font = { bold: true, size: 10, name:"Courier New" };
  // Add border to PPN 11% cells
  worksheet.getCell(`G${summaryStartRowTotal + 1}`).border = {
  
    left: { style: 'thin' },
    
    right: { style: 'thin' }
  };
  worksheet.getCell(`H${summaryStartRowTotal + 1}`).border = {
  
    left: { style: 'thin' },
    
    right: { style: 'thin' }
  };
  worksheet.getCell(`I${summaryStartRowTotal + 1}`).border = {
  
    left: { style: 'thin' },
    
    right: { style: 'thin' }
  };
  
  // PPN 11%
  worksheet.mergeCells(`G${summaryStartRowTotal + 2}:H${summaryStartRowTotal + 2}`);
  worksheet.getCell(`G${summaryStartRowTotal + 2}`).value = `PPN ${invoiceData.tax_ppn}%`;
  worksheet.getCell(`G${summaryStartRowTotal + 2}`).font = { bold: true, size: 10, name:"Courier New" };
  worksheet.getCell(`G${summaryStartRowTotal + 2}`).alignment = { horizontal: 'right' };
  worksheet.getCell(`I${summaryStartRowTotal + 2}`).value = `Rp.${invoiceData.totalPpn.toLocaleString('id-ID')}`;
  worksheet.getCell(`I${summaryStartRowTotal + 2}`).font = { bold: true, size: 10, name:"Courier New" };
  // Add border to PPN 11% cells
  worksheet.getCell(`G${summaryStartRowTotal + 2}`).border = {
  
    left: { style: 'thin' },
    
    right: { style: 'thin' }
  };
  worksheet.getCell(`H${summaryStartRowTotal + 2}`).border = {
  
    left: { style: 'thin' },
    
    right: { style: 'thin' }
  };
  worksheet.getCell(`I${summaryStartRowTotal + 2}`).border = {
  
    left: { style: 'thin' },
    
    right: { style: 'thin' }
  };
  
  // Grand Total
  worksheet.mergeCells(`G${summaryStartRowTotal + 3}:H${summaryStartRowTotal + 3}`);
  worksheet.getCell(`G${summaryStartRowTotal + 3}`).value = 'GRAND TOTAL';
  worksheet.getCell(`G${summaryStartRowTotal + 3}`).alignment = { horizontal: 'right', vertical: 'middle' };
  worksheet.getCell(`G${summaryStartRowTotal + 3}`).font = { bold: true, size: 9, name:"Courier New" };
  worksheet.getCell(`I${summaryStartRowTotal + 3}`).value = `Rp.${invoiceData.grandTotal.toLocaleString('id-ID')}`;
  worksheet.getCell(`I${summaryStartRowTotal + 3}`).font = { size: 12, name:"Courier New" };
  // Add border to Grand Total cells (with thicker bottom border)
  worksheet.getCell(`G${summaryStartRowTotal + 3}`).border = {
  
    left: { style: 'thin' },
    top: { style: 'thin' },
   
    right: { style: 'thin' }
  };
  worksheet.getCell(`H${summaryStartRowTotal + 3}`).border = {
     top: { style: 'thin' },
      left: { style: 'thin' },
    bottom: { style: 'thick' },
    right: { style: 'thin' }
  };
  worksheet.getCell(`I${summaryStartRowTotal + 3}`).border = {
    top: { style: 'thin' },
    left: { style: 'thin' },
    bottom: { style: 'thick' },
    right: { style: 'thin' }
  };
  
  // Payment Information Box
  const paymentStartRow = summaryStartRowTotal + 6;
  
  // Add payment details with merged cells and a border
  worksheet.mergeCells(`D${paymentStartRow}:G${paymentStartRow + 2}`);
  const paymentCell = worksheet.getCell(`D${paymentStartRow}`);
  paymentCell.value = `Pembayaran : A/N  :  ${invoiceData.bank.accountName}\nAC        : ${invoiceData.bank.accountNumber}\nBANK      :  ${invoiceData.bank.bankName} ${invoiceData.bank.bankBranch}`;
  paymentCell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
  paymentCell.border = {
    top: { style: 'thin' },
    left: { style: 'thin' },
    bottom: { style: 'thin' },
    right: { style: 'thin' }
  };
  paymentCell.font = { bold: true, size: 9, name:"Book Antiqua" };
  // Tanda Terima and Hormat Kami text
  const tandaTerimaRow = paymentStartRow - 1;
  
  // Add 'Tanda Terima' text on the left
  worksheet.getCell(`A${tandaTerimaRow}`).value = 'Tanda Terima,';
  worksheet.getCell(`A${tandaTerimaRow}`).alignment = { horizontal: 'left' }
  worksheet.getCell(`A${tandaTerimaRow}`).alignment = { horizontal: 'left' }
  worksheet.getCell(`A${tandaTerimaRow}`).font = { bold: true, size: 9, name:"Courier New" };
  // Add 'Hormat Kami' text on the right
  worksheet.getCell(`I${tandaTerimaRow}`).value = 'Hormat Kami,';
  worksheet.getCell(`I${tandaTerimaRow}`).font = { bold: true, size: 9, name:"Courier New" };
  
  // Add dotted line for signature
  const signatureRow = tandaTerimaRow + 4;
  
  // Add dotted line for the signature on the left
  worksheet.getCell(`A${signatureRow}`).value = '.............';
  worksheet.getCell(`A${signatureRow}`).alignment = { horizontal: 'left' };
  worksheet.getCell(`A${signatureRow}`).font = { bold: true, size: 9, name:"Courier New" };
  
  // Add the name for the signature on the right
  worksheet.getCell(`I${signatureRow}`).value = `${invoiceData.signature}`;
  worksheet.getCell(`I${signatureRow}`).alignment = { horizontal: 'left' };
  worksheet.getCell(`I${signatureRow}`).font = { bold: true, size: 9, name:"Courier New" };
  
  
  
  // worksheet.eachRow((row, rowNumber) => {
  //   if (row.hasValues) {
  //     row.height = 17; // Set the desired row height for rows with content
  //   }
  // });
  // Helper function to convert numbers to words (simplified)
  function numberToWords(number) {
    // Implement your number to words logic here (or use an external library)
    // For simplicity, returning a placeholder here
    return 'Tiga Juta Tiga Ratus Tiga Puluh Ribu'; // You can replace this with a real implementation
  }
  

  // Save the workbook to the given filePath
  workbook.xlsx.writeFile(filePath)
    .then(() => {
      console.log(`Excel file created successfully at ${filePath}!`);
    })
    .catch(err => {
      console.log('Error creating Excel file:', err);
    });
}

function generateInvoiceExcelNonPpn(invoiceData, filePath){
  const workbook = new ExcelJS.Workbook();
const worksheet = workbook.addWorksheet('Sheet1 (7)');

// Set up column widths for better layout
worksheet.columns = [
  { width: 4.57 },   // A
  { width: 5.86 },   // B
  { width: 4.29 },   // C
  { width: 14.29 },  // D
  { width: 30 },  // E
  { width: 4.2 },      // F
  { width: 14.29 },  // G
  { width: 5.86 },   // H
  { width: 19.43 }   // I
];
  // worksheet.mergeCells('A1:E1');
  // worksheet.getCell('A1').value = `${'invoiceData.companyName' ||'CV. SUMBER MAKMUR DIESEL' }`;
  // worksheet.getCell('A1').font = { name: "Courier New", size: 12 };
  // worksheet.getCell('A1').alignment = { horizontal: 'center', vertical: 'top' };
  
  // worksheet.mergeCells('A2:E2');
  // worksheet.getCell('A2').value = 'GENERAL SPAREPART & TECHNICAL SUPPLIER';
  // worksheet.getCell('A2').font = { name: "Courier New", size: 12 };
  // worksheet.getCell('A2').alignment = { horizontal: 'center' };
  
  // worksheet.mergeCells('A3:E3');
  // worksheet.getCell('A3').value = `${invoiceData.companyAddress || 'Jl. Krekot Raya, Ruko Komplek Krekot Bunder IV No. 34A'}`;
  // worksheet.getCell('A3').font = { name: "Courier New", size: 10 };
  // worksheet.getCell('A3').alignment = { horizontal: 'center' };
  
  // worksheet.mergeCells('A4:E4');
  // worksheet.getCell('A4').value = `Telp: ${invoiceData.companyPhone || '(021) 34833155 - 157'}   Fax: ${invoiceData.companyFax || '(021) 34833158'}`
  // worksheet.getCell('A4').font = { name: "Courier New", size: 10 };
  // worksheet.getCell('A4').alignment = { horizontal: 'center' };
  
  // worksheet.mergeCells('A5:E5');
  // worksheet.getCell('A5').value = `Email : ${invoiceData.companyEmail || "smdmrn@yahoo.com"} `;
  // worksheet.getCell('A5').font = { name: "Courier New", size: 10 };
  // worksheet.getCell('A5').alignment = { horizontal: 'center' };
  
const fontOptions = { name: "Courier New", size: 12 };

// Define a consistent length for labels, for example 20 characters
const labelLength = 10;

// Add the rows with padded labels and monospaced font
worksheet.mergeCells('A1:E1');
worksheet.getCell('A1').value = `${'INVOICE NO'.padEnd(labelLength, ' ')}: ${invoiceData.invoiceNumber}`;
worksheet.getCell('A1').font = fontOptions;

worksheet.mergeCells('A2:E2');
worksheet.getCell('A2').value = `${'SJ NO'.padEnd(labelLength, ' ')}: ${invoiceData.sjNumber}`;
worksheet.getCell('A2').font = fontOptions;

worksheet.mergeCells('A3:E3');
worksheet.getCell('A3').value = `${'ITEMS'.padEnd(labelLength, ' ')}: ${invoiceData.items.length} Items`;
worksheet.getCell('A3').font = fontOptions;

worksheet.mergeCells('A4:E4');
worksheet.getCell('A4').value = `${'PO NO'.padEnd(labelLength, ' ')}: ${invoiceData.poNumber}`;
worksheet.getCell('A4').font = fontOptions;


worksheet.mergeCells('A5:E5');
worksheet.getCell('A5').value = `${'PAYMENT'.padEnd(labelLength, ' ')}: ${invoiceData.payment} Days`;
worksheet.getCell('A5').font = fontOptions;


  // Recipient Information on the right side
  worksheet.mergeCells('G1:I1');
  worksheet.getCell('G1').value = `Jakarta, ${invoiceData.transaction_date}`;
  worksheet.getCell('G1').alignment = { horizontal: 'left' };
  worksheet.getCell('G1').font = { name: "Courier New", size: 10 };
  
  worksheet.mergeCells('G3:I3');
  worksheet.getCell('G3').value = 'Kepada Yth,';
  worksheet.getCell('G3').alignment = { horizontal: 'left' };
  worksheet.getCell('G3').font = { name: "Courier New", size: 10 };
  
  worksheet.mergeCells('G4:I4');
  worksheet.getCell('G4').value = `${invoiceData.customer.name}`;
  worksheet.getCell('G4').alignment = { horizontal: 'left' };
  worksheet.getCell('G4').font = { name: "Courier New", size: 10 };
  
  worksheet.mergeCells('G5:I6');
  worksheet.getCell('G5').value = `${invoiceData.customer.address}`;
  worksheet.getCell('G5').alignment = { horizontal: 'left',wrapText:"true",vertical:"middle" };
  worksheet.getCell('G5').font = { name: "Courier New", size: 10 };
  
  // worksheet.mergeCells('G6:I6');
  // worksheet.getCell('G6').value = `${invoiceData.customer.address_2}`;
  // worksheet.getCell('G6').alignment = { horizontal: 'left' };
  // worksheet.getCell('G6').font = { name: "Courier New", size: 10 };
  
  worksheet.mergeCells('G7:I7');
  worksheet.getCell('G7').value = `${invoiceData.customer.address_2}`;
  worksheet.getCell('G7').alignment = { horizontal: 'left' };
  worksheet.getCell('G7').font = { name: "Courier New", size: 10 };
  
  // Set the row height only for rows with content
  

  worksheet.getCell('E7').value = `INVOICE`;
  worksheet.getCell('E7').alignment = {  horizontal: 'center', vertical: 'middle'};
  worksheet.getCell('E7').font = { name: "Courier New", size: 14 };


  worksheet.addRow(['No', 'Qty', '', 'PART NUMBER', 'DESCRIPTION', 'UNIT', 'PRICE', 'AMOUNT']);
  
  // Merge cells for the header as needed
  worksheet.mergeCells('A8:A9'); // Merge cells for "No"
  worksheet.mergeCells('B8:C9'); // Merge cells for "Qty"
  // worksheet.mergeCells('C8:C9'); // Merge cells for "Unit"
  worksheet.mergeCells('D8:D9'); // Merge cells for "PART NUMBER"
  worksheet.mergeCells('E8:E9'); // Merge cells for "DESCRIPTION"
  worksheet.mergeCells('F8:G8'); // Merge cells across F8 to G9 for "UNIT PRICE"
  worksheet.mergeCells('F9:G9'); // Merge cells across F8 to G9 for "UNIT PRICE"
  worksheet.mergeCells('H8:I9'); // Merge cells for "AMOUNT"
  
  // Set values for the merged cells
  worksheet.getCell('F8').value = 'UNIT'; // Use a line break to separate "UNIT" and "PRICE"
  worksheet.getCell('F9').value = 'PRICE'; // Use a line break to separate "UNIT" and "PRICE"
  worksheet.getCell('F9').alignment = { horizontal: "center", vertical: "middle" } 
  worksheet.getCell('H8').value = 'AMOUNT'; // Set the value for "AMOUNT"
  
  // Format "UNIT PRICE" and "AMOUNT" cells to wrap text and align
  worksheet.getCell('F8').alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
  worksheet.getCell('H8').alignment = { horizontal: 'center', vertical: 'middle' , wrapText: true };
  
  // Apply font and border formatting for the header row (Row 8)
  const headerRow = worksheet.getRow(8);
  headerRow.font = { size: 10, name: "Courier New" };
  headerRow.eachCell((cell, colNumber) => {
    // Skip formatting for the "UNIT PRICE" cell located in F8 (column 6)
  
    cell.alignment = { horizontal: "center", vertical: "middle" }; // Apply to each cell except "UNIT PRICE"
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      right: { style: 'thin' }
    };
  });
  
  // Add table data below the header
  const items = invoiceData.items.map((item, index) => [
    index + 1,                           // No
    item.quantity,                       // Qty
    item.unit_code || '',                // Unit (can be empty if not specified)
    item.partNumber,                     // PART NUMBER
    item.itemName,                       // DESCRIPTION
    'Rp.',                               // UNIT (Currency label)
    item.unitCost.toLocaleString('id-ID'), // PRICE (formatted with thousands separator)
    'Rp.',                               // CURRENCY LABEL (for amount)
    item.total.toLocaleString('id-ID')   // AMOUNT (formatted with thousands separator)
  ]);


  
// Add the data to the worksheet
items.forEach((item, rowIndex) => {
  const row = worksheet.addRow(item);
  row.height = 25;

  row.eachCell((cell, colIndex) => {
    let border = {};

    // Apply border to the outer part of the table
    if (rowIndex === 0) {
      border.top = { style: 'thin' }; // Top border for the first row
    }
    if (rowIndex === items.length - 1) {
      border.bottom = { style: 'thin' }; // Bottom border for the last row
    }
    if (colIndex === 1) {
      border.left = { style: 'thin' }; // Left border for the first column
    }
    if (colIndex === row.cellCount) {
      border.right = { style: 'thin' }; // Right border for the last column
    }

    // Apply the border to each cell
    cell.border = border;

    // Apply alignment to specific columns
    if (colIndex === 7 || colIndex === 9) { // Columns 7 and 9 (unitCost and total) to align left
      cell.alignment = { horizontal: 'left', vertical: 'middle', wrapText: true };
    } else {
      cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    }

    // Apply font to each cell
    cell.font = { bold: true, size: 10, name: "Courier New" };
  });
});

  
  
  // Determine the start row for financial summary based on the items data length
  const summaryStartRow = items.length + 10;
  const summaryStartRowTotal = items.length + 10;
  // Subtotal, Tax, and Grand Total
  
  
  worksheet.mergeCells(`A${summaryStartRow }:F${summaryStartRow + 2}`);
  worksheet.getCell(`A${summaryStartRow }`).value = `TERBILANG : # ${invoiceData.terbilang} Rupiah #`;
  worksheet.getCell(`A${summaryStartRow }`).font = { bold: true, size: 10, name:"Courier New" ,underline:"true"};
  worksheet.getCell(`A${summaryStartRow }`).alignment = {horizontal: 'center', vertical: 'middle',wrapText: true };
  
  // Financial Summary
  // Sub Total
  worksheet.mergeCells(`G${summaryStartRowTotal}:H${summaryStartRowTotal}`);
  worksheet.getCell(`G${summaryStartRowTotal}`).value = 'SUB TOTAL';
  worksheet.getCell(`G${summaryStartRowTotal}`).alignment = { horizontal: 'right' };
  worksheet.getCell(`G${summaryStartRowTotal}`).font = { bold: true, size: 10, name:"Courier New" };
  worksheet.getCell(`I${summaryStartRowTotal}`).value = `Rp.${invoiceData.subTotal.toLocaleString('id-ID')}`;
  worksheet.getCell(`I${summaryStartRowTotal}`).font = { bold: true, size: 10, name:"Courier New" };
  // Add border to Sub Total cells
  worksheet.getCell(`G${summaryStartRowTotal}`).border = {
  
    left: { style: 'thin' },
    
    right: { style: 'thin' }
  };
  worksheet.getCell(`H${summaryStartRowTotal}`).border = {
  
    left: { style: 'thin' },
    
    right: { style: 'thin' }
  };
  worksheet.getCell(`I${summaryStartRowTotal}`).border = {
  
    left: { style: 'thin' },
    
    right: { style: 'thin' }
  };
  worksheet.mergeCells(`G${summaryStartRowTotal + 1}:H${summaryStartRowTotal + 1}`);
  worksheet.getCell(`G${summaryStartRowTotal + 1}`).value = `Discount ${invoiceData.discountPercentage}%`;
  worksheet.getCell(`G${summaryStartRowTotal + 1}`).font = { bold: true, size: 10, name:"Courier New" };
  worksheet.getCell(`G${summaryStartRowTotal + 1}`).alignment = { horizontal: 'right' };
  worksheet.getCell(`I${summaryStartRowTotal + 1}`).value = `Rp.${invoiceData.discount.toLocaleString('id-ID')}`;
  worksheet.getCell(`I${summaryStartRowTotal + 1}`).font = { bold: true, size: 10, name:"Courier New" };
  // Add border to PPN 11% cells
  worksheet.getCell(`G${summaryStartRowTotal + 1}`).border = {
  
    left: { style: 'thin' },
    
    right: { style: 'thin' }
  };
  worksheet.getCell(`H${summaryStartRowTotal + 1}`).border = {
  
    left: { style: 'thin' },
    
    right: { style: 'thin' }
  };
  worksheet.getCell(`I${summaryStartRowTotal + 1}`).border = {
  
    left: { style: 'thin' },
    
    right: { style: 'thin' }
  };
  
  // PPN 11%
  worksheet.mergeCells(`G${summaryStartRowTotal + 2}:H${summaryStartRowTotal + 2}`);
  worksheet.getCell(`G${summaryStartRowTotal + 2}`).value = `PPN ${invoiceData.tax_ppn}%`;
  worksheet.getCell(`G${summaryStartRowTotal + 2}`).font = { bold: true, size: 10, name:"Courier New" };
  worksheet.getCell(`G${summaryStartRowTotal + 2}`).alignment = { horizontal: 'right' };
  worksheet.getCell(`I${summaryStartRowTotal + 2}`).value = `Rp.${invoiceData.totalPpn.toLocaleString('id-ID')}`;
  worksheet.getCell(`I${summaryStartRowTotal + 2}`).font = { bold: true, size: 10, name:"Courier New" };
  // Add border to PPN 11% cells
  worksheet.getCell(`G${summaryStartRowTotal + 2}`).border = {
  
    left: { style: 'thin' },
    
    right: { style: 'thin' }
  };
  worksheet.getCell(`H${summaryStartRowTotal + 2}`).border = {
  
    left: { style: 'thin' },
    
    right: { style: 'thin' }
  };
  worksheet.getCell(`I${summaryStartRowTotal + 2}`).border = {
  
    left: { style: 'thin' },
    
    right: { style: 'thin' }
  };
  
  // Grand Total
  worksheet.mergeCells(`G${summaryStartRowTotal + 3}:H${summaryStartRowTotal + 3}`);
  worksheet.getCell(`G${summaryStartRowTotal + 3}`).value = 'GRAND TOTAL';
  worksheet.getCell(`G${summaryStartRowTotal + 3}`).alignment = { horizontal: 'right', vertical: 'middle' };
  worksheet.getCell(`G${summaryStartRowTotal + 3}`).font = { bold: true, size: 9, name:"Courier New" };
  worksheet.getCell(`I${summaryStartRowTotal + 3}`).value = `Rp.${invoiceData.grandTotal.toLocaleString('id-ID')}`;
  worksheet.getCell(`I${summaryStartRowTotal + 3}`).font = { size: 12, name:"Courier New" };
  // Add border to Grand Total cells (with thicker bottom border)
  worksheet.getCell(`G${summaryStartRowTotal + 3}`).border = {
  
    left: { style: 'thin' },
    top: { style: 'thin' },
   
    right: { style: 'thin' }
  };
  worksheet.getCell(`H${summaryStartRowTotal + 3}`).border = {
     top: { style: 'thin' },
      left: { style: 'thin' },
    bottom: { style: 'thick' },
    right: { style: 'thin' }
  };
  worksheet.getCell(`I${summaryStartRowTotal + 3}`).border = {
    top: { style: 'thin' },
    left: { style: 'thin' },
    bottom: { style: 'thick' },
    right: { style: 'thin' }
  };
  
  // Payment Information Box
  const paymentStartRow = summaryStartRowTotal + 6;
  
  // Add payment details with merged cells and a border
  worksheet.mergeCells(`D${paymentStartRow}:G${paymentStartRow + 2}`);
  const paymentCell = worksheet.getCell(`D${paymentStartRow}`);
  paymentCell.value = `Pembayaran : A/N  :  ${invoiceData.bank.accountName}\nAC        : ${invoiceData.bank.accountNumber}\nBANK      :  ${invoiceData.bank.bankName} ${invoiceData.bank.bankBranch}`;
  paymentCell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
  paymentCell.border = {
    top: { style: 'thin' },
    left: { style: 'thin' },
    bottom: { style: 'thin' },
    right: { style: 'thin' }
  };
  paymentCell.font = { bold: true, size: 9, name:"Book Antiqua" };
  // Tanda Terima and Hormat Kami text
  const tandaTerimaRow = paymentStartRow - 1;
  
  // Add 'Tanda Terima' text on the left
  worksheet.getCell(`A${tandaTerimaRow}`).value = 'Tanda Terima,';
  worksheet.getCell(`A${tandaTerimaRow}`).alignment = { horizontal: 'left' }
  worksheet.getCell(`A${tandaTerimaRow}`).alignment = { horizontal: 'left' }
  worksheet.getCell(`A${tandaTerimaRow}`).font = { bold: true, size: 9, name:"Courier New" };
  // Add 'Hormat Kami' text on the right
  worksheet.getCell(`I${tandaTerimaRow}`).value = 'Hormat Kami,';
  worksheet.getCell(`I${tandaTerimaRow}`).font = { bold: true, size: 9, name:"Courier New" };
  
  // Add dotted line for signature
  const signatureRow = tandaTerimaRow + 4;
  
  // Add dotted line for the signature on the left
  worksheet.getCell(`A${signatureRow}`).value = '.............';
  worksheet.getCell(`A${signatureRow}`).alignment = { horizontal: 'left' };
  worksheet.getCell(`A${signatureRow}`).font = { bold: true, size: 9, name:"Courier New" };
  
  // Add the name for the signature on the right
  worksheet.getCell(`I${signatureRow}`).value = `${invoiceData.signature}`;
  worksheet.getCell(`I${signatureRow}`).alignment = { horizontal: 'left' };
  worksheet.getCell(`I${signatureRow}`).font = { bold: true, size: 9, name:"Courier New" };
  
  
  workbook.xlsx.writeFile(filePath)
    .then(() => {
      console.log(`Excel file created successfully at ${filePath}!`);
    })
    .catch(err => {
      console.log('Error creating Excel file:', err);
    });
}


function generateSuratJalanExcel(invoiceData, filePath){
  const workbook = new ExcelJS.Workbook();
const worksheet = workbook.addWorksheet('Sheet1 (7)');

// Set up column widths for better layout
worksheet.columns = [
  { width: 4.57 },   // A
  { width: 5.86 },   // B
  { width: 4.29 },   // C
  { width: 23 },  // D
  { width: 23 },  // E
  { width: 0},      // F
  { width: 45 },  // G
  { width: 5.86 },   // H
  { width: 20 }   // I
];
  worksheet.mergeCells('A1:E1');
  worksheet.getCell('A1').value = `${invoiceData.companyName ||'CV. SUMBER MAKMUR DIESEL' }`;
  worksheet.getCell('A1').font = { name: "Courier New", size: 12 };
  worksheet.getCell('A1').alignment = { horizontal: 'center', vertical: 'top' };
  
  worksheet.mergeCells('A2:E2');
  worksheet.getCell('A2').value = 'GENERAL SPAREPART & TECHNICAL SUPPLIER';
  worksheet.getCell('A2').font = { name: "Courier New", size: 12 };
  worksheet.getCell('A2').alignment = { horizontal: 'center' };
  
  worksheet.mergeCells('A3:E3');
  worksheet.getCell('A3').value = `${invoiceData.companyAddress || 'Jl. Krekot Raya, Ruko Komplek Krekot Bunder IV No. 34A'}`;
  worksheet.getCell('A3').font = { name: "Courier New", size: 10 };
  worksheet.getCell('A3').alignment = { horizontal: 'center' };
  
  worksheet.mergeCells('A4:E4');
  worksheet.getCell('A4').value = `Telp: ${invoiceData.companyPhone || '(021) 34833155 - 157'}   Fax: ${invoiceData.companyFax || '(021) 34833158'}`
  worksheet.getCell('A4').font = { name: "Courier New", size: 10 };
  worksheet.getCell('A4').alignment = { horizontal: 'center' };
  
  worksheet.mergeCells('A5:E5');
  worksheet.getCell('A5').value = `Email : ${invoiceData.companyEmail || "smdmrn@yahoo.com"} `;
  worksheet.getCell('A5').font = { name: "Courier New", size: 10 };
  worksheet.getCell('A5').alignment = { horizontal: 'center' };

  
  worksheet.mergeCells('A7:E7');
  worksheet.getCell('A7').value = `SURAT JALAN NO. ${invoiceData.sjNumber}`
  worksheet.getCell('A7').font = { name: "Courier New", size: 14 };
  
  // Recipient Information on the right side
  worksheet.mergeCells('G1:I1');
  worksheet.getCell('G1').value = `Jakarta, ${invoiceData.transaction_date}`;
  worksheet.getCell('G1').alignment = { horizontal: 'left' };
  worksheet.getCell('G1').font = { name: "Courier New", size: 10 };
  
  worksheet.mergeCells('G3:I3');
  worksheet.getCell('G3').value = 'Kepada Yth,';
  worksheet.getCell('G3').alignment = { horizontal: 'left' };
  worksheet.getCell('G3').font = { name: "Courier New", size: 10 };
  
  worksheet.mergeCells('G4:I4');
  worksheet.getCell('G4').value = `${invoiceData.customer.name}`;
  worksheet.getCell('G4').alignment = { horizontal: 'left' };
  worksheet.getCell('G4').font = { name: "Courier New", size: 10 };
  
  worksheet.mergeCells('G5:I6');
  worksheet.getCell('G5').value = `${invoiceData.customer.address}`;
  worksheet.getCell('G5').alignment = { horizontal: 'left',wrapText:"true",vertical:"middle" };
  worksheet.getCell('G5').font = { name: "Courier New", size: 10 };
  
  // worksheet.mergeCells('G6:I6');
  // worksheet.getCell('G6').value = `${invoiceData.customer.address_2}`;
  // worksheet.getCell('G6').alignment = { horizontal: 'left' };
  // worksheet.getCell('G6').font = { name: "Courier New", size: 10 };
  
  worksheet.mergeCells('G7:I7');
  worksheet.getCell('G7').value = `${invoiceData.customer.address_2}`;
  worksheet.getCell('G7').alignment = { horizontal: 'left' };
  worksheet.getCell('G7').font = { name: "Courier New", size: 10 };
  
  // Set the row height only for rows with content
  

  worksheet.addRow(['NO', 'QTY', '', 'NAMA BARANG', 'PART NUMBER', 'KETERANGAN']);
  
  // Merge cells for the header as needed
  worksheet.mergeCells('A8:A9'); // Merge cells for "No"
  worksheet.mergeCells('B8:C9'); // Merge cells for "Qty"
  // worksheet.mergeCells('C8:C9'); // Merge cells for "Unit"
  worksheet.mergeCells('D8:D9'); // Merge cells for "PART NUMBER"
  worksheet.mergeCells('E8:E9'); // Merge cells for "DESCRIPTION"
  worksheet.mergeCells('F8:G9'); // Merge cells across F8 to G9 for "UNIT PRICE"
  // worksheet.mergeCells('F9:G9'); // Merge cells across F8 to G9 for "UNIT PRICE"
  // worksheet.mergeCells('H8:I9'); // Merge cells for "AMOUNT"
  

  
  // Format "UNIT PRICE" and "AMOUNT" cells to wrap text and align
  // worksheet.getCell('F8').alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
  // worksheet.getCell('H8').alignment = { horizontal: 'center', vertical: 'middle' , wrapText: true };
  
  // Apply font and border formatting for the header row (Row 8)
  const headerRow = worksheet.getRow(8);
  headerRow.font = { size: 10, name: "Courier New" };
  headerRow.eachCell((cell, colNumber) => {
    // Skip formatting for the "UNIT PRICE" cell located in F8 (column 6)
  
    cell.alignment = { horizontal: "center", vertical: "middle" }; // Apply to each cell except "UNIT PRICE"
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      right: { style: 'thin' }
    };
  });
  
  // Add table data below the header
  const items = invoiceData.items.map((item, index) => [
    index + 1,                           // No
    item.quantity,                       // Qty
    item.unit_code || '',                // Unit (can be empty if not specified)
    item.name,                       // DESCRIPTION
    item.partNumber,                     // PART NUMBER
    '',                               // UNIT (Currency label)
    item.note, // PRICE (formatted with thousands separator)

  ]);


  
// Add the data to the worksheet
// Add the data to the worksheet
items.forEach((item, rowIndex) => {
  const row = worksheet.addRow(item);
  row.height = 25;

  // Loop through all columns (1 to item length)
  for (let colIndex = 1; colIndex <= item.length; colIndex++) {
    const cell = row.getCell(colIndex);

    let border = {};

    // Apply border to the outer part of the table
    if (rowIndex === 0) {
      border.top = { style: 'thin' }; // Top border for the first row
    }
    if (rowIndex === items.length - 1) {
      border.bottom = { style: 'thin' }; // Bottom border for the last row
    }
    if (colIndex === 1) {
      border.left = { style: 'thin' }; // Left border for the first column
    }
    if (colIndex === item.length) {
      border.right = { style: 'thin' }; // Right border for the last column
    }

    // Apply the border to each cell
    cell.border = border;

    // Apply alignment to each cell
    cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };

    // Apply font to each cell
    cell.font = { bold: true, size: 10, name: "Courier New" };
  }
});


  
  
  // Determine the start row for financial summary based on the items data length
  // const summaryStartRow = items.length + 10;
  const summaryStartRowTotal = items.length + 10;
  // Subtotal, Tax, and Grand Total
  
  
  // worksheet.mergeCells(`A${summaryStartRow }:F${summaryStartRow + 2}`);
  // worksheet.getCell(`A${summaryStartRow }`).value = `TERBILANG : # ${invoiceData.terbilang} Rupiah #`;
  // worksheet.getCell(`A${summaryStartRow }`).font = { bold: true, size: 10, name:"Courier New" ,underline:"true"};
  // worksheet.getCell(`A${summaryStartRow }`).alignment = {horizontal: 'center', vertical: 'middle',wrapText: true };
  

  // Payment Information Box
  const paymentStartRow = summaryStartRowTotal + 2;
  
  // // Add payment details with merged cells and a border
  // worksheet.mergeCells(`D${paymentStartRow}:G${paymentStartRow + 2}`);
  // const paymentCell = worksheet.getCell(`D${paymentStartRow}`);
  // paymentCell.value = `Pembayaran : A/N  :  ${invoiceData.bank.accountName}\nAC        : ${invoiceData.bank.accountNumber}\nBANK      :  ${invoiceData.bank.bankName} ${invoiceData.bank.bankBranch}`;
  // paymentCell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
  // paymentCell.border = {
  //   top: { style: 'thin' },
  //   left: { style: 'thin' },
  //   bottom: { style: 'thin' },
  //   right: { style: 'thin' }
  // };
  // paymentCell.font = { bold: true, size: 9, name:"Book Antiqua" };
  // Tanda Terima and Hormat Kami text
  const tandaTerimaRow = paymentStartRow - 1;
  
  // Add 'Tanda Terima' text on the left
  worksheet.getCell(`A${tandaTerimaRow}`).value = 'Tanda Terima,';
  worksheet.getCell(`A${tandaTerimaRow}`).alignment = { horizontal: 'left' }
  worksheet.getCell(`A${tandaTerimaRow}`).alignment = { horizontal: 'left' }
  worksheet.getCell(`A${tandaTerimaRow}`).font = { bold: true, size: 9, name:"Courier New" };
  // Add 'Hormat Kami' text on the right
  worksheet.getCell(`G${tandaTerimaRow}`).value = 'Hormat Kami,';
  worksheet.getCell(`G${tandaTerimaRow}`).font = { bold: true, size: 9, name:"Courier New" };
  worksheet.getCell(`G${tandaTerimaRow}`).alignment = { horizontal: 'right' };
  // Add dotted line for signature
  const signatureRow = tandaTerimaRow + 4;
  
  // Add dotted line for the signature on the left
  worksheet.getCell(`A${signatureRow}`).value = '.............';
  worksheet.getCell(`A${signatureRow}`).alignment = { horizontal: 'left' };
  worksheet.getCell(`A${signatureRow}`).font = { bold: true, size: 9, name:"Courier New" };
  
  // Add the name for the signature on the right
  worksheet.getCell(`G${signatureRow}`).value = `${invoiceData.signature}`;
  worksheet.getCell(`G${signatureRow}`).alignment = { horizontal: 'right' };
  worksheet.getCell(`G${signatureRow}`).font = { bold: true, size: 9, name:"Courier New" };
  
  

  

  // Save the workbook to the given filePath
  workbook.xlsx.writeFile(filePath)
    .then(() => {
      console.log(`Excel file created successfully at ${filePath}!`);
    })
    .catch(err => {
      console.log('Error creating Excel file:', err);
    });
}

module.exports = { generateInvoiceExcel,generateInvoiceExcelNonPpn, generateSuratJalanExcel}