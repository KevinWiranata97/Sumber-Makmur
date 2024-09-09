const { Customer, Area, Expedition } = require("../models");

class Controller {
  static async getCustomer(req, res, next) {
    try {
      const customer = await Customer.findAll({
        where: {
          status: true,
        },
        include: [
          {
            model: Area,
            attributes:['area_name']
          },
          {
            model: Expedition,
            attributes:['expedition_name']
          },
        ],
      });

      
      res.status(200).json({
        error: false,
        msg: `Success`,
        data: customer,
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
