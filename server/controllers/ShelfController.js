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

      const data = {
    shelf_name,
        shelf_code,
      };

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
      const Shelf = await Shelf.findOne({
        where: {
          id,
          status: true,
        },
      });
      if (!Shelf) {
        throw {
          name: "not_found",
          code: 404,
          msg: "Shelf not found",
        };
      }

      res.status(200).json({
        error: false,
        msg: `Success`,
        data: Shelf,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteShelf(req, res, next) {
    try {
      const { id } = req.params;
      const Shelf = await Shelf.findOne({
        where: {
          id,
        },
      });
      if (!Shelf) {
        throw {
          name: "Unauthorized",
          code: 401,
          msg: "Invalid email/password",
        };
      }
      const data = {
        status: false,
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
      const { Shelf_name, Shelf_code } = req.body;
      const Shelf = await Shelf.findOne({
        where: {
          id,
        },
      });
      if (!Shelf) {
        throw {
          name: "Unauthorized",
          code: 401,
          msg: "Invalid email/password",
        };
      }
      const data = {
       Shelf_code,
       Shelf_name
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
  static async login(req, res, next) {
    try {
      const { Shelfname, password } = req.body;

      let findShelf = await Shelf.findOne({
        where: {
          Shelfname,
        },
      });
      if (!findShelf) {
        throw {
          name: "Unauthorized",
          code: 401,
          msg: "Invalid email/password",
        };
      }

      const checkPassword = comparePassword(password, findShelf.password);

      if (!checkPassword) {
        throw {
          name: "Unauthorized",
        };
      }

      const payload = {
        id: findShelf.id,
        email: findShelf.email,
      };

      const authorization = generateToken(payload);

      res.status(200).json({
        error:false,
        id: findShelf.id,
        role: findShelf.role,
        authorization: authorization,
        email: findShelf.email,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = Controller;
