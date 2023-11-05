const router = require('express').Router();
const danhMucController = require('../app/controllers/danhmuc.controller');
const authMiddleWare = require('../app/middlewares/auth.middleware');
const danhMucMiddleWare = require('../app/middlewares/danhmuc.middleware');

// thêm mới
router.post(
  '/:ma_danh_muc',
  authMiddleWare.verifyToken,
  danhMucMiddleWare.assignDanhMuc,
  danhMucMiddleWare.specifyRoleOnDanhMuc,
  danhMucController.create
);
// cập nhật
router.put(
  '/:ma_danh_muc',
  authMiddleWare.verifyToken,
  danhMucMiddleWare.assignDanhMuc,
  danhMucMiddleWare.specifyRoleOnDanhMuc,
  danhMucController.update
);
// xóa bản ghi vào thùng rác
router.delete(
  '/:ma_danh_muc',
  authMiddleWare.verifyToken,
  danhMucMiddleWare.assignDanhMuc,
  danhMucMiddleWare.specifyRoleOnDanhMuc,
  danhMucController.deleteMany
);

// Lấy danh sách kèm điều kiện
router.post(
  '/:ma_danh_muc/search',
  authMiddleWare.verifyToken,
  danhMucMiddleWare.assignDanhMuc,
  danhMucController.search
);

module.exports = router;
