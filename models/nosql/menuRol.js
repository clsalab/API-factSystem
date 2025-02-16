const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');

const MenuRolScheme = new mongoose.Schema(
  {


    idMenu: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Menu',
      required: true,
    },
    idRol: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Rol',
      required: true,
    },


  },
  {
    timestamps: true,
    versionKey: false,
  }
);


MenuRolScheme.plugin(mongooseDelete, { overrideMethods: 'all', deletedAt: true });
const MenuRolModel = mongoose.model('MenuRol', MenuRolScheme);

module.exports = MenuRolModel;