const router = require('express').Router();
const Controller = require('../controllers/SupplierController')

router.post('/', Controller.createSupplier)


router.get('/', Controller.getSupplier)
router.get('/:id', Controller.getSupplierById)
router.put('/:id', Controller.editSupplier)
router.delete('/:id', Controller.deleteSupplier)



module.exports = router