const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');

const VentasSchema = new mongoose.Schema(
  {
    numeroDocumento: {
      type: String,
      required: true,
    },
    tipoPago: {
      type: String,
      enum: ["Credito", "SemiCredito", "Efectivo"],  // Usar enum para restringir los valores posibles
      default: "Efectivo",  // Valor por defecto si no se especifica
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

// Plugin para el soft delete
VentasSchema.plugin(mongooseDelete, { overrideMethods: 'all', deletedAt: true });

// Crear el modelo para Ventas
const VentasModel = mongoose.models.Ventas || mongoose.model('Ventas', VentasSchema);

module.exports = VentasModel;
