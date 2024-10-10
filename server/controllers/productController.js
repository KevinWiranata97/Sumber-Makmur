const { Product, Storage, Unit, Transaction_Product, Transaction,Supplier,Customer } = require("../models");
const { Op } = require('sequelize'); // Import Sequelize operators
class Controller {


  static async getProduct(req, res, next) {
    try {
      // Get search query from request, or use empty string as default
      const searchQuery = req.query.search || '';
  
      // Get limit and page from query parameters, default to 10 items per page and page 1
      // If limit is 0 or undefined, we assume "no limit"
      const limit = parseInt(req.query.limit) || 0; // 0 will mean "no limit"
      const page = parseInt(req.query.page) || 1;
  
      // Calculate the offset (how many records to skip), only if limit is set
      const offset = limit > 0 ? (page - 1) * limit : 0;
  
      // Query options
      const queryOptions = {
        where: {
          status: true,
          [Op.or]: [
            {
              name: {
                [Op.iLike]: `%${searchQuery}%`, // Case-insensitive search in name field
              },
            },
            {
              part_number: {
                [Op.iLike]: `%${searchQuery}%`, // Case-insensitive search in part_number field
              },
            },
            {
              product: {
                [Op.iLike]: `%${searchQuery}%`, // Case-insensitive search in product field
              },
            },
            {
              type: {
                [Op.iLike]: `%${searchQuery}%`, // Case-insensitive search in type field
              },
            },
            {
              replacement_code: {
                [Op.iLike]: `%${searchQuery}%`, // Case-insensitive search in replacement_code field
              },
            },
            searchQuery
              ? {
                  cost: {
                    [Op.eq]: Number(searchQuery), // Use exact number match for cost
                  },
                }
              : null,
            searchQuery
              ? {
                  sell_price: {
                    [Op.eq]: Number(searchQuery), // Use exact number match for sell_price
                  },
                }
              : null,
            {
              '$Storage.storage_name$': {
                [Op.iLike]: `%${searchQuery}%`, // Search in related Storage name
              },
            },
            {
              '$Unit.unit_code$': {
                [Op.iLike]: `%${searchQuery}%`, // Search in related Unit code
              },
            },
          ].filter(Boolean), // Filter out any null conditions
        },
        include: [
          {
            model: Storage,
            attributes: ['storage_name'],
          },
          {
            model: Unit,
            attributes: ['unit_code'],
          },
        ],
        order: [['id', 'ASC']], // Order the results by ID in ascending order
      };
  
      // Add pagination only if limit is greater than 0
      if (limit > 0) {
        queryOptions.limit = limit;
        queryOptions.offset = offset;
      }
  
      // Fetch products with or without pagination
      const { count, rows: products } = await Product.findAndCountAll(queryOptions);
  
      // Calculate total pages (only if limit > 0)
      const totalPages = limit > 0 ? Math.ceil(count / limit) : 1;
  
      // Return paginated result with metadata
      res.status(200).json({
        error: false,
        msg: 'Success',
        data: products,
        pagination: {
          totalItems: count,
          currentPage: page,
          totalPages,
          itemsPerPage: limit > 0 ? limit : count, // If no limit, show total count
        },
      });
    } catch (error) {
      next(error);
    }
  }
  

  static async createProduct(req, res, next) {
    try {
      const {
        name,
        part_number,
        product,
        type,
        replacement_code,
        storage_id,
      
        stock,
        unit_id,
        cost,
        sell_price,
      } = req.body;
      const { username } = req.userAccess;

      const data = {
        name,
        part_number,
        product,
        type,
        replacement_code,
        storage_id,
      
        stock,
        unit_id,
        cost,
        sell_price,
        createdBy: username,
      };

      await Product.create(data);
      res.status(201).json({
        error: false,
        msg: `Success`,
        data: [],
      });
    } catch (error) {
      next(error);
    }
  }

  static async getProductById(req, res, next) {
    try {
      const { id } = req.params;
      const product = await Product.findOne({
        where: {
          id,
          status: true,
        },

      });


      if (!product) {
        throw {
          name: "not_found",
          code: 404,
          msg: "Product not found",
        };
      }

      res.status(200).json({
        error: false,
        msg: `Success`,
        data: product,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteProduct(req, res, next) {
    try {
      const { id } = req.params;
      const { username } = req.userAccess;
      const product = await Product.findOne({
        where: {
          id,
        },
      });
      if (!product) {
        throw {
          name: "not_found",
          code: 404,
          msg: "Product not found",
        };
      }
      const data = {
        status: false,
        updatedBy: username,
      };
      await Product.update(data, {
        where: {
          id,
        },
      });
      res.status(200).json({
        error: false,
        msg: `success delete Products with id ${id}`,
        data: [],
      });
    } catch (error) {
      next(error);
    }
  }
  static async editProduct(req, res, next) {
    try {
      const { id } = req.params;
      const {
        name,
        part_number,
        product,
        type,
        replacement_code,
        storage_id,
        NPWP,
        stock,
        unit_id,
        cost,
        sell_price,
      } = req.body;
      const { username } = req.userAccess;

      const productById = await Product.findOne({
        where: {
          id,
          status: true,
        },
      });
      if (!productById) {
        throw {
          name: "not_found",
          code: 404,
          msg: "Product not found",
        };
      }
      const data = {
        name,
        part_number,
        product,
        type,
        replacement_code,
        storage_id,
        NPWP,
        stock,
        unit_id,
        cost,
        sell_price,
        updatedBy: username,
      };
      await Product.update(data, {
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

  static async getProductSellHistory(req,res,next){
    try {
      const { id } = req.params;
      const productById = await Product.findOne({
        where: {
          id,
          status: true,
        },
      });
      if (!productById) {
        throw {
          name: "not_found",
          code: 404,
          msg: "Product not found",
        };
      }

    const getTransactionProduct = await Transaction_Product.findAll({
      where:{
        product_id:id,
        status:true
      },
      attributes:{
        exclude:['createdAt','updatedAt']
      },
      include: [
        {
          model: Transaction,
          where:{
            transaction_type:"sell",
            status:true
          
          },
          attributes:['transaction_invoice_number','transaction_date'],
          include:[
           {
            model: Customer,
            attributes:['customer_name']
           }
          ]
        }
      ],
    })

    res.status(200).json({
      error: false,
      msg: `success`,
      data: getTransactionProduct,
    });
    } catch (error) {
      next(error)
    }
  }
}

module.exports = Controller;
