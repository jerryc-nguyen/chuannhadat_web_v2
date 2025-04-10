import { NextRequest, NextResponse } from 'next/server';
import {
  rateLimit,
  isKnownBot,
  verifySearchEngineBot,
  isSuspiciousBot,
  hasSuspiciousHeaders,
  hasUnusualRequestPattern,
} from './botProtection';
import { getClientIp } from '../middleware/bot-protection';

// Enable debug mode for local development
const DEBUG = process.env.DEBUG_BOT_PROTECTION === 'true';

// Helper functions for controlled logging
const log = {
  error: (message: string, ...args: any[]) => {
    // Always log errors (level >= 1)
    if (DEBUG) {
      console.error(`[BOT-MONITOR] ❌ ${message}`, ...args);
    }
  },
  info: (message: string, ...args: any[]) => {
    // Only log important info (level >= 2)
    if (DEBUG) {
      console.log(`[BOT-MONITOR] ${message}`, ...args);
    }
  },
  verbose: (message: string, ...args: any[]) => {
    // Only log verbose details (level >= 3)
    if (DEBUG) {
      console.log(`[BOT-MONITOR] 🔍 ${message}`, ...args);
    }
  },
  storage: (message: string, ...args: any[]) => {
    // Only log storage actions if forced or debug (level >= 2)
    if (DEBUG) {
      console.log(`[BOT-MONITOR] 📝 ${message}`, ...args);
    }
  },
  result: (message: string, ...args: any[]) => {
    // Only log important results (level >= 2)
    if (DEBUG) {
      console.log(`[BOT-MONITOR] ${message}`, ...args);
    }
  }
};

// Interface for bot detection results
interface BotDetectionResult {
  timestamp: string;
  url: string;
  ip: string;
  userAgent: string | null;
  isBot: boolean;
  isSuspicious: boolean;
  requestDenied: boolean;
  rateLimited: boolean;
  rateLimitRemaining: number;
  suspiciousDetails: {
    isKnownSearchEngine: boolean;
    hasSuspiciousUserAgent: boolean;
    hasSuspiciousHeaders: boolean;
    hasUnusualPattern: boolean;
    matchedPatterns: string[];
  };
}

// Store recent bot detection logs in memory
// This is used by both middleware and API routes
const recentBotLogs: BotDetectionResult[] = [];
const MAX_LOGS = 20000;

// Export the interface for use in API routes
export type { BotDetectionResult };

