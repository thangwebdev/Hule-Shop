const generateUser = require('./user.seed');
const generatePhanQuyen = require('./phanquyen.seed');
const generateTrangThai = require('./trangthai.seed');
const generateKenhBan = require('./kenhban.seed');
const generateLoaiThuChi = require('./loaithuchi');
const loaithuchiModel = require('../app/models/loaithuchi.model');
const soquyModel = require('../app/models/soquy.model');
const pnkModel = require('../app/models/pnk.model');
const pblModel = require('../app/models/pbl.model');

const generateSeed = async () => {
  await generatePhanQuyen();
  await generateUser();
  await generateTrangThai();
  await generateKenhBan();
  await generateLoaiThuChi();

  console.log('Khởi tạo dữ liệu thành công');
};
module.exports = generateSeed;
