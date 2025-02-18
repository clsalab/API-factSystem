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

const RolModel = mongoose.models.Rol || mongoose.model('Rol', RolSchema );

module.exports = RolModel;
