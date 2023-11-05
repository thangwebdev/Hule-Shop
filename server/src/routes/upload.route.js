const router = require('express').Router();
const { upload } = require('../utils/myUtil');
const uploadController = require('../app/controllers/upload.controller');
const authMiddleWare = require('../app/middlewares/auth.middleware');
const roleMiddleWare = require('../app/middlewares/role.middware');

// upload hình ảnh sản phẩm
router.post(
  '/product/thumbnail',
  authMiddleWare.verifyToken,
  roleMiddleWare.exceptNhanVienBanHang,
  upload.single('thumbnail'),
  uploadController.uploadProductThumbnail
);

module.exports = router;
