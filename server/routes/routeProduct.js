const router = require('express').Router();
const Controller = require('../controllers/productController')

router.post('/', Controller.createProduct)


router.get('/', Controller.getProduct)
router.get('/sell-history/:id', Controller.getProductSellHistory)
router.get('/:id', Controller.getProductById)
router.put('/:id', Controller.editProduct)
router.delete('/:id', Controller.deleteProduct)



module.exports = router