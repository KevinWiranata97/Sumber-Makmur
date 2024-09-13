const { generateRandom6DigitNumber, generateCustomString, generateSuratJalan } = require("../helpers/util");
const {
  Transaction,
  Transaction_Product,
  Product,
  sequelize,
  Supplier,
  Customer,
  Unit
} = require("../models");

class Controller {
  static async getTransaction(req, res, next) {
    try {
      // Extract the type query parameter
      const { type } = req.query;

      // Construct the where clause based on the presence of the type parameter
      const whereClause = {
        status: true,
      };
      if (type && (type === 'buy' || type === 'sell')) {
        whereClause.transaction_type = type;
      }


      const transactions = await Transaction.findAll({
        where: whereClause,
        include: [
          {
            model: Transaction_Product,
            required: true,
            include: [
              {
                model: Product,
                attributes: {
                  exclude: ['status', 'createdBy', 'updatedBy', 'createdAt', 'updatedAt', 'NPWP', 'storage_id', 'type', 'stock']
                }
              },
            ],
            attributes: {
              exclude: ['status', 'createdBy', 'updatedBy', 'createdAt', 'updatedAt']
            }
          },
          {
            model: Supplier,
            attributes: ['id', 'supplier_name']
          },
          {
            model: Customer,
            attributes: ['id', 'customer_name']
          },
        ],
        attributes: {
          exclude: ['status', 'createdBy', 'updatedBy', 'createdAt', 'updatedAt']
        },
        order: [['id', 'ASC']] // Sort by id in ascending order
      });




      // After fetching the transactions, calculate the total amount
      const transactionsWithTotalAmount = transactions.map(transaction => {
        // Calculate the total amount for each transaction
        const total_amount = transaction.Transaction_Products.reduce((sum, product) => {
          return sum + (product.qty * product.Product.cost);
        }, 0); // Start from 0

        // Format the transaction date
        const fix_transaction_date = new Date(transaction.transaction_date).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });

        const fix_transaction_due_date = new Date(transaction.transaction_due_date).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });;
        // Add the total amount and formatted date to the transaction object
        return {
          ...transaction.toJSON(), // Convert the Sequelize object to a plain object
          total_amount,
          transaction_date: fix_transaction_date,
          transaction_due_date: fix_transaction_due_date  // Include the formatted transaction date
        };
      });
      res.status(200).json({
        error: false,
        msg: `Success`,
        data: transactionsWithTotalAmount,
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
      // transaction_PO_num,
      // transaction_surat_jalan,
      transaction_customer_id,
      transaction_supplier_id,
      transaction_note,
      transaction_PO_note,
      transaction_type,
      product_id,
      qty,
      transaction_payment_due_time,
      PPN,
    } = req.body;
    const { username } = req.userAccess;

    try {
      // Start a Sequelize transaction
      const t = await sequelize.transaction();

      const transactionLatest = await Transaction.findOne({
        order: [['id', 'DESC']],
        attributes: ['id']
      });


      try {
        // Create the transaction record
        transaction = await Transaction.create(
          {
            transaction_date,
            transaction_due_date,
            transaction_PO_num: generateRandom6DigitNumber(),
            transaction_surat_jalan: generateSuratJalan(transaction?transactionLatest.id:1),
            transaction_customer_id,
            transaction_supplier_id,
            transaction_note,
            transaction_PO_note,
            transaction_type,
            transaction_invoice_number: generateRandom6DigitNumber(),
            transaction_proof_number: generateCustomString(generateRandom6DigitNumber()),
            PPN,
            transaction_payment_due_time,
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

            console.log(product.cost);

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
                throw new Error(`Insufficient stock for product with ID ${productId}.`);
              }
            }

            // Save the updated product
            await product.save({ transaction: t });

            // Create entry in Transaction_Products table
            await Transaction_Product.create(
              {
                current_cost: product.cost,
                transaction_id: transaction.id,
                product_id: productId,
                qty: qty[index],
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

            attributes: ['customer_name', 'customer_discount', 'customer_time',"customer_expedition_id"]

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
        return sum + (product.qty * product.Product.cost);
      }, 0);

      // Calculate total PPN (10% of total DPP)
      let total_ppn
      if (transactions.PPN === true) {
        total_ppn = total_dpp * 0.1;
      } else {
        total_ppn = 0
      }
      let customer_discount  = transactions.Customer? transactions.Customer.customer_discount:0
  
      
      let total_discount 
      if (transactions.transaction_type) {
        total_discount = total_dpp * (customer_discount / 100); // Calculate discount based on percentage
      }

   
      
      const fix_transaction_date = new Date(transactions.transaction_date).toISOString().split('T')[0];
      const fix_transaction_due_date = new Date(transactions.transaction_due_date).toISOString().split('T')[0];
      const total_netto = total_dpp + total_ppn - total_discount

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

      console.log(req.body);
      
      const {
        transaction_date,
        transaction_due_date,
        transaction_PO_num,
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


     
      
      if(customer_expedition_id){
        
        console.log('kneaaaaaaaaaa');
        
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


      const { transaction_id, product_id, qty, transaction_type } = req.body

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
                throw new Error(`Insufficient stock for product with ID ${productId}.`);
              }
            }

            // Save the updated product
            await product.save({ transaction: t });

            // Create entry in Transaction_Products table
            await Transaction_Product.create(
              {
                current_cost: product.cost,
                transaction_id: transaction.id,
                product_id: productId,
                qty: qty[index],
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
}

module.exports = Controller;
