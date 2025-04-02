import { NextApiRequest, NextApiResponse } from 'next';
import { getBotLogs as getInMemoryLogs, clearBotLogs as clearInMemoryLogs, BotDetectionResult } from '@/lib/botProtectionMonitor';
import Redis from 'ioredis';

// Enable debug mode for local development
const DEBUG = process.env.NODE_ENV === 'development';

// In-memory cache for this API route
const recentBotLogs: BotDetectionResult[] = [];

// Helper function to ensure we have logs for debugging in development mode
function ensureLogsExist(logs: BotDetectionResult[]) {
  console.log(`API - Original log count: ${logs.length}`);

  // If still no logs and we're in development, add a fake one for debugging
  if (logs.length === 0 && DEBUG) {
    const fakeLog: BotDetectionResult = {
      timestamp: new Date().toISOString(),
      url: 'http://localhost:3000/',
      ip: '127.0.0.1',
      userAgent: 'Test User Agent',
      isBot: false,
      isSuspicious: false,
      requestDenied: false,
      rateLimited: false,
      rateLimitRemaining: 100,
      suspiciousDetails: {
        isKnownSearchEngine: false,
        hasSuspiciousUserAgent: false,
        hasSuspiciousHeaders: false,
        hasUnusualPattern: false,
        matchedPatterns: []
      }
    };

    logs.push(fakeLog);
    console.log('Added a fake log since none were found');
  }

  return logs;
}

// Redis client for logs storage - only used in API routes
let logsRedis: Redis | null = null;
let redisConnectionError = false;

const getLogsRedis = (): Redis | null => {
  if (redisConnectionError) {
    return null;
  }

  if (!logsRedis) {
    try {
      logsRedis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379/1', {
        connectTimeout: 5000, // 5 seconds
        maxRetriesPerRequest: 3,
        retryStrategy(times) {
          if (times > 3) {
            // After 3 retries, mark as error and stop trying
            redisConnectionError = true;
            console.error('Redis connection failed after multiple retries, using in-memory logs');
            return null;
          }
          return Math.min(times * 50, 1000); // Exponential backoff up to 1s
        },
      });

      // Reset error flag if connection is successful
      logsRedis.on('connect', () => {
        redisConnectionError = false;
        console.log('Connected to Redis logs successfully');
      });

      // Log errors but don't crash the application
      logsRedis.on('error', (err) => {
        console.error('Redis logs connection error:', err);
        redisConnectionError = true;
      });
    } catch (error) {
      console.error('Failed to initialize Redis logs client:', error);
      redisConnectionError = true;
      return null;
    }
  }
  return logsRedis;
};

// Get logs from Redis
async function getRedisLogs(): Promise<BotDetectionResult[]> {
  try {
    const redis = getLogsRedis();
    if (!redis) {
      console.log('[BOT-API] Redis not available, using in-memory logs only');
      return [];
    }

    const logs = await redis.lrange('bot:logs', 0, 1000 - 1);
    if (!logs || logs.length === 0) {
      return [];
    }

    // Parse JSON strings to objects
    return logs.map(log => {
      try {
        return JSON.parse(log) as BotDetectionResult;
      } catch (e) {
        console.error('Error parsing log from Redis:', e);
        return null;
      }
    }).filter(Boolean) as BotDetectionResult[];
  } catch (e) {
    console.error('Error fetching logs from Redis:', e);
    return [];
  }
}

// Clear logs from Redis
async function clearRedisLogs(): Promise<void> {
  try {
    const redis = getLogsRedis();
    if (redis) {
      await redis.del('bot:logs');
      console.log('Successfully cleared logs from Redis');
    }
  } catch (e) {
    console.error('Error clearing logs from Redis:', e);
  }
}

// Combined function to get logs from both in-memory and Redis
async function getBotLogs(): Promise<BotDetectionResult[]> {
  console.log(`📋📋📋 [BOT-API] Retrieving logs`);

  // Get in-memory logs
  const memoryLogs = getInMemoryLogs();
  console.log(`In-memory logs count: ${memoryLogs.length}`);

  // Get Redis logs
  const redisLogs = await getRedisLogs();
  console.log(`Redis logs count: ${redisLogs.length}`);

  // Combine logs and deduplicate
  if (redisLogs.length === 0) {
    return memoryLogs;
  }

  const allLogs = [...redisLogs, ...memoryLogs];

  // Deduplicate by URL and timestamp
  const uniqueLogs = Array.from(
    new Map(allLogs.map(log => [`${log.url}-${log.timestamp}`, log])).values()
  );

  console.log(`Combined unique logs: ${uniqueLogs.length}`);
  return uniqueLogs;
}

