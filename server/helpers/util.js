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


function generateSuratJalan(uniqueId) {
    // Get the current date
    const now = new Date();

    // Extract the current year
    const year = now.getFullYear();

    // Create the final string
    return `${uniqueId}/SJ/CV/IV/${year}`;
}



module.exports = {
    generateCustomString,
    generateRandom6DigitNumber,
    generateSuratJalan
}
