const router = require('express').Router();
const Controller = require('../controllers/transactionController')

router.post('/', Controller.createTransaction)
router.post('/transaction-product/', Controller.addTransactionProduct)


router.get('/', Controller.getTransaction)
router.get('/:id', Controller.getTransactionById)
router.put('/:id', Controller.editTransaction)
router.delete('/transaction-product/:id', Controller.deleteTransactionProduct)
router.delete('/:id', Controller.deleteTransaction)



module.exports = router