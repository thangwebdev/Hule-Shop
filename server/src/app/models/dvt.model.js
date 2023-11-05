const mongoose = require('mongoose');

const dvtSchema = new mongoose.Schema(
  {
    ma_dvt: {
      type: String,
      unique: true,
    },
    ten_dvt: {
      type: String,
      index: true,
      default: '',
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
  { timestamps: true, collection: 'dvts' }
);

dvtSchema.index(
  { ma_dvt: 'text', ten_dvt: 'text' },
  { default_language: 'none' }
);

module.exports = mongoose.model('Dvt', dvtSchema);
