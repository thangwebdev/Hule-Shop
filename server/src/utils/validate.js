const joi = require('joi');

// phân quyền
const validateCreatePhanQuyen = (phanQuyen) => {
  const phanQuyenSchema = joi.object({
    ma_phan_quyen: joi.number().required(),
    ten_phan_quyen: joi.string().required(),
  });
  return phanQuyenSchema.validate(phanQuyen);
};
// auth
const validateNguoiDungDangKy = (user) => {
  const userSchema = joi.object({
    ma_nguoi_dung: joi.string().required(),
    ten_nguoi_dung: joi.string().required(),
    mat_khau: joi.string().required(),
    email: joi.string().required().email(),
    ma_phan_quyen: joi.number().required(),
  });
  return userSchema.validate(user);
};
const validateNguoiDungDangNhap = (user) => {
  const userSchema = joi.object({
    email: joi.string().required().email(),
    mat_khau: joi.string().required(),
  });
  return userSchema.validate(user);
};

// product
const validateCreateProduct = ({ ten_vt }) => {
  const productSchema = joi.object({
    // ma_vt: joi.string().required(),
    ten_vt: joi.string().required(),
  });
  return productSchema.validate({ ten_vt });
};
// nhom vat tu
const validateCreateNhomVatTu = ({ ma_nvt, ten_nvt }) => {
  const modelSchema = joi.object({
    ma_nvt: joi.string().required(),
    ten_nvt: joi.string().required(),
  });
  return modelSchema.validate({ ma_nvt, ten_nvt });
};
// file
const validateCreateFile = (file) => {
  const fileSchema = joi.object({
    ma_danh_muc: joi.string().required(),
    path: joi.string().required(),
  });
  return fileSchema.validate(file);
};
// don vi tinh
const validateCreateDonViTinh = ({ ma_dvt, ten_dvt }) => {
  const modelSchema = joi.object({
    ma_dvt: joi.string().required(),
    ten_dvt: joi.string().required(),
  });
  return modelSchema.validate({ ma_dvt, ten_dvt });
};
// kenh ban
const validateCreateKenhBan = ({ ma_kenh, ten_kenh }) => {
  const modelSchema = joi.object({
    ma_kenh: joi.string().required(),
    ten_kenh: joi.string().required(),
  });
  return modelSchema.validate({ ma_kenh, ten_kenh });
};
// phieu nhap kho
const validateCreatePNK = ({ ngay_ct, ngay_nhap_hang, ma_trang_thai }) => {
  const modelSchema = joi.object({
    ngay_ct: joi.date().required(),
    ngay_nhap_hang: joi.date().required(),
    ma_trang_thai: joi.number().required(),
  });
  return modelSchema.validate({ ngay_ct, ngay_nhap_hang, ma_trang_thai });
};
// phieu xuat kho
const validateCreatePXK = ({ ngay_ct, ngay_xuat_hang, ma_trang_thai }) => {
  const modelSchema = joi.object({
    ngay_ct: joi.date().required(),
    ngay_xuat_hang: joi.date().required(),
    ma_trang_thai: joi.number().required(),
  });
  return modelSchema.validate({ ngay_ct, ngay_xuat_hang, ma_trang_thai });
};
// phieu kiem kho
const validateCreatePKK = ({ ngay_ct, ngay_lap_phieu, ma_trang_thai }) => {
  const modelSchema = joi.object({
    ngay_ct: joi.date().required(),
    ngay_lap_phieu: joi.date().required(),
    ma_trang_thai: joi.number().required(),
  });
  return modelSchema.validate({ ngay_ct, ngay_lap_phieu, ma_trang_thai });
};
// phieu ban le
const validateCreatePBL = ({ ngay_ct, ngay_lap_phieu, ma_trang_thai }) => {
  const modelSchema = joi.object({
    ngay_ct: joi.date().required(),
    ngay_lap_phieu: joi.date().required(),
    ma_trang_thai: joi.number().required(),
  });
  return modelSchema.validate({ ngay_ct, ngay_lap_phieu, ma_trang_thai });
};
// phieu ban le
const validateCreateSoQuy = ({ ngay_ct, ngay_lap_phieu, ma_loai_thu_chi }) => {
  const modelSchema = joi.object({
    ngay_ct: joi.date().required(),
    ngay_lap_phieu: joi.date().required(),
    ma_loai_thu_chi: joi.number().required(),
  });
  return modelSchema.validate({ ngay_ct, ngay_lap_phieu, ma_loai_thu_chi });
};

module.exports = {
  validateCreatePhanQuyen,
  validateNguoiDungDangKy,
  validateNguoiDungDangNhap,
  validateCreateProduct,
  validateCreateFile,
  validateCreateNhomVatTu,
  validateCreateDonViTinh,
  validateCreateKenhBan,
  validateCreatePKK,
  validateCreatePNK,
  validateCreatePXK,
  validateCreatePBL,
  validateCreateSoQuy,
};
