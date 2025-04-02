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

// Store recent bot detection logs in memory (for dev/testing)
// In production you would use a proper logging service
const recentBotLogs: BotDetectionResult[] = [];
const MAX_LOGS = 1000; // Keep only the most recent logs

// Make logs available globally to share between Edge and Node environments
// This is a workaround for development environments
if (typeof globalThis !== 'undefined') {
  (globalThis as any).__BOT_PROTECTION_LOGS = (globalThis as any).__BOT_PROTECTION_LOGS || [];
}

export function getBotLogs(): BotDetectionResult[] {
  console.log(`📋📋📋 [BOT-MONITOR] Retrieving ${recentBotLogs.length} logs`);

  try {
    // Try to get global logs if available
    const globalLogs = (globalThis as any).__BOT_PROTECTION_LOGS || [];
    console.log(`Global logs count: ${globalLogs.length}`);

    // Combine local and global logs
    const allLogs = [...recentBotLogs, ...globalLogs];

    // Log the first few logs to help with debugging
    if (allLogs.length > 0) {
      console.log(`📋 First log: ${JSON.stringify({
        url: allLogs[0].url,
        timestamp: allLogs[0].timestamp,
        isBot: allLogs[0].isBot
      })}`);
    } else {
      console.log(`📋 WARNING: No logs found in recentBotLogs array or global scope!`);
    }

    return allLogs;
  } catch (e) {
    console.error('Error accessing global logs:', e);
    return [...recentBotLogs]; // Fallback to local logs
  }
}

export function clearBotLogs(): void {
  console.log('[BOT-MONITOR] Clearing all logs');
  recentBotLogs.length = 0;

  try {
    // Also clear global logs
    if (typeof globalThis !== 'undefined') {
      (globalThis as any).__BOT_PROTECTION_LOGS = [];
    }
  } catch (e) {
    console.error('Error clearing global logs:', e);
  }
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

  // Store the log (for monitoring purposes)
  recentBotLogs.unshift(result);
  if (recentBotLogs.length > MAX_LOGS) {
    recentBotLogs.length = MAX_LOGS; // Trim the log array
  }

  // Also add to global scope for sharing between Edge and Node environments
  try {
    if (typeof globalThis !== 'undefined') {
      const globalLogs = (globalThis as any).__BOT_PROTECTION_LOGS || [];
      globalLogs.unshift(result);
      if (globalLogs.length > MAX_LOGS) {
        globalLogs.length = MAX_LOGS;
      }
      (globalThis as any).__BOT_PROTECTION_LOGS = globalLogs;
    }
  } catch (e) {
    console.error('Error adding to global logs:', e);
  }

  // Always show log storage regardless of DEBUG setting
  const homepageFlag = result.url.match(/\/(home|index)?(\?|$)/) ? ' 🏠 HOME PAGE' : '';
  console.log(`💾💾💾 BOT LOG STORED for${homepageFlag}: ${result.url}`);
  console.log(`💾💾💾 Current log count: ${recentBotLogs.length}`);

  // Show global log count if available
  try {
    const globalLogs = (globalThis as any).__BOT_PROTECTION_LOGS || [];
    console.log(`💾💾💾 Global log count: ${globalLogs.length}`);
  } catch (e) {
    // Skip if not available
  }

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
