const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');

const VentasScheme = new mongoose.Schema(
  {
    numeroDocumento: {
      type: String,
      required: true
    },
    tipoPago: {
      type: ["Credito", "SemiCredito","Efectivo"],
      default: "Efectivo",

    },
    total: {
      type: Number,
      required: true
    },

  },
  {
    timestamps: true,
    versionKey: false,
  }
);

VentasScheme.plugin(mongooseDelete, { overrideMethods: 'all', deletedAt: true });
const VentasModel = mongoose.model('Ventas', VentasScheme);

module.exports = VentasModel;