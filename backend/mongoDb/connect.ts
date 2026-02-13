"use server"
import mongoose from "mongoose"

/**
 * Global cache for the mongoose connection.
 * Using `global` ensures the connection persists across hot reloads in dev
 * and across the lifetime of the Node process in production.
 */
const globalForMongoose = global as typeof global & {
  mongooseConnection?: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
    eventsRegistered?: boolean;
  };
};

if (!globalForMongoose.mongooseConnection) {
  globalForMongoose.mongooseConnection = { conn: null, promise: null, eventsRegistered: false };
}

const cached = globalForMongoose.mongooseConnection;

/**
 * Register connection event listeners once so we can detect and recover
 * from connection drops on long-running EC2 / VPS processes.
 */
function registerConnectionEvents() {
  if (cached.eventsRegistered) return;
  cached.eventsRegistered = true;

  mongoose.connection.on("connected", () => {
    console.log("[MongoDB] Connected");
  });

  mongoose.connection.on("disconnected", () => {
    console.warn("[MongoDB] Disconnected — will reconnect on next request");
    // Clear the cache so the next connectToDB() call establishes a fresh connection
    cached.conn = null;
    cached.promise = null;
  });

  mongoose.connection.on("error", (err) => {
    console.error("[MongoDB] Connection error:", err.message);
    cached.conn = null;
    cached.promise = null;
  });
}

export const connectToDB = async (): Promise<typeof mongoose> => {
  const MONGODB_URL = process.env.MONGODB_URL;

  if (!MONGODB_URL) {
    throw new Error("MONGODB_URL environment variable is not set");
  }

  registerConnectionEvents();

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
    heartbeatFrequencyMS: 15000,
  });

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    cached.conn = null;
    throw new Error(`Failed to connect to MongoDB: ${error}`);
  }
};
