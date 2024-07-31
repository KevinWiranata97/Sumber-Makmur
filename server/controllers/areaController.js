const {Area } = require("../models");

class Controller {
  static async getArea(req, res, next) {
    try {
      const area = await Area.findAll({
        where: {
          status: true,
        },
      });
      res.status(200).json(area);
    } catch (error) {
      next(error);
    }
  }

  static async createArea(req, res, next) {
    try {
      const { area_name, area_code } = req.body;

      const data = {
    area_name,
        area_code,
      };

      await Area.create(data);
      res.status(201).json({
        error: false,
        msg: `Success`,
        data: [],
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAreaById(req, res, next) {
    try {
      const { id } = req.params;
      const area = await Area.findOne({
        where: {
          id,
          status: true,
        },
      });
      if (!area) {
        throw {
          name: "not_found",
          code: 404,
          msg: "Area not found",
        };
      }

      res.status(200).json({
        error: false,
        msg: `Success`,
        data: area,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteArea(req, res, next) {
    try {
      const { id } = req.params;
      const area = await Area.findOne({
        where: {
          id,
        },
      });
      if (!area) {
        throw {
          name: "not_found",
          code: 404,
          msg: "Area not found",
        };
      }
      const data = {
        status: false,
      };
      await Area.update(data, {
        where: {
          id,
        },
      });
      res.status(200).json({
        error: false,
        msg: `success delete Areas with id ${id}`,
        data: [],
      });
    } catch (error) {
      next(error);
    }
  }
  static async editArea(req, res, next) {
    try {
      const { id } = req.params;
      const { area_name, area_code } = req.body;
      const area = await Area.findOne({
        where: {
          id,
        },
      });
      if (!area) {
        throw {
          name: "not_found",
          code: 404,
          msg: "Area not found",
        };
      }
      const data = {
       area_code,
       area_name
      };
      await Area.update(data, {
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
