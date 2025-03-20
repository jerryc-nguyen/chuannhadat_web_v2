import { NextResponse } from 'next/server';
import os from 'os';

/**
 * Health check endpoint for monitoring and Docker health checks
 * Returns system information and memory usage
 */
export async function GET() {
  // Get memory statistics
  const totalMemory = os.totalmem();
  const freeMemory = os.freemem();
  const usedMemory = totalMemory - freeMemory;
  const memoryUsagePercent = Math.round((usedMemory / totalMemory) * 100);

  // Get CPU load averages (1, 5, and 15 minute averages)
  const loadAvg = os.loadavg();

  // Get system uptime in seconds
  const uptime = os.uptime();

  // Basic health status
  const healthy = memoryUsagePercent < 90; // Consider unhealthy if memory usage > 90%

  // Return health information
  return NextResponse.json({
    status: healthy ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString(),
    uptime: uptime,
    memory: {
      total: Math.round(totalMemory / 1024 / 1024) + ' MB',
      free: Math.round(freeMemory / 1024 / 1024) + ' MB',
      used: Math.round(usedMemory / 1024 / 1024) + ' MB',
      percentUsed: memoryUsagePercent + '%'
    },
    cpu: {
      loadAvg1: loadAvg[0],
      loadAvg5: loadAvg[1],
      loadAvg15: loadAvg[2],
      cores: os.cpus().length
    }
  }, {
    status: healthy ? 200 : 503
  });
} 
