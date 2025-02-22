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
      ref: 'Rol',
      required: true,
      index: true,
    },
    idMenuRol: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MenuRol',
      required: true,
      index: true,
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

// Método estático para obtener todos los usuarios con su rol y menú
UsersScheme.statics.findAllData = async function () {
  try {
    const joinData = await this.aggregate([
      {
        $match: { deleted: { $ne: true } },
      },
      {
        $lookup: {
          from: 'rols',
          localField: 'idRol',
          foreignField: '_id',
          as: 'rol',
        },
      },
      {
        $unwind: {
          path: '$rol',
          preserveNullAndEmptyArrays: true, // 🔹 Asegura que no se pierdan usuarios sin rol
        },
      },
      {
        $lookup: {
          from: 'menurols',
          localField: 'idMenuRol',
          foreignField: '_id',
          as: 'menuRol',
        },
      },
      {
        $unwind: {
          path: '$menuRol',
          preserveNullAndEmptyArrays: true, // 🔹 Evita que se pierdan usuarios sin menú asignado
        },
      },
      {
        $lookup: {
          from: 'menus',
          localField: 'menuRol.idMenu',
          foreignField: '_id',
          as: 'menuRol.menu',
        },
      },
      {
        $unwind: {
          path: '$menuRol.menu',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'rols',
          localField: 'menuRol.menu.idRol',
          foreignField: '_id',
          as: 'menuRol.menu.rol',
        },
      },
      {
        $unwind: {
          path: '$menuRol.menu.rol',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'rols',
          localField: 'menuRol.idRol',
          foreignField: '_id',
          as: 'menuRol.rol',
        },
      },
      {
        $unwind: {
          path: '$menuRol.rol',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          clave: 0, // 🔹 Ocultamos la clave del usuario
          'menuRol.idMenu': 0,
          'menuRol.idRol': 0,
          'menuRol.menu.idRol': 0,
        },
      },
    ]);

    return joinData;
  } catch (error) {
    console.error('Error en findAllData:', error);
    throw error;
  }
};



// Método para obtener un usuario con su rol y menú
UsersScheme.statics.findOneData = async function (id) {
  try {
    const joinData = await this.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(id),
          deleted: { $ne: true },
        },
      },
      {
        $lookup: {
          from: 'rols',
          localField: 'idRol',
          foreignField: '_id',
          as: 'rol',
        },
      },
      {
        $unwind: {
          path: '$rol',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'menurols',
          localField: 'idMenuRol',
          foreignField: '_id',
          as: 'menuRol',
        },
      },
      {
        $unwind: {
          path: '$menuRol',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'menus',
          localField: 'menuRol.idMenu',
          foreignField: '_id',
          as: 'menuRol.menu',
        },
      },
      {
        $unwind: {
          path: '$menuRol.menu',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'rols',
          localField: 'menuRol.menu.idRol',
          foreignField: '_id',
          as: 'menuRol.menu.rol',
        },
      },
      {
        $unwind: {
          path: '$menuRol.menu.rol',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'rols',
          localField: 'menuRol.idRol',
          foreignField: '_id',
          as: 'menuRol.rol',
        },
      },
      {
        $unwind: {
          path: '$menuRol.rol',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          clave: 0,
          'menuRol.idMenu': 0,
          'menuRol.idRol': 0,
          'menuRol.menu.idRol': 0,
        },
      },
    ]);

    return joinData.length > 0 ? joinData[0] : null;
  } catch (error) {
    console.error('Error en findOneData:', error);
    throw error;
  }
};



// Hook para encriptar la contraseña antes de guardar
UsersScheme.pre('save', async function (next) {
  const user = this;
  if (!user.isModified('clave')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    user.clave = await bcrypt.hash(user.clave, salt);
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
