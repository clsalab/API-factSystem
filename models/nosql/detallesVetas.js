const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');

// Definir el esquema de DetallesVentas
const DetallesVentasScheme = new mongoose.Schema(
  {
    idVentas: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ventas',
      required: true,
    },
    idProducto: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Productos',
      required: true,
    },
    cantidad: {
      type: Number,
      required: true,
    },
    precioUnitario: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Método estático para obtener todos los detalles de ventas con los datos de Ventas, Productos y Categoria
DetallesVentasScheme.statics.findAllData = async function () {
  try {
    const joinData = await this.aggregate([
      {
        $lookup: {
          from: 'ventas',  // Nombre de la colección de ventas
          localField: 'idVentas',
          foreignField: '_id',
          as: 'venta',
        },
      },
      {
        $unwind: '$venta',  // Desenrolla la relación de ventas
      },
      {
        $lookup: {
          from: 'productos',  // Nombre de la colección de productos
          localField: 'idProducto',
          foreignField: '_id',
          as: 'producto',
        },
      },
      {
        $unwind: '$producto',  // Desenrolla la relación de productos
      },
      {
        $lookup: {
          from: 'categorias',  // Nombre de la colección de categorías
          localField: 'producto.idCategoria',  // El campo idCategoria dentro del objeto producto
          foreignField: '_id',
          as: 'categoria',  // El nombre del campo que contendrá los datos de la categoría
        },
      },
      {
        $unwind: '$categoria',  // Desenrolla la relación de categorías
      },
      {
        $project: {  // Excluir campos no deseados si es necesario
          total: 0,  // Excluir el campo 'total' si lo deseas
        },
      },
    ]);
    return joinData;
  } catch (error) {
    console.error('Error en el uso de aggregate:', error);
    throw error;
  }
};

// Método estático para obtener un detalle de venta por ID con los datos de Ventas, Productos y Categoria
DetallesVentasScheme.statics.findOneData = async function (id) {
  try {
    const joinData = await this.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(id) },  // Buscar por el ID del detalle de venta
      },
      {
        $lookup: {
          from: 'ventas',  // Nombre de la colección de ventas
          localField: 'idVentas',
          foreignField: '_id',
          as: 'venta',
        },
      },
      {
        $unwind: '$venta',  // Desenrolla la relación de ventas
      },
      {
        $lookup: {
          from: 'productos',  // Nombre de la colección de productos
          localField: 'idProducto',
          foreignField: '_id',
          as: 'producto',
        },
      },
      {
        $unwind: '$producto',  // Desenrolla la relación de productos
      },
      {
        $lookup: {
          from: 'categorias',  // Nombre de la colección de categorías
          localField: 'producto.idCategoria',  // El campo idCategoria dentro del objeto producto
          foreignField: '_id',
          as: 'categoria',  // El nombre del campo que contendrá los datos de la categoría
        },
      },
      {
        $unwind: '$categoria',  // Desenrolla la relación de categorías
      },
      {
        $project: {  // Excluir campos no deseados si es necesario
          total: 0,  // Excluir el campo 'total' si lo deseas
        },
      },
    ]);

    // Si el array está vacío, significa que no se encontró el detalle
    if (joinData.length === 0) {
      return null;  // Si no se encuentra el detalle, devuelve null
    }

    return joinData[0];  // Retorna el primer resultado
  } catch (error) {
    console.error('Error al ejecutar aggregate:', error);
    throw error;  // Lanza el error para ser manejado en el controlador
  }
};

// Plugin para el soft delete
DetallesVentasScheme.plugin(mongooseDelete, { overrideMethods: 'all', deletedAt: true });

// Crear el modelo de DetallesVentas
const DetallesVentasModel = mongoose.model('DetallesVentas', DetallesVentasScheme);

// Exportar el modelo
module.exports = DetallesVentasModel;
