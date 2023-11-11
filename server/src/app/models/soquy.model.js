const mongoose = require('mongoose');
const {
  generateUniqueValueUtil,
  generateTimeByDate,
} = require('../../utils/myUtil');
const createHttpError = require('http-errors');
const loaithuchiModel = require('./loaithuchi.model');

const soQuySchema = new mongoose.Schema(
  {
    ma_phieu: {
      type: String,
      unique: true,
    },
    ma_loai_thu_chi: {
      type: Number,
      default: 1,
    },
    ten_loai_thu_chi: {
      type: String,
      default: '',
    },
    color: {
      type: String,
      default: '',
    },
    reference: {
      type: String,
      default: '',
    },
    ngay_lap_phieu: {
      type: Date,
      default: null,
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
    gia_tri: {
      type: Number,
      default: 0,
    },
    tien: {
      type: Number,
      default: 0,
    },
    dien_giai: {
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
  { timestamps: true, collection: 'so_quy' }
);

// compute
const compute = async (soquy) => {
  // compute
  const loaiThuChi = await loaithuchiModel.findOne({
    ma_loai: soquy.ma_loai_thu_chi,
  });
  if (loaiThuChi) {
    soquy.color = loaiThuChi.color;
  }
  if (soquy.ma_loai_thu_chi === 1) {
    soquy.tien = soquy.gia_tri;
  } else if (soquy.ma_loai_thu_chi === 2) {
    soquy.tien = -soquy.gia_tri;
  }
  const { nam, quy, thang, ngay } = generateTimeByDate(soquy.ngay_ct);
  soquy.nam = nam;
  soquy.quy = quy;
  soquy.thang = thang;
  soquy.ngay = ngay;
};

soQuySchema.pre('save', async function (next) {
  const soquy = this;
  // create ma_phieu if it was empty
  if (!soquy.ma_phieu) {
    const maPhieu = await generateUniqueValueUtil({
      maDm: 'PTC',
      model: mongoose.model('SoQuy', soQuySchema),
      compareKey: 'ma_phieu',
    });
    soquy.ma_phieu = maPhieu;
  }
  // compute
  await compute(soquy);
  next();
});
soQuySchema.pre('updateOne', async function (next) {
  const soquy = this.getUpdate();
  // compute
  if (soquy.reference) {
    return next(
      createHttpError(
        400,
        `Phiếu '${soquy.ma_phieu}' đang liên kết với ${
          soquy.ma_loai_thu_chi === 1
            ? `phiếu bán lẻ '${soquy.reference}'`
            : `phiếu nhập kho '${soquy.reference}'`
        }`
      )
    );
  }
  await compute(soquy);
  next();
});
soQuySchema.pre('deleteMany', async function (next) {
  const filter = this.getFilter();
  const soquys = await this.model.find(filter);
  const soquyRef = soquys.find((item) => !!item.reference);
  if (soquyRef) {
    return next(
      createHttpError(
        400,
        `Phiếu '${soquyRef.ma_phieu}' đang liên kết với ${
          soquyRef.ma_loai_thu_chi === 1
            ? 'phiếu bán lẻ'
            : `phiếu nhập kho '${soquyRef.reference}'`
        }`
      )
    );
  }
});

soQuySchema.index({ ma_phieu: 'text' }, { default_language: 'none' });

module.exports = mongoose.model('SoQuy', soQuySchema);
