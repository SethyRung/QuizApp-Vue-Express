const express = require('express')
const router = express.Router()
const authenticationController = require('../controllers/authController')

router.post('/', authenticationController.handleRegister)

module.exports = router
