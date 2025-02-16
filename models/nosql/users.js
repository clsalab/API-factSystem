const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const mongooseDelete = require('mongoose-delete');

// Definición del esquema
const UsersScheme = new mongoose.Schema(
  {
    nombreCompleto: {
      type: String,
      required: true
    },
    correo: {
      type: String,
      required: true,
      unique: true,
    },
    idRol: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Rol',
      required: true,
    },
    clave: {
      type: String,
      required: true,
      select: false,
    },
    esActivo: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Agregar el hook para encriptar la contraseña antes de guardar
UsersScheme.pre('save', async function (next) {
  const user = this;

  // Si la contraseña no se modificó, no hace falta encriptar de nuevo
  if (!user.isModified('clave')) return next();

  try {
    // Encriptar la contraseña con bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.clave, salt);

    // Asignar la contraseña encriptada al campo 'clave'
    user.clave = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

// Plugin para el soft delete
UsersScheme.plugin(mongooseDelete, { overrideMethods: 'all' });

// Crear el modelo
const UsersModel = mongoose.model('Usuarios', UsersScheme);

module.exports = UsersModel;
