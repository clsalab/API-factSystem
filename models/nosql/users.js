const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const mongooseDelete = require('mongoose-delete');

const UsersScheme = new mongoose.Schema(
  {
    nombreCompleto: {
      type: String,
      required: true,
    },
    correo: {
      type: String,
      required: true,
      unique: true,
    },
    idRol: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'rols',
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

// Método estático para obtener todos los usuarios con su rol
UsersScheme.statics.findAllData = async function () {
  try {
    const joinData = await this.aggregate([
      {
        $lookup: {
          from: 'rols',
          localField: 'idRol',
          foreignField: '_id',
          as: 'rol',
        },
      },
      {
        $unwind: '$rol',
      },
      {
        $project: {  // Asegúrate de excluir la clave
          clave: 0,  // Excluir el campo 'clave' del resultado
        },
      }
    ]);
    return joinData;
  } catch (error) {
    console.error('Error en el uso de aggregate:', error);
    throw error;
  }
};

// Agregar el hook para encriptar la contraseña antes de guardar
UsersScheme.pre('save', async function (next) {
  const user = this;
  if (!user.isModified('clave')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.clave, salt);
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

// Exportar el modelo
module.exports = UsersModel;
