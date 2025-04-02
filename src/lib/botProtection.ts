import { NextRequest } from 'next/server';

// Check if bot protection is enabled from environment variable
const isBotProtectionEnabled = process.env.ENABLE_BOT_PROTECTION === 'true';

// Enable debug mode for local development
const DEBUG = process.env.NODE_ENV === 'development' ? true : false;

// Edge compatible in-memory rate limiter storage (for development/testing only)
// In production, use a durable edge-compatible solution like Vercel KV or upstash
const rateLimitMap = new Map<string, { count: number, reset: number }>();

// Redis rate limiter (Edge compatible version)
export const rateLimit = async (
  ip: string,
  maxRequests: number = 60,
  windowSizeInSeconds: number = 60
): Promise<{ success: boolean; limit: number; remaining: number; reset: number }> => {
  // If protection is disabled, always allow
  if (!isBotProtectionEnabled) {
    return {
      success: true,
      limit: maxRequests,
      remaining: maxRequests - 1,
      reset: Math.floor(Date.now() / 1000) + windowSizeInSeconds
    };
  }

  const now = Math.floor(Date.now() / 1000);
  const windowStart = now - (now % windowSizeInSeconds);
  const windowExpire = windowStart + windowSizeInSeconds;
  const key = `ratelimit:${ip}:${windowStart}`;

  try {
    // Clean up expired entries
    for (const [storedKey, data] of rateLimitMap.entries()) {
      if (data.reset < now) {
        rateLimitMap.delete(storedKey);
      }
    }

    // Get or create rate limit data
    let rateData = rateLimitMap.get(key);
    if (!rateData) {
      rateData = { count: 0, reset: windowExpire };
    }

    // Increment counter
    rateData.count++;
    rateLimitMap.set(key, rateData);

    if (DEBUG) {
      console.log(`[RATE-LIMIT] IP: ${ip}, Count: ${rateData.count}/${maxRequests}`);
    }

    return {
      success: rateData.count <= maxRequests,
      limit: maxRequests,
      remaining: Math.max(0, maxRequests - rateData.count),
      reset: windowExpire
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

// Advanced bot verification via DNS lookup - Edge compatible version
export const verifySearchEngineBot = async (ip: string, userAgent: string | null): Promise<boolean> => {
  if (!userAgent) return false;

  userAgent = userAgent.toLowerCase();

  try {
    // Only verify common search engine bots
    const isGoogle = userAgent.includes('google');
    const isBing = userAgent.includes('bing') || userAgent.includes('msn');
    const isYandex = userAgent.includes('yandex');
    const isBaidu = userAgent.includes('baidu');

    if (!isGoogle && !isBing && !isYandex && !isBaidu) return false;

    // In Edge runtime, we can't do DNS lookups
    // For development/testing, we'll just assume the bot is legitimate
    // In production, this should be replaced with a proper verification service
    if (DEBUG) {
      console.log(`[BOT-VERIFY] Skipping DNS verification in Edge runtime for: ${userAgent}`);
    }

    // As a simple heuristic, check if IP is in common ranges
    // This isn't reliable but better than nothing in Edge
    // Google's crawlers often come from 66.249.xx.xx
    if (isGoogle && ip.startsWith('66.249.')) {
      return true;
    }

    // For development, return true to simulate successful verification
    return process.env.NODE_ENV === 'development';
  } catch (error) {
    console.error('Bot verification error:', error);
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
