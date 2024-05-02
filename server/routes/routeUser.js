const router = require('express').Router();
const Controller = require('../controllers/UserController.js')
const authentication = require('../middlewares/authentication');
const authorization = require('../middlewares/authorization');
router.post('/', Controller.createUser)
router.post('/login', Controller.login)
router.use(authentication)
router.get('/', Controller.getUser)
router.get('/:id', Controller.getUserById)

router.delete('/:id',authorization, Controller.deleteUser)



module.exports = router