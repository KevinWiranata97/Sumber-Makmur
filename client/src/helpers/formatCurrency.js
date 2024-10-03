const formatCurrency = (value) => {
    if (!value) return '';
    const numberValue = parseFloat(value.replace(/,/g, ''));
    return new Intl.NumberFormat('en-US', { minimumFractionDigits: 0 }).format(numberValue);
  };


  module.exports = formatCurrency