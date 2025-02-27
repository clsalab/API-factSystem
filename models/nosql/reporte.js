const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');

// Definir el esquema de Ventas
const ReporteSchema = new mongoose.Schema(
  {
    numeroDocumento: {
      type: String,
      required: true,
    },
    tipoPago: {
      type: String,
      enum: ['Credito', 'SemiCredito', 'Efectivo'], // Usar enum para restringir los valores posibles
      default: 'Efectivo', // Valor por defecto si no se especifica
    },
    totalVenta: {
      type: Number,
      required: true,
    },
    producto: {
      type: Number,
      required: true,
    },
    cantidad: {
      type: Number,
      required: true,
    },
    precio: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },

  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Método estático para obtener todos los detalles de ventas con los datos de Ventas, Productos y Categoria
VentasSchema.statics.findAllData = async function () {
  try {
    console.log('Ejecutando la agregación para obtener los detalles de ventas...');

    const joinData = await this.aggregate([
      {
        $match: {
          deleted: { $ne: true },
        },
      },
      {
        $lookup: {
          from: 'detallesventas', // Colección de detalles de ventas
          localField: 'idDetallesVentas', // Campo local que referencia 'detallesventas'
          foreignField: '_id', // Campo en 'detallesventas' para hacer el match
          as: 'detalles_ventas',
        },
      },
      {
        $unwind: {
          path: '$detalles_ventas', // Desenrollar el array de detalles de ventas
          preserveNullAndEmptyArrays: true, // Si no hay datos relacionados, preservarlos vacíos
        },
      },
      {
        $lookup: {
          from: 'productos', // Colección de productos
          localField: 'detalles_ventas.idProducto', // Usamos idProducto desde detalles_ventas
          foreignField: '_id', // Campo en 'productos' para hacer el match
          as: 'producto',
        },
      },
      {
        $unwind: {
          path: '$producto',
          preserveNullAndEmptyArrays: true, // Si no hay datos relacionados, preservarlos vacíos
        },
      },
      {
        $lookup: {
          from: 'categorias', // Colección de categorías
          localField: 'producto.idCategoria', // Relacionamos con el idCategoria del producto
          foreignField: '_id', // Campo en 'categorias' para hacer el match
          as: 'categoria',
        },
      },
      {
        $unwind: {
          path: '$categoria',
          preserveNullAndEmptyArrays: true, // Si no hay datos relacionados, preservarlos vacíos
        },
      },
      // Añadir la relación para traer el campo 'idVentas' dentro de 'detalles_ventas'
      {
        $lookup: {
          from: 'ventas',  // Relacionar la colección 'ventas' con 'detalles_ventas'
          localField: 'detalles_ventas.idVentas',  // Campo que hace referencia al ID de ventas
          foreignField: '_id',  // Buscar por el campo '_id' en la colección 'ventas'
          as: 'detalles_ventas_idVentas',  // Crear un nuevo campo con la relación
        },
      },
      {
        $unwind: {
          path: '$detalles_ventas_idVentas',
          preserveNullAndEmptyArrays: true,  // Si no hay datos relacionados, preservarlos vacíos
        },
      },
      {
        $project: {
          // Excluir el campo 'total' si no es necesario
          total: 0,
        },
      },
    ]);

    console.log('Datos obtenidos con la agregación:', joinData);

    if (!joinData || joinData.length === 0) {
      console.log('No se encontraron detalles de ventas.');
    }

    return joinData;
  } catch (error) {
    console.error('Error en el uso de aggregate:', error);
    throw error;
  }
};



VentasSchema.statics.findOneData = async function (ventaId) {
  try {
    console.log('Ejecutando la agregación para obtener un detalle de venta...');

    // Encontrar un único documento de ventas por su ID
    const joinData = await this.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId(ventaId), // Filtrar por el ID de la venta
          deleted: { $ne: true }, // Excluir los documentos marcados como eliminados
        },
      },
      {
        $lookup: {
          from: 'detallesventas', // Colección de detalles de ventas
          localField: 'idDetallesVentas', // Campo local que referencia 'detallesventas'
          foreignField: '_id', // Campo en 'detallesventas' para hacer el match
          as: 'detalles_ventas',
        },
      },
      {
        $unwind: {
          path: '$detalles_ventas', // Desenrollar el array de detalles de ventas
          preserveNullAndEmptyArrays: true, // Si no hay datos relacionados, preservarlos vacíos
        },
      },
      {
        $lookup: {
          from: 'productos', // Colección de productos
          localField: 'detalles_ventas.idProducto', // Usamos idProducto desde detalles_ventas
          foreignField: '_id', // Campo en 'productos' para hacer el match
          as: 'producto',
        },
      },
      {
        $unwind: {
          path: '$producto',
          preserveNullAndEmptyArrays: true, // Si no hay datos relacionados, preservarlos vacíos
        },
      },
      {
        $lookup: {
          from: 'categorias', // Colección de categorías
          localField: 'producto.idCategoria', // Relacionamos con el idCategoria del producto
          foreignField: '_id', // Campo en 'categorias' para hacer el match
          as: 'categoria',
        },
      },
      {
        $unwind: {
          path: '$categoria',
          preserveNullAndEmptyArrays: true, // Si no hay datos relacionados, preservarlos vacíos
        },
      },
      // Añadir la relación para traer el campo 'idVentas' dentro de 'detalles_ventas'
      {
        $lookup: {
          from: 'ventas',  // Relacionar la colección 'ventas' con 'detalles_ventas'
          localField: 'detalles_ventas.idVentas',  // Campo que hace referencia al ID de ventas
          foreignField: '_id',  // Buscar por el campo '_id' en la colección 'ventas'
          as: 'detalles_ventas_idVentas',  // Crear un nuevo campo con la relación
        },
      },
      {
        $unwind: {
          path: '$detalles_ventas_idVentas',
          preserveNullAndEmptyArrays: true,  // Si no hay datos relacionados, preservarlos vacíos
        },
      },
      {
        $project: {
          // Excluir el campo 'total' si no es necesario
          total: 0, // Puedes eliminar este campo si no lo necesitas
        },
      },
    ]);

    console.log('Datos obtenidos con la agregación:', joinData);

    // Si no se encuentran datos, retornar null
    if (!joinData || joinData.length === 0) {
      console.log('No se encontró el detalle de venta con ese ID.');
      return null;
    }

    // Retornar el primer resultado de la agregación (solo hay un documento debido a la búsqueda por ID)
    return joinData[0];
  } catch (error) {
    console.error('Error en el uso de aggregate:', error);
    throw error;
  }
};



// Plugin para el soft delete
VentasSchema.plugin(mongooseDelete, { overrideMethods: 'all', deletedAt: true });

// Crear el modelo para Ventas
const VentasModel = mongoose.models.Ventas || mongoose.model('Ventas', VentasSchema);

module.exports = VentasModel;
