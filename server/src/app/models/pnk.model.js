const mongoose = require('mongoose');
const createError = require('http-errors');
const { generateUniqueValueUtil } = require('../../utils/myUtil');
const productModel = require('../models/product.model');
const giavonModel = require('./giavon.model');
const loaithuchiModel = require('./loaithuchi.model');
const soquyModel = require('./soquy.model');
/*
- Khi sửa (không được sửa details) cần sửa sổ kho
 */

const phieuNhapKhoSchema = new mongoose.Schema(
  {
    ma_phieu: {
      type: String,
      unique: true,
    },
    ma_ct: {
      type: String,
      default: 'pnk',
    },
    ten_loai_ct: {
      type: String,
      default: 'Phiếu nhập kho',
    },
    ngay_ct: {
      type: Date,
      default: new Date(),
    },
    ngay_nhap_hang: {
      type: Date,
      default: new Date(),
    },
    tong_tien_nhap: {
      type: Number,
      default: 0,
    },
    dien_giai: {
      type: String,
      default: '',
    },
    ma_trang_thai: {
      type: Number,
      default: 1,
    },
    ten_trang_thai: {
      type: String,
      default: 'Khởi tạo',
    },
    color: { type: String, default: '' },
    details: {
      type: [
        {
          gia_von: {
            type: Number,
            default: 0,
          },
          ma_dvt: {
            type: String,
            default: '',
          },
          ten_dvt: {
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
          sl_nhap: {
            type: Number,
            default: 0,
          },
          tien_nhap: {
            type: Number,
            default: 0,
          },
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
  { timestamps: true, collection: 'phieu_nhap_kho' }
);

// fuctions
const caculateGiaVon = ({ tonKho = 0, MAC = 0, nhapKho = 0, giaVon = 0 }) => {
  tonKho = tonKho >= 0 ? tonKho : 0;
  const newMAC = (tonKho * MAC + nhapKho * giaVon) / (tonKho + nhapKho);
  return Math.round(newMAC);
};
const computeTienNhap = (pnk) => {
  pnk.tong_tien_nhap = pnk.details.reduce((acc, item) => {
    return acc + item.gia_von * item.sl_nhap;
  }, 0);
};
const saveInfo = async (pnk) => {
  for (let i = 0; i < pnk.details.length; i++) {
    const detail = pnk.details[i];
    const product = await productModel.findOne({ ma_vt: detail.ma_vt });

    const MAC = caculateGiaVon({
      tonKho: product.ton_kho || 0,
      MAC: product.gia_von || 0,
      nhapKho: detail.sl_nhap || 0,
      giaVon: detail.gia_von || 0,
    });
    await giavonModel.create({
      reference: pnk.ma_phieu,
      ma_vt: detail.ma_vt,
      tu_so: detail.gia_von * detail.sl_nhap,
      mau_so: detail.sl_nhap,
    });
    // update gia von
    await productModel.updateOne(
      { ma_vt: product.ma_vt },
      {
        ton_kho: (product.ton_kho >= 0 ? product.ton_kho : 0) + detail.sl_nhap,
        gia_von: MAC,
      }
    );
    // tao phieu chi
    const loaiPhieu = await loaithuchiModel.findOne({ ma_loai: 2 });
    await soquyModel.create({
      ma_loai_thu_chi: loaiPhieu.ma_loai,
      ten_loai_thu_chi: loaiPhieu.ten_loai,
      color: loaiPhieu.color,
      reference: pnk.ma_phieu,
      ngay_lap_phieu: pnk.ngay_ct,
      ngay_ct: pnk.ngay_ct,
      gia_tri: pnk.tong_tien_nhap,
      dien_giai: 'Phiếu chi được tạo tự động khi nhập kho',
    });
  }
};
const revertInfo = async (pnk) => {
  for (let i = 0; i < pnk.details.length; i++) {
    const detail = pnk.details[i];
    const product = await productModel.findOne({ ma_vt: detail.ma_vt });

    await giavonModel.deleteOne({
      reference: pnk.ma_phieu,
      ma_vt: detail.ma_vt,
    });
    const result = await giavonModel.aggregate([
      {
        $match: { ma_vt: detail.ma_vt },
      },
      {
        $group: {
          _id: null,
          tong_tu_so: { $sum: '$tu_so' },
          tong_mau_so: { $sum: '$mau_so' },
        },
      },
    ]);
    await productModel.updateOne(
      { ma_vt: detail.ma_vt },
      {
        ton_kho: product.ton_kho - detail.sl_nhap,
        gia_von: Math.round(
          (result[0]?.tong_tu_so || 0) / (result[0]?.tong_mau_so || 1)
        ),
      }
    );
    // xoa phieu chi
    await soquyModel.deleteOne({ reference: pnk.ma_phieu });
  }
};

phieuNhapKhoSchema.pre('save', async function (next) {
  const pnk = this;
  // create ma_phieu if it was empty
  if (!pnk.ma_phieu) {
    const maPhieu = await generateUniqueValueUtil({
      maDm: 'PNK',
      model: mongoose.model('PhieuNhapKho', phieuNhapKhoSchema),
      compareKey: 'ma_phieu',
    });
    pnk.ma_phieu = maPhieu;
  }
  // compute tien_nhap
  computeTienNhap(pnk);
  next();
});

phieuNhapKhoSchema.post('save', async function () {
  const pnk = this;
  // luu vao kho
  if (pnk.ma_trang_thai === 3) {
    await saveInfo(pnk);
  }
});
phieuNhapKhoSchema.pre('updateOne', async function (next) {
  const pnk = this.getUpdate();
  const filter = this.getFilter();
  const pnkOld = await this.model.findOne(filter);
  // compute tien_nhap
  computeTienNhap(pnk);
  // luu vao kho neu trang thai thay doi
  if (pnkOld.ma_trang_thai !== pnk.ma_trang_thai) {
    if (pnk.ma_trang_thai === 3 && pnkOld.ma_trang_thai !== 3) {
      await saveInfo(pnk);
    } else if (pnk.ma_trang_thai !== 3 && pnkOld.ma_trang_thai === 3) {
      await revertInfo(pnkOld);
    }
  } else if (pnk.ma_trang_thai === 3 && pnkOld.ma_trang_thai === 3) {
    return next(createError(400, 'Không thể sửa phiếu đã lưu sổ'));
  }
  next();
});

phieuNhapKhoSchema.pre('deleteMany', async function (next) {
  const filter = this.getFilter();
  const pnks = await this.model.find(filter);
  const valid = pnks.every((item) => item.ma_trang_thai === 4);
  if (!valid) {
    return next(createError(400, 'Hủy phiếu trước khi xóa'));
  } else {
    next();
  }
});

phieuNhapKhoSchema.index({ ma_phieu: 'text' }, { default_language: 'none' });

module.exports = mongoose.model('PhieuNhapKho', phieuNhapKhoSchema);
