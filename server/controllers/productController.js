const { Product, Storage, Unit } = require("../models");
const { Op } = require('sequelize'); // Import Sequelize operators
class Controller {


  static async getProduct(req, res, next) {
    try {
      // Get search query from request, or use empty string as default
      const searchQuery = req.query.search || '';
  
      // Get limit and page from query parameters, default to 10 items per page and page 1
      const limit = parseInt(req.query.limit) || 10;
      const page = parseInt(req.query.page) || 1;
  
      // Calculate the offset (how many records to skip)
      const offset = (page - 1) * limit;
  
      // Fetch products with pagination
      const { count, rows: products } = await Product.findAndCountAll({
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
            searchQuery ? {
              cost: {
                [Op.eq]: Number(searchQuery), // Use exact number match for cost
              },
            } : null,
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
        order: [['id', 'ASC']],
        limit, // Set limit for pagination
        offset, // Set offset for pagination
      });
  
      // Calculate total pages
      const totalPages = Math.ceil(count / limit);
  
      // Return paginated result with metadata
      res.status(200).json({
        error: false,
        msg: 'Success',
        data: products,
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
}

module.exports = Controller;
