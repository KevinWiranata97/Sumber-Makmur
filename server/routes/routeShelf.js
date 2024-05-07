const router = require('express').Router();
const Controller = require('../controllers/ShelfController')

router.post('/', Controller.createShelf)


router.get('/', Controller.getShelf)
router.get('/:id', Controller.getShelfById)
router.put('/:id', Controller.editShelf)
router.delete('/:id', Controller.deleteShelf)



module.exports = router