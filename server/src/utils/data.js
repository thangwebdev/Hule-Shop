const {
  validateCreateProduct,
  validateCreateDonViTinh,
  validateCreateKenhBan,
} = require('./validate');
const productModel = require('../app/models/product.model');
const dvtModel = require('../app/models/dvt.model');
const kenhbanModel = require('../app/models/kenhban.model');
const pnkModel = require('../app/models/pnk.model');
const pxkModel = require('../app/models/pxk.model');
const trangThaiModel = require('../app/models/trangthai.model');
const pblModel = require('../app/models/pbl.model');

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
  },
  {
    maDanhMuc: 'pxk',
    uniqueField: 'ma_phieu',
    model: pxkModel,
  },
  {
    maDanhMuc: 'pbl',
    uniqueField: 'ma_phieu',
    model: pblModel,
  },
  {
    maDanhMuc: 'trangthai',
    uniqueField: 'ma_trang_thai',
    model: trangThaiModel,
  },
];
module.exports = { dsDanhMuc };
