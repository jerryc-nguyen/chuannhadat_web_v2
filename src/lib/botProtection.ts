import Redis from 'ioredis';
import { NextRequest } from 'next/server';

// Check if bot protection is enabled from environment variable
const isBotProtectionEnabled = process.env.ENABLE_BOT_PROTECTION === 'true';

// Configure Redis client (use environment variables in production)
let redis: Redis | null = null;
let redisConnectionError = false;

// Initialize Redis connection
const getRedisClient = (): Redis | null => {
  // Skip Redis if bot protection is disabled
  if (!isBotProtectionEnabled) {
    return null;
  }

  // Don't retry connection if we already had an error
  if (redisConnectionError) {
    return null;
  }

  if (!redis) {
    try {
      redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
        connectTimeout: 5000, // 5 seconds
        maxRetriesPerRequest: 3,
        retryStrategy(times) {
          if (times > 3) {
            // After 3 retries, mark as error and stop trying
            redisConnectionError = true;
            console.error('Redis connection failed after multiple retries, disabling rate limiting');
            return null;
          }
          return Math.min(times * 50, 1000); // Exponential backoff up to 1s
        },
      });

      // Reset error flag if connection is successful
      redis.on('connect', () => {
        redisConnectionError = false;
        console.log('Connected to Redis successfully');
      });

      // Log errors but don't crash the application
      redis.on('error', (err) => {
        console.error('Redis connection error:', err);
        redisConnectionError = true;
      });
    } catch (error) {
      console.error('Failed to initialize Redis client:', error);
      redisConnectionError = true;
      return null;
    }
  }
  return redis;
};

// Redis rate limiter
export const rateLimit = async (
  ip: string,
  maxRequests: number = 60,
  windowSizeInSeconds: number = 60
): Promise<{ success: boolean; limit: number; remaining: number; reset: number }> => {
  // If protection is disabled or Redis is not available, always allow
  if (!isBotProtectionEnabled || redisConnectionError) {
    return {
      success: true,
      limit: maxRequests,
      remaining: maxRequests - 1,
      reset: Math.floor(Date.now() / 1000) + windowSizeInSeconds
    };
  }

  const client = getRedisClient();
  if (!client) {
    // Redis client not available, default to allowing the request
    return {
      success: true,
      limit: maxRequests,
      remaining: maxRequests - 1,
      reset: Math.floor(Date.now() / 1000) + windowSizeInSeconds
    };
  }

  const now = Math.floor(Date.now() / 1000);
  const windowStart = now - (now % windowSizeInSeconds);
  const windowExpire = windowStart + windowSizeInSeconds * 2; // Keep for current and next window
  const key = `ratelimit:${ip}:${windowStart}`;

  try {
    // Use Redis transaction to ensure atomicity
    const multi = client.multi();
    multi.incr(key);
    multi.expireat(key, windowExpire);

    const results = await multi.exec();
    if (!results) {
      // Redis transaction failed, default to allowing the request
      return {
        success: true,
        limit: maxRequests,
        remaining: maxRequests - 1,
        reset: windowStart + windowSizeInSeconds
      };
    }

    const currentRequests = (results[0][1] as number) || 1;

    return {
      success: currentRequests <= maxRequests,
      limit: maxRequests,
      remaining: Math.max(0, maxRequests - currentRequests),
      reset: windowStart + windowSizeInSeconds
    };
  } catch (error) {
    console.error('Rate limiting error:', error);
    // In case of error, allow the request
    return {
      success: true,
      limit: maxRequests,
      remaining: maxRequests - 1,
      reset: windowStart + windowSizeInSeconds
    };
  }
};

// List of allowed bot user agents
export const allowedBots: Record<string, boolean> = {
  // Google bots
  'googlebot': true,
  'adsbot-google': true,
  'apis-google': true,
  'mediapartners-google': true,
  'feedfetcher-google': true,
  'google-read-aloud': true,
  'storebot-google': true,
  'google-searchbyimage': true,
  'google web preview': true,

  // Bing bots
  'bingbot': true,
  'msnbot': true,
  'adidxbot': true,
  'bingpreview': true,

  // Add other legitimate search engines
  'yandexbot': true,
  'duckduckbot': true,
  'baiduspider': true,
  'applebot': true
};

