import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  // Return existing connection if available
  if (cached.conn) {
    return cached.conn;
  }

  // If no promise exists, create a new connection promise
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000, // Increased timeout
      socketTimeoutMS: 45000,
      maxPoolSize: 10, // Maintain up to 10 socket connections
      heartbeatFrequencyMS: 10000, // Send a heartbeat every 10 seconds
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('MongoDB connected successfully');
      return mongoose;
    }).catch((error) => {
      console.error('MongoDB connection error:', error);
      cached.promise = null; // Reset promise on failure
      throw error;
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    console.error('Failed to establish database connection:', error);
    cached.promise = null; // Reset promise for retry
    return null; // Return null instead of throwing
  }
}

export default dbConnect;