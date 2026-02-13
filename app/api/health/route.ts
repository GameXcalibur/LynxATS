import { NextResponse } from "next/server";
import mongoose from "mongoose";

/**
 * Health check endpoint for load balancers / uptime monitors.
 * GET /api/health
 *
 * Returns 200 if the process and DB are healthy, 503 otherwise.
 */
export async function GET() {
  const dbState = mongoose.connection.readyState;
  // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  const dbHealthy = dbState === 1;

  const status = {
    status: dbHealthy ? "ok" : "degraded",
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    db: dbHealthy ? "connected" : `state_${dbState}`,
    memory: {
      rss_mb: Math.round(process.memoryUsage().rss / 1024 / 1024),
      heap_used_mb: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
    },
  };

  return NextResponse.json(status, { status: dbHealthy ? 200 : 503 });
}
