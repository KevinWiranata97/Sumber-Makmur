const { generateInvoice, generateInvoiceNonPPN,generateSuratJalan, generateInvoiceBuy, } = require("../helpers/pdfkit");
const { generateRandom6DigitNumber, generateCustomString,generateSuratJalanNumber,  formatDateToDDMMYYYY, convertToTerbilang, formatDateToYYYYMMDD, generateInvoiceNumberPPN, generateInvoiceNumberNoPPN } = require("../helpers/util");
const {
  Transaction,
  Transaction_Product,
  Product,
  sequelize,
  Supplier,
  Customer,
  Unit,
  Company_Profile,
  Bank_Account,
  Tax_Information
} = require("../models");
const fs = require('fs');
const path = require('path');
const { Op } = require('sequelize');
class Controller {



  // Controller function to get paginated and searchable transactions

  static async getTransaction(req, res, next) {
    try {
      // Extract query parameters
      const { type } = req.query;
      const searchQuery = req.query.search || ''; // Default search query is empty
      const limit = parseInt(req.query.limit) || 10; // Default limit is 10
      let page = parseInt(req.query.page);

      // Ensure page is at least 1, handle cases where page=0 or NaN
      page = !isNaN(page) && page > 0 ? page : 1;
      const offset = (page - 1) * limit; // Calculate the offset for pagination (1-based page)

      // Construct the base SQL query for fetching data
      let sqlQuery = `
      SELECT
        t.id, t.transaction_invoice_number, t.transaction_proof_number, t.transaction_surat_jalan,
        to_char(t.transaction_date, 'DD/MM/YYYY') as transaction_date, -- Format the transaction_date
        to_char(t.transaction_due_date, 'DD/MM/YYYY') as transaction_due_date, -- Format the transaction_due_date
        t.transaction_type, t."PPN", t."transaction_PO_num", t."transaction_ppn_value", t."transaction_discount",
        s.id AS supplier_id, s.supplier_name,
        c.id AS customer_id, c.customer_name, c.customer_discount,
        
        array_agg(json_build_object(
          'qty', tp.qty,
          'product_name', p.name,
          'cost', p.cost,
          'current_cost', tp.current_cost 
        )) AS products -- Aggregating products as an array of objects
      FROM
        "Transactions" t
      LEFT JOIN
        "Suppliers" s ON t.transaction_supplier_id = s.id
      LEFT JOIN
        "Customers" c ON t.transaction_customer_id = c.id
      INNER JOIN
        "Transaction_Products" tp ON t.id = tp.transaction_id
        AND tp.status = true 
      INNER JOIN
        "Products" p ON tp.product_id = p.id
      WHERE
        t.status = true
    `;
    


      // Add search conditions for invoice, proof number, surat jalan, customer name, transaction date, and due date
      sqlQuery += `
        AND (
          t.transaction_invoice_number ILIKE :searchQuery
          OR t.transaction_proof_number ILIKE :searchQuery
          OR t.transaction_surat_jalan ILIKE :searchQuery
          OR c.customer_name ILIKE :searchQuery -- Search by customer name
          OR to_char(t.transaction_date, 'DD/MM/YYYY') ILIKE :searchQuery -- Search by transaction date in DD/MM/YYYY format
          OR to_char(t.transaction_due_date, 'DD/MM/YYYY') ILIKE :searchQuery -- Search by due date in DD/MM/YYYY format
        )
      `;

      // Add condition for type (buy or sell) if present
      if (type && (type === 'buy' || type === 'sell')) {
        sqlQuery += ' AND t.transaction_type = :type';
      }

      // Add grouping by transaction to allow aggregation
      sqlQuery += `
        GROUP BY t.id, s.id, c.id
        ORDER BY t.id ASC
        LIMIT :limit OFFSET :offset
      `;

      // Count query for pagination
      const countQuery = `
        SELECT COUNT(DISTINCT t.id) AS total
        FROM "Transactions" t
        LEFT JOIN "Customers" c ON t.transaction_customer_id = c.id
        WHERE t.status = true
        AND (
          t.transaction_invoice_number ILIKE :searchQuery
          OR t.transaction_proof_number ILIKE :searchQuery
          OR t.transaction_surat_jalan ILIKE :searchQuery
          OR c.customer_name ILIKE :searchQuery -- Search by customer name
          OR to_char(t.transaction_date, 'DD/MM/YYYY') ILIKE :searchQuery -- Search by transaction date in DD/MM/YYYY format
          OR to_char(t.transaction_due_date, 'DD/MM/YYYY') ILIKE :searchQuery -- Search by due date in DD/MM/YYYY format
        )
      `;

      // Prepare the query parameters
      const queryParams = {
        searchQuery: `%${searchQuery}%`,
        limit,
        offset,
        type,
      };

      // Execute the raw SQL queries
      const transactions = await sequelize.query(sqlQuery, {
        replacements: queryParams,
        type: sequelize.QueryTypes.SELECT,
      });

      const countResult = await sequelize.query(countQuery, {
        replacements: queryParams,
        type: sequelize.QueryTypes.SELECT,
      });

      const count = countResult[0].total;


      // After fetching the transactions, calculate the total amount for each product in the transaction
      const transactionsWithTotalAmount = transactions.map((transaction) => {
        const total_dpp = transaction.products.reduce((sum, product) => {
          return sum + product.qty * product.current_cost;
        }, 0); // Sum of qty * cost for each product

        let customer_discount = transaction.transaction_discount





        let total_discount
        if (transaction.transaction_type) {
          total_discount = total_dpp - total_dpp * (customer_discount / 100); // Calculate discount based on percentage
        }

        let total_ppn
        if (transaction.PPN === true) {


          total_ppn = total_discount !== 0 ? total_discount * transaction.transaction_ppn_value / 100 : total_dpp * transaction.transaction_ppn_value / 100


        } else {
          total_ppn = 0
        }





        const total_netto = total_ppn + total_discount

        return {
          ...transaction,
          total_netto,
          total_amount: total_dpp
        };
      });

      // Calculate the total number of pages
      const totalPages = Math.ceil(count / limit);

      res.status(200).json({
        error: false,
        msg: 'Success',
        data: transactionsWithTotalAmount,
        pagination: {
          totalItems: count,
          currentPage: page,
          totalPages,
          itemsPerPage: limit,
        },
      });
    } catch (error) {
      next(error);
    }
  }





