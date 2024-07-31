const router = require("express").Router();
const Controller = require("../controllers/expeditionController");

router.post("/", Controller.createExpedition);
router.get("/", Controller.getExpedition);
router.get("/:id", Controller.getExpeditionById);
router.put("/:id", Controller.editExpedition);
router.delete("/:id", Controller.deleteExpedition);

module.exports = router;
