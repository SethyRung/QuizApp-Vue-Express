const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')

router.get('/', userController.getPersonalDetails)
router.put('/', userController.editPersonalDetails)
router.put('/changePassword', userController.editPassword)

module.exports = router
