const xlsx = require('xlsx');
const fs = require('fs');
const {User, Storage, Unit, Product, Company_Profile, sequelize, Bank_Account,Tax_Information } = require('./models'); // Assuming you have a Sequelize model named 'Shelf'
const { create } = require('domain');

// Load the Excel file
const workbook = xlsx.readFile('STOCK BARANG.xlsx');

// Get the first worksheet
const worksheet = workbook.Sheets[workbook.SheetNames[0]];

// Convert the worksheet to JSON
const jsonData = xlsx.utils.sheet_to_json(worksheet, {
  header: 1, // Treat the first row as header
  defval: "", // Fill empty values with an empty string
});

// Extract the headers (first row)
const headers = jsonData[0];

// Remove the header row from the data
const rows = jsonData.slice(1);

// Create an array of objects using the headers as keys
const formattedData = rows.map(row => {
  let rowObject = {};
  headers.forEach((header, index) => {
    rowObject[header] = row[index];
  });
  return rowObject;
});

// Clean data by removing rows with empty values
const cleanedData = formattedData.filter(row =>
  Object.values(row).some(value => value !== "")
);
fs.writeFileSync('formatted_stock_barang.json', JSON.stringify(cleanedData, null, 2), 'utf-8');
// Function to create shelf data from the RAK field
async function createStorageFromData() {
  try {
    const shelfData = cleanedData.map(item => ({
      storage_name: item.RAK,      // Using RAK from the JSON data as storage_name
      storage_code: item.RAK,      // Using RAK from the JSON data as storage_code
      createdBy: 'system'
    }));

    // Loop over the shelfData and create each storage if it doesn't already exist
    for (const data of shelfData) {
      // Check if storage already exists
      const existingStorage = await Storage.findOne({
        where: {
          storage_name: data.storage_name,  // Check for existing storage_name
          storage_code: data.storage_code   // Check for existing storage_code
        }
      });

      if (!existingStorage) {
        // If no existing storage, create a new one
        await Storage.create(data);
        console.log(`Created new storage: ${data.storage_name}`);
      } else {
        console.log(`Storage already exists: ${data.storage_name}`);
      }
    }

    console.log('Storage creation process completed!');
  } catch (error) {
    console.error('Error creating Storage:', error);
  }
}

async function createUnitFromData(username) {
  try {
    const unitData = cleanedData.map(item => ({
      unit_name: item.Satuan,      // Using Satuan from the JSON data as unit_name
      unit_code: item.Satuan,      // Using Satuan from the JSON data as unit_code
      createdBy: username          // Using the username from req.userAccess
    }));

    // Loop over the unitData and create each unit if it doesn't already exist
    for (const data of unitData) {
      // Check if the unit already exists
      const existingUnit = await Unit.findOne({
        where: {
          unit_name: data.unit_name,  // Check for existing unit_name
          unit_code: data.unit_code   // Check for existing unit_code
        }
      });

      if (!existingUnit) {
        // If no existing unit, create a new one
        await Unit.create(data);
        console.log(`Created new unit: ${data.unit_name}`);
      } else {
        console.log(`Unit already exists: ${data.unit_name}`);
      }
    }

    console.log('Unit creation process completed!');
  } catch (error) {
    console.error('Error creating Unit:', error);
  }
}


async function createOrUpdateProductFromData() {
  try {
    // Loop over each item in the JSON data and create or update the product
    for (const item of cleanedData) {
      // Find the storage ID using the RAK value as the storage_name
      const storage = await Storage.findOne({
        where: { storage_name: item.RAK } // Assuming RAK corresponds to storage_name
      });

      // If no storage is found, handle the error or create a new storage
      if (!storage) {
        console.log(`Storage not found for RAK: ${item.RAK}`);
        continue;
      }

      // Find the unit ID using the Satuan value as unit_name
      const unit = await Unit.findOne({
        where: { unit_name: item.Satuan } // Assuming Satuan corresponds to unit_name
      });

      // If no unit is found, handle the error or create a new unit
      if (!unit) {
        console.log(`Unit not found for Satuan: ${item.Satuan}`);
        continue;
      }

      // Check if the product with the same Nama_Barang already exists
      const existingProduct = await Product.findOne({
        where: { name: item.Nama_Barang }
      });

      if (existingProduct) {
        // If the product exists, update the stock by adding the new stock quantity
        const updatedStock = existingProduct.stock + item.Qty;
        await existingProduct.update({ stock: updatedStock });
        console.log(`Updated stock for product: ${item.Nama_Barang}, new stock: ${updatedStock}`);
      } else {
        // If the product doesn't exist, create a new product
        const data = {
          name: item.Nama_Barang,           // Using Nama_Barang from the JSON as the product name
          part_number: item.KODE,           // Using KODE from the JSON as the part number
          product: item.PRODUCT,
          type: "WELDING MILLER 400",
          replacement_code: "0118.2384 KZ - CW ROTATION",          // Using PRODUCT from the JSON as the product type
          stock: item.Qty,                  // Using Qty from the JSON as the stock quantity
          storage_id: storage.id,           // Storage ID found from the database
          unit_id: unit.id,                 // Unit ID found from the database
          createdBy: 'system',              // Set the createdBy field to the username
          cost: 1000000,                          // Default cost (you can update this based on your logic)
          sell_price: 2000000                     // Default sell_price (you can update this based on your logic)
        };

        // Create the product
        await Product.create(data);
        console.log(`Created new product: ${data.name}`);
      }
    }

    console.log('Product creation or update process completed!');
  } catch (error) {
    console.error('Error creating or updating product:', error);
  }
}


