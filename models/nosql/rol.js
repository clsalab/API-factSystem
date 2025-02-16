const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');

const RolSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
}, {
  timestamps: true,
  versionKey: false,
});
RolSchema.plugin(mongooseDelete, { overrideMethods: 'all', deletedAt: true });

// Verificar si el modelo ya está definido antes de crearlo
const RolModel = mongoose.models.Rol || mongoose.model('Rol', RolSchema);

module.exports = RolModel;
