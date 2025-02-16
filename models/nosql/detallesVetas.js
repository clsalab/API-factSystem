const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');

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

DetallesVentasScheme.plugin(mongooseDelete, { overrideMethods: 'all', deletedAt: true });
const DetallesVentasModel = mongoose.model('DetallesVentas', DetallesVentasScheme);

module.exports = DetallesVentasModel;