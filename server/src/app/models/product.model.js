const mongoose = require('mongoose');
const { generateUniqueValueUtil } = require('../../utils/myUtil');
const giavonModel = require('./giavon.model');

const productSchema = new mongoose.Schema(
  {
    ma_vt: {
      type: String,
      unique: true,
    },
    ten_vt: {
      type: String,
      index: true,
    },
    ma_dvt: {
      type: String,
      default: '',
    },
    ten_dvt: {
      type: String,
      default: '',
    },
    ma_dvt: {
      type: String,
      default: '',
    },
    ten_dvt: {
      type: String,
      default: '',
    },
    gia_ban_le: {
      type: Number,
      default: 0,
    },
    gia_von: {
      type: Number,
      default: 0,
    },
    ton_kho_ban_dau: {
      type: Number,
      default: 0,
    },
    ton_kho: {
      type: Number,
      default: 0,
    },
    la_sp_sx: {
      type: Boolean,
      default: false,
    },
    hinh_anh1: {
      type: String,
      default: '',
    },
    hinh_anh2: {
      type: String,
      default: '',
    },
    hinh_anh3: {
      type: String,
      default: '',
    },
    ds_dvt: {
      type: [
        {
          ma_dvt: String,
          ten_dvt: String,
          sl_quy_doi: Number,
          gia_ban_qd: Number,
        },
      ],
      default: [],
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
  { timestamps: true, collection: 'products' }
);

productSchema.pre('save', async function (next) {
  const product = this;
  if (!product.ma_vt) {
    const maVt = await generateUniqueValueUtil({
      maDm: 'SP',
      model: mongoose.model('Product', productSchema),
      compareKey: 'ma_vt',
    });
    product.ma_vt = maVt;
  }
  if (product.isNew && product.ton_kho_ban_dau > 0) {
    product.ton_kho = product.ton_kho_ban_dau;
    await giavonModel.create({
      reference: product.ma_vt,
      ma_vt: product.ma_vt,
      tu_so: product.gia_von * product.ton_kho,
      mau_so: product.ton_kho,
    });
  }
  next();
});

productSchema.index(
  { ma_vt: 'text', ten_vt: 'text' },
  { default_language: 'none' }
);

module.exports = mongoose.model('Product', productSchema);
