const mongoose = require('mongoose');
const createError = require('http-errors');
const { generateUniqueValueUtil } = require('../../utils/myUtil');
const productModel = require('./product.model');

const phieuXuatKhoSchema = new mongoose.Schema(
  {
    ma_phieu: {
      type: String,
      unique: true,
    },
    ma_ct: {
      type: String,
      default: 'pxk',
    },
    ten_loai_ct: {
      type: String,
      default: 'Phiếu xuất kho',
    },
    ngay_ct: {
      type: Date,
      default: new Date(),
    },
    ngay_xuat_hang: {
      type: Date,
      default: new Date(),
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
          sl_xuat: {
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
  { timestamps: true, collection: 'phieu_xuat_kho' }
);

const saveInfo = async (pxk) => {
  for (let i = 0; i < pxk.details.length; i++) {
    const detail = pxk.details[i];
    const product = await productModel.findOne({ ma_vt: detail.ma_vt });
    await productModel.updateOne(
      { ma_vt: detail.ma_vt },
      { ton_kho: (product.ton_kho || 0) - (detail.sl_xuat || 0) }
    );
  }
};
const revertInfo = async (pxk) => {
  for (let i = 0; i < pxk.details.length; i++) {
    const detail = pxk.details[i];
    const product = await productModel.findOne({ ma_vt: detail.ma_vt });
    await productModel.updateOne(
      { ma_vt: detail.ma_vt },
      { ton_kho: product.ton_kho + detail.sl_xuat }
    );
  }
};

phieuXuatKhoSchema.pre('save', async function (next) {
  const pxk = this;
  // create ma_phieu if it was empty
  if (!pxk.ma_phieu) {
    const maPhieu = await generateUniqueValueUtil({
      maDm: 'PXK',
      model: mongoose.model('PhieuXuatKho', phieuXuatKhoSchema),
      compareKey: 'ma_phieu',
    });
    pxk.ma_phieu = maPhieu;
  }
  next();
});
phieuXuatKhoSchema.post('save', async function () {
  const pxk = this;
  if (pxk.ma_trang_thai === 3) {
    await saveInfo(pxk);
  }
});
phieuXuatKhoSchema.pre('updateOne', async function (next) {
  const filter = this.getFilter();
  const pxk = this.getUpdate();
  const pxkOld = await this.model.findOne(filter);

  if (pxk.ma_trang_thai !== pxkOld.ma_trang_thai) {
    if (pxk.ma_trang_thai === 3 && pxkOld.ma_trang_thai !== 3) {
      await saveInfo(pxk);
    } else if (pxk.ma_trang_thai !== 3 && pxkOld.ma_trang_thai === 3) {
      await revertInfo(pxkOld);
    }
  } else if (pxk.ma_trang_thai === 3 && pxkOld.ma_trang_thai === 3) {
    return next(createError(400, 'Không thể sửa phiếu đã lưu sổ'));
  }
  next();
});
phieuXuatKhoSchema.pre('deleteMany', async function (next) {
  const filter = this.getFilter();
  const pxks = await this.model.find(filter);
  const valid = pxks.every((item) => item.ma_trang_thai === 4);
  if (!valid) {
    return next(createError(400, 'Hủy phiếu trước khi xóa'));
  } else {
    next();
  }
});

phieuXuatKhoSchema.index({ ma_phieu: 'text' }, { default_language: 'none' });

module.exports = mongoose.model('PhieuXuatKho', phieuXuatKhoSchema);
