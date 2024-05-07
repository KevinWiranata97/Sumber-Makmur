const express = require("express");
const routerUser = require("../routes/routeUser");

const routerUnit = require("../routes/routeUnit");
const routerShelf = require("../routes/routeShelf")
const router = express.Router();

router.use("/users", routerUser);
router.use("/units", routerUnit);
router.use("/shelves", routerShelf);
module.exports = router;
