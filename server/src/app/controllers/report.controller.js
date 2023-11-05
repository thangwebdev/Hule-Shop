const createHttpError = require('http-errors');
const pblModel = require('../models/pbl.model');
const chitietbanleModel = require('../models/chitietbanle.model');

const reportController = {
  async reportPBL(req, res, next) {
    const { tu_ngay, den_ngay } = req.body;
    if (!tu_ngay || !den_ngay) {
      return next(
        createHttpError(400, `Báo cáo cần biết ngày bắt đầu và kết thúc`)
      );
    }
    const results = await pblModel.find({
      ma_trang_thai: 2,
      ngay_ct: { $gte: tu_ngay, $lte: den_ngay },
    });
    return res.status(200).json(results);
  },
  async reportDetail(req, res, next) {
    const { tu_ngay, den_ngay } = req.body;
    if (!tu_ngay || !den_ngay) {
      return next(
        createHttpError(400, `Báo cáo cần biết ngày bắt đầu và kết thúc`)
      );
    }
    const results = await chitietbanleModel.find({
      ngay_ct: { $gte: tu_ngay, $lte: den_ngay },
    });
    return res.status(200).json(results);
  },
};
module.exports = reportController;
