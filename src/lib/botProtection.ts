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
  userAgent?: string | null,
  maxRequests: number = 60, // Default value if not provided
  windowSizeInSeconds: number = 60
): Promise<{ success: boolean; limit: number; remaining: number; reset: number }> => {
  // Log all parameters for debugging
  if (DEBUG) {
    console.log(`[RATE-LIMIT-DEBUG] Parameters:
      - IP: ${ip}
      - userAgent: ${userAgent ? userAgent.substring(0, 30) + '...' : 'null'}
      - maxRequests: ${maxRequests}
    `);
  }

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

  // Log the decision
  if (DEBUG) {
    console.log(`[RATE-LIMIT] IP: ${ip}, Count: ${record.count}/${maxRequests}, Allowed: ${isAllowed}`);
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

  // Facebook bots
  'facebookexternalhit': true,
  'facebookcatalog': true,
  'facebookbot': true,
  'facebook-api': true,
  'instagram': true,
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

  // Facebook IPs
  if ((userAgent.includes('facebook') || userAgent.includes('instagram')) && (
    ip.startsWith('31.13.') ||    // Facebook main range
    ip.startsWith('66.220.') ||   // Facebook range
    ip.startsWith('69.63.') ||    // Facebook range
    ip.startsWith('69.171.') ||   // Facebook range
    ip.startsWith('74.119.') ||   // Facebook range
    ip.startsWith('103.4.') ||    // Facebook Asia Pacific
    ip.startsWith('173.252.') ||  // Facebook range
    ip.startsWith('179.60.') ||   // Facebook range
    ip.startsWith('185.89.') ||   // Facebook Europe
    ip.startsWith('157.240.')     // Facebook range
  )) {
    return true;
  }

  // For other user agents, fall back to a lenient approach
  return isKnownBot(userAgent);
};

// Bot detection patterns
export const botPatterns = [
  /crawl/i,
  /bot(?!chovy|tle)/i,  // 'bot' but not in 'botchovy' or 'bottle'
  /spider/i,
  /scraper/i,
  /curl/i,
  /wget/i,
  /phantom/i,
  /headless/i,
  /archiver/i,
  /slurp/i,
  /chrome-lighthouse/i,
  /dataminr/i,
  /python-requests/i,
  /python-urllib/i,
  /ahrefs/i,
  /screaming frog/i,
];


// Modify the isSuspiciousBot function to exclude Facebook bots
export const isSuspiciousBot = (userAgent: string | null): boolean => {
  if (!userAgent) return true;

  // Check if it's a Facebook bot first
  if (isFacebookBot(userAgent)) return false;

  // Check for known search engines
  if (isKnownBot(userAgent)) return false;

  // Check for patterns
  for (const pattern of botPatterns) {
    if (pattern.test(userAgent)) {
      return true;
    }
  }

  return false;
};

// Add a specific Facebook check function
export const isFacebookBot = (userAgent: string | null): boolean => {
  if (!userAgent) return false;

  const lowerUA = userAgent.toLowerCase();
  return lowerUA.includes('facebookexternalhit') ||
    lowerUA.includes('facebookcatalog') ||
    lowerUA.includes('facebookbot');
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

// Update the getMatchedPatterns function to handle Facebook correctly
function getMatchedPatterns(userAgent: string | null): string[] {
  if (!userAgent) return [];

  const lowerUA = userAgent.toLowerCase();

  // Special case for Facebook - avoid flagging it as suspicious
  if (lowerUA.includes('facebookexternalhit') ||
    lowerUA.includes('facebookcatalog') ||
    lowerUA.includes('facebookbot')) {
    return ['facebook-legitimate'];
  }

  const patterns = [
    { name: 'crawl', regex: /crawl/i },
    { name: 'bot', regex: /bot(?!chovy|tle)/i }, // Exclude "botchovy", "bottle", etc.
    { name: 'spider', regex: /spider/i },
    { name: 'scraper', regex: /scraper/i },
    { name: 'curl', regex: /curl/i },
    { name: 'wget', regex: /wget/i },
    { name: 'phantom', regex: /phantom/i },
    { name: 'headless', regex: /headless/i },
    { name: 'archiver', regex: /archiver/i },
    { name: 'slurp', regex: /slurp/i },
    // Removed facebook from suspicious patterns
    { name: 'chrome-lighthouse', regex: /chrome-lighthouse/i },
    { name: 'dataminr', regex: /dataminr/i },
    { name: 'semrush', regex: /semrush/i },
    { name: 'python', regex: /python/i },
    { name: 'ahrefs', regex: /ahrefs/i },
    { name: 'screaming frog', regex: /screaming frog/i },
  ];

  const matches = patterns
    .filter(pattern => pattern.regex.test(userAgent))
    .map(pattern => pattern.name);

  if (DEBUG && matches.length > 0) {
    console.log(`[BOT-MONITOR] Pattern matches for UA: ${matches.join(', ')}`);
  }

  return matches;
}
