const router = require('express').Router();
const authController = require('../app/controllers/auth.controller');

router.post('/dangKy', authController.dangKy);
router.post('/dangNhap', authController.dangNhap);
router.post('/lamMoi', authController.lamMoi);

module.exports = router;
