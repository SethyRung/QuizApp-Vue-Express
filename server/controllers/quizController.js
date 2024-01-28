const { Quiz, sequelize } = require('../models')

module.exports = {
  async getQuiz(req, res) {
    try {
      const quiz = await Quiz.findAll({
        attributes: ['title', 'quiz'],
        where: {
          category_id: req.query.category_id
        }
      })
      res.status(200).json({
        status: 'success',
        quiz: {
          title: quiz.length > 0 ? quiz[0].title : '',
          questions: quiz.length > 0 ? quiz[0].quiz : quiz
        }
      })
    } catch (e) {
      res
        .status(400)
        .json({ status: 'error', message: 'Something went wrong. Unable to retrieve quiz.' })
    }
  }
}
