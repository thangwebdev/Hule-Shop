const { default: mongoose } = require('mongoose');

const trangThaiSchema = new mongoose.Schema(
  {
    ma_trang_thai: {
      type: Number,
    },
    ten_trang_thai: {
      type: String,
      default: '',
    },
    ma_ct: {
      type: String,
      default: '',
    },
    color: {
      type: String,
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
  { timestamps: true, collection: 'trang_thais' }
);

trangThaiSchema.index(
  { ma_trang_thai: 'text', ten_trang_thai: 'text' },
  { default_language: 'none' }
);

module.exports = mongoose.model('Trangthai', trangThaiSchema);
