const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');

const MenuScheme = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true
    },
    idRol: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Rol',
      required: true,
    },
    icono: {
      type: String

    },
    url: {
      type: String,
      required: true
    },

  },
  {
    timestamps: true,
    versionKey: false,
  }
);

MenuScheme.plugin(mongooseDelete, { overrideMethods: 'all', deletedAt: true });
const MenuModel = mongoose.model('Menu', MenuScheme);

module.exports = MenuModel;