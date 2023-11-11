const mongoose = require('mongoose');

const loaiThuChiSchema = new mongoose.Schema(
  {
    ma_loai: {
      type: Number,
      unique: true,
    },
    ten_loai: {
      type: String,
      index: true,
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
  { timestamps: true, collection: 'loai_thu_chi' }
);

loaiThuChiSchema.index(
  { ma_loai: 'text', ten_loai: 'text' },
  { default_language: 'none' }
);

module.exports = mongoose.model('LoaiThuChi', loaiThuChiSchema);
