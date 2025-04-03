import { NextRequest, NextResponse } from 'next/server';
import {
  rateLimit,
  isKnownBot,
  verifySearchEngineBot,
  isSuspiciousBot,
  hasSuspiciousHeaders,
  hasUnusualRequestPattern
} from './botProtection';

// Enable debug mode for local development
const DEBUG = process.env.NODE_ENV === 'development' ? true : false;

// Force log storing to be visible even without DEBUG
const FORCE_LOG_VISIBILITY = true;

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
const MAX_LOGS = 1000;

// Export the interface for use in API routes
export type { BotDetectionResult };

// Function to send logs to the API for Redis storage
// This is called after in-memory storage and avoids direct Redis dependency in middleware
async function sendLogToAPI(log: BotDetectionResult): Promise<void> {
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
      body: JSON.stringify(log)
    }).catch(err => {
      // Silently catch errors to avoid breaking the middleware
      console.error('Error sending log to API:', err);
    });

    if (DEBUG) {
      console.log(`[BOT-MONITOR] Log sent to API for processing`);
    }
  } catch (error) {
    // Don't let errors in API storage affect the middleware
    console.error('Error initializing log API call:', error);
  }
}

// Store bot detection log for dashboard/monitoring
// This is a simplified version that only uses memory storage
// Redis functionality will be added only in the API routes
function storeDetectionLog(detectionResult: BotDetectionResult) {
  if (DEBUG || FORCE_LOG_VISIBILITY) {
    console.log(`[BOT-MONITOR] 📝 Storing detection log for ${detectionResult.url}`);
  }

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

// Bot protection middleware with enhanced monitoring
export async function monitorBotProtection(
  req: NextRequest
): Promise<{ response: NextResponse | null; result: BotDetectionResult }> {
  const start = Date.now();
  const url = req.nextUrl.toString();
  const userAgent = req.headers.get('user-agent');
  const ip = req.ip || '0.0.0.0';

  if (DEBUG) {
    console.log(`[BOT-MONITOR] Processing request: ${url}`);
    console.log(`[BOT-MONITOR] IP: ${ip}, UA: ${userAgent?.substring(0, 30)}...`);
  }

  // Create the detection result object
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
  if (DEBUG) console.log(`[BOT-MONITOR] Checking rate limit for IP: ${ip}`);
  const rateLimitResult = await rateLimit(ip);
  result.rateLimited = !rateLimitResult.success;
  result.rateLimitRemaining = rateLimitResult.remaining;
  if (DEBUG) console.log(`[BOT-MONITOR] Rate limit result: ${JSON.stringify(rateLimitResult)}`);

  // 2. Check if it's a known search engine bot
  const isSearchEngineBot = isKnownBot(userAgent);
  result.suspiciousDetails.isKnownSearchEngine = isSearchEngineBot;
  if (DEBUG && isSearchEngineBot) console.log(`[BOT-MONITOR] Known search engine detected`);

  // 3. If it claims to be a search engine, verify it
  let isVerifiedBot = false;
  if (isSearchEngineBot) {
    if (DEBUG) console.log(`[BOT-MONITOR] Verifying search engine bot claim`);
    isVerifiedBot = await verifySearchEngineBot(ip, userAgent);
    if (DEBUG) console.log(`[BOT-MONITOR] Verification result: ${isVerifiedBot ? 'Legitimate' : 'Spoofed'}`);
  }

  // 4. Check for suspicious characteristics
  const suspiciousUA = isSuspiciousBot(userAgent);
  const suspiciousHeaders = hasSuspiciousHeaders(req);
  const unusualPattern = hasUnusualRequestPattern(req);

  result.suspiciousDetails.hasSuspiciousUserAgent = suspiciousUA;
  result.suspiciousDetails.hasSuspiciousHeaders = suspiciousHeaders;
  result.suspiciousDetails.hasUnusualPattern = unusualPattern;

  if (DEBUG) {
    console.log(`[BOT-MONITOR] Suspicious UA: ${suspiciousUA}`);
    console.log(`[BOT-MONITOR] Suspicious headers: ${suspiciousHeaders}`);
    console.log(`[BOT-MONITOR] Unusual request pattern: ${unusualPattern}`);
  }

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
  console.log(`💾💾💾 BOT LOG STORED for${homepageFlag}: ${result.url}`);
  console.log(`💾💾💾 Current log count: ${recentBotLogs.length}`);

  // Log to console
  const executionTime = Date.now() - start;
  console.log(`[BotProtection] ${result.requestDenied ? '🚫 BLOCKED' : '✅ ALLOWED'} ${url} (${executionTime}ms)`);

  if (result.isBot || result.isSuspicious) {
    console.log(JSON.stringify({
      type: 'bot_detection',
      ...result
    }, null, 2));
  }

  // If the request should be denied, return 403 response
  if (result.requestDenied) {
    if (DEBUG) console.log(`[BOT-MONITOR] Denying request with 403`);
    const response = NextResponse.json(
      { error: 'Access Denied', code: 'BOT_PROTECTION' },
      { status: 403 }
    );
    return { response, result };
  }

  if (DEBUG) console.log(`[BOT-MONITOR] Request processing complete in ${executionTime}ms`);
  // Otherwise continue with the request
  return { response: null, result };
} 
