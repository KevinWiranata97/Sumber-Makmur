const {Storage } = require("../models");
const { comparePassword } = require("../helpers/bcrypt");
const { generateToken } = require("../helpers/jwt");
class Controller {
  static async getStorage(req, res, next) {
    try {
      const storage = await Storage.findAll({
        where: {
          status: true,
        },
      });
      res.status(200).json(storage);
    } catch (error) {
      next(error);
    }
  }

  static async createStorage(req, res, next) {
    try {
      const { storage_name, storage_code } = req.body;

      const data = {
    storage_name,
        storage_code,
      };

      await Storage.create(data);
      res.status(201).json({
        error: false,
        msg: `Success`,
        data: [],
      });
    } catch (error) {
      next(error);
    }
  }

  static async getStorageById(req, res, next) {
    try {
      const { id } = req.params;
      const storage = await Storage.findOne({
        where: {
          id,
          status: true,
        },
      });
      if (!storage) {
        throw {
          name: "not_found",
          code: 404,
          msg: "Storage not found",
        };
      }

      res.status(200).json({
        error: false,
        msg: `Success`,
        data: storage,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteStorage(req, res, next) {
    try {
      const { id } = req.params;
      const storage = await Storage.findOne({
        where: {
          id,
        },
      });
      if (!storage) {
        throw {
          name: "not_found",
          code: 404,
          msg: "Storage not found",
        };
      }
      const data = {
        status: false,
      };
      await Storage.update(data, {
        where: {
          id,
        },
      });
      res.status(200).json({
        error: false,
        msg: `success delete Storages with id ${id}`,
        data: [],
      });
    } catch (error) {
      next(error);
    }
  }
  static async editStorage(req, res, next) {
    try {
      const { id } = req.params;
      const { storage_name, storage_code } = req.body;
      const storage = await Storage.findOne({
        where: {
          id,
        },
      });
      if (!storage) {
        throw {
          name: "not_found",
          code: 404,
          msg: "Storage not found",
        };
      }
      const data = {
       storage_code,
       storage_name
      };
      await Storage.update(data, {
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
      const { Storagename, password } = req.body;

      let findStorage = await Storage.findOne({
        where: {
          Storagename,
        },
      });
      if (!findStorage) {
        throw {
          name: "Unauthorized",
          code: 401,
          msg: "Invalid email/password",
        };
      }

      const checkPassword = comparePassword(password, findStorage.password);

      if (!checkPassword) {
        throw {
          name: "Unauthorized",
        };
      }

      const payload = {
        id: findStorage.id,
        email: findStorage.email,
      };

      const authorization = generateToken(payload);

      res.status(200).json({
        error:false,
        id: findStorage.id,
        role: findStorage.role,
        authorization: authorization,
        email: findStorage.email,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = Controller;
