const ExcelJS = require('exceljs');

// Create a new workbook and a worksheet
const workbook = new ExcelJS.Workbook();
const worksheet = workbook.addWorksheet('Sheet1 (7)');

// Add data and merge cells
worksheet.mergeCells('A1:I1');
worksheet.getCell('A1').value = 'CV . SUMBER MAKMUR DIESEL';
worksheet.getCell('A1').alignment = { horizontal: 'center' };
worksheet.getCell('A1').font = { bold: true };

worksheet.mergeCells('A2:I2');
worksheet.getCell('A2').value = 'GENERAL SPAREPART & TECHNICAL SUPPLIER';

worksheet.mergeCells('A3:I3');
worksheet.getCell('A3').value = 'Jl . Krekot Raya , Ruko Komplek Krekot Bunder , Jakarta';

worksheet.mergeCells('A4:I4');
worksheet.getCell('A4').value = 'Telp : (021) 34833155 - 157 , Fax : (021) 34833158';

worksheet.mergeCells('A5:I5');
worksheet.getCell('A5').value = 'Email : smdmrn@yahoo.com';

worksheet.mergeCells('A6:D6');
worksheet.getCell('A6').value = 'INVOICE No. 24000170/CV/SMD/IX/2024';

worksheet.mergeCells('E6:I6');
worksheet.getCell('E6').value = 'Jakarta, 24 September 2024';

// Adding recipient details
worksheet.mergeCells('A8:D8');
worksheet.getCell('A8').value = 'Kepada Yth,';

worksheet.mergeCells('A9:I9');
worksheet.getCell('A9').value = 'PT . PELAYARAN SAMUDERA RIZQI';

worksheet.mergeCells('A10:I10');
worksheet.getCell('A10').value = 'Komp. BSD Sektor XII , Kencana Loka';

worksheet.mergeCells('A11:I11');
worksheet.getCell('A11').value = 'Blok. J5 , No. 3';

// Save the workbook to a file
workbook.xlsx.writeFile('invoice_output.xlsx')
  .then(() => {
    console.log('File saved successfully!');
  })
  .catch((error) => {
    console.error('Error saving file:', error);
  });
