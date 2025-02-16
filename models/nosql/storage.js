const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');

const StorageScheme = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true
    },
    filename: {
      type: String,
    },


  },
  {
    timestamps: true,
    versionKey: false,
  }
);

StorageScheme.plugin(mongooseDelete, { deletedAt: true, overrideMethods: 'all' });
const StorageModel = mongoose.model('Storage', StorageScheme);

module.exports = StorageModel;