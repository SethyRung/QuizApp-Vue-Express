const { Category, sequelize } = require('../../models')
const { Op } = require('sequelize')

module.exports = {
  async addCategory(req, res) {
    const { icon, name, parent_id } = req.body
    if (!icon || !name) return res.status(400).json({ message: 'Insufficient data' })
    try {
      await Category.create({ icon: icon, name: name, parent_id: parent_id })
      res
        .status(200)
        .json({ status: 'success', message: 'You have successfully added a category.' })
    } catch (e) {
      res
        .status(400)
        .json({ status: 'error', message: 'You have unsuccessfully added a category.' })
    }
  },
  async editCategory(req, res) {
    const { id, icon, name } = req.body
    if (!id || !icon || !name) return res.status(400).json({ message: 'Insufficient data' })
    try {
      await Category.update({ icon: icon, name: name }, { where: { id: id } })
      res
        .status(200)
        .json({ status: 'success', message: 'You have successfully updated a category.' })
    } catch (e) {
      res
        .status(400)
        .json({ status: 'error', message: 'You have unsuccessfully updated a category.' })
    }
  },
  async getCategories(req, res) {
    try {
      if (req.query.onlySub !== 'true') {
        const mainCategory = await Category.findAll({
          attributes: ['id', 'icon', 'name'],
          where: {
            parent_id: {
              [Op.is]: null
            }
          }
        })

        const subCategory = await Category.findAll({
          attributes: ['id', 'icon', 'name', 'parent_id'],
          where: {
            parent_id: {
              [Op.not]: null
            }
          }
        })

        const categories = { main: [], sub: [] }
        mainCategory.forEach((m) => {
          const sub = subCategory.filter((s) => m.id === s.parent_id)
          categories.main.push({
            id: m.id,
            icon: m.icon,
            name: m.name,
            sub: sub
          })
        })

        subCategory.forEach((m) => {
          const sub = subCategory.filter((s) => m.id === s.parent_id)
          categories.sub.push({
            id: m.id,
            icon: m.icon,
            name: m.name,
            sub: sub
          })
        })
        res.json({ status: 'success', categories: categories })
      } else {
        const [results, metadata] = await sequelize.query(
          'SELECT categories.id, categories.name, categories.parent_id FROM categories INNER JOIN quizzes ON categories.id != quizzes.category_id WHERE categories.parent_id IS NOT NULL'
        )
        res.json({ status: 'success', categories: results })
      }
    } catch (e) {
      res
        .status(400)
        .json({ status: 'error', message: 'Something went wrong. Unable to retrieve category.' })
    }
  }
}
