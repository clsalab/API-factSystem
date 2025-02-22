const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');

const MenuRolScheme = new mongoose.Schema(
  {
    idMenu: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Menu',
      required: true,
    },
    idRol: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Rol',
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Método estático para obtener todos los MenuRol con los datos de Menu y Rol asociados
MenuRolScheme.statics.findAllData = async function () {
  try {
    const joinData = await this.aggregate([
      {
        $match: {
          deleted: { $ne: true }
        },
      },
      {
        $lookup: {
          from: 'menus', // Nombre de la colección de menús
          localField: 'idMenu',
          foreignField: '_id',
          as: 'menu',
        },
      },
      {
        $unwind: {
          path:'$menu',
        preserveNullAndEmptyArrays: true,
        }
      },
      {
        // Eliminar 'idRol' dentro de 'menu' si existe
        $unset: 'menu.idRol',
      },
      {
        $lookup: {
          from: 'rols', // Nombre de la colección de roles
          localField: 'idRol',
          foreignField: '_id',
          as: 'rol',
        },
      },
      {
        $unwind: {
          path: '$rol',
        preserveNullAndEmptyArrays: true,
        }
      },
      {
        $project: {  // Excluir campos no deseados si es necesario
          __v: 0,  // Excluir la versión del documento (_v), si no es necesario
        },
      },
    ]);
    return joinData;
  } catch (error) {
    console.error('Error en el uso de aggregate:', error);
    throw error;
  }
};

// Método estático para obtener un solo MenuRol con los datos de Menu y Rol asociados
MenuRolScheme.statics.findOneData = async function (id) {
  try {
    const joinData = await this.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(id),  // Buscar por el ID de MenuRol
          deleted: { $ne: true }
        },
      },
      {
        $lookup: {
          from: 'menus',  // Nombre de la colección de menús
          localField: 'idMenu',
          foreignField: '_id',
          as: 'menu',
        },
      },
      {
        $unwind:{
          path: '$menu',  // Desenrolla la relación con el menú
        preserveNullAndEmptyArrays: true,
        }
      },
      {
        // Eliminar 'idRol' dentro de 'menu' si existe
        $unset: 'menu.idRol',
      },
      {
        $lookup: {
          from: 'rols',  // Nombre de la colección de roles
          localField: 'idRol',
          foreignField: '_id',
          as: 'rol',
        },
      },
      {
        $unwind: {
        path:'$rol',  // Desenrolla la relación con el rol
        preserveNullAndEmptyArrays: true,
        }
      },
      {
        $project: {  // Excluir campos no deseados
          __v: 0,  // Excluir la versión del documento (_v)
        },
      },
    ]);

    // Si el array está vacío, significa que no se encontró el MenuRol
    if (joinData.length === 0) {
      return null;  // Si no se encuentra, devuelve null
    }

    return joinData[0];  // Devuelve el primer resultado
  } catch (error) {
    console.error('Error al ejecutar aggregate:', error);
    throw error;  // Lanza el error para que sea manejado en el controlador
  }
};

// Plugin para el soft delete
MenuRolScheme.plugin(mongooseDelete, { overrideMethods: 'all', deletedAt: true });

const MenuRolModel = mongoose.model('MenuRol', MenuRolScheme);

module.exports = MenuRolModel;