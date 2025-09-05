import { NextRequest, NextResponse } from 'next/server';
import { rateLimit } from './botProtection';

// Simple IP extraction function
function getClientIp(req: NextRequest): string {
  // Check common proxy headers first
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  const realIp = req.headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }

  // Fallback to default if no headers found
  return '0.0.0.0';
}

// Enable debug mode for local development
const DEBUG = process.env.DEBUG_BOT_PROTECTION === 'true';

// Configuration from environment
const DEFAULT_RATE_LIMIT = 60;
const GOOGLE_RATE_LIMIT = 120;
const BING_RATE_LIMIT = 100;
const FACEBOOK_RATE_LIMIT = 50;
const BOT_LEVEL_2 = 40;
const BOT_LEVEL_3 = 20;

// Minimal logging for performance (reserved for future use)
const _logDebug = (message: string) => {
  if (DEBUG) {
    // eslint-disable-next-line no-console
    console.log(`[BOT-MONITOR] ${message}`);
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

// Lightweight rate limit assignment based on user agent patterns
function getBotRateLimit(userAgent: string | null): number {
  if (!userAgent) return DEFAULT_RATE_LIMIT;

  const ua = userAgent.toLowerCase();

  // PageSpeed/Lighthouse gets unlimited (highest priority)
  if (ua.includes('lighthouse') || ua.includes('pagespeed') || ua.includes('googleother')) {
    return 999;
  }

  // Major search engines - configurable limits
  if (ua.includes('googlebot') || ua.includes('google')) {
    return GOOGLE_RATE_LIMIT;
  }

  if (ua.includes('bingbot') || ua.includes('bing') || ua.includes('msnbot')) {
    return BING_RATE_LIMIT;
  }

  // Other legitimate search engines
  if (ua.includes('yandexbot') || ua.includes('yandex')) return BOT_LEVEL_2;
  if (ua.includes('baiduspider') || ua.includes('baidu')) return BOT_LEVEL_2;
  if (ua.includes('duckduckbot') || ua.includes('duckduckgo')) return BOT_LEVEL_2;
  if (ua.includes('slurp') || ua.includes('yahoo')) return BOT_LEVEL_2; // Yahoo
  if (ua.includes('applebot') || ua.includes('apple')) return BOT_LEVEL_2;

  // Social media crawlers - moderate limits
  if (ua.includes('facebookexternalhit') || ua.includes('facebookbot') || ua.includes('facebook')) {
    return FACEBOOK_RATE_LIMIT; // Facebook gets moderate limit
  }

  if (ua.includes('twitterbot') || ua.includes('twitter')) return BOT_LEVEL_2;
  if (ua.includes('linkedinbot') || ua.includes('linkedin')) return BOT_LEVEL_2;
  if (ua.includes('whatsapp')) return BOT_LEVEL_2;
  if (ua.includes('telegram')) return BOT_LEVEL_2;
  if (ua.includes('discord')) return BOT_LEVEL_2;

  // SEO and monitoring tools - lower limits
  if (ua.includes('ahrefsbot') || ua.includes('ahrefs')) return BOT_LEVEL_3;
  if (ua.includes('semrushbot') || ua.includes('semrush')) return BOT_LEVEL_3;
  if (ua.includes('mj12bot')) return BOT_LEVEL_3;
  if (ua.includes('dotbot')) return BOT_LEVEL_3;

  // Monitoring tools - higher limits
  if (ua.includes('uptimerobot') || ua.includes('pingdom') || ua.includes('gtmetrix')) {
    return 60;
  }

  // Generic bots - strict limits
  if (ua.includes('bot') || ua.includes('crawler') || ua.includes('spider') || ua.includes('scraper')) {
    return 10;
  }

  if (ua.includes('curl/')) {
    return 5;
  }

  // Regular users get standard limit
  return DEFAULT_RATE_LIMIT;
}

// Function to check if a path should be excluded from rate limiting
export function isRateLimitExcluded(pathname: string, url?: string, req?: NextRequest): boolean {
  // Exclude specific paths
  if (pathname.startsWith('/_next/') || pathname.startsWith('/monitoring')) {
    return true;
  }

  // Quick check for Next.js AJAX requests (client navigation)
  if (url?.includes('_rsc=') || req?.headers.has('x-nextjs-data')) {
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

  // Debug logging to show rate limit assignment
  if (DEBUG && effectiveRateLimit !== DEFAULT_RATE_LIMIT) {
    // eslint-disable-next-line no-console
    console.log(`[BOT-RATE] ${userAgent?.substring(0, 50)} → ${effectiveRateLimit} req/min`);
  }

  // Single rate limit check - no double checking
  const rateLimitResult = await rateLimit(ip, userAgent, effectiveRateLimit);

  if (DEBUG) {
    // eslint-disable-next-line no-console
    console.log(`[BOT-RATE] ${userAgent?.substring(0, 50)} → ${rateLimitResult.remaining} req/min`);
  }

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
