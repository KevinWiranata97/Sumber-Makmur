const {
  Transaction,
  Transaction_Product,
  Product,
  sequelize,
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
      
          // Query the transactions with the constructed where clause
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
                      exclude: ['status', 'createdBy', 'updatedBy', 'createdAt', 'updatedAt', 'NPWP', 'storage_id', 'type','stock']
                    }
                  },
                ],
                attributes: {
                  exclude: ['status', 'createdBy', 'updatedBy', 'createdAt', 'updatedAt']
                }
              },
            ],
            attributes: {
              exclude: ['status', 'createdBy', 'updatedBy', 'createdAt', 'updatedAt']
            }
          });
      
          res.status(200).json({
            error: false,
            msg: `Success`,
            data: transactions,
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
      transaction_surat_jalan,
      transaction_customer_id,
      transaction_supplier_id,
      transaction_note,
      transaction_PO_note,
      transaction_type,
      product_id,
      qty,
    } = req.body;
    const { username } = req.userAccess;
  
    try {
      // Start a Sequelize transaction
      const t = await sequelize.transaction();
  
      try {
        // Create the transaction record
        transaction = await Transaction.create(
          {
            transaction_date,
            transaction_due_date,
            transaction_PO_num,
            transaction_surat_jalan,
            transaction_customer_id,
            transaction_supplier_id,
            transaction_note,
            transaction_PO_note,
            transaction_type,
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
                throw new Error(`Insufficient stock for product with ID ${productId}.`);
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
          id:id
        },
        include: [
          {
            model: Transaction_Product,
            include: [
              {
                model: Product,
                attributes:{
                    exclude:['status','createdBy','updatedBy','createdAt','updatedAt','NPWP','storage_id','type']
                }
              },
              
            ],
            attributes:{
                exclude:['status','createdBy','updatedBy','createdAt','updatedAt']
            }
          },
        ],
        attributes:{
            exclude:['status','createdBy','updatedBy','createdAt','updatedAt']
        }
      });
      if (!transactions) {
        throw {
          name: "not_found",
          code: 404,
          msg: "Transaction not found",
        };
      }

      res.status(200).json({
        error: false,
        msg: `Success`,
        data: transactions,
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
        transaction_surat_jalan,
        transaction_product_id,
        transaction_qty,
        transaction_note,
        transaction_PO_note,
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
        transaction_product_id,
        transaction_qty,
        transaction_note,
        transaction_PO_note,
        updatedBy: username,
      };
      await Transaction.update(data, {
        where: {
          id,
        },
      });
      res.status(200).json({
        error: false,
        msg: `success`,
        data: [],
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = Controller;
