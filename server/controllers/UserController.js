const { User } = require("../models");
const { comparePassword } = require("../helpers/bcrypt");
const { generateToken } = require("../helpers/jwt");
class Controller {
  static async getUser(req, res, next) {
    try {
      const user = await User.findAll({
        where: {
          status: true,
        },
      });
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }

  static async createUser(req, res, next) {
    try {
      const { username, password, role } = req.body;

      const data = {
        username,
        password,
        role,
      };

      await User.create(data);
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
      const user = await User.findOne({
        where: {
          id,
          status: true,
        },
      });
      if (!user) {
        throw {
          name: "not_found",
          code: 404,
          msg: "User not found",
        };
      }

      res.status(200).json({
        error: false,
        msg: `Success`,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteUser(req, res, next) {
    try {
      const { id } = req.params;
      const user = await User.findOne({
        where: {
          id,
        },
      });
      if (!user) {
        throw {
          name: "Unauthorized",
          code: 401,
          msg: "Invalid email/password",
        };
      }
      const data = {
        status: false,
      };
      await user.update(data, {
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

      let findUser = await User.findOne({
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
