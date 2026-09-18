const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/oralsense', {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[OralSense DB] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`[OralSense DB Warning] Could not connect to MongoDB: ${error.message}`);
    console.warn('[OralSense DB Warning] Running server in hybrid mode with local storage fallback.');
  }
};

module.exports = connectDB;
