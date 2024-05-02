const User = require("../models/user");
const { comparePassword } = require("../helpers/bcrypt");
const { generateToken } = require("../helpers/jwt");
class Controller {
  static async getUser(req, res, next) {
    try {
      const user = await User.query();
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json("Internal Server Error");
    }
  }

  static async createUser(req, res, next) {
    try {
      const { name, email, password, role } = req.body;

      const data = {
        name,
        email,
        password,
        role,
      };
      const newUser = await User.query().insert(data);
      res.status(201).json(newUser);
    } catch (error) {
      if(error.name === "UniqueViolationError"){
        res.status(400).json({ message: "Email already exist" });
      }else{
        res.status(500).json("Internal Server Error");
      }
     
    }
  }

  static async getUserById(req, res, next) {
    try {
      const { id } = req.params;
      const user = await User.query().findById(id);
      res.status(200).json(user);
    } catch (error) {
      console.log(error);
      res.status(500).json("Internal Server Error");
    }
  }

  static async deleteUser(req, res, next) {
    try {
      const { id } = req.params;
      const findUser = await User.query().findById(id);
      if (!findUser) {
        throw { name: "Not Found" };
      }

      await User.query().deleteById(id);
      res.status(200).json(`success delete users with id ${id}`);
    } catch (error) {
      if (error.name === "Not Found") {
        res.status(404).json({ message: '"Data not found"' });
      }
      res.status(500).json({ message: "internal server error" });
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;

      let findUser = await User.query().findOne({
        email,
      });
;
      if (!findUser) {
        throw {
          name: "Unauthorized",
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

      const access_token = generateToken(payload);

      res.status(200).json({
        id: findUser.id,
        role: findUser.role,
        access_token: access_token,
        email: findUser.email,
      });
    } catch (error) {
      if (error.name === "Unauthorized") {
        res.status(401).json({ message: "Invalid email or password" });
      }else{
        res.status(500).json({ message: "internal server error" });
      }
   
    }
  }
}

module.exports = Controller;
