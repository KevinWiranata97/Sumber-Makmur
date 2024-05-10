const router = require('express').Router();
const Controller = require('../controllers/customerController')

router.post('/', Controller.createCustomer)


router.get('/', Controller.getCustomer)
router.get('/:id', Controller.getCustomerById)
router.put('/:id', Controller.editCustomer)
router.delete('/:id', Controller.deleteCustomer)



module.exports = router