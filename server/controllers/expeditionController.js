const { Expedition } = require("../models");

class Controller {
  static async getExpedition(req, res, next) {
    try {
      const expedition = await Expedition.findAll({
        where: {
          status: true,
        },
      });
      res.status(200).json(expedition);
    } catch (error) {
      next(error);
    }
  }

  static async createExpedition(req, res, next) {
    try {
      const {
        expedition_name,
        expedition_address,
        expedition_contact,
        expedition_phone,
        expedition_fax,
        expedition_destination,
      } = req.body;

      const data = {
        expedition_name,
        expedition_address,
        expedition_contact,
        expedition_phone,
        expedition_fax,
        expedition_destination,
      };

      await Expedition.create(data);
      res.status(201).json({
        error: false,
        msg: `Success`,
        data: [],
      });
    } catch (error) {
      next(error);
    }
  }

  static async getExpeditionById(req, res, next) {
    try {
      const { id } = req.params;
      const expedition = await Expedition.findOne({
        where: {
          id,
          status: true,
        },
      });
      if (!expedition) {
        throw {
          name: "not_found",
          code: 404,
          msg: "Expedition not found",
        };
      }

      res.status(200).json({
        error: false,
        msg: `Success`,
        data: expedition,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteExpedition(req, res, next) {
    try {
      const { id } = req.params;
      const expedition = await Expedition.findOne({
        where: {
          id,
        },
      });
      if (!expedition) {
        throw {
          name: "not_found",
          code: 404,
          msg: "Expedition not found",
        };
      }
      const data = {
        status: false,
      };
      await Expedition.update(data, {
        where: {
          id,
        },
      });
      res.status(200).json({
        error: false,
        msg: `success delete Expeditions with id ${id}`,
        data: [],
      });
    } catch (error) {
      next(error);
    }
  }
  static async editExpedition(req, res, next) {
    try {
      const { id } = req.params;
      const {
        expedition_name,
        expedition_address,
        expedition_contact,
        expedition_phone,
        expedition_fax,
        expedition_destination,
      } = req.body;

      const data = {
        expedition_name,
        expedition_address,
        expedition_contact,
        expedition_phone,
        expedition_fax,
        expedition_destination,
      };
      const expedition = await Expedition.findOne({
        where: {
          id,
        },
      });
      if (!expedition) {
        throw {
          name: "not_found",
          code: 404,
          msg: "Expedition not found",
        };
      }
    
      await Expedition.update(data, {
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
