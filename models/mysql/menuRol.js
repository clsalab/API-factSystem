const { sequelize } = require('../../config/mysql');
const { DataTypes } = require('sequelize');

const User = sequelize.define(
  'MenuRol',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    idMenu: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    idRol: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      field: 'created_at',
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: 'updated_at',
    },
  }
);


module.exports = User;