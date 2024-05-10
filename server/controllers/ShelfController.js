const {Shelf, Storage } = require("../models");
const { comparePassword } = require("../helpers/bcrypt");
const { generateToken } = require("../helpers/jwt");
class Controller {
  static async getShelf(req, res, next) {
    try {
      const shelves = await Shelf.findAll({
        where: {
          status: true,
        },
      });
      res.status(200).json(shelves);
    } catch (error) {
      next(error);
    }
  }

  static async createShelf(req, res, next) {
    try {
      const { shelf_name, shelf_code } = req.body;
      const {username} = req.userAccess
     
      const data = {
    shelf_name,
        shelf_code,
        createdBy:username
      };

      console.log(data);
      await Shelf.create(data);
      res.status(201).json({
        error: false,
        msg: `Success`,
        data: [],
      });
    } catch (error) {
      next(error);
    }
  }

  static async getShelfById(req, res, next) {
    try {
      const { id } = req.params;
      const shelf = await Shelf.findOne({
        where: {
          id,
          status: true,
        },
      });
      if (!shelf) {
        throw {
          name: "not_found",
          code: 404,
          msg: "Shelf not found",
        };
      }

      res.status(200).json({
        error: false,
        msg: `Success`,
        data: shelf,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteShelf(req, res, next) {
    try {
      const { id } = req.params;
      const {username} = req.userAccess
      const shelf = await Shelf.findOne({
        where: {
          id,
        },
      });
      if (!shelf) {
        throw {
          name: "not_found",
          code: 404,
          msg: "Shelf not found",
        };
      }
      const data = {
        status: false,
        updatedBy:username
      };
      await Shelf.update(data, {
        where: {
          id,
        },
      });
      res.status(200).json({
        error: false,
        msg: `success delete Shelfs with id ${id}`,
        data: [],
      });
    } catch (error) {
      next(error);
    }
  }
  static async editShelf(req, res, next) {
    try {
      const { id } = req.params;
      const { shelf_name, shelf_code } = req.body;
      const {username} = req.userAccess
    

      const shelf = await Shelf.findOne({
        where: {
          id,
          status: true,
        },
      });
      if (!shelf) {
        throw {
          name: "not_found",
          code: 404,
          msg: "Shelf not found",
        };
      }
      const data = {
       shelf_code,
       shelf_name,
       updatedBy:username

      };
      await Shelf.update(data, {
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
