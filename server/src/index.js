const express = require('express');
const cors = require('cors');
require('dotenv').config();
const path = require('path');
const initApiRoute = require('./routes/route');
const connectToDB = require('./configs/database.config');
const generateSeed = require('./seeds');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
connectToDB();
initApiRoute(app);
// relationData()
// create sample data
// generateSeed();

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
