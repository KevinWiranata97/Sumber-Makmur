const router = require("express").Router();
const Controller = require("../controllers/areaController");

router.post("/", Controller.createArea);
router.get("/", Controller.getArea);
router.get("/:id", Controller.getAreaById);
router.put("/:id", Controller.editArea);
router.delete("/:id", Controller.deleteArea);

module.exports = router;