// Check if a user agent belongs to a known bot
export const isKnownBot = (userAgent: string | null): boolean => {
  if (!userAgent) return false;

  userAgent = userAgent.toLowerCase();

  for (const botName in allowedBots) {
    if (userAgent.includes(botName)) {
      return true;
    }
  }

  return false;
};

// Advanced bot verification via DNS lookup
export const verifySearchEngineBot = async (ip: string, userAgent: string | null): Promise<boolean> => {
  if (!userAgent) return false;

  userAgent = userAgent.toLowerCase();

  try {
    // Only verify Google and Bing bots
    const isGoogle = userAgent.includes('google');
    const isBing = userAgent.includes('bing') || userAgent.includes('msn');
    const isYandex = userAgent.includes('yandex');
    const isBaidu = userAgent.includes('baidu');

    if (!isGoogle && !isBing && !isYandex && !isBaidu) return false;

    // Perform DNS lookup
    const dns = await import('dns');
    const util = await import('util');
    const reverseLookup = util.promisify(dns.reverse);

    const addresses = await reverseLookup(ip);
    if (addresses.length === 0) return false;

    const hostname = addresses[0].toLowerCase();

    // Verify the hostname belongs to the correct domain
    if (isGoogle && (hostname.includes('googlebot.com') || hostname.includes('google.com'))) {
      return true;
    }

    if (isBing && (hostname.includes('search.msn.com') || hostname.includes('bing.com'))) {
      return true;
    }

    if (isYandex && hostname.includes('yandex.ru')) {
      return true;
    }

    if (isBaidu && hostname.includes('baidu.com')) {
      return true;
    }

    return false;
  } catch (error) {
    console.error('Bot verification error:', error);
    // If verification fails, assume it's not a legitimate bot
    return false;
  }
};

// Bot detection patterns
export const botPatterns = [
  /crawl/i,
  /bot/i,
  /spider/i,
  /scraper/i,
  /curl/i,
  /wget/i,
  /phantom/i,
  /headless/i,
  /archiver/i,
  /slurp/i,
  /facebook/i,
  /chrome-lighthouse/i,
  /dataminr/i,
  /semrush/i,
  /python-requests/i,
  /python-urllib/i,
  /ahrefs/i,
  /screaming frog/i,
];

// Detect suspicious bots
export const isSuspiciousBot = (userAgent: string | null): boolean => {
  if (!userAgent) return true;

  for (const pattern of botPatterns) {
    if (pattern.test(userAgent) && !isKnownBot(userAgent)) {
      return true;
    }
  }

  return false;
};

// Check for suspicious headers
export const hasSuspiciousHeaders = (req: NextRequest): boolean => {
  const noAcceptHeader = !req.headers.get('accept');
  const noAcceptLanguage = !req.headers.get('accept-language');
  const noAcceptEncoding = !req.headers.get('accept-encoding');
  const hasReferer = !!req.headers.get('referer');

  return (noAcceptHeader && noAcceptLanguage && noAcceptEncoding && !hasReferer);
};

// Check for suspicious request patterns
export const hasUnusualRequestPattern = (req: NextRequest): boolean => {
  const path = req.nextUrl.pathname.toLowerCase();
  const userAgent = req.headers.get('user-agent');

  const isSuspiciousPath = path.includes('wp-') ||
    path.includes('admin') ||
    path.includes('.php') ||
    (path.endsWith('.xml') && !path.endsWith('sitemap.xml')) ||
    path.includes('.env') ||
    path.includes('config') ||
    path.includes('backup');

  if (isSuspiciousPath && isSuspiciousBot(userAgent)) {
    return true;
  }

  return false;
}; 
