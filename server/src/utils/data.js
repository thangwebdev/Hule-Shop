const {
  validateCreateProduct,
  validateCreateDonViTinh,
  validateCreateKenhBan,
  validateCreatePKK,
  validateCreatePNK,
  validateCreatePXK,
  validateCreatePBL,
  validateCreateSoQuy,
} = require('./validate');
const productModel = require('../app/models/product.model');
const dvtModel = require('../app/models/dvt.model');
const kenhbanModel = require('../app/models/kenhban.model');
const pnkModel = require('../app/models/pnk.model');
const pxkModel = require('../app/models/pxk.model');
const trangThaiModel = require('../app/models/trangthai.model');
const pblModel = require('../app/models/pbl.model');
const pkkModel = require('../app/models/pkk.model');
const loaiThuChiModel = require('../app/models/loaithuchi.model');
const soquyModel = require('../app/models/soquy.model');

const dsDanhMuc = [
  {
    maDanhMuc: 'dmvt',
    uniqueField: 'ma_vt',
    model: productModel,
    validate: validateCreateProduct,
  },
  {
    maDanhMuc: 'dmdvt',
    uniqueField: 'ma_dvt',
    model: dvtModel,
    validate: validateCreateDonViTinh,
  },
  {
    maDanhMuc: 'dmkb',
    uniqueField: 'ma_kenh',
    model: kenhbanModel,
    validate: validateCreateKenhBan,
  },
  {
    maDanhMuc: 'pnk',
    uniqueField: 'ma_phieu',
    model: pnkModel,
    validate: validateCreatePNK,
  },
  {
    maDanhMuc: 'pxk',
    uniqueField: 'ma_phieu',
    model: pxkModel,
    validate: validateCreatePXK,
  },
  {
    maDanhMuc: 'pkk',
    uniqueField: 'ma_phieu',
    model: pkkModel,
    validate: validateCreatePKK,
  },
  {
    maDanhMuc: 'pbl',
    uniqueField: 'ma_phieu',
    model: pblModel,
    validate: validateCreatePBL,
  },
  {
    maDanhMuc: 'trangthai',
    uniqueField: 'ma_trang_thai',
    model: trangThaiModel,
  },
  {
    maDanhMuc: 'loaithuchi',
    uniqueField: 'ma_loai',
    model: loaiThuChiModel,
  },
  {
    maDanhMuc: 'soquy',
    uniqueField: 'ma_phieu',
    model: soquyModel,
    validate: validateCreateSoQuy,
  },
];
module.exports = { dsDanhMuc };
