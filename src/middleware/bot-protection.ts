import { NextRequest, NextResponse } from 'next/server';
import { monitorBotProtection } from '@/lib/botProtectionMonitor';

// Check if bot protection is enabled
const isBotProtectionEnabled = process.env.ENABLE_BOT_PROTECTION === 'true';

// Enable debug mode for local development
const DEBUG = process.env.DEBUG_BOT_PROTECTION === 'true';

// Force log visibility regardless of DEBUG flag
const FORCE_LOG_VISIBILITY = process.env.BOT_PROTECTION_FORCE_LOGS === 'true';

// Log verbosity level (0=silent, 1=errors only, 2=important, 3=verbose)
const LOG_LEVEL = parseInt(process.env.BOT_PROTECTION_LOG_LEVEL || '2', 10);

// Helper functions for controlled logging
const log = {
  error: (message: string, ...args: any[]) => {
    // Always log errors (level >= 1)
    if ((DEBUG || FORCE_LOG_VISIBILITY) && LOG_LEVEL >= 1) {
      console.error(`[BOT-PROTECTION] ❌ ${message}`, ...args);
    }
  },
  info: (message: string, ...args: any[]) => {
    // Only log important info (level >= 2)
    if ((DEBUG || FORCE_LOG_VISIBILITY) && LOG_LEVEL >= 2) {
      console.log(`[BOT-PROTECTION] ${message}`, ...args);
    }
  },
  verbose: (message: string, ...args: any[]) => {
    // Only log verbose details (level >= 3)
    if ((DEBUG || FORCE_LOG_VISIBILITY) && LOG_LEVEL >= 3) {
      console.log(`[BOT-PROTECTION] 🔍 ${message}`, ...args);
    }
  },
  warning: (message: string, ...args: any[]) => {
    // Only log important warnings (level >= 2)
    if ((DEBUG || FORCE_LOG_VISIBILITY) && LOG_LEVEL >= 2) {
      console.log(`⚠️⚠️⚠️ ${message}`, ...args);
    }
  }
};

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
 * Check if a pathname matches one of the protected routes
 * @param pathname URL pathname to check
 * @returns true if the pathname matches a protected route pattern
 */
function isProtectedRoute(pathname: string): boolean {
  // Match common dynamic route patterns
  const patterns = [
    /^\/$/, // Home route "/"
    /^\/post\/[^/]+$/, // Post detail "/post/:slug"
    /^\/profile\/[^/]+$/, // Profile detail "/profile/:slug" 
    /^\/category\/[^/]+$/, // Category "/category/:slug"
  ];

  return patterns.some(pattern => pattern.test(pathname));
}

/**
 * Check if a path should be excluded from rate limiting
 * @param pathname URL pathname to check
 * @returns true if the pathname should be excluded from rate limiting
 */
function isRateLimitExcluded(pathname: string, url: URL, req: NextRequest): boolean {
  // Convert to string for more flexible checking
  const urlString = url.toString();
  const searchParamsString = url.searchParams.toString();
  const rawUrl = req.url || '';
  const referer = req.headers.get('referer') || '';

  // Debug the full URL information
  if (DEBUG) {
    log.info(`🔎 URL CHECK:
    - pathname: ${pathname}
    - urlString: ${urlString}
    - searchParams: ${searchParamsString}
    - referer: ${referer}
    - raw URL: ${rawUrl}
    - x-nextjs-data: ${req.headers.has('x-nextjs-data')}
    - next-router-state-tree: ${req.headers.has('next-router-state-tree')}
    `);
  }

  // Exclude specific paths
  if (pathname.startsWith('/_next/') || pathname.startsWith('/monitoring')) {
    log.info(`Excluded path: ${pathname}`);
    return true;
  }

  // Exclude Next.js AJAX requests by checking for multiple indicators
  const isNextJsAjax = (
    // Check URL parameters
    url.searchParams.has('_rsc') ||
    urlString.includes('_rsc=') ||
    searchParamsString.includes('_rsc') ||
    referer.includes('_rsc') ||
    rawUrl.includes('_rsc') ||

    // Check special Next.js headers
    req.headers.has('x-nextjs-data') ||
    req.headers.has('next-router-state-tree') ||
    req.headers.has('next-url')
  );

  if (isNextJsAjax) {
    log.info(`⚠️⚠️⚠️ EXCLUDING NEXT.JS AJAX REQUEST: ${urlString}`);
    return true;
  }

  return false;
}

/**
 * Get a friendly route name for logging purposes
 */
function getRouteName(pathname: string): string {
  if (pathname === '/') return 'HOME';
  if (pathname === '/bot-protection-dashboard' || pathname.startsWith('/bot-protection-dashboard?')) return 'DASHBOARD';
  if (pathname.startsWith('/post/')) return 'POST DETAIL';
  if (pathname.startsWith('/profile/')) return 'PROFILE DETAIL';
  if (pathname.startsWith('/category/')) return 'CATEGORY';
  return 'OTHER';
}

