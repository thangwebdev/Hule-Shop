const mongoose = require('mongoose');
const { generateUniqueValueUtil } = require('../../utils/myUtil');
const productModel = require('./product.model');
const createHttpError = require('http-errors');

const pkkSchema = new mongoose.Schema(
  {
    ma_phieu: {
      type: String,
      unique: true,
    },
    ma_ct: {
      type: String,
      default: 'pkk',
    },
    ngay_lap_phieu: {
      type: Date,
      default: null,
    },
    ngay_ct: {
      type: Date,
      default: null,
    },
    ma_trang_thai: {
      type: Number,
      default: 1,
    },
    ten_trang_thai: {
      type: String,
      default: '',
    },
    color: {
      type: String,
      default: '',
    },
    dien_giai: {
      type: String,
      default: '',
    },
    details: {
      type: [
        {
          ma_vt: String,
          ten_vt: String,
          ma_dvt: String,
          ten_dvt: String,
          sl_so_sach: Number,
          sl_thuc_te: Number,
          chenh_lech: Number,
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
  { timestamps: true, collection: 'phieu_kiem_kho' }
);

// compute chenh lech
const computeChenhLech = async (pkk) => {
  for (let i = 0; i < pkk.details.length; i++) {
    const detail = pkk.details[i];
    const product = await productModel.findOne({ ma_vt: detail.ma_vt });
    if (!product) {
      return next(
        createHttpError(404, `Hàng hóa '${detail.ma_vt}' không tồn t`)
      );
    }
    detail.ten_vt = product.ten_vt;
    detail.ten_dvt = product.ten_dvt;
    detail.ma_dvt = product.ma_dvt;
    detail.sl_so_sach = product.ton_kho;
    detail.chenh_lech = Math.abs(
      (detail.sl_so_sach || 0) - (detail.sl_thuc_te || 0)
    );
  }
};

// save info
const saveInfo = async (pkk) => {
  for (let i = 0; i < pkk.details.length; i++) {
    const detail = pkk.details[i];
    await productModel.updateOne({
      ma_vt: detail.ma_vt,
      ton_kho: detail.sl_thuc_te,
    });
  }
};
// revert info
const revertInfo = async (pkk) => {
  for (let i = 0; i < pkk.details.length; i++) {
    const detail = pkk.details[i];
    const isIncrease =
      detail.sl_so_sach - detail.sl_thuc_te >= 0 ? false : true;
    if (detail.chenh_lech !== 0) {
      await productModel.updateOne({
        ma_vt: detail.ma_vt,
        ton_kho: isIncrease
          ? (detail.sl_thuc_te || 0) - (detail.chenh_lech || 0)
          : (detail.sl_thuc_te || 0) + (detail.chenh_lech || 0),
      });
    }
  }
};

pkkSchema.pre('save', async function (next) {
  const pkk = this;
  // create ma_phieu if it was empty
  if (!pkk.ma_phieu) {
    const maPhieu = await generateUniqueValueUtil({
      maDm: 'PKK',
      model: mongoose.model('PhieuKiemKho', pkkSchema),
      compareKey: 'ma_phieu',
    });
    pkk.ma_phieu = maPhieu;
  }
  // compute chench lech
  await computeChenhLech(pkk);
  next();
});

pkkSchema.post('save', async function () {
  const pkk = this;
  if (pkk.ma_trang_thai === 3) {
    await saveInfo(pkk);
  }
});

pkkSchema.pre('updateOne', async function (next) {
  const filter = this.getFilter();
  const pkk = this.getUpdate();
  const pkkOld = await this.model.findOne(filter);

  // compute chenh lech
  await computeChenhLech(pkk);
  // luu vao kho neu trang thai thay doi
  if (pkkOld.ma_trang_thai !== pkk.ma_trang_thai) {
    if (pkk.ma_trang_thai === 3 && pkkOld.ma_trang_thai !== 3) {
      await saveInfo(pkk);
    } else if (pkk.ma_trang_thai !== 3 && pkkOld.ma_trang_thai === 3) {
      await revertInfo(pkkOld);
    }
  } else if (pkk.ma_trang_thai === 3 && pkkOld.ma_trang_thai === 3) {
    return next(createHttpError(400, 'Không thể sửa phiếu đã lưu sổ'));
  }
  next();
});

pkkSchema.pre('deleteMany', async function (next) {
  const filter = this.getFilter();
  const pkks = await this.model.find(filter);
  const valid = pkks.every((item) => item.ma_trang_thai === 4);
  if (!valid) {
    return next(createHttpError(400, 'Hủy phiếu trước khi xóa'));
  } else {
    next();
  }
});

pkkSchema.index({ ma_phieu: 'text' }, { default_language: 'none' });

module.exports = mongoose.model('PhieuKiemKho', pkkSchema);
