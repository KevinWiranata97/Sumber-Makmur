const express = require("express");
const routerUser = require("../routes/routeUser");

const routerUnit = require("../routes/routeUnit");
const routerShelf = require("../routes/routeShelf")
const routerSupplier = require("../routes/routeSupplier")
const routeStorage = require("../routes/routeStorage")
const routeProduct = require("../routes/routeProduct")
const routeCustomer = require("../routes/routeCustomer")
const routerTransaction = require("../routes/routeTransaction")
const routerArea = require("../routes/routeArea")
const routerExpedition = require("../routes/routeExpedition")
const router = express.Router();
const authentication = require("../middlewares/authentication");
router.use("/users", routerUser);

router.use(authentication)
router.use("/units", routerUnit);
router.use("/shelves", routerShelf);
router.use("/suppliers", routerSupplier);
router.use("/storages", routeStorage);
router.use("/products", routeProduct);
router.use("/customers", routeCustomer);
router.use("/transactions", routerTransaction);
router.use("/areas", routerArea);
router.use("/expeditions", routerExpedition);
module.exports = router;

