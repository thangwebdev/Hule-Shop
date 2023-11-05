const mongoose = require('mongoose');

const soKhoSchema = new mongoose.Schema(
  {
    reference: {
      type: String,
      default: '',
    },
    ma_vt: {
      type: String,
      default: '',
    },
    ten_vt: {
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
    sl_nhap: {
      type: Number,
      default: 0,
    },
    sl_xuat: {
      type: Number,
      default: 0,
    },
    sl: {
      type: Number,
      default: 0,
    },
    ngay_ct: {
      type: Date,
      default: null,
    },
    nam: {
      type: Number,
      default: 0,
    },
    quy: {
      type: Number,
      default: 0,
    },
    thang: {
      type: Number,
      default: 0,
    },
    ngay: {
      type: Number,
      default: 0,
    },
    gio: {
      type: Number,
      default: 0,
    },
    phut: {
      type: Number,
      default: 0,
    },
    giay: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true, collection: 'sokho' }
);

module.exports = mongoose.model('SoKho', soKhoSchema);
