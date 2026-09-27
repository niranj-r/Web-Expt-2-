import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoMemoryServer = null;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/techfest2026';
  
  try {
    // Set fast connection options
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000 // Quick timeout to fallback if local mongod is not running
    });
    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}`);
    return conn;
  } catch (err) {
    console.warn(`[MongoDB] Direct connection to ${uri} failed: ${err.message}`);
    console.log('[MongoDB] Starting MongoMemoryServer fallback...');
    
    try {
      mongoMemoryServer = await MongoMemoryServer.create();
      const memUri = mongoMemoryServer.getUri();
      const conn = await mongoose.connect(memUri);
      console.log(`[MongoDB Memory Server] Connected successfully to in-memory database at: ${memUri}`);
      return conn;
    } catch (memErr) {
      console.error(`[MongoDB] Fatal error initializing MongoDB Memory Server: ${memErr.message}`);
      process.exit(1);
    }
  }
};