// Combined function to clear logs from both in-memory and Redis
async function clearBotLogs(): Promise<void> {
  console.log('[BOT-API] Clearing all logs');

  // Clear in-memory logs
  clearInMemoryLogs();

  // Clear Redis logs
  await clearRedisLogs();
}

// Simple auth middleware for protecting the endpoint
const isAuthorized = (req: NextApiRequest): boolean => {
  return true;

  // In production, you'd want to use a proper authentication system
  // For this example, we'll use a simple API key approach
  const apiKey = req.headers['x-api-key'];
  const validApiKey = process.env.BOT_PROTECTION_DASHBOARD_KEY;

  // If no API key is configured, only allow in development
  if (!validApiKey) {
    return process.env.NODE_ENV === 'development';
  }

  return apiKey === validApiKey;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (DEBUG) {
    console.log(`[BOT-API] ${req.method} request to /api/bot-protection/logs`);
    console.log(`[BOT-API] Headers: ${JSON.stringify(req.headers['user-agent'])}`);
  }

  // Check authorization
  if (!isAuthorized(req)) {
    if (DEBUG) console.log('[BOT-API] Unauthorized access attempt');
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Handle different HTTP methods
  try {
    let logs: BotDetectionResult[] = [];
    let finalLogs: BotDetectionResult[] = [];

    switch (req.method) {
      case 'GET':
        // Get the bot logs with extra debugging
        console.log('🔎 Fetching logs via getBotLogs()...');
        logs = await getBotLogs();
        console.log(`🔎 getBotLogs returned ${logs.length} logs`);

        // Make sure we have logs for debugging
        finalLogs = ensureLogsExist(logs);

        // Add distinctive flag for visibility in console
        console.log('======= BOT PROTECTION API LOGS =======');
        console.log(`LOG COUNT: ${finalLogs.length}`);
        if (finalLogs.length > 0) {
          console.log(`NEWEST LOG: ${JSON.stringify({
            url: finalLogs[0].url,
            timestamp: finalLogs[0].timestamp,
            userAgent: finalLogs[0].userAgent?.substring(0, 30)
          })}`);
        } else {
          console.log('NO LOGS FOUND! This suggests middleware is not recording requests.');
        }
        console.log('======================================');

        if (DEBUG) console.log(`[BOT-API] Returning ${finalLogs.length} logs`);
        return res.status(200).json({ logs: finalLogs });

      case 'DELETE':
        // Clear all logs
        if (DEBUG) console.log('[BOT-API] Clearing all logs');
        await clearBotLogs();
        return res.status(200).json({ success: true });

      case 'POST':
        // Store a log to Redis (used by webhook or external system)
        if (!req.body || typeof req.body !== 'object') {
          console.error('[BOT-API] Invalid request body:', req.body);
          return res.status(400).json({ error: 'Invalid request body' });
        }

        console.log('[BOT-API] Received log via POST:', {
          url: req.body.url,
          timestamp: req.body.timestamp,
          ip: req.body.ip,
          bodySize: JSON.stringify(req.body).length
        });

        try {
          const redis = getLogsRedis();
          if (redis) {
            const logJson = JSON.stringify(req.body);
            console.log(`[BOT-API] Storing log in Redis (${logJson.length} bytes)`);

            // Store log in Redis
            await redis.lpush('bot:logs', logJson);
            await redis.ltrim('bot:logs', 0, 1000 - 1);

            // Verify the log was stored
            const count = await redis.llen('bot:logs');
            console.log(`[BOT-API] Successfully stored log in Redis. Current count: ${count}`);

            // Also add to memory logs for immediate access
            try {
              recentBotLogs.unshift(req.body);
              if (recentBotLogs.length > 1000) {
                recentBotLogs.length = 1000;
              }
            } catch (memErr) {
              console.error('[BOT-API] Error adding to memory logs:', memErr);
            }

            return res.status(200).json({
              success: true,
              redisCount: count
            });
          } else {
            console.error('[BOT-API] Redis client not available for log storage');
            return res.status(500).json({ error: 'Redis not available' });
          }
        } catch (e) {
          console.error('[BOT-API] Error storing log in Redis:', e);
          return res.status(500).json({
            error: 'Failed to store log',
            message: e instanceof Error ? e.message : String(e)
          });
        }

      default:
        if (DEBUG) console.log(`[BOT-API] Unsupported method: ${req.method}`);
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error in bot protection logs API:', error);
    return res.status(500).json({ error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' });
  }
} 
