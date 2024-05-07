const router = require('express').Router();
const Controller = require('../controllers/UnitController')

router.post('/', Controller.createUnit)


router.get('/', Controller.getUnit)
router.get('/:id', Controller.getUnitById)
router.put('/:id', Controller.editUnit)
router.delete('/:id', Controller.deleteUnit)



module.exports = router