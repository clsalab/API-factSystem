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
    console.log("Ejecutando la agregación para obtener los detalles de ventas...");

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
        $unwind: {
          path: '$venta',
          preserveNullAndEmptyArrays: true,  // Si no hay relación, lo preserva vacío
        },
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
        $unwind: {
          path: '$producto',
          preserveNullAndEmptyArrays: true,  // Si no hay relación, lo preserva vacío
        },
      },
      {
        $lookup: {
          from: 'categorias',  // Nombre de la colección de categorías
          localField: 'producto.idCategoria',  // Relación con 'idCategoria' de productos
          foreignField: '_id',
          as: 'categoria',
        },
      },
      {
        $unwind: {
          path: '$categoria',
          preserveNullAndEmptyArrays: true,  // Si no hay relación, lo preserva vacío
        },
      },
      {
        $project: {  // Excluir campos no deseados si es necesario
          total: 0,  // Excluir el campo 'total' si lo deseas
        },
      },
    ]);

    console.log("Datos obtenidos con la agregación:", joinData);

    if (!joinData || joinData.length === 0) {
      console.log('No se encontraron detalles de ventas.');
    }

    return joinData;
  } catch (error) {
    console.error('Error en el uso de aggregate:', error);
    throw error;
  }
};

DetallesVentasScheme.statics.findOneData = async function (id) {
  try {
    console.log(`Buscando detalles de venta con el ID: ${id}...`);

    // Realiza la agregación para buscar los detalles de venta
    const joinData = await this.aggregate([
      {
        $match: {  // Filtro por ID
          _id: new mongoose.Types.ObjectId(id)  // Convierte el id a ObjectId si es necesario
        },
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
        $unwind: {
          path: '$venta',
          preserveNullAndEmptyArrays: true,  // Si no hay relación, lo preserva vacío
        },
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
        $unwind: {
          path: '$producto',
          preserveNullAndEmptyArrays: true,  // Si no hay relación, lo preserva vacío
        },
      },
      {
        $lookup: {
          from: 'categorias',  // Nombre de la colección de categorías
          localField: 'producto.idCategoria',  // Relación con 'idCategoria' de productos
          foreignField: '_id',
          as: 'categoria',
        },
      },
      {
        $unwind: {
          path: '$categoria',
          preserveNullAndEmptyArrays: true,  // Si no hay relación, lo preserva vacío
        },
      },
      {
        $project: {  // Excluir campos no deseados si es necesario
          total: 0,  // Excluir el campo 'total' si lo deseas
        },
      },
    ]);

    // Verificar si se encontraron resultados
    if (!joinData || joinData.length === 0) {
      console.log(`No se encontraron detalles de ventas para el ID: ${id}`);
      return null;  // Si no se encuentra el detalle de ventas, devuelve null
    }

    return joinData;
  } catch (error) {
    console.error('Error en el uso de aggregate:', error);
    throw error;
  }
};




// Plugin para el soft delete
DetallesVentasScheme.plugin(mongooseDelete, { overrideMethods: 'all', deletedAt: true });

// Crear el modelo de DetallesVentas
const DetallesVentasModel = mongoose.model('DetallesVentas', DetallesVentasScheme);

// Exportar el modelo
module.exports = DetallesVentasModel;
