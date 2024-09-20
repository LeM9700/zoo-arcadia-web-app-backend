const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load config
dotenv.config({ path: './config/config.env' });

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/zooArcadiaDB", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('MongoDB Connected');
  } catch (err) {
    console.error(err);
    process.exit(1); // Stop the app if there is an error
  }
};

module.exports = connectDB;
