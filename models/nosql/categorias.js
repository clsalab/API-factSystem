const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');


const CategoriasScheme = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true
    },
    esActivo: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);


CategoriasScheme.plugin(mongooseDelete, { overrideMethods: 'all', deletedAt: true });
const CategoriasModel = mongoose.model('Categorias', CategoriasScheme);

module.exports = CategoriasModel;
