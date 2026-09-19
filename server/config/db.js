/**
 * MongoDB Atlas Database Connection Configuration
 * Handles connection lifecycle, retry logic, and graceful shutdown.
 */

const mongoose = require('mongoose');

const MAX_RETRIES = 5;
const RETRY_INTERVAL_MS = 5000;
let retryCount = 0;
let isConnected = false;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('❌ MONGODB_URI is not defined in environment variables.');
    process.exit(1);
  }

  const options = {
    autoIndex: true,
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    maxPoolSize: 20,
    minPoolSize: 5,
  };

  const tryConnect = async () => {
    try {
      const conn = await mongoose.connect(uri, options);
      isConnected = true;
      retryCount = 0;
      console.log(`✅ [MongoDB Atlas] Connected successfully: ${conn.connection.host}/${conn.connection.name}`);
    } catch (error) {
      retryCount += 1;
      console.error(`❌ [MongoDB Atlas] Connection attempt ${retryCount}/${MAX_RETRIES} failed:`, error.message);

      if (retryCount < MAX_RETRIES) {
        console.log(`⏳ Retrying connection in ${RETRY_INTERVAL_MS / 1000}s...`);
        setTimeout(tryConnect, RETRY_INTERVAL_MS);
      } else {
        console.error('🚨 Max database connection retries reached. Operating in disconnected state.');
      }
    }
  };

  // Connection Event Listeners
  mongoose.connection.on('connected', () => {
    console.log('📦 [Mongoose] Connection event: connected');
  });

  mongoose.connection.on('error', (err) => {
    console.error('🚨 [Mongoose] Connection event error:', err.message);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('⚠️ [Mongoose] Connection event: disconnected');
    isConnected = false;
  });

  // Graceful Shutdown
  const handleShutdown = async (signal) => {
    console.log(`\n🛑 Received ${signal}. Closing MongoDB connection gracefully...`);
    try {
      await mongoose.connection.close(false);
      console.log('🔒 MongoDB connection closed. Exiting process.');
      process.exit(0);
    } catch (err) {
      console.error('❌ Error during graceful MongoDB shutdown:', err.message);
      process.exit(1);
    }
  };

  process.on('SIGINT', () => handleShutdown('SIGINT'));
  process.on('SIGTERM', () => handleShutdown('SIGTERM'));

  await tryConnect();
};

module.exports = { connectDB, getIsConnected: () => isConnected };
