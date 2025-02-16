const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');

const NumeroDocumentoScheme = new mongoose.Schema(
  {
    ultimoNumero: {
      type: Number,
    },

  },
  {
    timestamps: true,
    versionKey: false,
  }
);

NumeroDocumentoScheme.plugin(mongooseDelete, { deletedAt: true });  // Enable soft delete

const NumeroDocumentoModel = mongoose.model('NumeroDocumento', NumeroDocumentoScheme);

module.exports = NumeroDocumentoModel;