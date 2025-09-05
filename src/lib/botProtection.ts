import { NextRequest } from 'next/server';

// Check if bot protection is enabled from environment variable
const isBotProtectionEnabled = process.env.ENABLE_BOT_PROTECTION === 'true';

// Enable debug mode for local development
const DEBUG = process.env.DEBUG_BOT_PROTECTION === 'true';

// Simple in-memory rate limiter for middleware
// This avoids Redis dependencies in the middleware context
const ipRequestCounts = new Map<string, { count: number, timestamp: number }>();

// DNS result cache to avoid repeated lookups for the same IPs
// Cache results for 1 hour to balance performance and accuracy
const dnsCache = new Map<string, {
  result: boolean,
  timestamp: number,
  hostname?: string
}>();
const DNS_CACHE_TTL = 60 * 60 * 1000; // 1 hour in milliseconds

// Redis will only be used in the API routes, not middleware
export const rateLimit = async (
  ip: string,
  userAgent?: string | null,
  maxRequests = 60, // Default value if not provided
  windowSizeInSeconds = 60
): Promise<{ success: boolean; limit: number; remaining: number; reset: number }> => {
  // Log all parameters for debugging
  if (DEBUG) {
    // eslint-disable-next-line no-console
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
    // eslint-disable-next-line no-console
    console.log(`[RATE-LIMIT] IP: ${ip}, Count: ${record.count}/${maxRequests}, Allowed: ${isAllowed}`);
  }

  // Periodically clean up old records (do this async to not block)
  if (now % 10 === 0) { // Clean every ~10 seconds
    setTimeout(() => {
      // Clean rate limit records
      for (const [ipKey, data] of ipRequestCounts.entries()) {
        if (data.timestamp < windowStart) {
          ipRequestCounts.delete(ipKey);
        }
      }

      // Clean DNS cache and enforce size limits
      const currentTime = Date.now();
      let cleanedCount = 0;

      for (const [cacheKey, cacheData] of dnsCache.entries()) {
        if (currentTime - cacheData.timestamp > DNS_CACHE_TTL) {
          dnsCache.delete(cacheKey);
          cleanedCount++;
        }
      }

      // Enforce cache size limit (max 1000 entries)
      if (dnsCache.size > 1000) {
        const entries = Array.from(dnsCache.entries());
        entries.sort((a, b) => a[1].timestamp - b[1].timestamp); // Sort by oldest first
        const toDelete = entries.slice(0, dnsCache.size - 800); // Keep newest 800
        toDelete.forEach(([key]) => dnsCache.delete(key));
      }

      if (DEBUG && (cleanedCount > 0 || ipRequestCounts.size > 100)) {
        // eslint-disable-next-line no-console
        console.log(`[CLEANUP] Cleaned ${cleanedCount} DNS cache entries, ${ipRequestCounts.size} rate limit entries`);
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
  'google-site-verification': true,

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

  // Other legitimate search engines
  'yandexbot': true,
  'baiduspider': true,
  'duckduckbot': true,
  'slurp': true, // Yahoo
  'twitterbot': true,
  'linkedinbot': true,
  'whatsapp': true,
  'telegrambot': true,
  'applebot': true,
  'discordbot': true,

  // SEO and monitoring tools (legitimate)
  'ahrefsbot': true,
  'semrushbot': true,
  'mj12bot': true,
  'dotbot': true,
  'uptimerobot': true,
  'pingdom': true,
  'gtmetrix': true,
  'lighthouse': true,
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

// Advanced bot verification via reverse DNS lookup
// This is the official method recommended by Google and other search engines
export const verifySearchEngineBot = async (ip: string, userAgent: string | null): Promise<boolean> => {
  if (!userAgent) return false;

  const lowerUA = userAgent.toLowerCase();

  // Check DNS cache first
  const cacheKey = `${ip}:${lowerUA.substring(0, 20)}`;
  const cached = dnsCache.get(cacheKey);
  if (cached && (Date.now() - cached.timestamp) < DNS_CACHE_TTL) {
    if (DEBUG) {
      // eslint-disable-next-line no-console
      console.log(`[BOT-VERIFY] Cache hit for ${ip} → ${cached.result}`);
    }
    return cached.result;
  }

  try {
    // Use Node.js dns module for reverse DNS lookup
    const dns = await import('dns');
    const { promisify } = await import('util');

    // Add timeout to prevent hanging
    const withTimeout = <T>(promise: Promise<T>, timeoutMs: number): Promise<T> => {
      return Promise.race([
        promise,
        new Promise<T>((_, reject) =>
          setTimeout(() => reject(new Error('DNS lookup timeout')), timeoutMs)
        )
      ]);
    };

    const reverse = promisify(dns.reverse);
    const lookup = promisify(dns.lookup);

    // Step 1: Reverse DNS lookup to get hostname (with 5s timeout)
    const hostnames = await withTimeout(reverse(ip), 5000);
    if (!hostnames || hostnames.length === 0) {
      if (DEBUG) {
        // eslint-disable-next-line no-console
        console.log(`[BOT-VERIFY] No reverse DNS found for ${ip}`);
      }
      // Cache negative result
      dnsCache.set(cacheKey, { result: false, timestamp: Date.now() });
      return false;
    }

    const hostname = hostnames[0].toLowerCase();
    if (DEBUG) {
      // eslint-disable-next-line no-console
      console.log(`[BOT-VERIFY] ${ip} → ${hostname}`);
    }

    // Step 2: Verify hostname matches expected patterns
    let isValidHostname = false;

    if (lowerUA.includes('google')) {
      // Google: *.googlebot.com or *.google.com
      isValidHostname = hostname.endsWith('.googlebot.com') ||
        hostname.endsWith('.google.com');
    } else if (lowerUA.includes('bing') || lowerUA.includes('msn')) {
      // Bing: *.search.msn.com
      isValidHostname = hostname.endsWith('.search.msn.com');
    } else if (lowerUA.includes('facebook')) {
      // Facebook: *.facebook.com
      isValidHostname = hostname.endsWith('.facebook.com');
    } else if (lowerUA.includes('yandex')) {
      // Yandex: *.yandex.ru or *.yandex.net
      isValidHostname = hostname.endsWith('.yandex.ru') ||
        hostname.endsWith('.yandex.net');
    } else if (lowerUA.includes('baidu')) {
      // Baidu: *.baidu.com or *.baidu.jp
      isValidHostname = hostname.endsWith('.baidu.com') ||
        hostname.endsWith('.baidu.jp');
    } else if (lowerUA.includes('duckduckgo')) {
      // DuckDuckGo: *.duckduckgo.com
      isValidHostname = hostname.endsWith('.duckduckgo.com');
    } else if (lowerUA.includes('twitter') || lowerUA.includes('twitterbot')) {
      // Twitter: *.twitter.com
      isValidHostname = hostname.endsWith('.twitter.com');
    } else if (lowerUA.includes('linkedin')) {
      // LinkedIn: *.linkedin.com
      isValidHostname = hostname.endsWith('.linkedin.com');
    } else if (lowerUA.includes('yahoo') || lowerUA.includes('slurp')) {
      // Yahoo: *.crawl.yahoo.net
      isValidHostname = hostname.endsWith('.crawl.yahoo.net');
    } else if (lowerUA.includes('apple') || lowerUA.includes('applebot')) {
      // Apple: *.applebot.apple.com
      isValidHostname = hostname.endsWith('.applebot.apple.com');
    } else if (lowerUA.includes('whatsapp')) {
      // WhatsApp: *.whatsapp.net or *.whatsapp.com
      isValidHostname = hostname.endsWith('.whatsapp.net') ||
        hostname.endsWith('.whatsapp.com');
    } else if (lowerUA.includes('telegram')) {
      // Telegram: *.telegram.org
      isValidHostname = hostname.endsWith('.telegram.org');
    } else if (lowerUA.includes('discord')) {
      // Discord: *.discord.com or *.discordapp.com
      isValidHostname = hostname.endsWith('.discord.com') ||
        hostname.endsWith('.discordapp.com');
    }

    if (!isValidHostname) {
      if (DEBUG) {
        // eslint-disable-next-line no-console
        console.log(`[BOT-VERIFY] Invalid hostname pattern: ${hostname} for UA: ${lowerUA.substring(0, 50)}`);
      }
      // Cache negative result
      dnsCache.set(cacheKey, { result: false, timestamp: Date.now(), hostname });
      return false;
    }

    // Step 3: Forward DNS lookup to verify IP matches (with 5s timeout)
    const lookupResult = await withTimeout(lookup(hostname), 5000);
    const isVerified = lookupResult.address === ip;

    if (DEBUG) {
      // eslint-disable-next-line no-console
      console.log(`[BOT-VERIFY] ${hostname} → ${lookupResult.address}, matches: ${isVerified}`);
    }

    // Cache the result (both positive and negative)
    dnsCache.set(cacheKey, { result: isVerified, timestamp: Date.now(), hostname });

    return isVerified;

  } catch (error) {
    // If DNS lookup fails, fall back to lenient approach for known bots
    // This prevents blocking legitimate crawlers due to DNS issues
    if (DEBUG) {
      // eslint-disable-next-line no-console
      console.log(`[BOT-VERIFY] DNS lookup failed for ${ip}: ${error}`);
    }

    // For known bot user agents, be lenient when DNS fails
    // Better to allow a legitimate bot than block it
    const fallbackResult = isKnownBot(userAgent);

    // Cache fallback result for shorter time (15 minutes) to retry sooner
    dnsCache.set(cacheKey, {
      result: fallbackResult,
      timestamp: Date.now() - (DNS_CACHE_TTL - 15 * 60 * 1000) // Expire in 15 min
    });

    return fallbackResult;
  }
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

// Utility function to get cache statistics (for monitoring)
export const getCacheStats = () => {
  const now = Date.now();
  let expiredDnsEntries = 0;
  let expiredRateLimitEntries = 0;

  for (const [, data] of dnsCache.entries()) {
    if (now - data.timestamp > DNS_CACHE_TTL) {
      expiredDnsEntries++;
    }
  }

  const windowStart = Math.floor(now / 1000) - (Math.floor(now / 1000) % 60);
  for (const [, data] of ipRequestCounts.entries()) {
    if (data.timestamp < windowStart) {
      expiredRateLimitEntries++;
    }
  }

  return {
    dnsCache: {
      total: dnsCache.size,
      expired: expiredDnsEntries,
      active: dnsCache.size - expiredDnsEntries
    },
    rateLimitCache: {
      total: ipRequestCounts.size,
      expired: expiredRateLimitEntries,
      active: ipRequestCounts.size - expiredRateLimitEntries
    }
  };
};
