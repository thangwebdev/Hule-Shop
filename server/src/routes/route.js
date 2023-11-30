const createError = require('http-errors');
const userRoute = require('./user.route');
const authRoute = require('./auth.route');
const danhMucRoute = require('./danhmuc.route');
const uploadRoute = require('./upload.route');
const reportRoute = require('./report.route');

const initApiRoute = (app) => {
  app.use('/api/v1/xacThuc', authRoute);
  app.use('/api/v1/user', userRoute);
  app.use('/api/v1/danhmuc', danhMucRoute);
  app.use('/api/v1/baocao', reportRoute);
  app.use('/api/v1/upload', uploadRoute);
  // handle error
  app.get('/check', (req, res) => {
    return res.status(200).json({ version: '2.3' });
  });
  app.use((req, res, next) => {
    const error = createError.NotFound('Route is not exist');
    next(error);
  });
  app.use((err, req, res, next) => {
    const statusCode = err.status || 500;
    const message = err.message;
    return res.status(statusCode).json({ status: statusCode, message });
  });
};
module.exports = initApiRoute;
