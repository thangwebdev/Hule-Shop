const mongoose = require('mongoose');

const kenhBanSchema = new mongoose.Schema(
  {
    ma_kenh: {
      type: String,
      unique: true,
    },
    ten_kenh: {
      type: String,
      default: '',
      index: true,
    },
    createdBy: {
      type: String,
      default: '',
    },
    updatedBy: {
      type: String,
      default: '',
    },
  },
  { timestamps: true, collection: 'kenh_ban' }
);

kenhBanSchema.index(
  { ma_kenh: 'text', ten_kenh: 'text' },
  { default_language: 'none' }
);

module.exports = mongoose.model('KenhBan', kenhBanSchema);
