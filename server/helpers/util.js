function generateRandom6DigitNumber() {
    return Math.floor(100000 + Math.random() * 900000);
}


function generateCustomString(uniqueId) {
    // Get the current date
    const now = new Date();

    // Format day and month with leading zeros if necessary
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');

    // Create the final string
    return `FB ${day}/${month}/${uniqueId}`;
}

function generateSuratJalanNumber(uniqueId) {
  // Get the current date
  const now = new Date();

  // Extract the current year and month
  const year = now.getFullYear();
  const month = now.getMonth() + 1; // getMonth() returns 0-11, so we add 1

  // Map the month number to Roman numerals
  const romanMonths = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];

  // Get the Roman numeral for the current month
  const romanMonth = romanMonths[month - 1]; // Subtract 1 to match the array index

  // Create the final string
  return `${uniqueId}/SJ/CV/${romanMonth}/${year}`;
}

function generateInvoiceNumberPPN(uniqueId) {
  // Get the current date
  const now = new Date();

  // Extract the current year
  const year = now.getFullYear();

  // Calculate the base year (24000 for 2024, 25000 for 2025, etc.)
  const baseYear = Math.floor(year) - 2000; // Will give 24 for 2024, 25 for 2025, etc.
  const invoiceBase = `${baseYear}000`; // Convert to string and append '000'

  // Get the uniqueId directly from the parameter
  const uniqueNumber = uniqueId; // This will be the unique identifier passed as a parameter

  // Format the unique ID according to the specified rules
  let formattedUniqueId;
  if (uniqueNumber < 10) {
    formattedUniqueId = String(uniqueNumber).padStart(4, '0'); // 00000
  } else if (uniqueNumber < 100) {
    formattedUniqueId = String(uniqueNumber).padStart(3, '0'); // 0000
  } else if (uniqueNumber < 1000) {
    formattedUniqueId = String(uniqueNumber).padStart(2, '0'); // 000
  } else if (uniqueNumber < 10000) {
    formattedUniqueId = String(uniqueNumber).padStart(1, '0'); // 00
  } else {
    formattedUniqueId = String(uniqueNumber); // No padding for five or more digits
  }

  // Map the month number to Roman numerals
  const month = now.getMonth() + 1; // getMonth() returns 0-11, so we add 1
  const romanMonths = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];

  // Get the Roman numeral for the current month
  const romanMonth = romanMonths[month - 1]; // Subtract 1 to match the array index

  // Create the final string
  return `${invoiceBase}${formattedUniqueId}/CV/SMD/${romanMonth}/${year}`;
}



function generateInvoiceNumberNoPPN(uniqueId) {
  // Get the current date
  const now = new Date();

  // Extract the current year and month
  const year = now.getFullYear();
  const month = now.getMonth() + 1; // getMonth() returns 0-11, so we add 1

  // Map the month number to Roman numerals
  const romanMonths = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];

  // Get the Roman numeral for the current month
  const romanMonth = romanMonths[month - 1]; // Subtract 1 to match the array index

  // Create the final string
  return `${uniqueId}/SMD/${romanMonth}/${year}`;
}

function formatDateToDDMMYYYY(dateInput) {
    const date = new Date(dateInput);
    
    const formattedDate = [
      ('0' + date.getDate()).slice(-2), // Day
      ('0' + (date.getMonth() + 1)).slice(-2), // Month
      date.getFullYear() // Year
    ].join('/');
  
    return formattedDate;
  }
  function convertToTerbilang(number) {
    const units = ['', 'satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'delapan', 'sembilan'];
    const tens = ['', 'sepuluh', 'sebelas', 'dua belas', 'tiga belas', 'empat belas', 'lima belas', 'enam belas', 'tujuh belas', 'delapan belas', 'sembilan belas'];
    const tensMultiple = ['', '', 'dua puluh', 'tiga puluh', 'empat puluh', 'lima puluh', 'enam puluh', 'tujuh puluh', 'delapan puluh', 'sembilan puluh'];
    const hundreds = ['', 'seratus', 'dua ratus', 'tiga ratus', 'empat ratus', 'lima ratus', 'enam ratus', 'tujuh ratus', 'delapan ratus', 'sembilan ratus'];
  
    if (number === 0) return 'nol Rupiah';
  
    function convertHundreds(num) {
      let result = '';
      if (num >= 100) {
        result += hundreds[Math.floor(num / 100)] + ' ';
        num %= 100;
      }
      if (num >= 20) {
        result += tensMultiple[Math.floor(num / 10)] + ' ';
        num %= 10;
      } else if (num >= 10 && num <= 19) {
        result += tens[num - 10] + ' ';
        num = 0;
      }
      if (num > 0) {
        result += units[num] + ' ';
      }
      return result.trim();
    }
  
    function convertThousandAndUp(num) {
      let parts = [
        { divisor: 1000000000, word: 'miliar' },
        { divisor: 1000000, word: 'juta' },
        { divisor: 1000, word: 'ribu' },
      ];
  
      let result = '';
      let currentPart = num;
  
      for (let i = 0; i < parts.length; i++) {
        let quotient = Math.floor(currentPart / parts[i].divisor);
        if (quotient > 0) {
          if (quotient === 1 && parts[i].divisor === 1000) {
            result += 'seribu ';
          } else {
            result += convertHundreds(quotient) + ' ' + parts[i].word + ' ';
          }
        }
        currentPart %= parts[i].divisor;
      }
  
      if (currentPart > 0) {
        result += convertHundreds(currentPart) + ' ';
      }
  
      return result.trim();
    }
  
    return convertThousandAndUp(number);
  }
  function formatDateToYYYYMMDD(dateString) {
    const [day, month, year] = dateString.split('/');
    return `${year}-${month}-${day}`; // Return in YYYY-MM-DD format
  }
  
  function convertDateToIndonesianFormat(datetimeStr) {
    // Parse the datetime string into a JavaScript Date object
    const date = new Date(datetimeStr);
  
    // Extract day, month, and year
    const day = date.getDate();
    const year = date.getFullYear();
  
    // Array of month names in Indonesian
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
  
    // Get the month name
    const month = months[date.getMonth()];
  
    // Return formatted date
    return `${day} ${month} ${year}`;
  }
  

module.exports = {
    generateCustomString,
    generateRandom6DigitNumber,
    generateSuratJalanNumber,
    formatDateToDDMMYYYY,
    convertToTerbilang,
    formatDateToYYYYMMDD,
    generateInvoiceNumberNoPPN,
    generateInvoiceNumberPPN,
    convertDateToIndonesianFormat
}
