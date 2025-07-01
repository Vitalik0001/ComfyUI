/**
 * Example debug endpoint for verifying that the server process is healthy
 * and retrieving basic runtime information.
 * 
 * @route GET /api/debug
 * @returns {200} JSON with health and memory statistics.
 */

export default async function healthCheckController(req, res) {
  try {
    const memoryUsage = process.memoryUsage();
    const now = new Date();

    res.status(200).json({
      status: "OK",
      timestamp: now.toISOString(),
      timestamp_readable: now.toUTCString(),
      uptime_seconds: process.uptime(),
      node_version: process.version,
      memory_usage: {
        rss_mb: +(memoryUsage.rss / 1024 / 1024).toFixed(1),
        heap_used_mb: +(memoryUsage.heapUsed / 1024 / 1024).toFixed(1),
        heap_total_mb: +(memoryUsage.heapTotal / 1024 / 1024).toFixed(1),
      }
    });
  } catch (error) {
    console.error("Health check failed:", error);
    res.status(500).json({
      status: "ERROR",
      error: error.message,
    });
  }
}
