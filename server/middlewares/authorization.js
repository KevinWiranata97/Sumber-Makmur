
async function adminAuthorization(req, res, next) {
  try {
    const role = req.userAccess.role;
   
    if (role !== "admin") {
      throw {
        name: "forbidden",
      };
    }
    next();
  } catch (error) {
    console.log(error);
    if (error.name === "forbidden") {
      res.status(403).json({ message: "Forbidden access" });
    }else{
      res.status(500).json({ message: "internal server error" });
    }
  }
}

module.exports =  adminAuthorization;
