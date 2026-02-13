/**
 * Next.js Instrumentation — runs once when the server starts.
 * Catches unhandled errors that would otherwise kill the process.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    // Prevent unhandled promise rejections from crashing the process
    process.on("unhandledRejection", (reason, promise) => {
      console.error("[UNHANDLED REJECTION]", reason);
    });

    // Prevent uncaught exceptions from crashing the process
    process.on("uncaughtException", (error) => {
      console.error("[UNCAUGHT EXCEPTION]", error);
      // Don't exit — PM2 will restart if truly unrecoverable
    });

    // Log when the process receives termination signals
    process.on("SIGTERM", () => {
      console.log("[SIGTERM] Graceful shutdown initiated...");
    });

    console.log("[instrumentation] Global error handlers registered.");
  }
}