  static async createTransaction(req, res, next) {
    let transaction;
    const {
      transaction_date,
      transaction_due_date,
      transaction_PO_num,
      transaction_invoice_number, // Will only be used for 'buy' transactions
      transaction_customer_id,
      transaction_supplier_id,
      transaction_note,
      transaction_PO_note,
      transaction_type,
      product_id,
      qty,
      current_cost,
      note,
      po_note,
      transaction_payment_due_time,
      PPN,
      transaction_discount
    } = req.body;
    const { username } = req.userAccess;
  
    try {
      // Start a Sequelize transaction
      const t = await sequelize.transaction();
  
      const transactionLatest = await Transaction.findOne({
        order: [['id', 'DESC']],
        attributes: ['id']
      });
      const companyProfile = await Company_Profile.findOne({
        where: {
          company_name: "CV.SUMBER MAKMUR DIESEL",
          status: true, // Only get non-deleted company profiles
        },
        include: [
          {
            model: Bank_Account,
            as: 'bank_accounts',
          },
          {
            model: Tax_Information,
            as: 'tax_information',
          },
        ],
      });
      
      let tax_number
      let ppn;
      if (companyProfile.tax_information.tax_ppn) {
        ppn = companyProfile.tax_information.tax_ppn;
        tax_number = companyProfile.tax_information.tax_number;
      }
  
      try {
        // Determine the correct invoice number based on the conditions
        let finalInvoiceNumber;
  
        if (transaction_type === 'buy') {
          // For 'buy' transactions, use the provided transaction_invoice_number
          finalInvoiceNumber = transaction_invoice_number;
        } else if (transaction_type === 'sell') {
          // For 'sell' transactions, auto-generate the invoice number based on PPN
          if (PPN) {
            finalInvoiceNumber = generateInvoiceNumberPPN(transactionLatest ? transactionLatest.id : 1); // Use PPN invoice generation
          } else {
            finalInvoiceNumber = generateInvoiceNumberNoPPN(transactionLatest ? transactionLatest.id : 1); // Use non-PPN invoice generation
          }
        }
  
        // Create the transaction record
        transaction = await Transaction.create(
          {
            transaction_date,
            transaction_due_date,
            transaction_PO_num: transaction_PO_num,
            transaction_surat_jalan: generateSuratJalanNumber(transactionLatest ? transactionLatest.id : 1),
            transaction_customer_id,
            transaction_supplier_id,
            transaction_note,
            transaction_PO_note,
            transaction_type,
            transaction_invoice_number: finalInvoiceNumber, // Use the final invoice number based on conditions
            transaction_proof_number: generateCustomString(generateRandom6DigitNumber()),
            PPN,
            transaction_payment_due_time,
            transaction_ppn_value: ppn,
            transaction_discount,
            createdBy: username,
          },
          { transaction: t }
        );
  
        // Create entries in the Transaction_Products table for each product associated with the transaction
        const products = await Promise.all(
          product_id.map(async (productId, index) => {
            const product = await Product.findOne({
              where: {
                id: productId,
              },
            });
  
            if (!product) {
              throw new Error(`Product with ID ${productId} not found.`);
            }
  
            // Adjust stock based on transaction type
            if (transaction_type === 'buy') {
              // Increase stock
              product.stock += parseInt(qty[index]);
            } else if (transaction_type === 'sell') {
              // Decrease stock
              product.stock -= parseInt(qty[index]);
              if (product.stock < 0) {
                throw {
                  name: "insufficient_stock",
                  code: 422,
                  msg: "not enough product stock",
                };
              }
            }
  
            // Save the updated product
            await product.save({ transaction: t });
  
            // Create entry in Transaction_Products table
            await Transaction_Product.create(
              {
                transaction_id: transaction.id,
                product_id: productId,
                qty: qty[index],
                current_cost: current_cost[index],
                note: note ? note[index] : "",
                po_note: po_note ? po_note[index] : ""
              },
              { transaction: t }
            );
  
            return product;
          })
        );
  
        // If everything is successful, commit the transaction
        await t.commit();
  
        res.status(201).json({
          error: false,
          msg: `Success`,
          data: { transaction, products },
        });
      } catch (error) {
        // If any error occurs during the transaction, rollback changes
        await t.rollback();
        throw error; // Rethrow the error to be handled by the outer catch block
      }
    } catch (error) {
      next(error);
    }
  }
  


