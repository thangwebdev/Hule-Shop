const createError = require('http-errors');
const mongoose = require('mongoose');
const xlsx = require('xlsx');
const { deleteFile } = require('../../utils/myUtil');
const userModel = require('../models/user.model');

const danhMucController = {
  // check duplicate unique field
  async checkUniqueValueExisted(model, uniqueField, uniqueFieldValue, next) {
    try {
      const document = await model.findOne({
        [uniqueField]: uniqueFieldValue,
      });
      if (document) {
        return next(
          createError(400, `${uniqueField} '${uniqueFieldValue}' đã tồn tại`)
        );
      } else {
        return uniqueFieldValue;
      }
    } catch (error) {
      next(error);
    }
  },
  // create
  async create(req, res, next) {
    try {
      const { model, uniqueField, validate } = req.danhMuc;
      if (!model) {
        return next(400, 'Không có model cho danh mục này');
      }
      const validateResult = validate?.(req.body);
      if (validateResult?.error) {
        return next(error);
      }
      let uniqueFieldValue = req.body[uniqueField];
      if (uniqueFieldValue) {
        uniqueFieldValue = await danhMucController.checkUniqueValueExisted(
          model,
          uniqueField,
          uniqueFieldValue,
          next
        );
        if (!uniqueFieldValue) {
          return;
        }
      }
      const document = await model.create({
        ...req.body,
        createdBy: req.user.email,
      });
      return res.status(200).json(document);
    } catch (error) {
      next(error);
    }
  },
  // update
  async update(req, res, next) {
    try {
      const { model, uniqueField } = req.danhMuc;
      if (!model) {
        return next(400, 'Không có model cho danh mục này');
      }
      const { [uniqueField]: uniqueFieldValue } = req.body;
      if (!uniqueFieldValue) {
        return next(
          createError(400, 'Không xác định được đối tượng để cập nhật')
        );
      }
      const documentSaved = await model.findOne({
        [uniqueField]: uniqueFieldValue,
      });
      if (!documentSaved) {
        return next(
          createError(404, `Đối tượng '${uniqueFieldValue}' không tồn tại`)
        );
      }
      await model.updateOne(
        { [uniqueField]: uniqueFieldValue },
        { ...req.body, updatedBy: req.user.email }
      );
      const documentUpdated = await model.findOne({
        [uniqueField]: uniqueFieldValue,
      });
      return res.status(200).json(documentUpdated);
    } catch (error) {
      next(error);
    }
  },
  // delete many
  async deleteMany(req, res, next) {
    try {
      const { model, uniqueField } = req.danhMuc;
      const { uniqueValues } = req.body;
      if (!uniqueValues || !Array.isArray(uniqueValues)) {
        return next(createError(400, 'Không xác định được đối tượng để xóa'));
      }
      const result = await model.deleteMany({
        [uniqueField]: { $in: uniqueValues },
      });
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },
  // search
  async search(req, res, next) {
    try {
      const { model } = req.danhMuc;
      if (!model) {
        return next(400, 'Không có model cho danh mục này');
      }
      let { limit, page, ...condition } = req.body;
      if (!limit) {
        limit = 20;
      }
      if (!page) {
        page = 1;
      }
      const skip = limit * (page - 1);
      const documents = await model
        .find(condition)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .collation({ locale: 'vi', strength: 1 });
      const count = await model.find(condition).count();
      return res.status(200).json({ data: documents, count });
    } catch (error) {
      next(error);
    }
  },
};
module.exports = danhMucController;
