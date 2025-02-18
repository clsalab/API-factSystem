const { sequelize } = require('../../config/mysql');
const { DataTypes } = require('sequelize');

const User = sequelize.define(
  'Menu',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombreCompleto: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    correo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    idRol: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true, // Esto asegura que no haya dos registros con el mismo idRol
    },
    clave: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    esActivo: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
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