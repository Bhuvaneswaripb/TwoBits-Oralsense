const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer = null;

const connectDB = async () => {
  // Disable Mongoose buffering so operations return immediate error if DB is disconnected
  mongoose.set('bufferCommands', false);

  console.log('[OralSense Backend] MongoDB connecting...');

  const mongoURI = process.env.MONGODB_URI;

  if (mongoURI) {
    try {
      await mongoose.connect(mongoURI, {
        serverSelectionTimeoutMS: 3000,
      });
      console.log('[OralSense Backend] MongoDB connected to process.env.MONGODB_URI');
      return true;
    } catch (error) {
      console.warn('[OralSense Backend] External MONGODB_URI failed:', error.message);
    }
  }

  // Try local standalone MongoDB instance
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/oralsense', {
      serverSelectionTimeoutMS: 2000,
    });
    console.log('[OralSense Backend] MongoDB connected to local instance (127.0.0.1:27017)');
    return true;
  } catch (localErr) {
    console.warn('[OralSense Backend] Local MongoDB standard connection unavailable:', localErr.message);
    console.log('[OralSense Backend] Starting MongoMemoryServer fallback...');
    try {
      mongoServer = await MongoMemoryServer.create();
      const memoryUri = mongoServer.getUri();
      await mongoose.connect(memoryUri);
      console.log('[OralSense Backend] In-Memory MongoDB connected successfully at:', memoryUri);
      return true;
    } catch (memErr) {
      console.error('[OralSense Backend] Failed to start MongoMemoryServer:', memErr.message);
      return false;
    }
  }
};

module.exports = connectDB;

