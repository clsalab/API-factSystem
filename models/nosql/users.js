const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const mongooseDelete = require('mongoose-delete');

// Definir el esquema de usuarios
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
      match: [/\S+@\S+\.\S+/, 'Por favor ingrese un correo válido'],
    },
    idRol: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'rols',
      required: true,
      index: true,  // Agregado índice
    },
    clave: {
      type: String,
      required: true,
      select: false,  // Esto asegura que la contraseña no se devuelva en las respuestas por defecto
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
          from: 'rols',  // Nombre de la colección de roles
          localField: 'idRol',
          foreignField: '_id',
          as: 'rol',
        },
      },
      {
        $unwind: '$rol',  // Solo un rol por usuario
      },
      {
        $project: {  // Excluimos la contraseña
          clave: 0,  // Excluir el campo 'clave' del resultado
        },
      },
    ]);
    return joinData;
  } catch (error) {
    console.error('Error en el uso de aggregate:', error);
    throw error;
  }
};

// Método estático para obtener un solo usuario con su rol
UsersScheme.statics.findOneData = async function (id) {
  try {
    const joinData = await this.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(id),  // Aquí agregamos 'new' a ObjectId
        },
      },
      {
        $lookup: {
          from: 'rols',  // Asegúrate de que esta colección existe
          localField: 'idRol',
          foreignField: '_id',
          as: 'rol',
        },
      },
      {
        $unwind: '$rol',  // Desenrolla el array para obtener el rol
      },
      {
        $project: {  // Excluir el campo 'clave'
          clave: 0,
        },
      }
    ]);

    // Si el array está vacío, significa que no se encontró el usuario
    if (joinData.length === 0) {
      return null;  // Si no se encuentra el usuario, devuelve null
    }

    return joinData[0];  // Devuelve el primer resultado, ya que es un solo usuario
  } catch (error) {
    console.error('Error al ejecutar aggregate:', error);
    throw error;  // Lanza el error para que sea manejado en el controlador
  }
};

// Hook para encriptar la contraseña antes de guardar
UsersScheme.pre('save', async function (next) {
  const user = this;
  if (!user.isModified('clave')) return next();  // Si la contraseña no fue modificada, seguimos

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.clave, salt);
    user.clave = hashedPassword;  // Guardamos la contraseña encriptada
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
