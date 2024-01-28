const fs = require('fs')
const path = require('path')
const db = {}
const config = require('../configs/config')
const Sequelize = require('sequelize')
const sequelize = new Sequelize(
  config.db.database,
  config.db.user,
  config.db.password,
  config.db.options
)

fs.readdirSync(__dirname)
  .filter((file) => file !== 'index.js')
  .forEach((file) => {
    const model = require(path.join(__dirname, file))
    db[file.replace('.js', '')] = model(sequelize, Sequelize)
  })
db.sequelize = sequelize
db.Sequelize = Sequelize

//Associations
// db.Question.hasMany(db.Answer, {
//   foreignKey: {
//     allowNull: false
//   }
// })
// db.Answer.belongsTo(db.Question)

db.Category.hasOne(db.Category, {
  foreignKey: {
    name: 'parent_id',
    allowNull: true
  },
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE'
})

db.Category.hasOne(db.Quiz, {
  foreignKey: {
    name: 'category_id',
    allowNull: false
  },
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
})

module.exports = db
