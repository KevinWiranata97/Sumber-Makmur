const { Unit } = require("../models");

class Controller {
  static async getUnit(req, res, next) {
    try {
      const unit = await Unit.findAll({
        where: {
          status: true,
        },
      });
      res.status(200).json(unit);
    } catch (error) {
      next(error);
    }
  }

  static async createUnit(req, res, next) {
    try {
      const { unit_name, unit_code } = req.body;
      const {username} = req.userAccess
      const data = {
        unit_name,
        unit_code,
        createdBy: username
      };

      await Unit.create(data);
      res.status(201).json({
        error: false,
        msg: `Success`,
        data: [],
      });
    } catch (error) {
      next(error);
    }
  }

  static async getUnitById(req, res, next) {
    try {
      const { id } = req.params;
      const unit = await Unit.findOne({
        where: {
          id,
          status: true,
        },
      });
      if (!unit) {
        throw {
          name: "not_found",
          code: 404,
          msg: "Unit not found",
        };
      }

      res.status(200).json({
        error: false,
        msg: `Success`,
        data: unit,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteUnit(req, res, next) {
    try {
      const { id } = req.params;
      const {username} = req.userAccess
      const unit = await Unit.findOne({
        where: {
          id,
        },
      });
      if (!unit) {
        throw {
          name: "not_found",
          code: 404,
          msg: "Unit not found",
        };
      }
      const data = {
        updatedBy:username,
        status: false,
      };
      await Unit.update(data, {
        where: {
          id,
        },
      });
      res.status(200).json({
        error: false,
        msg: `success delete Units with id ${id}`,
        data: [],
      });
    } catch (error) {
      next(error);
    }
  }
  static async editUnit(req, res, next) {
    try {
      const { id } = req.params;
      const { unit_name, unit_code } = req.body;
      const {username} = req.userAccess
      const unit = await Unit.findOne({
        where: {
          id,
        },
      });
      if (!unit) {
        throw {
          name: "not_found",
          code: 404,
          msg: "Unit not found",
        };
      }
      const data = {
       unit_code,
       unit_name,
       updatedBy:username
      };
      await Unit.update(data, {
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
