const express = require('express')
const router = express.Router()
const categoryController = require('../../controllers/admin/categoryController')

router.get('/', categoryController.getCategories)
router.post('/', categoryController.addCategory)
router.put('/', categoryController.editCategory)

module.exports = router
