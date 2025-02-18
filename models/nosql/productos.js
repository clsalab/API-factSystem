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


ProductosSchema.plugin(mongooseDelete, { deletedAt: true });
const ProductosModel = mongoose.models.Productos || mongoose.model('Productos', ProductosSchema);

module.exports = ProductosModel;