  static async getTransactionById(req, res, next) {
    try {
      const { id } = req.params;


      const transactions = await Transaction.findOne({
        where: {
          status: true,
          id: id
        },
        include: [
          {
            model: Transaction_Product,
            where: {
              status: true
            },
            order: [['id', 'ASC']],
            include: [
              {
                model: Product,
                attributes: {
                  exclude: ['status', 'createdBy', 'updatedBy', 'createdAt', 'updatedAt', 'NPWP', 'storage_id', 'type']
                },
                include: [
                  {
                    model: Unit,
                    attributes: ['unit_code']
                  },
                ]
              },


            ],
            attributes: {
              exclude: ['status', 'createdBy', 'updatedBy', 'createdAt', 'updatedAt']
            }
          },

          {
            model: Customer,
            where: {
              status: true
            },
            required: false,
            attributes: ['customer_name', 'customer_discount', 'customer_time', "customer_expedition_id"]

          },
        ],
        attributes: {
          exclude: ['status', 'createdBy', 'updatedBy', 'createdAt', 'updatedAt']
        }
      });



      if (!transactions) {
        throw {
          name: "not_found",
          code: 404,
          msg: "Transaction not found",
        };
      }
      const total_qty = transactions.Transaction_Products.reduce((sum, product) => {
        return sum + product.qty;
      }, 0); // Start from 0


      const total_dpp = transactions.Transaction_Products.reduce((sum, product) => {
        return sum + (product.qty * product.current_cost);
      }, 0);


      let customer_discount = transactions.transaction_discount


      let total_discount
      if (transactions.transaction_type) {
        total_discount = total_dpp - total_dpp * (customer_discount / 100); // Calculate discount based on percentage
      }
      // Calculate total PPN (10% of total DPP)
      let total_ppn
      if (transactions.PPN === true) {
        total_ppn = total_discount !== 0 ? total_discount * transactions.transaction_ppn_value / 100 : total_dpp * transactions.transaction_ppn_value / 100
      } else {
        total_ppn = 0
      }




      const fix_transaction_date = new Date(transactions.transaction_date).toISOString().split('T')[0];
      const fix_transaction_due_date = new Date(transactions.transaction_due_date).toISOString().split('T')[0];
      const total_netto = total_ppn + total_discount

      const transactionWithTotalAmount = {
        ...transactions.toJSON(), // Convert Sequelize instance to plain object
        total_amount: total_dpp,
        total_dpp,
        total_ppn,
        total_discount,
        total_netto,
        total_qty,
        transaction_date: fix_transaction_date,
        transaction_due_date: fix_transaction_due_date
      };

      // Send the response with total_amount included

      res.status(200).json({
        error: false,
        msg: `Success`,
        data: transactionWithTotalAmount,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteTransaction(req, res, next) {
    try {
      const { id } = req.params;
      const { username } = req.userAccess;
      const transaction = await Transaction.findOne({
        where: {
          id,
        },
      });
      if (!transaction) {
        throw {
          name: "not_found",
          code: 404,
          msg: "Transaction not found",
        };
      }
      const data = {
        status: false,
        updatedBy: username,
      };
      await Transaction.update(data, {
        where: {
          id,
        },
      });
      res.status(200).json({
        error: false,
        msg: `success delete Transactions with id ${id}`,
        data: [],
      });
    } catch (error) {
      next(error);
    }
  }
  static async editTransaction(req, res, next) {
    try {
      const { id } = req.params;



      const {
        transaction_date,
        transaction_due_date,
        transaction_PO_num,
        transaction_invoice_number,
        transaction_surat_jalan,
        transaction_supplier_id,
        transaction_note,
        transaction_PO_note,
        PPN,
        customer_expedition_id,
        transaction_customer_id
      } = req.body;
      const { username } = req.userAccess;

      const TransactionById = await Transaction.findOne({
        where: {
          id,
          status: true,
        },
      });
      if (!TransactionById) {
        throw {
          name: "not_found",
          code: 404,
          msg: "Transaction not found",
        };
      }
      const data = {
        transaction_date,
        transaction_due_date,
        transaction_PO_num,
        transaction_surat_jalan,
        transaction_supplier_id,
        transaction_invoice_number,
        transaction_note,
        transaction_PO_note,
        PPN,
        updatedBy: username,
      };
      await Transaction.update(data, {
        where: {
          id,
        },
      });




      if (customer_expedition_id) {



        const data = {
          customer_expedition_id
        };
        await Customer.update(data, {
          where: {
            id: transaction_customer_id,
          },
        });
      }
      res.status(200).json({
        error: false,
        msg: `success`,
        data: [],
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteTransactionProduct(req, res, next) {
    try {


      const { id } = req.params;
      const { username } = req.userAccess;
      const transaction = await Transaction_Product.findOne({
        where: {
          id,
        },
      });
      if (!transaction) {
        throw {
          name: "not_found",
          code: 404,
          msg: "Transaction not found",
        };
      }
      const data = {
        status: false,
        updatedBy: username,
      };
      await Transaction_Product.update(data, {
        where: {
          id,
        },
      });
      res.status(200).json({
        error: false,
        msg: `success delete Transactions product with id ${id}`,
        data: [],
      });
    } catch (error) {
      next(error);
    }
  }

  static async addTransactionProduct(req, res, next) {
    try {


      const { transaction_id, product_id, qty, transaction_type, current_cost, note, po_note } = req.body

      const transaction = await Transaction.findOne({
        where: {
          id: transaction_id,
        },
      });

      if (!transaction) {
        throw {
          name: "not_found",
          code: 404,
          msg: "Transaction not found",
        };
      }
      const t = await sequelize.transaction();
      try {
        // Create the transaction record



        // Create entries in the Transaction_Products table for each product associated with the transaction
        const products = await Promise.all(
          product_id.map(async (productId, index) => {
            const product = await Product.findOne({
              where: {
                id: productId,
              },
            });


            if (!product) {
              throw new Error(`Product with ID ${productId} not found.`);
            }

            // Adjust stock based on transaction type
            if (transaction_type === 'buy') {
              // Increase stock


              product.stock += parseInt(qty[index]);



            } else if (transaction_type === 'sell') {
              // Decrease stock
              product.stock -= parseInt(qty[index]);
              if (product.stock < 0) {
                throw {
                  name: "insufficient_stock",
                  code: 422,
                  msg: "not enought product stock",
                };
              }
            }

            // Save the updated product
            await product.save({ transaction: t });

            // Create entry in Transaction_Products table
            await Transaction_Product.create(
              {
                current_cost: current_cost[index],

                transaction_id: transaction.id,
                product_id: productId,
                qty: qty[index],
                note: note ? note[index] : "",
                po_note: po_note ? po_note[index] : ""
              },
              { transaction: t }
            );

            return product;
          })
        );

        // If everything is successful, commit the transaction
        await t.commit();

        res.status(201).json({
          error: false,
          msg: `Success`,
          data: { products },
        });
      } catch (error) {
        // If any error occurs during the transaction, rollback changes
        await t.rollback();
        throw error; // Rethrow the error to be handled by the outer catch block
      }
    } catch (error) {
      next(error);
    }
  }

  static async generateInvoice(req, res, next) {
    try {
      const { id } = req.params;


      const transactions = await Transaction.findOne({
        where: {
          status: true,
          id: id
        },
        include: [
          {
            model: Transaction_Product,
            where: {
              status: true
            },
            include: [
              {
                model: Product,
                attributes: {
                  exclude: ['status', 'createdBy', 'updatedBy', 'createdAt', 'updatedAt', 'NPWP', 'storage_id', 'type']
                },
                include: [
                  {
                    model: Unit,
                    attributes: ['unit_code']
                  },
                ]
              },


            ],
            attributes: {
              exclude: ['status', 'createdBy', 'updatedBy', 'createdAt', 'updatedAt']
            }
          },

          {
            model: Customer,
            where: {
              status: true
            },
            required: false,
            attributes: ['customer_name', 'customer_discount', 'customer_time', "customer_expedition_id", "customer_address_1", "customer_address_2"]

          },

          {
            model: Supplier,
            where: {
              status: true
            },
            required: false,
            attributes: ['supplier_name', 'supplier_address']

          },
        ],
        attributes: {
          exclude: ['status', 'createdBy', 'updatedBy', 'createdAt', 'updatedAt']
        }
      });

      const companyProfile = await Company_Profile.findOne({
        where: {
          company_name: "CV.SUMBER MAKMUR DIESEL",
          status: true, // Only get non-deleted company profiles
        },
        include: [
          {
            model: Bank_Account,
            as: 'bank_accounts',
          },
          {
            model: Tax_Information,
            as: 'tax_information',
          },
        ],
      });

      const activeAccount = companyProfile.bank_accounts.find(account => account.status === true);



      const total_qty = transactions.Transaction_Products.reduce((sum, product) => {
        return sum + product.qty;
      }, 0); // Start from 0


      const total_dpp = transactions.Transaction_Products.reduce((sum, product) => {
        return sum + (product.qty * product.current_cost);
      }, 0);


      let customer_discount = transactions.transaction_discount


      let total_discount
      let discount
      if (transactions.transaction_type) {
        total_discount = total_dpp - total_dpp * (customer_discount / 100); // Calculate discount based on percentage
        discount = total_dpp * (customer_discount / 100)
    
      }
      // Calculate total PPN (10% of total DPP)
      let total_ppn
      if (transactions.PPN === true) {
        total_ppn = total_discount !== 0 ? total_discount * transactions.transaction_ppn_value / 100 : total_dpp * transactions.transaction_ppn_value / 100
      } else {
        total_ppn = 0
      }



      const fix_transaction_date = new Date(transactions.transaction_date).toISOString().split('T')[0];
      const fix_transaction_due_date = new Date(transactions.transaction_due_date).toISOString().split('T')[0];
      const total_netto = total_ppn + total_discount

      const transactionWithTotalAmount = {
        ...transactions.toJSON(), // Convert Sequelize instance to plain object
        total_amount: total_dpp,
        total_dpp,
        total_ppn,
        total_discount,
        total_netto,
        total_qty,
        discount,
        transaction_date: fix_transaction_date,
        transaction_due_date: fix_transaction_due_date
      };
      const invoiceData = {
        transaction_date: formatDateToDDMMYYYY(transactions.transaction_date),
        transaction_due_date: formatDateToDDMMYYYY(transactions.transaction_due_date),
        invoiceNumber: transactions.transaction_invoice_number,
        sjNumber: transactions.transaction_surat_jalan,
        poNumber: transactions.transaction_PO_num,
        items: transactions.Transaction_Products.map(product => ({
          quantity: product.qty,
          partNumber: product.Product.part_number,
          itemName: `${product.Product.product} ${product.Product.replacement_code}`,
          unitCost: product.current_cost,
          total: product.qty * product.current_cost,
          unit_code: product.Product.Unit.unit_code
        })),
        subTotal: transactionWithTotalAmount.total_dpp,
        discount: transactionWithTotalAmount.discount,
        totalPpn: transactionWithTotalAmount.total_ppn,
        total: transactionWithTotalAmount.total_discount,
        grandTotal: transactionWithTotalAmount.total_netto,
        terbilang: convertToTerbilang(transactionWithTotalAmount.total_netto).toUpperCase(),
        transaction_type: transactionWithTotalAmount.transaction_type.toUpperCase(),
        bank: {
          accountName: activeAccount.account_name,
          accountNumber: activeAccount.account_number,
          bankName: activeAccount.bank_name,
          bankBranch: activeAccount.bank_branch,
        },
        companyName: companyProfile.company_name,
        companyAddress: companyProfile.address,
        companyPhone: companyProfile.phone,
        companyFax: companyProfile.fax,
        cityPostalCode: `${companyProfile.city + ' - ' + companyProfile.postal_code}`,
        customer: {
          name: transactions.transaction_type === "sell"
            ? transactions.Customer.customer_name
            : transactions.Supplier.supplier_name,

          address: transactions.transaction_type === "sell"
            ? transactions.Customer.customer_address_1
            : transactions.Supplier.supplier_address,
        },

        signature: companyProfile.person_1,
      };


      
     
      const firstNumberPart = invoiceData.invoiceNumber.match(/^\d+/)[0];

      const invoiceName = `invoice_${firstNumberPart}`

      
      const invoiceDir = path.join(__dirname, '..', 'data', 'invoice');
      if (!fs.existsSync(invoiceDir)) {
        fs.mkdirSync(invoiceDir, { recursive: true }); // Create the directory if it doesn't exist
      }

      // Create the file in the /data/invoice folder inside server
      const filePath = path.join(invoiceDir, `${invoiceName + '.pdf'}`);




      transactions.PPN === false ? generateInvoiceNonPPN(invoiceData, filePath) : generateInvoice(invoiceData, filePath); // Assuming you have a function to generate PDF

      // Respond with the file URL (assuming the file is served via some static route)
      const fileUrl = `${req.protocol}://${req.get('host')}/download-invoice/${invoiceName + '.pdf'}`;

      res.status(201).json({
        error: false,
        msg: `Success`,
        data: {
          fileUrl: fileUrl, // Provide the URL for download
        },
      });
    } catch (error) {
      next(error)
    }

  }

  static async generateSuratJalan(req, res, next) {
    try {
      const { id } = req.params;


      const transactions = await Transaction.findOne({
        where: {
          status: true,
          id: id
        },
        include: [
          {
            model: Transaction_Product,
            where: {
              status: true
            },
            include: [
              {
                model: Product,
                attributes: {
                  exclude: ['status', 'createdBy', 'updatedBy', 'createdAt', 'updatedAt', 'NPWP', 'storage_id', 'type']
                },
                include: [
                  {
                    model: Unit,
                    attributes: ['unit_code']
                  },
                ]
              },


            ],
            attributes: {
              exclude: ['status', 'createdBy', 'updatedBy', 'createdAt', 'updatedAt']
            }
          },

          {
            model: Customer,
            where: {
              status: true
            },
            required: false,
            attributes: ['customer_name', 'customer_discount', 'customer_time', "customer_expedition_id", "customer_address_1", "customer_address_2"]

          },

          {
            model: Supplier,
            where: {
              status: true
            },
            required: false,
            attributes: ['supplier_name', 'supplier_address']

          },
        ],
        attributes: {
          exclude: ['status', 'createdBy', 'updatedBy', 'createdAt', 'updatedAt']
        }
      });

      const companyProfile = await Company_Profile.findOne({
        where: {
          company_name: "CV.SUMBER MAKMUR DIESEL",
          status: true, // Only get non-deleted company profiles
        },
        include: [
          {
            model: Bank_Account,
            as: 'bank_accounts',
          },
          {
            model: Tax_Information,
            as: 'tax_information',
          },
        ],
      });

      const activeAccount = companyProfile.bank_accounts.find(account => account.status === true);



      const total_qty = transactions.Transaction_Products.reduce((sum, product) => {
        return sum + product.qty;
      }, 0); // Start from 0


      const total_dpp = transactions.Transaction_Products.reduce((sum, product) => {
        return sum + (product.qty * product.current_cost);
      }, 0);


      let customer_discount = transactions.transaction_discount


      let total_discount
      let discount
      if (transactions.transaction_type) {
        total_discount = total_dpp - total_dpp * (customer_discount / 100); // Calculate discount based on percentage
        discount = total_dpp * (customer_discount / 100)
    
      }
      // Calculate total PPN (10% of total DPP)
      let total_ppn
      if (transactions.PPN === true) {
        total_ppn = total_discount !== 0 ? total_discount * transactions.transaction_ppn_value / 100 : total_dpp * transactions.transaction_ppn_value / 100
      } else {
        total_ppn = 0
      }



      const fix_transaction_date = new Date(transactions.transaction_date).toISOString().split('T')[0];
      const fix_transaction_due_date = new Date(transactions.transaction_due_date).toISOString().split('T')[0];
      const total_netto = total_ppn + total_discount

      const transactionWithTotalAmount = {
        ...transactions.toJSON(), // Convert Sequelize instance to plain object
        total_amount: total_dpp,
        total_dpp,
        total_ppn,
        total_discount,
        total_netto,
        total_qty,
        discount,
        transaction_date: fix_transaction_date,
        transaction_due_date: fix_transaction_due_date
      };
      const invoiceData = {
        transaction_date: formatDateToDDMMYYYY(transactions.transaction_date),
        transaction_due_date: formatDateToDDMMYYYY(transactions.transaction_due_date),
        invoiceNumber: transactions.transaction_invoice_number,
        sjNumber: transactions.transaction_surat_jalan,
        poNumber: transactions.transaction_PO_num,
        items: transactions.Transaction_Products.map(product => ({
          quantity: product.qty,
          partNumber: product.Product.part_number,
          itemName: `${product.Product.product} ${product.Product.replacement_code}`,
          unitCost: product.current_cost,
          total: product.qty * product.current_cost,
          note: product.note,
          unit_code: product.Product.Unit.unit_code
        })),
        subTotal: transactionWithTotalAmount.total_dpp,
        discount: transactionWithTotalAmount.discount,
        totalPpn: transactionWithTotalAmount.total_ppn,
        total: transactionWithTotalAmount.total_discount,
        grandTotal: transactionWithTotalAmount.total_netto,
        terbilang: convertToTerbilang(transactionWithTotalAmount.total_netto).toUpperCase(),
        transaction_type: transactionWithTotalAmount.transaction_type.toUpperCase(),
        bank: {
          accountName: activeAccount.account_name,
          accountNumber: activeAccount.account_number,
          bankName: activeAccount.bank_name,
          bankBranch: activeAccount.bank_branch,
        },
        companyName: companyProfile.company_name,
        companyAddress: companyProfile.address,
        companyPhone: companyProfile.phone,
        companyFax: companyProfile.fax,
        cityPostalCode: `${companyProfile.city + ' - ' + companyProfile.postal_code}`,
        customer: {
          name: transactions.transaction_type === "sell"
            ? transactions.Customer.customer_name
            : transactions.Supplier.supplier_name,

          address: transactions.transaction_type === "sell"
            ? transactions.Customer.customer_address_1
            : transactions.Supplier.supplier_address,
        },

        signature: companyProfile.person_1,
      };


      
      const firstNumberPart = invoiceData.invoiceNumber.match(/^\d+/)[0];

      const invoiceName = `surat_jalan_${firstNumberPart}`

      
  
      
      const invoiceDir = path.join(__dirname, '..', 'data', 'invoice');
      if (!fs.existsSync(invoiceDir)) {
        fs.mkdirSync(invoiceDir, { recursive: true }); // Create the directory if it doesn't exist
      }

      // Create the file in the /data/invoice folder inside server
      const filePath = path.join(invoiceDir, `${invoiceName + '.pdf'}`);


   
      

      generateSuratJalan(invoiceData, filePath)

      // Respond with the file URL (assuming the file is served via some static route)
      const fileUrl = `${req.protocol}://${req.get('host')}/download-invoice/${invoiceName + '.pdf'}`;

      res.status(201).json({
        error: false,
        msg: `Success`,
        data: {
          fileUrl: fileUrl, // Provide the URL for download
        },
      });
    } catch (error) {
      next(error)
    }

  }

  static async generateInvoiceBuy(req, res, next) {
    try {
      const { id } = req.params;


      const transactions = await Transaction.findOne({
        where: {
          status: true,
          id: id
        },
        include: [
          {
            model: Transaction_Product,
            where: {
              status: true
            },
            include: [
              {
                model: Product,
                attributes: {
                  exclude: ['status', 'createdBy', 'updatedBy', 'createdAt', 'updatedAt', 'NPWP', 'storage_id', 'type']
                },
                include: [
                  {
                    model: Unit,
                    attributes: ['unit_code']
                  },
                ]
              },


            ],
            attributes: {
              exclude: ['status', 'createdBy', 'updatedBy', 'createdAt', 'updatedAt']
            }
          },

          {
            model: Customer,
            where: {
              status: true
            },
            required: false,
            attributes: ['customer_name', 'customer_discount', 'customer_time', "customer_expedition_id", "customer_address_1", "customer_address_2"]

          },

          {
            model: Supplier,
            where: {
              status: true
            },
            required: false,
            attributes: ['supplier_name', 'supplier_address']

          },
        ],
        attributes: {
          exclude: ['status', 'createdBy', 'updatedBy', 'createdAt', 'updatedAt']
        }
      });

      const companyProfile = await Company_Profile.findOne({
        where: {
          company_name: "CV.SUMBER MAKMUR DIESEL",
          status: true, // Only get non-deleted company profiles
        },
        include: [
          {
            model: Bank_Account,
            as: 'bank_accounts',
          },
          {
            model: Tax_Information,
            as: 'tax_information',
          },
        ],
      });

     
      
      const activeAccount = companyProfile.bank_accounts.find(account => account.status === true);



      const total_qty = transactions.Transaction_Products.reduce((sum, product) => {
        return sum + product.qty;
      }, 0); // Start from 0


      const total_dpp = transactions.Transaction_Products.reduce((sum, product) => {
        return sum + (product.qty * product.current_cost);
      }, 0);


      let customer_discount = transactions.transaction_discount


      let total_discount
      let discount
      if (transactions.transaction_type) {
        total_discount = total_dpp - total_dpp * (customer_discount / 100); // Calculate discount based on percentage
        discount = total_dpp * (customer_discount / 100)
    
      }
      // Calculate total PPN (10% of total DPP)
      let total_ppn
      if (transactions.PPN === true) {
        total_ppn = total_discount !== 0 ? total_discount * transactions.transaction_ppn_value / 100 : total_dpp * transactions.transaction_ppn_value / 100
      } else {
        total_ppn = 0
      }



      const fix_transaction_date = new Date(transactions.transaction_date).toISOString().split('T')[0];
      const fix_transaction_due_date = new Date(transactions.transaction_due_date).toISOString().split('T')[0];
      const total_netto = total_ppn + total_discount

      const transactionWithTotalAmount = {
        ...transactions.toJSON(), // Convert Sequelize instance to plain object
        total_amount: total_dpp,
        total_dpp,
        total_ppn,
        total_discount,
        total_netto,
        total_qty,
        discount,
        transaction_date: fix_transaction_date,
        transaction_due_date: fix_transaction_due_date
      };
      const invoiceData = {
        transaction_date: formatDateToDDMMYYYY(transactions.transaction_date),
        transaction_due_date: formatDateToDDMMYYYY(transactions.transaction_due_date),
        invoiceNumber: transactions.transaction_invoice_number,
        proofNumber: transactions.transaction_proof_number,
        sjNumber: transactions.transaction_surat_jalan,
        poNumber: transactions.transaction_PO_num,
        items: transactions.Transaction_Products.map(product => ({
          quantity: product.qty,
          partNumber: product.Product.part_number,
          itemName: `${product.Product.product} ${product.Product.replacement_code}`,
          unitCost: product.current_cost,
          total: product.qty * product.current_cost,
          unit_code: product.Product.Unit.unit_code
        })),
        subTotal: transactionWithTotalAmount.total_dpp,
        discount: transactionWithTotalAmount.discount,
        totalPpn: transactionWithTotalAmount.total_ppn,
        total: transactionWithTotalAmount.total_discount,
        grandTotal: transactionWithTotalAmount.total_netto,
        terbilang: convertToTerbilang(transactionWithTotalAmount.total_netto).toUpperCase(),
        transaction_type: transactionWithTotalAmount.transaction_type.toUpperCase(),
        bank: {
          accountName: activeAccount.account_name,
          accountNumber: activeAccount.account_number,
          bankName: activeAccount.bank_name,
          bankBranch: activeAccount.bank_branch,
        },
        companyName: companyProfile.company_name,
        companyAddress: companyProfile.address,
        companyPhone: companyProfile.phone,
        companyFax: companyProfile.fax,
        cityPostalCode: `${companyProfile.city + ' - ' + companyProfile.postal_code}`,
        customer: {
          name: transactions.transaction_type === "sell"
            ? transactions.Customer.customer_name
            : transactions.Supplier.supplier_name,

          address: transactions.transaction_type === "sell"
            ? transactions.Customer.customer_address_1
            : transactions.Supplier.supplier_address,
        },

        signature: companyProfile.person_1,
      };


      
     
   

      const invoiceName = `invoice_${invoiceData.invoiceNumber}`

      
      const invoiceDir = path.join(__dirname, '..', 'data', 'invoice');
      if (!fs.existsSync(invoiceDir)) {
        fs.mkdirSync(invoiceDir, { recursive: true }); // Create the directory if it doesn't exist
      }

      // Create the file in the /data/invoice folder inside server
      const filePath = path.join(invoiceDir, `${invoiceName + '.pdf'}`);


      generateInvoiceBuy(invoiceData, filePath)


      // Respond with the file URL (assuming the file is served via some static route)
      const fileUrl = `${req.protocol}://${req.get('host')}/download-invoice/${invoiceName + '.pdf'}`;

      res.status(201).json({
        error: false,
        msg: `Success`,
        data: {
          fileUrl: fileUrl, // Provide the URL for download
        },
      });
    } catch (error) {
      next(error)
    }

  }
}



module.exports = Controller;
