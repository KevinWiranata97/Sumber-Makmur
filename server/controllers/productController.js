const { Product, Storage, Unit } = require("../models");
const { Op } = require('sequelize'); // Import Sequelize operators
class Controller {


  static async getProduct(req, res, next) {
    try {
      const searchQuery = req.query.search || ''; // Get the search term from query params
  
      const product = await Product.findAll({
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
              sell_price: {
                [Op.eq]: Number(searchQuery), // Use exact number match for sell_price
              },
            } : null,
            // Search by related 'storage_name'
            {
              '$Storage.storage_name$': {
                [Op.iLike]: `%${searchQuery}%`, // Search in related Storage name
              },
            },
            // Search by related 'unit_code'
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
      });
  
      res.status(200).json({
        error: false,
        msg: 'Success',
        data: product,
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
