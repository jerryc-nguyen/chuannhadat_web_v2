import { NextRequest } from 'next/server';

// Check if bot protection is enabled from environment variable
const isBotProtectionEnabled = process.env.ENABLE_BOT_PROTECTION === 'true';

// Enable debug mode for local development
const DEBUG = process.env.DEBUG_BOT_PROTECTION === 'true';

// Simple in-memory rate limiter for middleware
// This avoids Redis dependencies in the middleware context
const ipRequestCounts = new Map<string, { count: number, timestamp: number }>();

// Redis will only be used in the API routes, not middleware
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
  const reset = windowStart + windowSizeInSeconds;

  // Check if we have a record for this IP in the current window
  const record = ipRequestCounts.get(ip);

  // If no record exists or it's from a previous window, create a new one
  if (!record || record.timestamp < windowStart) {
    ipRequestCounts.set(ip, { count: 1, timestamp: now });
    return {
      success: true,
      limit: maxRequests,
      remaining: maxRequests - 1,
      reset
    };
  }

  // Increment the counter
  record.count += 1;

  // Check if the request is allowed
  const isAllowed = record.count <= maxRequests;
  const remaining = Math.max(0, maxRequests - record.count);

  if (DEBUG) {
    console.log(`[RATE-LIMIT] IP: ${ip}, Count: ${record.count}/${maxRequests}`);
  }

  // Periodically clean up old records (do this async to not block)
  if (now % 10 === 0) { // Clean every ~10 seconds
    setTimeout(() => {
      for (const [ipKey, data] of ipRequestCounts.entries()) {
        if (data.timestamp < windowStart) {
          ipRequestCounts.delete(ipKey);
        }
      }
    }, 0);
  }

  return {
    success: isAllowed,
    limit: maxRequests,
    remaining,
    reset
  };
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

  // IP-based verification 
  // Google IPs
  if (userAgent.includes('google') && (
    ip.startsWith('66.249.') || // Core Googlebot range
    ip.startsWith('64.233.') ||
    ip.startsWith('216.239.') ||
    ip.startsWith('172.217.') ||
    ip.startsWith('34.') ||
    ip.startsWith('35.') ||
    ip.startsWith('209.85.')
  )) {
    return true;
  }

  // Bing IPs
  if ((userAgent.includes('bing') || userAgent.includes('msn')) && (
    ip.startsWith('157.55.') ||
    ip.startsWith('207.46.') ||
    ip.startsWith('40.77.') ||
    ip.startsWith('13.66.') ||
    ip.startsWith('131.253.') ||
    ip.startsWith('199.30.') ||
    ip.startsWith('157.56.') ||
    ip.startsWith('20.31.') ||
    ip.startsWith('20.175.') ||
    ip.startsWith('20.186.')
  )) {
    return true;
  }

  // For other user agents, fall back to a lenient approach
  return isKnownBot(userAgent);
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
