const router = require('express').Router();
const authMiddleWare = require('../app/middlewares/auth.middleware');
const roleMiddleWare = require('../app/middlewares/role.middware');
const userController = require('../app/controllers/user.controller');

router.put('/', authMiddleWare.verifyToken, userController.capNhatNguoiDung);
router.delete(
  '/:id',
  authMiddleWare.verifyToken,
  roleMiddleWare.checkAdmin,
  userController.xoaNguoiDungVaoThungRac
);
router.get(
  '/verify-email',
  authMiddleWare.verifyToken,
  userController.verifyEmail
);
router.post(
  '/nhanvien',
  authMiddleWare.verifyToken,
  userController.xemNhanVien
);

module.exports = router;
