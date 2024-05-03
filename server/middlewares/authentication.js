const {User} = require("../models");
const { verifyToken } = require("../helpers/jwt");

async function authentication(req, res, next) {
  try {
    const {authorization } = req.headers;

    if (!authorization) {
      throw {
        name: "Unauthorized",
        code:401,
        msg:"Invalid email/password"
      };
    }

    const payload = verifyToken(authorization);
    const findUser = await User.findOne({
     where:{
      id: payload.id,
     } 
    });

    if (!findUser) {
      throw {
        name: "Unauthorized",
        code:401,
        msg:"Invalid email/password"
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
    next(error)
  }
}

module.exports = authentication;
