const { Unit } = require("../models");
const { comparePassword } = require("../helpers/bcrypt");
const { generateToken } = require("../helpers/jwt");
class Controller {
  static async getUser(req, res, next) {
    try {
      const Unit = await Unit.findAll({
        where: {
          status: true,
        },
      });
      res.status(200).json(Unit);
    } catch (error) {
      next(error);
    }
  }

  static async createUser(req, res, next) {
    try {
      const { unit_name, unit_code } = req.body;

      const data = {
        unit_name,
        unit_code,
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

  static async getUserById(req, res, next) {
    try {
      const { id } = req.params;
      const Unit = await Unit.findOne({
        where: {
          id,
          status: true,
        },
      });
      if (!Unit) {
        throw {
          name: "not_found",
          code: 404,
          msg: "Unit not found",
        };
      }

      res.status(200).json({
        error: false,
        msg: `Success`,
        data: Unit,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteUser(req, res, next) {
    try {
      const { id } = req.params;
      const Unit = await Unit.findOne({
        where: {
          id,
        },
      });
      if (!Unit) {
        throw {
          name: "Unauthorized",
          code: 401,
          msg: "Invalid email/password",
        };
      }
      const data = {
        status: false,
      };
      await Unit.update(data, {
        where: {
          id,
        },
      });
      res.status(200).json({
        error: false,
        msg: `success delete users with id ${id}`,
        data: [],
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const { username, password } = req.body;

      let findUser = await Unit.findOne({
        where: {
          username,
        },
      });
      if (!findUser) {
        throw {
          name: "Unauthorized",
          code: 401,
          msg: "Invalid email/password",
        };
      }

      const checkPassword = comparePassword(password, findUser.password);

      if (!checkPassword) {
        throw {
          name: "Unauthorized",
        };
      }

      const payload = {
        id: findUser.id,
        email: findUser.email,
      };

      const authorization = generateToken(payload);

      res.status(200).json({
        error:false,
        id: findUser.id,
        role: findUser.role,
        authorization: authorization,
        email: findUser.email,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = Controller;
