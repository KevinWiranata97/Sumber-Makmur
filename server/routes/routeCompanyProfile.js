const router = require('express').Router();
const Controller = require('../controllers/companyProfileController')

router.post('/', Controller.createCompanyProfile)


router.get('/', Controller.getCompanyProfiles)
router.get('/:id', Controller.getCompanyProfileById)
router.put('/:id', Controller.editCompanyProfile)
router.delete('/:id', Controller.deleteCompanyProfile)



module.exports = router