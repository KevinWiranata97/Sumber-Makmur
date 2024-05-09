const express = require("express");
const routerUser = require("../routes/routeUser");

const routerUnit = require("../routes/routeUnit");
const routerShelf = require("../routes/routeShelf")
const routerSupplier = require("../routes/routeSupplier")
const router = express.Router();
const authentication = require("../middlewares/authentication");
router.use("/users", routerUser);

router.use(authentication)
router.use("/units", routerUnit);
router.use("/shelves", routerShelf);
router.use("/suppliers", routerSupplier);
module.exports = router;
