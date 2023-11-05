const generateUser = require('./user.seed');
const generatePhanQuyen = require('./phanquyen.seed');
const generateTrangThai = require('./trangthai.seed');
const generateKenhBan = require('./kenhban.seed');

const generateSeed = async () => {
  await generatePhanQuyen();
  await generateUser();
  await generateTrangThai();
  await generateKenhBan();
  // await generateTrangThaiPBH();
  console.log('Khởi tạo dữ liệu thành công');
};
module.exports = generateSeed;
