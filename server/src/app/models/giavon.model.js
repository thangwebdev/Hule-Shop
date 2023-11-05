const mongoose = require('mongoose');

const giavonSchema = new mongoose.Schema(
  {
    reference: {
      type: String,
      default: '',
    },
    ma_vt: {
      type: String,
      default: '',
    },
    tu_so: {
      type: Number,
      default: 0,
    },
    mau_so: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true, collection: 'gia_von' }
);

giavonSchema.index(
  { ma_dvt: 'text', ten_dvt: 'text' },
  { default_language: 'none' }
);

module.exports = mongoose.model('GiaVon', giavonSchema);
