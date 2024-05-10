const { Product } = require("../models");

class Controller {
  static async getProduct(req, res, next) {
    try {
      const product = await Product.findAll({
        where: {
          status: true,
        },
      });
      res.status(200).json({
        error: false,
        msg: `Success`,
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
        NPWP,
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
        NPWP,
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