/**
 * Apply bot protection rules
 * @returns NextResponse if request should be blocked/limited, or null if allowed
 */
export async function applyBotProtection(req: NextRequest): Promise<NextResponse | null> {
  // Wrap the entire middleware in a try-catch to prevent crashes in production
  try {
    // Immediate log at the very start 
    log.warning(`BOT PROTECTION STARTED: ${req.nextUrl.pathname}`);

    const startTime = Date.now();
    const pathname = req.nextUrl.pathname;
    const userAgent = req.headers.get('user-agent');
    const ip = getClientIp(req);
    const routeName = getRouteName(pathname);

    // Always log every request that reaches the middleware
    log.info(`Request: ${req.method} ${pathname} from ${ip}`);

    log.verbose(`Middleware request: ${pathname}`);
    log.verbose(`IP: ${ip}, User-Agent: ${userAgent?.substring(0, 50)}...`);
    log.verbose(`Enabled: ${isBotProtectionEnabled}`);

    // Skip bot protection if disabled in environment
    if (!isBotProtectionEnabled) {
      log.verbose('Protection disabled, skipping');
      return null;
    }

    // Check if path should be excluded from rate limiting
    const url = new URL(req.nextUrl.toString());
    if (isRateLimitExcluded(pathname, url, req)) {
      log.info(`Skipping rate limit counting for excluded path: ${pathname}`);
      // Allow the request but skip monitoring/counting entirely
      return NextResponse.next();
    }

    // Handle special routes separately to ensure they get monitored

    // Handle the dashboard route
    if (pathname === '/bot-protection-dashboard' || pathname.startsWith('/bot-protection-dashboard?')) {
      if (DEBUG) log.info('!!!!! DASHBOARD ACCESS DETECTED !!!!!');
      log.info(`Dashboard URL: ${req.nextUrl.toString()}`);
      log.info(`User-Agent: ${userAgent}`);

      // Always monitor the dashboard page
      const monitorResult = await monitorBotProtection(req);
      log.info('Dashboard monitoring result:', {
        timestamp: monitorResult.result.timestamp,
        url: monitorResult.result.url,
        logCount: monitorBotProtection.toString().includes('recentBotLogs.unshift') ? 'Logs should be added' : 'No log adding code found'
      });

      return null;
    }

    // Handle protected routes (home, post detail, profile detail, category)
    if (isProtectedRoute(pathname)) {
      if (DEBUG) log.info(`!!!!! ${routeName} PAGE ACCESS DETECTED !!!!!`);
      log.info(`${routeName} URL: ${req.nextUrl.toString()}`);
      log.info(`User-Agent: ${userAgent}`);

      // Always monitor these important pages
      const monitorResult = await monitorBotProtection(req);
      log.verbose(`${routeName} page monitoring result:`, {
        timestamp: monitorResult.result.timestamp,
        url: monitorResult.result.url
      });

      // If bot protection blocks the request, return response
      if (monitorResult.response) {
        log.info(`Blocking access to ${routeName} page: ${pathname}`);
        return monitorResult.response;
      }

      // For these routes, we want to continue processing after monitoring
      // but we've already applied the bot protection
    }

    // Skip bot protection for API routes and static assets
    const isApiRoute = pathname.startsWith('/api/');
    const isStaticAsset =
      pathname.startsWith('/_next/') ||
      pathname.includes('.') || // Files with extensions
      pathname === '/favicon.ico';

    log.verbose(`Route type: ${isApiRoute ? 'API' : isStaticAsset ? 'Static' : 'Page'}`);

    // Only apply bot protection to actual page routes that weren't handled above
    if (!isApiRoute && !isStaticAsset && !isProtectedRoute(pathname)) {
      log.verbose('Running protection on other page route');

      // Run enhanced bot protection middleware with monitoring
      const { response: botResponse, result: botResult } = await monitorBotProtection(req);

      // If bot protection blocked the request, return the response
      if (botResponse) {
        log.info('Request blocked');
        return botResponse;
      }

      // Add the bot analysis to request headers for potential use by the application
      const nextReq = req.clone();
      (nextReq as any).botResult = botResult;
    } else if (isApiRoute || isStaticAsset) {
      log.verbose('Skipping protection for API/static asset');
    }

    // Get the client IP using our enhanced function
    const ip2 = getClientIp(req);
    if (ip !== ip2) {
      log.verbose(`IP mismatch: ${ip} vs ${ip2}`);
    }

    // Add the real IP to the request headers for downstream use
    const response = NextResponse.next();
    response.headers.set('x-client-real-ip', ip);

    const endTime = Date.now();
    log.verbose(`Processing time: ${endTime - startTime}ms`);
    log.verbose('Middleware complete');

    return response;
  } catch (error) {
    // Log the error but allow the request to continue
    log.error('Middleware error:', error);

    // Return a pass-through response to avoid breaking the application
    return NextResponse.next();
  }
} 
