const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');

const ProductosSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  idCategoria: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Categorias',
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  precio: {
    type: Number,
    required: true,
  },
  esActivo: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
  versionKey: false,
});

// Método estático para obtener todos los productos con sus categorías
ProductosSchema.statics.findAllData = async function () {
  try {
    const joinData = await this.aggregate([
      {
        $lookup: {
          from: 'categorias', // Nombre de la colección de categorías
          localField: 'idCategoria',
          foreignField: '_id',
          as: 'categoria',
        },
      },
      {
        $unwind: '$categoria', // Desenrolla el array de categorías
      },
      {
        $project: {
          __v: 0,  // Excluir el campo __v si no lo necesitas
        },
      },
    ]);

    return joinData;
  } catch (error) {
    console.error('Error al obtener productos:', error);
    throw error;
  }
};

// Método estático para obtener un producto por ID con su categoría
ProductosSchema.statics.findOneData = async function (id) {
  try {
    const joinData = await this.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(id),  // Buscar el producto por su ID
        },
      },
      {
        $lookup: {
          from: 'categorias', // Nombre de la colección de categorías
          localField: 'idCategoria',
          foreignField: '_id',
          as: 'categoria',
        },
      },
      {
        $unwind: '$categoria', // Desenrolla el array de categorías
      },
      {
        $project: {
          __v: 0,  // Excluir el campo __v si no lo necesitas
        },
      },
    ]);

    // Si el array está vacío, significa que no se encontró el producto
    if (joinData.length === 0) {
      return null;
    }

    return joinData[0];  // Retorna el primer resultado (solo debe haber uno)
  } catch (error) {
    console.error('Error al obtener producto por ID:', error);
    throw error;
  }
};

// Plugin para el soft delete
ProductosSchema.plugin(mongooseDelete, { deletedAt: true });

// Crear el modelo de Productos
const ProductosModel = mongoose.models.Productos || mongoose.model('Productos', ProductosSchema);

module.exports = ProductosModel;
