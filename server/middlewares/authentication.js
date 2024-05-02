const User = require("../models/user");
const { verifyToken } = require("../helpers/jwt");

async function authentication(req, res, next) {
  try {
    const { access_token } = req.headers;
    if (!access_token) {
      throw {
        name: "Unauthorized",
      };
    }

    const payload = verifyToken(access_token);
    const findUser = await User.query().findOne({
      id: payload.id,
    });

    if (!findUser) {
      throw {
        name: "Unauthorized",
      };
    }

    req.userAccess = {
      id: findUser.id,
      email: findUser.email,
      username: findUser.username,
      role: findUser.role,
    };

    next();
  } catch (error) {
    if (error.name === "Unauthorized") {
      res.status(401).json({ message: "Invalid email or password" });
    } else {
      res.status(500).json({ message: "internal server error" });
    }
  }
}

module.exports = authentication;
