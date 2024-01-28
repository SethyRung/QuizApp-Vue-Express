module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'categories',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
      },
      icon: {
        type: DataTypes.STRING,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      freezeTableName: true
    }
  )

// <!-- id, icon, name, parent_id
// CREATE TABLE categories (
//   id INT NOT NULL AUTO_INCREMENT,
//   name VARCHAR(255) NOT NULL,
//   parent_id INT NULL,
//   PRIMARY KEY (id),
//   FOREIGN KEY (parent_id) REFERENCES categories (id)
// ) -->
