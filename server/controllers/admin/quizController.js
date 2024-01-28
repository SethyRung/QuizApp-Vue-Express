const { Quiz, sequelize } = require('../../models')

module.exports = {
  async addQuiz(req, res) {
    const { title, quiz, category_id } = req.body
    if (!title || !quiz || !category_id)
      return res.status(400).json({ message: 'Insufficient data' })
    try {
      await Quiz.create({ title: title, quiz: quiz, category_id: category_id })
      res.status(200).json({ status: 'success', message: 'You have successfully added a quiz.' })
    } catch (e) {
      res.status(400).json({ status: 'error', message: 'You have unsuccessfully added a quiz.' })
    }
  },
  async editQuiz(req, res) {
    const { id, title, quiz, category_id } = req.body
    if (!id || !title || !quiz || !category_id)
      return res.status(400).json({ message: 'Insufficient data' })

    try {
      await Quiz.update(
        { title: title, quiz: quiz, category_id: category_id },
        { where: { id: id } }
      )
      res.status(200).json({ status: 'success', message: 'You have successfully updated a quiz.' })
    } catch (e) {
      res
        .status(400)
        .json({ status: 'success', message: 'You have unsuccessfully updated a quiz.' })
    }
  },
  async deleteQuiz(req, res) {
    const { id } = req.body
    if (!id) return res.status(400).json({ message: 'Insufficient data' })

    try {
      await Quiz.destroy({ where: { id: id } })
      res.status(200).json({ status: 'success', message: 'You have successfully updated a quiz.' })
    } catch (e) {
      res.status(400).json({ status: 'error', message: 'You have unsuccessfully updated a quiz.' })
    }
  },
  async getQuizbyId(req, res) {
    try {
      const quiz = await Quiz.findByPk(req.params.id, {
        attributes: ['id', 'title', 'quiz', 'category_id']
      })
      res.status(200).json({ status: 'success', quiz: quiz })
    } catch (e) {
      res
        .status(400)
        .json({ status: 'error', message: 'Something went wrong. Unable to retrieve quiz.' })
    }
  },
  async getQuiz(req, res) {
    try {
      const [results] = await sequelize.query(
        'SELECT quizzes.id, title, categories.name AS category FROM quizzes INNER JOIN categories ON quizzes.category_id = categories.id'
      )

      res.status(200).json({ status: 'success', quizzes: results })
    } catch (e) {
      res
        .status(400)
        .json({ status: 'error', message: 'Something went wrong. Unable to retrieve quiz.' })
    }
  }
}
