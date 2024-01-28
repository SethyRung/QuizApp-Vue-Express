const express = require('express')
const router = express.Router()
const quizController = require('../../controllers/admin/quizController')

router.get('/', quizController.getQuiz)
router.get('/:id', quizController.getQuizbyId)
router.post('/', quizController.addQuiz)
router.put('/', quizController.editQuiz)
router.delete('/', quizController.deleteQuiz)

module.exports = router
