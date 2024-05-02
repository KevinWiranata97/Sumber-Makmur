const express = require("express");
const routerUser = require("../routes/routeUser");
const router = express.Router();

router.use("/users", routerUser);
module.exports = router;
