const mongoose = require('mongoose');

const chitietbanleSchema = new mongoose.Schema(
  {
    ma_phieu: {
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
    gia_von: {
      type: Number,
      default: 0,
    },
    sl_xuat: {
      type: Number,
      default: 0,
    },
    tien_hang: {
      type: Number,
      default: 0,
    },
    tien_ck: {
      type: Number,
      default: 0,
    },
    chi_phi: {
      type: Number,
      default: 0,
    },
    doanh_thu: {
      type: Number,
      default: 0,
    },
    loi_nhuan: {
      type: Number,
      default: 0,
    },
    ngay: {
      type: Number,
      default: 0,
    },
    ngay_ct: {
      type: Date,
      default: new Date(),
    },
    thang: {
      type: Number,
      default: 0,
    },
    quy: {
      type: Number,
      default: 0,
    },
    nam: {
      type: Number,
      default: 0,
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
  { timestamps: true, collection: 'chi_tiet_ban_le' }
);

module.exports = mongoose.model('ChiTietBanLe', chitietbanleSchema);
