"use server"
import mongoose from "mongoose"

/**
 * Global cache for the mongoose connection.
 * In serverless environments (Vercel), module-level variables are NOT reliable
 * across invocations. Using `global` ensures the connection persists across
 * hot reloads in dev and across invocations in production.
 */
const globalForMongoose = global as typeof global & {
  mongooseConnection?: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
};

if (!globalForMongoose.mongooseConnection) {
  globalForMongoose.mongooseConnection = { conn: null, promise: null };
}

const cached = globalForMongoose.mongooseConnection;

export const connectToDB = async (): Promise<typeof mongoose> => {
  const MONGODB_URL = process.env.MONGODB_URL;

  if (!MONGODB_URL) {
    throw new Error("MONGODB_URL environment variable is not set");
  }

  // If we have a healthy cached connection, reuse it
  if (cached.conn && cached.conn.connection.readyState === 1) {
    return cached.conn;
  }

  // If a connection attempt is already in progress, wait for it
  if (cached.promise) {
    try {
      cached.conn = await cached.promise;
      if (cached.conn.connection.readyState === 1) {
        return cached.conn;
      }
    } catch {
      // Previous attempt failed — fall through to reconnect
      cached.promise = null;
      cached.conn = null;
    }
  }

  // Establish a new connection
  mongoose.set("strictQuery", true);

  cached.promise = mongoose.connect(MONGODB_URL, {
    bufferCommands: false,
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
  });

  try {
    cached.conn = await cached.promise;
    console.log("Connected to MongoDB");
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    cached.conn = null;
    throw new Error(`Failed to connect to MongoDB: ${error}`);
  }
};
