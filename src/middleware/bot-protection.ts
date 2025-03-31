import { NextRequest, NextResponse } from 'next/server';
import {
  isKnownBot,
  isSuspiciousBot,
  hasSuspiciousHeaders,
  hasUnusualRequestPattern,
  rateLimit,
  verifySearchEngineBot
} from '../lib/botProtection';

// Check if bot protection is enabled
const isBotProtectionEnabled = process.env.ENABLE_BOT_PROTECTION === 'true';

/**
 * Get the real client IP address
 * In a Docker environment with Nginx, we need to check multiple headers
 */
export function getClientIp(req: NextRequest): string {
  // Check headers in order of reliability for Docker+Nginx setup
  const realIp = req.headers.get('x-real-ip');
  if (realIp) return realIp;

  // Nginx typically forwards original client IP in x-forwarded-for
  const forwardedFor = req.headers.get('x-forwarded-for');
  if (forwardedFor) {
    // x-forwarded-for can contain multiple IPs (client, proxy1, proxy2, ...)
    // The first one is typically the original client
    const ips = forwardedFor.split(',');
    if (ips.length > 0) {
      return ips[0].trim();
    }
  }

  // Fall back to request IP from Next.js (usually the proxy's IP in Docker setups)
  return req.ip || '0.0.0.0';
}

/**
 * Apply bot protection rules
 * @returns NextResponse if request should be blocked/limited, or null if allowed
 */
export async function applyBotProtection(req: NextRequest): Promise<NextResponse | null> {
  // Skip bot protection if disabled in environment
  if (!isBotProtectionEnabled) {
    return null;
  }

  // Get the client IP using our enhanced function
  const ip = getClientIp(req);
  const userAgent = req.headers.get('user-agent');

  // Log headers during development to debug IP resolution
  if (process.env.NODE_ENV === 'development') {
    console.log('Headers:', Object.fromEntries(req.headers.entries()));
    console.log('Resolved client IP:', ip);
  }

  // Allow known search engine bots to bypass protection
  if (isKnownBot(userAgent)) {
    // For enhanced security, you can enable DNS verification:
    // const isVerifiedBot = await verifySearchEngineBot(ip, userAgent);
    // if (!isVerifiedBot) {
    //   console.warn(`Blocked fake search engine bot: IP ${ip}, UA: ${userAgent}`);
    //   return new NextResponse('Forbidden - Bot Verification Failed', { status: 403 });
    // }

    // No additional protection needed for legitimate bots
    return null;
  }

  // For regular visitors and potential bad bots, check suspicious patterns
  const isSuspicious = isSuspiciousBot(userAgent) ||
    hasSuspiciousHeaders(req) ||
    hasUnusualRequestPattern(req);

  // Apply rate limiting based on suspiciousness
  const rateLimit_MaxRequests = isSuspicious ? 20 : 60; // Lower limit for suspicious clients

  try {
    const rateLimitResult = await rateLimit(ip, rateLimit_MaxRequests);

    if (!rateLimitResult.success) {
      // Log rate limit events for monitoring
      console.warn(`Rate limited IP: ${ip}, UA: ${userAgent}`);

      return new NextResponse('Too Many Requests', {
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil((rateLimitResult.reset - Date.now()) / 1000)),
          'X-RateLimit-Limit': String(rateLimitResult.limit),
          'X-RateLimit-Remaining': String(rateLimitResult.remaining),
          'X-RateLimit-Reset': String(rateLimitResult.reset),
          'Content-Type': 'text/plain',
        },
      });
    }

    // Add rate limit headers to the response for monitoring
    const response = NextResponse.next();
    response.headers.set('X-RateLimit-Limit', String(rateLimitResult.limit));
    response.headers.set('X-RateLimit-Remaining', String(rateLimitResult.remaining));
    response.headers.set('X-RateLimit-Reset', String(rateLimitResult.reset));

    // Block extremely suspicious behavior
    if (isSuspicious && rateLimitResult.remaining < 5) {
      console.warn(`Blocked suspicious bot: IP ${ip}, UA: ${userAgent}`);
      return new NextResponse('Forbidden', { status: 403 });
    }

    // If rate limiting succeeded but response headers were set,
    // return the response with the headers
    if (response.headers.has('X-RateLimit-Limit')) {
      return response;
    }
  } catch (error) {
    console.error('Rate limiting error:', error);
  }

  // Allow request to proceed
  return null;
} 
