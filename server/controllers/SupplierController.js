const { Supplier } = require("../models");

class Controller {
  static async getSupplier(req, res, next) {
    try {
      const supplier = await Supplier.findAll({
        where: {
          status: true,
        },
      });
      res.status(200).json(supplier);
    } catch (error) {
      next(error);
    }
  }

  static async createSupplier(req, res, next) {
    try {
      const {
        supplier_name,
        supplier_address,
        supplier_email,
        supplier_contact,
        supplier_fax,
        supplier_website,
        supplier_NPWP,
      } = req.body;
      const { username } = req.userAccess;

      const data = {
        supplier_name,
        supplier_address,
        supplier_email,
        supplier_contact,
        supplier_fax,
        supplier_website,
        supplier_NPWP,
        createdBy: username,
      };

      
      await Supplier.create(data);
      res.status(201).json({
        error: false,
        msg: `Success`,
        data: [],
      });
    } catch (error) {
      next(error);
    }
  }

  static async getSupplierById(req, res, next) {
    try {
      const { id } = req.params;
      const supplier = await Supplier.findOne({
        where: {
          id,
          status: true,
        },
      });
      if (!supplier) {
        throw {
          name: "not_found",
          code: 404,
          msg: "Supplier not found",
        };
      }

      res.status(200).json({
        error: false,
        msg: `Success`,
        data: supplier,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteSupplier(req, res, next) {
    try {
      const { id } = req.params;
      const { username } = req.userAccess;
      const supplier = await Supplier.findOne({
        where: {
          id,
        },
      });
      if (!supplier) {
        throw {
          name: "not_found",
          code: 404,
          msg: "Supplier not found",
        };
      }
      const data = {
        status: false,
        updatedBy: username,
      };
      await Supplier.update(data, {
        where: {
          id,
        },
      });
      res.status(200).json({
        error: false,
        msg: `success delete Suppliers with id ${id}`,
        data: [],
      });
    } catch (error) {
      next(error);
    }
  }
  static async editSupplier(req, res, next) {
    try {
      const { id } = req.params;
      const {      supplier_name,
        supplier_address,
        supplier_email,
        supplier_contact,
        supplier_fax,
        supplier_website,
        supplier_NPWP } = req.body;
      const { username } = req.userAccess;

      const supplier = await Supplier.findOne({
        where: {
          id,
          status: true,
        },
      });
      if (!supplier) {
        throw {
          name: "not_found",
          code: 404,
          msg: "Supplier not found",
        };
      }
      const data = {
        supplier_name,
        supplier_address,
        supplier_email,
        supplier_contact,
        supplier_fax,
        supplier_website,
        supplier_NPWP,
        updatedBy: username,
      };
      await Supplier.update(data, {
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
