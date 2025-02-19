const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');

const MenuScheme = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
    },
    idRol: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Rol',  // Asegúrate que el nombre de la colección de Rol sea correcto
      required: true,
    },
    icono: {
      type: String,
    },
    url: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Método estático para obtener todos los menús con su rol asociado
MenuScheme.statics.findAllData = async function () {
  try {
    const joinData = await this.aggregate([
      {
        $lookup: {
          from: 'rols', // Nombre de la colección de roles
          localField: 'idRol',
          foreignField: '_id',
          as: 'rol',
        },
      },
      {
        $unwind: '$rol',
      },
      {
        $project: {  // Excluir campos no deseados, por ejemplo, icono o url
          __v: 0,  // Excluir la versión del documento (_v), si no es necesario
          // Excluir otros campos si lo deseas
        },
      },
    ]);
    return joinData;
  } catch (error) {
    console.error('Error en el uso de aggregate:', error);
    throw error;
  }
};

// Método estático para obtener un solo menú con su rol asociado
MenuScheme.statics.findOneData = async function (id) {
  try {
    const joinData = await this.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(id),  // Buscar por el ID del menú
        },
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
        $unwind: '$rol',  // Desenrolla la relación con el rol
      },
      {
        $project: {  // Excluir campos no deseados
          __v: 0,  // Excluir la versión del documento (_v)
          // Excluir otros campos si lo deseas
        },
      },
    ]);

    // Si el array está vacío, significa que no se encontró el menú
    if (joinData.length === 0) {
      return null;  // Si no se encuentra el menú, devuelve null
    }

    return joinData[0];  // Devuelve el primer resultado (solo uno, ya que estamos buscando por ID)
  } catch (error) {
    console.error('Error al ejecutar aggregate:', error);
    throw error;  // Lanza el error para que sea manejado en el controlador
  }
};

// Plugin para el soft delete
MenuScheme.plugin(mongooseDelete, { overrideMethods: 'all', deletedAt: true });

const MenuModel = mongoose.model('Menu', MenuScheme);

module.exports = MenuModel;
