const mongoose = require('mongoose');
const {
  generateUniqueValueUtil,
  generateTimeByDate,
} = require('../../utils/myUtil');
const productModel = require('./product.model');
const createHttpError = require('http-errors');
const trangthaiModel = require('./trangthai.model');
const chitietbanleModel = require('./chitietbanle.model');

const pblSchema = new mongoose.Schema(
  {
    ma_phieu: {
      type: String,
      unique: true,
    },
    ma_ct: {
      type: String,
      default: 'pbl',
    },
    ten_loai_ct: {
      type: String,
      default: 'Phiếu bán lẻ',
    },
    ngay_ct: {
      type: Date,
      default: new Date(),
    },
    ngay_lap_phieu: {
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
      default: 'Đang có khách',
    },
    color: {
      type: String,
      default: '',
    },
    ma_kenh: {
      type: String,
      default: '',
    },
    ten_kenh: {
      type: String,
      default: '',
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
    details: {
      type: [
        {
          ma_vt: String,
          ten_vt: String,
          ma_dvt: String,
          ten_dvt: String,
          dien_giai: String,
          sl_xuat: Number,
          gia_ban_le: Number,
          don_gia: Number,
          gia_von: Number,
          chi_phi: Number,
          tien_hang: Number,
          tien_ck: Number,
          ty_le_ck: Number,
          t_tien: Number,
          dien_giai: String,
        },
      ],
      default: [],
    },
    t_tien_hang: {
      type: Number,
      default: 0,
    },
    t_chi_phi: {
      type: Number,
      default: 0,
    },
    tien_ck_hd: {
      type: Number,
      default: 0,
    },
    ty_le_ck_hd: {
      type: Number,
      default: 0,
    },
    tien_ck_sp: {
      type: Number,
      default: 0,
    },
    t_tien_ck: {
      type: Number,
      default: 0,
    },
    t_chi_phi: {
      type: Number,
      default: 0,
    },
    tien_van_chuyen: {
      type: Number,
      default: 0,
    },
    chi_phi_khac: {
      type: Number,
      default: 0,
    },
    t_tt: {
      type: Number,
      default: 0,
    },
    tien_thu: {
      type: Number,
      default: 0,
    },
    tien_thoi: {
      type: Number,
      default: 0,
    },
    phi_nen_tang: {
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
    createdBy: {
      type: String,
      default: '',
    },
    updatedBy: {
      type: String,
      default: '',
    },
  },
  { timestamps: true, collection: 'phieu_ban_le' }
);

const saveInfo = async (pbl) => {
  for (let i = 0; i < pbl.details.length; i++) {
    const detail = pbl.details[i];
    const product = await productModel.findOne({ ma_vt: detail.ma_vt });
    let slXuat = detail.sl_xuat;
    if (product.ma_dvt !== detail.ma_dvt) {
      const dvtObj = product.ds_dvt.find((dvt) => dvt.ma_dvt === detail.ma_dvt);
      if (dvtObj) {
        slXuat = dvtObj.sl_quy_doi;
      }
    }
    if (!product?.la_sp_sx) {
      await productModel.updateOne(
        { ma_vt: detail.ma_vt },
        { ton_kho: (product.ton_kho || 0) - (slXuat || 0) }
      );
    }
    // lưu vào chi tiết bán lẻ
    await chitietbanleModel.create({
      ma_phieu: pbl.ma_phieu,
      ma_vt: detail.ma_vt,
      ten_vt: detail.ten_vt,
      ma_dvt: product.ma_dvt,
      ten_dvt: product.ten_dvt,
      gia_von: product.gia_von,
      sl_xuat: slXuat,
      tien_hang: detail.tien_hang,
      tien_ck: detail.tien_ck,
      chi_phi: detail.chi_phi,
      doanh_thu: (detail.tien_hang || 0) - (detail.tien_ck || 0),
      loi_nhuan:
        (detail.tien_hang || 0) - (detail.tien_ck || 0) - (detail.chi_phi || 0),
      ngay_ct: pbl.ngay_ct,
      nam: pbl.nam,
      quy: pbl.quy,
      thang: pbl.thang,
      ngay: pbl.ngay,
    });
  }
};
const revertInfo = async (pbl) => {
  for (let i = 0; i < pbl.details.length; i++) {
    const detail = pbl.details[i];
    const product = await productModel.findOne({ ma_vt: detail.ma_vt });
    let slXuat = detail.sl_xuat;
    if (product.ma_dvt !== detail.ma_dvt) {
      const dvtObj = product.ds_dvt.find((dvt) => dvt.ma_dvt === detail.ma_dvt);
      if (dvtObj) {
        slXuat = dvtObj.sl_quy_doi;
      }
    }
    if (!product?.la_sp_sx) {
      await productModel.updateOne(
        { ma_vt: detail.ma_vt },
        { ton_kho: (product.ton_kho || 0) + (slXuat || 0) }
      );
    }
    await chitietbanleModel.deleteMany({
      ma_phieu: pbl.ma_phieu,
      ma_vt: detail.ma_vt,
    });
  }
};
const computeInfo = async (pbl, next) => {
  let tongTienhang = 0,
    tienCkSp = 0,
    tongChiPhi = 0;
  // xác định vật tư và đơn vị tính để lấy đúng giá bán lẻ
  for (let i = 0; i < pbl.details.length; i++) {
    const detail = pbl.details[i];
    const product = await productModel.findOne({ ma_vt: detail.ma_vt });
    let slXuat = detail.sl_xuat;
    if (product.ma_dvt !== detail.ma_dvt) {
      const dvtObj = product.ds_dvt.find((dvt) => dvt.ma_dvt === detail.ma_dvt);
      if (dvtObj) {
        slXuat = dvtObj.sl_quy_doi;
      }
    }
    // xác định giá bán lẻ
    if (detail.ma_dvt !== product.ma_dvt) {
      const giaBanLeObj = product.ds_dvt.find(
        (item) => item.ma_dvt === detail.ma_dvt
      );
      if (giaBanLeObj) {
        detail.gia_ban_le = giaBanLeObj.gia_ban_qd;
      } else {
        return next(
          createHttpError(
            400,
            `Hàng hóa '${product.ten_vt}' không có đơn vị tính '${detail.ten_dvt}'`
          )
        );
      }
    } else {
      detail.gia_ban_le = product.gia_ban_le;
    }
    // xác định đơn giá
    if ((detail.ty_le_ck || 0) > 0) {
      const tienCk = (detail.gia_ban_le * detail.ty_le_ck) / 100;
      detail.tien_ck = Math.floor((tienCk || 0) * detail.sl_xuat);
      detail.don_gia = (detail.gia_ban_le || 0) - Math.floor(tienCk);
    } else {
      detail.don_gia = detail.gia_ban_le;
    }
    // xác định giá vốn, chi phí, tiền hàng, tổng tiền
    detail.gia_von = product.gia_von || 0;
    detail.chi_phi = detail.gia_von * (slXuat || 0);
    detail.tien_hang = (detail.gia_ban_le || 0) * (detail.sl_xuat || 0);
    detail.t_tien = (detail.tien_hang || 0) - (detail.tien_ck || 0);

    // tổng hợp cho phiếu bán lẻ
    tongTienhang += detail.tien_hang || 0;
    tienCkSp += detail.tien_ck || 0;
    tongChiPhi += detail.chi_phi || 0;
  }
  const { nam, quy, thang, ngay } = generateTimeByDate(pbl.ngay_ct);
  pbl.nam = nam;
  pbl.quy = quy;
  pbl.thang = thang;
  pbl.ngay = ngay;
  // tính tổng tiền hàng
  pbl.t_tien_hang = tongTienhang;
  // tính chiết khấu sản phẩm
  pbl.tien_ck_sp = tienCkSp;
  // tính tổng chi phí
  pbl.t_chi_phi = tongChiPhi;
  // tính tiền ck hd
  if ((pbl.ty_le_ck_hd || 0) > 0) {
    pbl.tien_ck_hd = Math.floor((pbl.t_tien_hang * pbl.ty_le_ck_hd) / 100);
  } else {
    pbl.tien_ck_hd = 0;
  }
  // tính tổng tiền ck
  pbl.t_tien_ck = (pbl.tien_ck_sp || 0) + (pbl.tien_ck_hd || 0);
  // tính tổng thanh toán
  pbl.t_tt =
    (pbl.t_tien_hang || 0) -
    (pbl.t_tien_ck || 0) +
    (pbl.tien_van_chuyen || 0) +
    (pbl.chi_phi_khac || 0);
  // tính tiền thối dựa trên tiền thu
  if ((pbl.tien_thu || 0) > 0) {
    pbl.tien_thoi = (pbl.tien_thu || 0) - pbl.t_tt;
  }
  // tính doanh thu
  pbl.doanh_thu = (pbl.t_tien_hang || 0) - (pbl.t_tien_ck || 0);
  // tính lợi nhuận
  pbl.loi_nhuan =
    (pbl.t_tien_hang || 0) -
    (pbl.t_tien_ck || 0) -
    (pbl.phi_nen_tang || 0) -
    (pbl.t_chi_phi || 0);
  if (!pbl.ma_kenh) {
    pbl.ma_kenh = 'tudo';
    pbl.ten_kenh = 'Tự do';
  }
};

pblSchema.pre('save', async function (next) {
  const pbl = this;
  // create ma_phieu if it was empty
  if (!pbl.ma_phieu) {
    const maPhieu = await generateUniqueValueUtil({
      maDm: 'PBL',
      model: mongoose.model('PhieuBanLe', pblSchema),
      compareKey: 'ma_phieu',
    });
    pbl.ma_phieu = maPhieu;
  }
  if (pbl.isNew) {
    const trangThai = await trangthaiModel.findOne({
      ma_trang_thai: pbl.ma_trang_thai,
      ma_ct: 'pbl',
    });
    pbl.color = trangThai.color;
    pbl.ten_trang_thai = trangThai.ten_trang_thai;
    await computeInfo(pbl, next);
  }
  next();
});

pblSchema.post('save', async function () {
  const pbl = this;
  if (pbl.ma_trang_thai === 2) {
    await saveInfo(pbl);
  }
});

pblSchema.pre('updateOne', async function (next) {
  const pbl = this.getUpdate();
  const filter = this.getFilter();
  const pblOld = await this.model.findOne(filter);

  const trangThai = await trangthaiModel.findOne({
    ma_trang_thai: pbl.ma_trang_thai,
    ma_ct: 'pbl',
  });
  pbl.color = trangThai.color;
  pbl.ten_trang_thai = trangThai.ten_trang_thai;

  await computeInfo(pbl, next);

  if (pblOld.ma_trang_thai !== pbl.ma_trang_thai) {
    if (pbl.ma_trang_thai === 2 && pblOld.ma_trang_thai !== 2) {
      await saveInfo(pbl);
    } else if (pbl.ma_trang_thai !== 2 && pblOld.ma_trang_thai === 2) {
      await revertInfo(pblOld);
    }
  } else if (pbl.ma_trang_thai === 2 && pblOld.ma_trang_thai === 2) {
    return next(createHttpError(400, 'Không thể sửa phiếu đã lưu sổ'));
  }
});

pblSchema.pre('deleteMany', async function (next) {
  const filter = this.getFilter();
  const pbls = await this.model.find(filter);
  const valid = pbls.every((item) => item.ma_trang_thai === 3);
  if (!valid) {
    return next(createHttpError(400, 'Hủy phiếu trước khi xóa'));
  } else {
    next();
  }
});

pblSchema.index({ ma_phieu: 'text' }, { default_language: 'none' });

module.exports = mongoose.model('PhieuBanLe', pblSchema);
