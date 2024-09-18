const { Supplier } = require("../models");
const { Op } = require('sequelize');
class Controller {
  static async getSupplier(req, res, next) {
    try {
      // Get search query, page, and limit from request query parameters
      const searchQuery = req.query.search || ''; // Default search is an empty string
      const limit = parseInt(req.query.limit) || 10; // Default limit is 10
      let page = parseInt(req.query.page);
  
      // Ensure page is at least 1, handle cases where page=0 or NaN
      page = !isNaN(page) && page > 0 ? page : 1;
  
      const offset = (page - 1) * limit; // Calculate the offset for pagination (1-based page)
  
      // Find all suppliers with pagination and optional search query
      const { count, rows: suppliers } = await Supplier.findAndCountAll({
        where: {
          status: true, // Ensure the status is true
          [Op.or]: [
            {
              supplier_name: {
                [Op.iLike]: `%${searchQuery}%`, // Case-insensitive search in supplier_name
              },
            },
            {
              supplier_address: {
                [Op.iLike]: `%${searchQuery}%`, // Case-insensitive search in supplier_address
              },
            },
            {
              supplier_email: {
                [Op.iLike]: `%${searchQuery}%`, // Case-insensitive search in supplier_email
              },
            },
            {
              supplier_contact: {
                [Op.iLike]: `%${searchQuery}%`, // Case-insensitive search in supplier_contact
              },
            },
          ],
        },
        limit, // Limit the number of results returned per page
        offset, // Skip the first (page-1) * limit results
      });
  
      // Calculate the total number of pages
      const totalPages = Math.ceil(count / limit);
  
      // Return the results along with pagination metadata
      res.status(200).json({
        error: false,
        msg: 'Success',
        data: suppliers,
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
        supplier_debt,
        supplier_time
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
        supplier_debt,
        supplier_time,
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
      const { supplier_name,
        supplier_address,
        supplier_email,
        supplier_contact,
        supplier_fax,
        supplier_website,
        supplier_NPWP, supplier_debt,
        supplier_time } = req.body;
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
        supplier_debt,
        supplier_time,
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