async function insertCompanyData() {
  const t = await sequelize.transaction(); // Start a transaction
  try {
    // Simulating incoming request body with the provided data
    const reqBody = {
      company_name: "CV.SUMBER MAKMUR DIESEL",
      address: "Jl. Krekot Raya, Ruko Komplek Krekot Bunder IV No. 34A",
      phone: "(021) 34833155 - 157",
      fax: "(021) 34833158",
      city: "Jakarta Pusat",
      postal_code: "10710",
      country: "Indonesia",
      email: "smdmnrn@yahoo.com",
      website: "",
      npwp: "02.417.046.6-075.000",
      person_1: "ANTHON LIE",
      person_2: "HENGKY",
      bank_accounts: [
        {
          account_name: "CV.SUMBER MAKMUR DIESEL",
          account_number: "119-000-4371-819",
          bank_name: "MANDIRI",
          bank_branch: "CAB. KARANG ANYAR 55 - JAKARTA"
        },
        {
          account_name: "ANTHONI LIE",
          account_number: "119-000-5472-749",
          bank_name: "MANDIRI",
          bank_branch: "CAB. KARANG ANYAR 55 - JAKARTA"
        },
        {
          account_name: "ANTHONI LIE",
          account_number: "685-003-1973",
          bank_name: "BCA",
          bank_branch: "CAB. ATRIUM SENEN - JAKARTA"
        },
        {
          account_name: "ANTHONI LIE",
          account_number: "021-8688-965",
          bank_name: "BNI",
          bank_branch: "CAB. PECENONGAN - JAKARTA"
        }
      ],
      tax_information: {
        tax_number: "24000044",
        default_rack: "B-ZZZ"
      }
    };

    // Step 1: Create the Company Profile
    const companyProfile = await Company_Profile.create({
      company_name: reqBody.company_name,
      address: reqBody.address,
      phone: reqBody.phone,
      fax: reqBody.fax,
      city: reqBody.city,
      postal_code: reqBody.postal_code,
      country: reqBody.country,
      email: reqBody.email,
      website: reqBody.website,
      npwp: reqBody.npwp,
      person_1: reqBody.person_1,
      person_2: reqBody.person_2,
    }, { transaction: t });

    // Step 2: Create related Bank Accounts (if provided)
    if (reqBody.bank_accounts && reqBody.bank_accounts.length > 0) {
      await Bank_Account.bulkCreate(
        reqBody.bank_accounts.map((bank, index) => ({
          company_id: companyProfile.id,
          account_name: bank.account_name,
          account_number: bank.account_number,
          bank_name: bank.bank_name,
          bank_branch: bank.bank_branch,
          status: index === 0 ? true : false  // Set status true for the first account, false for others
        })),
        { transaction: t }
      );
    }

    // Step 3: Create related Tax Information (if provided)
    if (reqBody.tax_information) {
      await Tax_Information.create({
        company_id: companyProfile.id,
        tax_number: reqBody.tax_information.tax_number,
        default_rack: reqBody.tax_information.default_rack,
      }, { transaction: t });
    }

    // Commit the transaction if everything is successful
    await t.commit();
    console.log("Company profile and related data successfully inserted!");
  } catch (error) {
    // Rollback the transaction in case of an error
    await t.rollback();
    console.error("Error occurred while inserting data: ", error);
  }
}

// Call the function to insert data

async function createAdminUser(req, res, next) {
  try {
      // Predefined data for the admin user
      const data = {
          username: 'admin',
          password: 'admin', // Ideally, you would hash the password before saving it to the database
          role: 'admin',
      };

      // Create the user in the database
   await User.create(data);

      // Respond with success message
    
  } catch (error) {
      // Handle any errors
      console.log(error);
      
  }
}



async function runSequentially() {
  try {

    await createAdminUser()
    console.log('Starting storage creation...');
    await createStorageFromData();
    console.log('Storage creation completed.');

    console.log('Starting unit creation...');
    await createUnitFromData();
    console.log('Unit creation completed.');

    console.log('Starting product creation or update...');
    await createOrUpdateProductFromData();
    console.log('Product creation or update completed.');
    insertCompanyData();
  } catch (error) {
    console.error('Error during the sequential execution:', error);
  }
}

// Ensure that createStorageFromData, createUnitFromData, and createOrUpdateProductFromData run sequentially
runSequentially();
