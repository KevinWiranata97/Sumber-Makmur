const { Customer, Area, Expedition } = require("../models");
const { Op } = require('sequelize');
class Controller {
  static async getCustomer(req, res, next) {
    try {
      // Get search query, page, and limit from request query parameters
      const searchQuery = req.query.search || ''; // Default search is an empty string
      const limit = parseInt(req.query.limit) || 10; // Default limit is 10
      let page = parseInt(req.query.page);

      
      // Ensure page is at least 1, handle cases where page=0 or NaN
      page = !isNaN(page) && page > 0 ? page : 1;
  
      const offset = (page - 1) * limit; // Calculate the offset for pagination (1-based page)
  
      // Find all customers with pagination, search, and include related data (Area and Expedition)
      const { count, rows: customers } = await Customer.findAndCountAll({
        where: {
          status: true, // Ensure the status is true
          [Op.or]: [
            {
              customer_name: {
                [Op.iLike]: `%${searchQuery}%`, // Case-insensitive search in customer_name field
              },
            },
            {
              customer_address_1: {
                [Op.iLike]: `%${searchQuery}%`, // Case-insensitive search in customer_address_1
              },
            },
            {
              customer_phone: {
                [Op.iLike]: `%${searchQuery}%`, // Case-insensitive search in customer_phone
              },
            },
            {
              customer_email: {
                [Op.iLike]: `%${searchQuery}%`, // Case-insensitive search in customer_email
              },
            },
            {
              '$Area.area_name$': {
                [Op.iLike]: `%${searchQuery}%`, // Search in related Storage name
              },
            },
            {
              '$Expedition.expedition_name$': {
                [Op.iLike]: `%${searchQuery}%`, // Search in related Unit code
              },
            },
          ],
        },
        include: [
          {
            model: Area,
            attributes: ['area_name'],
           
          },
          {
            model: Expedition,
            attributes: ['expedition_name'],
   
          },
        ],
        limit, // Limit the number of results returned per page
        offset, // Skip the first (page-1) * limit results
      });
  
      // Calculate the total number of pages
      const totalPages = Math.ceil(count / limit);
  
      // Return the results along with pagination metadata
      res.status(200).json({
        error: false,
        msg: 'Success',
        data: customers,
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
  static async createCustomer(req, res, next) {
    try {
      const {
        customer_name,
        customer_address_1,
        customer_address_2,
        customer_expedition_id,
        customer_area_id,
        customer_phone,
        customer_email,
        customer_contact,
        customer_plafon,
        customer_NPWP,
        customer_grade_id,
        customer_time,
        customer_discount
      } = req.body;
      const { username } = req.userAccess;

      const data = {
        customer_name,
        customer_address_1,
        customer_address_2,
        customer_expedition_id,
        customer_area_id,
        customer_phone,
        customer_email,
        customer_contact,
        customer_plafon,
        customer_NPWP,
        customer_grade_id,
        customer_time,
        customer_discount,
        createdBy: username,
      };

      await Customer.create(data);
      res.status(201).json({
        error: false,
        msg: `Success`,
        data: [],
      });
    } catch (error) {
      next(error);
    }
  }

  static async getCustomerById(req, res, next) {
    try {
      const { id } = req.params;
      const customer = await Customer.findOne({
        where: {
          id,
          status: true,
        },
      });
      if (!customer) {
        throw {
          name: "not_found",
          code: 404,
          msg: "Customer not found",
        };
      }

      res.status(200).json({
        error: false,
        msg: `Success`,
        data: customer,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteCustomer(req, res, next) {
    try {
      const { id } = req.params;
      const { username } = req.userAccess;
      const customer = await Customer.findOne({
        where: {
          id,
        },
      });
      if (!customer) {
        throw {
          name: "not_found",
          code: 404,
          msg: "Customer not found",
        };
      }
      const data = {
        status: false,
        updatedBy: username,
      };
      await Customer.update(data, {
        where: {
          id,
        },
      });
      res.status(200).json({
        error: false,
        msg: `success delete Customers with id ${id}`,
        data: [],
      });
    } catch (error) {
      next(error);
    }
  }
  static async editCustomer(req, res, next) {
    try {
      const { id } = req.params;
      const {
        customer_name,
        customer_address_1,
        customer_address_2,
        customer_expedition_id,
        customer_area_id,
        customer_phone,
        customer_email,
        customer_contact,
        customer_plafon,
        customer_NPWP,
        customer_grade_id,
        customer_time,
        customer_discount
      } = req.body;
      const { username } = req.userAccess;

      const CustomerById = await Customer.findOne({
        where: {
          id,
          status: true,
        },
      });
      if (!CustomerById) {
        throw {
          name: "not_found",
          code: 404,
          msg: "Customer not found",
        };
      }
      const data = {
        customer_name,
        customer_address_1,
        customer_address_2,
        customer_expedition_id,
        customer_area_id,
        customer_phone,
        customer_email,
        customer_contact,
        customer_plafon,
        customer_NPWP,
        customer_grade_id,
        customer_time,
        customer_discount,
        updatedBy: username,
      };
      await Customer.update(data, {
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