// Function to send logs to the API for Redis storage
// This is called after in-memory storage and avoids direct Redis dependency in middleware
async function sendLogToAPI(botLog: BotDetectionResult): Promise<void> {
  // Skip in production builds
  if (process.env.NODE_ENV === 'production') {
    // In production, we'll use a separate process or worker to handle logs
    return;
  }

  try {
    // Construct absolute URL based on request origin or environment
    const baseUrl = typeof window !== 'undefined'
      ? window.location.origin
      : process.env.NEXT_PUBLIC_BASE_CHUANHADAT_DOMAIN || 'http://localhost:3000';

    // Use fetch with no-wait to avoid blocking
    fetch(`${baseUrl}/api/bot-protection/logs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add an API key if configured
        ...(process.env.BOT_PROTECTION_DASHBOARD_KEY && {
          'x-api-key': process.env.BOT_PROTECTION_DASHBOARD_KEY
        })
      },
      body: JSON.stringify(botLog)
    }).catch(err => {
      // Silently catch errors to avoid breaking the middleware
      log.error('Error sending log to API:', err);
    });

    log.verbose('Log sent to API for processing');
  } catch (error) {
    // Don't let errors in API storage affect the middleware
    log.error('Error initializing log API call:', error);
  }
}

// Store bot detection log for dashboard/monitoring
// This is a simplified version that only uses memory storage
// Redis functionality will be added only in the API routes
function storeDetectionLog(detectionResult: BotDetectionResult) {
  log.storage(`Storing detection log for ${detectionResult.url}`);

  // Store the log in memory (for all environments)
  recentBotLogs.unshift(detectionResult);

  // Trim the in-memory logs to prevent memory growth
  if (recentBotLogs.length > MAX_LOGS) {
    recentBotLogs.length = MAX_LOGS;
  }

  // Also send the log to the API for Redis storage
  // This is done non-blocking and won't affect middleware performance
  sendLogToAPI(detectionResult);
}

// Get logs (simplified version for middleware)
// The full Redis implementation is in the API route
export function getBotLogs(): BotDetectionResult[] {
  return [...recentBotLogs];
}

// Clear logs (simplified version for middleware)
// The full Redis implementation is in the API route
export function clearBotLogs(): void {
  recentBotLogs.length = 0;
}

// Extract patterns that matched in the user agent
function getMatchedPatterns(userAgent: string | null): string[] {
  if (!userAgent) return [];

  const patterns = [
    { name: 'crawl', regex: /crawl/i },
    { name: 'bot', regex: /bot/i },
    { name: 'spider', regex: /spider/i },
    { name: 'scraper', regex: /scraper/i },
    { name: 'curl', regex: /curl/i },
    { name: 'wget', regex: /wget/i },
    { name: 'phantom', regex: /phantom/i },
    { name: 'headless', regex: /headless/i },
    { name: 'archiver', regex: /archiver/i },
    { name: 'slurp', regex: /slurp/i },
    { name: 'facebook', regex: /facebook/i },
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

// Function to check if a path should be excluded from rate limiting
export function isRateLimitExcluded(pathname: string, url?: string, req?: NextRequest): boolean {
  // Exclude specific paths
  if (pathname.startsWith('/_next/') || pathname.startsWith('/monitoring')) {
    log.storage(`Excluded path: ${pathname}`);
    return true;
  }

  // Exclude Next.js AJAX requests (used for client navigation)
  let isNextJsAjax = false;

  // Check URL for _rsc parameter variants
  if (url) {
    isNextJsAjax = isNextJsAjax ||
      url.includes('_rsc=') ||
      url.includes('?_rsc') ||
      url.includes('&_rsc');
  }

  // Check for Next.js-specific headers if request object available
  if (req) {
    const referer = req.headers.get('referer') || '';
    isNextJsAjax = isNextJsAjax ||
      referer.includes('_rsc') ||
      req.headers.has('x-nextjs-data') ||
      req.headers.has('next-router-state-tree') ||
      req.headers.has('next-url');

    // Enhanced logging of the detection method
    if (DEBUG) {
      console.log(`🔎 AJAX CHECK:
      - URL _rsc check: ${url?.includes('_rsc')}
      - referer _rsc: ${referer.includes('_rsc')}
      - x-nextjs-data: ${req.headers.has('x-nextjs-data')}
      - next-router-state-tree: ${req.headers.has('next-router-state-tree')}
      - next-url: ${req.headers.has('next-url')}
      `);
    }
  }

  if (isNextJsAjax) {
    // Print the URL for debugging
    if (DEBUG) {
      console.log(`⚠️⚠️⚠️ EXCLUDING NEXT.JS AJAX REQUEST: ${url || pathname}`);
    }

    log.storage(`Excluded AJAX request: ${url || pathname}`);
    return true;
  }

  return false;
}

// Bot protection middleware with enhanced monitoring
export async function monitorBotProtection(
  req: NextRequest
): Promise<{ response: NextResponse | null; result: BotDetectionResult }> {
  const start = Date.now();
  const url = req.nextUrl.toString();
  const pathname = req.nextUrl.pathname;
  const searchParams = req.nextUrl.searchParams.toString();
  const userAgent = req.headers.get('user-agent');
  const ip = getClientIp(req) || '0.0.0.0';

  // Preprocessing - Do this once instead of repeatedly
  const lowerUA = userAgent?.toLowerCase() || '';

  log.verbose(`Processing request: ${url}`);
  log.verbose(`URL searchParams: ${searchParams}`);
  log.verbose(`IP: ${ip}, UA: ${lowerUA.substring(0, 30)}...`);

  // Fast path - check for common exclusions first
  if (isRateLimitExcluded(pathname, url, req)) {
    const result = createBasicResult(url, ip, userAgent, false);
    log.storage(`Path excluded from rate limiting: ${pathname}`);
    storeDetectionLog(result);
    return { response: null, result };
  }

  // Fast bot detection - check once and store result
  const botType = detectBotType(lowerUA, ip);

  // If it's a known bot type, fast-track the response
  if (botType) {
    const result = createAllowedBotResult(url, ip, userAgent, botType);
    log.info(`${botType.name} detected: ${ip}, UA: ${lowerUA.substring(0, 30)}...`);
    storeDetectionLog(result);
    console.log(`✅ ALLOWED ${botType.name} bot: ${userAgent?.substring(0, 50) || 'unknown'}...`);
    return { response: null, result };
  }

  // Create the detection result object for normal processing
  const result: BotDetectionResult = {
    timestamp: new Date().toISOString(),
    url,
    ip,
    userAgent,
    isBot: false,
    isSuspicious: false,
    requestDenied: false,
    rateLimited: false,
    rateLimitRemaining: 0,
    suspiciousDetails: {
      isKnownSearchEngine: false,
      hasSuspiciousUserAgent: false,
      hasSuspiciousHeaders: false,
      hasUnusualPattern: false,
      matchedPatterns: getMatchedPatterns(userAgent),
    }
  };

  // 1. Check for rate limiting
  log.verbose(`Checking rate limit for IP: ${ip}`);
  const rateLimitResult = await rateLimit(ip);
  result.rateLimited = !rateLimitResult.success;
  result.rateLimitRemaining = rateLimitResult.remaining;
  log.verbose(`Rate limit result: ${JSON.stringify(rateLimitResult)}`);

  // 2. Check if it's a known search engine bot
  const isSearchEngineBot = isKnownBot(userAgent);
  result.suspiciousDetails.isKnownSearchEngine = isSearchEngineBot;
  if (isSearchEngineBot) log.verbose(`Known search engine detected`);

  // 3. If it claims to be a search engine, verify it
  let isVerifiedBot = false;
  if (isSearchEngineBot) {
    log.verbose(`Verifying search engine bot claim`);
    isVerifiedBot = await verifySearchEngineBot(ip, userAgent);
    log.verbose(`Verification result: ${isVerifiedBot ? 'Legitimate' : 'Spoofed'}`);
  }

  // 4. Check for suspicious characteristics
  const suspiciousUA = isSuspiciousBot(userAgent);
  const suspiciousHeaders = hasSuspiciousHeaders(req);
  const unusualPattern = hasUnusualRequestPattern(req);

  result.suspiciousDetails.hasSuspiciousUserAgent = suspiciousUA;
  result.suspiciousDetails.hasSuspiciousHeaders = suspiciousHeaders;
  result.suspiciousDetails.hasUnusualPattern = unusualPattern;

  log.verbose(`Suspicious UA: ${suspiciousUA}`);
  log.verbose(`Suspicious headers: ${suspiciousHeaders}`);
  log.verbose(`Unusual request pattern: ${unusualPattern}`);

  // Determine if this is a bot and if it's suspicious
  result.isBot = isSearchEngineBot || suspiciousUA;
  result.isSuspicious = (isSearchEngineBot && !isVerifiedBot) ||
    suspiciousUA ||
    suspiciousHeaders ||
    unusualPattern;

  // Decide whether to block the request
  // Block if rate limited or is a suspicious bot (but not verified search engine)
  result.requestDenied = result.rateLimited ||
    (result.isSuspicious && !(isSearchEngineBot && isVerifiedBot));

  // Store the log using our storage function
  storeDetectionLog(result);

  // Always show log storage regardless of DEBUG setting
  const homepageFlag = result.url.match(/\/(home|index)?(\?|$)/) ? ' 🏠 HOME PAGE' : '';

  // Control storage logs with environment variable
  if (DEBUG) {
    console.log(`💾💾💾 BOT LOG STORED for${homepageFlag}: ${result.url}`);
    console.log(`💾💾💾 Current log count: ${recentBotLogs.length}`);
  }

  // Log to console
  const executionTime = Date.now() - start;
  log.info(`${result.requestDenied ? '🚫 BLOCKED' : '✅ ALLOWED'} ${url}: ${userAgent} (${executionTime}ms)`);

  if ((result.isBot || result.isSuspicious) && DEBUG) {
    log.verbose(`Bot details: ${JSON.stringify({
      type: 'bot_detection',
      ...result
    }, null, 2)}`);
  }

  // If the request should be denied, return 403 response
  if (result.requestDenied) {
    console.log(`🚫 BLOCKED ${url}: ${userAgent}`);
    const response = NextResponse.json(
      { error: 'Access Denied', code: 'BOT_PROTECTION' },
      { status: 403 }
    );
    return { response, result };
  }

  log.verbose(`Request processing complete in ${executionTime}ms`);
  // Otherwise continue with the request
  return { response: null, result };
}

// Helper functions to optimize performance

// Unified bot detection function - returns bot type or null
function detectBotType(lowerUA: string, ip: string): { name: string, rateLimit: number } | null {
  // Early return if no user agent
  if (!lowerUA) return null;

  // Check for PageSpeed/Lighthouse
  if (lowerUA.includes('lighthouse') ||
    lowerUA.includes('pagespeed') ||
    lowerUA.includes('chrome-lighthouse') ||
    lowerUA.includes('googleother')) {
    return { name: 'PageSpeed', rateLimit: 999 };
  }

  // Check for ChatGPT
  const isChatGpt = lowerUA.includes('chatgpt') ||
    lowerUA.includes('gptbot') ||
    lowerUA.includes('openai');

  if (isChatGpt) {
    const isChatGptIP = checkIPRange(ip, [
      '23.98.', '52.152.', '20.15.', '13.107.', '20.37.',
      '20.40.', '20.43.', '20.193.', '20.195.', '20.82.',
      '52.146.', '104.40.', '104.42.', '104.44.', '104.45.'
    ]);

    // Allow any ChatGPT user agent (lenient mode)
    return { name: 'ChatGPT', rateLimit: 60 };
  }

  // Check for Google
  if (lowerUA.includes('google')) {
    const isGoogleIP = checkIPRange(ip, [
      '66.249.', '64.233.', '216.239.', '172.217.',
      '34.', '35.', '209.85.'
    ]);

    if (isGoogleIP) {
      return { name: 'Google', rateLimit: 999 };
    }
  }

  // Check for Bing
  if (lowerUA.includes('bing') || lowerUA.includes('msn')) {
    const isBingIP = checkIPRange(ip, [
      '157.55.', '207.46.', '40.77.', '13.66.', '131.253.',
      '199.30.', '157.56.', '20.31.', '20.175.', '20.186.'
    ]);

    if (isBingIP) {
      return { name: 'Bing', rateLimit: 999 };
    }
  }

  // Check for SemRush
  if (lowerUA.includes('semrush')) {
    const isSemrushIP = checkIPRange(ip, ['185.191.', '203.131.', '45.82.']);

    if (isSemrushIP) {
      return { name: 'SemRush', rateLimit: 30 };
    }
  }

  return null;
}

// Helper to check IP range once
function checkIPRange(ip: string, prefixes: string[]): boolean {
  for (const prefix of prefixes) {
    if (ip.startsWith(prefix)) return true;
  }
  return false;
}

// Create standardized result objects
function createBasicResult(url: string, ip: string, userAgent: string | null, isBot: boolean): BotDetectionResult {
  return {
    timestamp: new Date().toISOString(),
    url,
    ip,
    userAgent,
    isBot,
    isSuspicious: false,
    requestDenied: false,
    rateLimited: false,
    rateLimitRemaining: 0,
    suspiciousDetails: {
      isKnownSearchEngine: isBot,
      hasSuspiciousUserAgent: false,
      hasSuspiciousHeaders: false,
      hasUnusualPattern: false,
      matchedPatterns: isBot ? [] : getMatchedPatterns(userAgent),
    }
  };
}

function createAllowedBotResult(url: string, ip: string, userAgent: string | null, botType: { name: string, rateLimit: number }): BotDetectionResult {
  return {
    timestamp: new Date().toISOString(),
    url,
    ip,
    userAgent,
    isBot: true,
    isSuspicious: false,
    requestDenied: false,
    rateLimited: false,
    rateLimitRemaining: botType.rateLimit,
    suspiciousDetails: {
      isKnownSearchEngine: true,
      hasSuspiciousUserAgent: false,
      hasSuspiciousHeaders: false,
      hasUnusualPattern: false,
      matchedPatterns: [],
    }
  };
} 
