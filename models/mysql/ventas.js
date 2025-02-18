const { sequelize } = require('../../config/mysql');
const { DataTypes } = require('sequelize');

const User = sequelize.define(
  'Usuarios',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    numeroDocumento: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    tipoPago: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    total: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true, // Esto asegura que no haya dos registros con el mismo idRol
    },
    createdAt: {
      type: DataTypes.DATE,
      field: 'created_at',
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: 'updated_at',
    },
  },

);


module.exports = User;