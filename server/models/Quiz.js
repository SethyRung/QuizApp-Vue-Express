module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'quizzes',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      quiz: {
        type: DataTypes.JSON,
        allowNull: false
      }
    },
    {
      freezeTableName: true
    }
  )
