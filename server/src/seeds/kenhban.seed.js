const kenhbanModel = require('../app/models/kenhban.model');

const generateKenhBan = async () => {
  // Tạo dữ liệu mẫu
  const sampleData = [
    {
      ma_kenh: 'tudo',
      ten_kenh: 'Tự do',
    },
    {
      ma_kenh: 'shopee',
      ten_kenh: 'Shopee',
    },
  ];
  const operations = sampleData.map((doc) => ({
    updateOne: {
      filter: { ma_kenh: doc.ma_kenh },
      update: doc,
      upsert: true,
      new: true,
    },
  }));
  await kenhbanModel.bulkWrite(operations);
};
module.exports = generateKenhBan;
