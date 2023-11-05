const createError = require('http-errors');
const { deleteFile } = require('../../utils/myUtil');
const productModel = require('../models/product.model');

const uploadController = {
  // upload product thumbnail
  async uploadProductThumbnail(req, res, next) {
    try {
      const { stt, ma_vt } = req.body;
      if (!stt) {
        return next(createError(400, 'Không xác định được số thứ tự hình ảnh'));
      }
      if (!ma_vt) {
        return next(createError(400, 'Không xác định được hàng hóa'));
      }
      const vatTu = await productModel.findOne({ ma_vt });
      if (!vatTu) {
        return next(createError(404, `Hàng hóa '${ma_vt}' không tồn tại`));
      }
      if (vatTu[stt]) {
        deleteFile(`src/public/${vatTu[stt]}`);
      }
      vatTu[stt] = req.file?.filename
        ? `uploads/product/${req.file.filename}`
        : '';
      await vatTu.save();
      return res.status(200).json(vatTu);
    } catch (error) {
      next(error);
    }
  },
};
module.exports = uploadController;
