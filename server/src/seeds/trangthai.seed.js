const trangThaiModel = require('../app/models/trangthai.model');
const { PNK, PXK, PBL } = require('../utils/constants');

const generateTrangThai = async () => {
  // Tạo dữ liệu mẫu
  const sampleData = [
    {
      ma_trang_thai: 1,
      ten_trang_thai: 'Khởi tạo',
      ma_ct: PNK,
      color: '#00A9FF',
    },
    {
      ma_trang_thai: 2,
      ten_trang_thai: 'Chờ duyệt',
      ma_ct: PNK,
      color: '#0174BE',
    },
    {
      ma_trang_thai: 3,
      ten_trang_thai: 'Lưu sổ',
      ma_ct: PNK,
      color: '#A2C579',
    },
    {
      ma_trang_thai: 4,
      ten_trang_thai: 'Hủy',
      ma_ct: PNK,
      color: '#CE5A67',
    },
    {
      ma_trang_thai: 1,
      ten_trang_thai: 'Khởi tạo',
      ma_ct: PXK,
      color: '#00A9FF',
    },
    {
      ma_trang_thai: 2,
      ten_trang_thai: 'Chờ duyệt',
      ma_ct: PXK,
      color: '#0174BE',
    },
    {
      ma_trang_thai: 3,
      ten_trang_thai: 'Lưu sổ',
      ma_ct: PXK,
      color: '#A2C579',
    },
    {
      ma_trang_thai: 4,
      ten_trang_thai: 'Hủy',
      ma_ct: PXK,
      color: '#CE5A67',
    },
    {
      ma_trang_thai: 1,
      ten_trang_thai: 'Đang có khách',
      ma_ct: PBL,
      color: '#0174BE',
    },
    {
      ma_trang_thai: 2,
      ten_trang_thai: 'Đã thanh toán',
      ma_ct: PBL,
      color: '#A2C579',
    },
    {
      ma_trang_thai: 3,
      ten_trang_thai: 'Hủy',
      ma_ct: PBL,
      color: '#CE5A67',
    },
  ];
  const operations = sampleData.map((doc) => ({
    updateOne: {
      filter: { ma_trang_thai: doc.ma_trang_thai, ma_ct: doc.ma_ct },
      update: doc,
      upsert: true,
      new: true,
    },
  }));
  await trangThaiModel.bulkWrite(operations);
};
module.exports = generateTrangThai;
