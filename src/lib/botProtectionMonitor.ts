import { NextRequest, NextResponse } from 'next/server';
import { rateLimit } from './botProtection';
import { getClientIp } from '../middleware/bot-protection';

// Enable debug mode for local development
const DEBUG = process.env.DEBUG_BOT_PROTECTION === 'true';

// Helper functions for controlled logging
const log = {
  error: (message: string, ...args: unknown[]) => {
    // Always log errors (level >= 1)
    if (DEBUG) {
      // eslint-disable-next-line no-console
      console.error(`[BOT-MONITOR] ❌ ${message}`, ...args);
    }
  },
  info: (message: string, ...args: unknown[]) => {
    // Only log important info (level >= 2)
    if (DEBUG) {
      // eslint-disable-next-line no-console
      console.log(`[BOT-MONITOR] ${message}`, ...args);
    }
  },
  verbose: (message: string, ...args: unknown[]) => {
    // Only log verbose details (level >= 3)
    if (DEBUG) {
      // eslint-disable-next-line no-console
      console.log(`[BOT-MONITOR] 🔍 ${message}`, ...args);
    }
  },
  storage: (message: string, ...args: unknown[]) => {
    // Only log storage actions if forced or debug (level >= 2)
    if (DEBUG) {
      // eslint-disable-next-line no-console
      console.log(`[BOT-MONITOR] 📝 ${message}`, ...args);
    }
  },
  result: (message: string, ...args: unknown[]) => {
    // Only log important results (level >= 2)
    if (DEBUG) {
      // eslint-disable-next-line no-console
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

// Export the interface for use in API routes (if needed in future)
export type { BotDetectionResult };

// Removed unused interfaces

// Lightweight rate limit assignment - optimized for speed
function getBotRateLimit(userAgent: string | null): number {
  if (!userAgent) return 60;

  // Use single toLowerCase call and early returns for performance
  const ua = userAgent.toLowerCase();

  // Check most specific patterns first (PageSpeed gets unlimited)
  if (ua.includes('lighthouse') || ua.includes('pagespeed')) return 999;

  // Search engines get standard limit
  if (ua.includes('google') || ua.includes('bing')) return 60;

  // Social media crawlers get moderate limit  
  if (ua.includes('facebook') || ua.includes('twitter')) return 30;

  // Generic bots get strict limit
  if (ua.includes('bot') || ua.includes('crawler')) return 10;

  return 60; // Default for regular users
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
      // eslint-disable-next-line no-console
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
      // eslint-disable-next-line no-console
      console.log(`⚠️⚠️⚠️ EXCLUDING NEXT.JS AJAX REQUEST: ${url || pathname}`);
    }

    log.storage(`Excluded AJAX request: ${url || pathname}`);
    return true;
  }

  return false;
}

// Lightweight bot protection middleware - optimized for speed
export async function monitorBotProtection(
  req: NextRequest
): Promise<{ response: NextResponse | null; result: BotDetectionResult }> {
  const pathname = req.nextUrl.pathname;
  const userAgent = req.headers.get('user-agent');
  const ip = getClientIp(req) || '0.0.0.0';

  // Fast path - check for common exclusions first (no logging overhead)
  if (isRateLimitExcluded(pathname, req.nextUrl.toString(), req)) {
    return {
      response: null,
      result: createBasicResult(req.nextUrl.toString(), ip, userAgent, false)
    };
  }

  // Get rate limit based on user agent (lightweight check)
  const effectiveRateLimit = getBotRateLimit(userAgent);

  // Single rate limit check - no double checking
  const rateLimitResult = await rateLimit(ip, userAgent, effectiveRateLimit);

  // Early return if rate limited - skip all other expensive checks
  if (!rateLimitResult.success) {
    if (DEBUG) {
      // eslint-disable-next-line no-console
      console.log(`🚫 RATE LIMITED ${pathname}: ${userAgent}`);
    }

    const response = NextResponse.json(
      { error: 'Too Many Requests', code: 'RATE_LIMIT' },
      {
        status: 429,
        headers: {
          'Retry-After': '60',
          'X-RateLimit-Remaining': '0',
        }
      }
    );

    return {
      response,
      result: {
        timestamp: new Date().toISOString(),
        url: req.nextUrl.toString(),
        ip,
        userAgent,
        isBot: false,
        isSuspicious: false,
        requestDenied: true,
        rateLimited: true,
        rateLimitRemaining: 0,
        suspiciousDetails: {
          isKnownSearchEngine: false,
          hasSuspiciousUserAgent: false,
          hasSuspiciousHeaders: false,
          hasUnusualPattern: false,
          matchedPatterns: [],
        }
      }
    };
  }

  // Request allowed - minimal result object
  const result: BotDetectionResult = {
    timestamp: new Date().toISOString(),
    url: req.nextUrl.toString(),
    ip,
    userAgent,
    isBot: false,
    isSuspicious: false,
    requestDenied: false,
    rateLimited: false,
    rateLimitRemaining: rateLimitResult.remaining,
    suspiciousDetails: {
      isKnownSearchEngine: false,
      hasSuspiciousUserAgent: false,
      hasSuspiciousHeaders: false,
      hasUnusualPattern: false,
      matchedPatterns: [],
    }
  };

  return { response: null, result };
}

// Create minimal result objects for excluded requests
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
      matchedPatterns: [],
    }
  };
}
