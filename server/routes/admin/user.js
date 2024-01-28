const express = require('express')
const route = express.Router()
const userController = require('../../controllers/admin/usersController')

route.get('/', userController.getAllUsers)

module.exports = route
