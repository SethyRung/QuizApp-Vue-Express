const { Category } = require('../models')
const { Op } = require('sequelize')

module.exports = {
  async getCategories(req, res) {
    try {
      if (req.query.parent_id === '0') {
        const categories = []

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

        mainCategory.forEach((m) => {
          const sub = subCategory.filter((s) => m.id === s.parent_id)
          categories.push({
            id: m.id,
            icon: m.icon,
            name: m.name,
            sub: sub
          })
        })

        res.json({ status: 'success', categories: categories })
      } else {
        const categories = []

        const mainCategory = await Category.findAll({
          attributes: ['id', 'icon', 'name'],
          where: {
            id: req.query.parent_id
          }
        })

        const subCategory = await Category.findAll({
          attributes: ['id', 'icon', 'name', 'parent_id'],
          where: {
            parent_id: req.query.parent_id
          }
        })

        mainCategory.forEach((m) => {
          const sub = subCategory.filter((s) => m.id === s.parent_id)
          categories.push({
            id: m.id,
            icon: m.icon,
            name: m.name,
            sub: sub
          })
        })

        res.json({ status: 'success', categories: categories })
      }
    } catch (e) {
      res
        .status(400)
        .json({ status: 'error', message: 'Something went wrong. Unable to retrieve category.' })
    }
  }
}
