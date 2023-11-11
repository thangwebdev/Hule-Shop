const router = require('express').Router();
const reportController = require('../app/controllers/report.controller');

router.post('/pbl', reportController.reportPBL);
router.post('/ctbanle', reportController.reportDetail);
router.post('/soquy', reportController.reportSoQuy);

module.exports = router;
