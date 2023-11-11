const loaiThuChiModel = require('../app/models/loaithuchi.model');

const generateLoaiThuChi = async () => {
  // Tạo dữ liệu mẫu
  const sampleData = [
    {
      ma_loai: 1,
      ten_loai: 'Phiếu thu',
      color: '#9FBB73',
    },
    {
      ma_loai: 2,
      ten_loai: 'Phiếu chi',
      color: '#BE3144',
    },
  ];
  const operations = sampleData.map((doc) => ({
    updateOne: {
      filter: { ma_loai: doc.ma_loai },
      update: doc,
      upsert: true,
      new: true,
    },
  }));
  await loaiThuChiModel.bulkWrite(operations);
};
module.exports = generateLoaiThuChi;
