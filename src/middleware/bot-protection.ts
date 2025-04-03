import { NextRequest, NextResponse } from 'next/server';
import { monitorBotProtection } from '@/lib/botProtectionMonitor';
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

// Enable debug mode for local development
const DEBUG = process.env.NODE_ENV === 'development';

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
  // Wrap the entire middleware in a try-catch to prevent crashes in production
  try {
    // Immediate log at the very start 
    console.log(`⚠️⚠️⚠️ BOT PROTECTION STARTED: ${req.nextUrl.pathname}`);

    const startTime = Date.now();
    const pathname = req.nextUrl.pathname;
    const userAgent = req.headers.get('user-agent');
    const ip = getClientIp(req);

    // Always log every request that reaches the middleware
    console.log(`[BOT-PROTECTION] Request: ${req.method} ${pathname} from ${ip}`);

    if (DEBUG) {
      console.log(`[BOT-PROTECTION] Middleware request: ${pathname}`);
      console.log(`[BOT-PROTECTION] IP: ${ip}, User-Agent: ${userAgent?.substring(0, 50)}...`);
      console.log(`[BOT-PROTECTION] Enabled: ${isBotProtectionEnabled}`);
    }

    // Skip bot protection if disabled in environment
    if (!isBotProtectionEnabled) {
      if (DEBUG) console.log('[BOT-PROTECTION] Protection disabled, skipping');
      return null;
    }

    // Handle special routes separately to ensure they get monitored

    // Handle the dashboard route
    if (pathname === '/bot-protection-dashboard' || pathname.startsWith('/bot-protection-dashboard?')) {
      console.log('!!!!! DASHBOARD ACCESS DETECTED !!!!!');
      console.log(`Dashboard URL: ${req.nextUrl.toString()}`);
      console.log(`User-Agent: ${userAgent}`);

      // Always monitor the dashboard page
      const monitorResult = await monitorBotProtection(req);
      console.log('Dashboard monitoring result:', {
        timestamp: monitorResult.result.timestamp,
        url: monitorResult.result.url,
        logCount: monitorBotProtection.toString().includes('recentBotLogs.unshift') ? 'Logs should be added' : 'No log adding code found'
      });

      return null;
    }

    // Always monitor the home page
    if (pathname === '/' || pathname === '/index' || pathname === '/home') {
      console.log('!!!!! HOME PAGE ACCESS DETECTED !!!!!');
      console.log(`Home URL: ${req.nextUrl.toString()}`);
      console.log(`User-Agent: ${userAgent}`);

      // Always monitor the home page
      const monitorResult = await monitorBotProtection(req);
      console.log('Home page monitoring result:', {
        timestamp: monitorResult.result.timestamp,
        url: monitorResult.result.url
      });

      // Continue normal middleware processing - don't return early
    }

    // Skip bot protection for API routes and static assets
    const isApiRoute = pathname.startsWith('/api/');
    const isStaticAsset =
      pathname.startsWith('/_next/') ||
      pathname.includes('.') || // Files with extensions
      pathname === '/favicon.ico';

    if (DEBUG) {
      console.log(`[BOT-PROTECTION] Route type: ${isApiRoute ? 'API' : isStaticAsset ? 'Static' : 'Page'}`);
    }

    // Only apply bot protection to actual page routes (not API or static)
    if (!isApiRoute && !isStaticAsset) {
      if (DEBUG) console.log('[BOT-PROTECTION] Running protection on page route');

      // Run enhanced bot protection middleware with monitoring
      const { response: botResponse, result: botResult } = await monitorBotProtection(req);

      // If bot protection blocked the request, return the response
      if (botResponse) {
        if (DEBUG) console.log('[BOT-PROTECTION] Request blocked');
        return botResponse;
      }

      // Add the bot analysis to request headers for potential use by the application
      const nextReq = req.clone();
      (nextReq as any).botResult = botResult;
    } else if (DEBUG) {
      console.log('[BOT-PROTECTION] Skipping protection for API/static asset');
    }

    // Get the client IP using our enhanced function
    const ip2 = getClientIp(req);
    if (DEBUG && ip !== ip2) {
      console.log(`[BOT-PROTECTION] IP mismatch: ${ip} vs ${ip2}`);
    }

    // Add the real IP to the request headers for downstream use
    const response = NextResponse.next();
    response.headers.set('x-client-real-ip', ip);

    const endTime = Date.now();
    if (DEBUG) {
      console.log(`[BOT-PROTECTION] Processing time: ${endTime - startTime}ms`);
      console.log('[BOT-PROTECTION] Middleware complete');
    }

    return response;
  } catch (error) {
    // Log the error but allow the request to continue
    console.error('[BOT-PROTECTION] Middleware error:', error);

    // Return a pass-through response to avoid breaking the application
    return NextResponse.next();
  }
} 
