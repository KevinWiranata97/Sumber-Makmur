const router = require('express').Router();
const Controller = require('../controllers/storageController')

router.post('/', Controller.createStorage)


router.get('/', Controller.getStorage)
router.get('/:id', Controller.getStorageById)
router.put('/:id', Controller.editStorage)
router.delete('/:id', Controller.deleteStorage)



module.exports = router