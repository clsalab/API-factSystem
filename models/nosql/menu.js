const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');

const MenuScheme = new mongoose.Schema(
  {
    nombre: {
      type: String,
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

// Plugin para el soft delete
MenuScheme.plugin(mongooseDelete, { overrideMethods: 'all', deletedAt: true });

const MenuModel = mongoose.model('Menu', MenuScheme);

module.exports = MenuModel;
