import { type NextRequest, NextResponse } from 'next/server';
import { monitorBotProtection } from './lib/botProtectionMonitor';
import { handleUrlRedirects } from './middleware/url-redirects';

// Enable debug mode for local development
const DEBUG = process.env.DEBUG_MIDDLEWARE === 'true';

// Log configuration on startup
if (DEBUG) {
  // eslint-disable-next-line no-console
  console.log(`[MIDDLEWARE-CONFIG] DEBUG=${DEBUG}, NODE_ENV=${process.env.NODE_ENV}`);
}

// Helper functions for controlled logging
const log = {
  error: (message: string, ...args: unknown[]) => {
    // Always log errors (level >= 1)
    if (DEBUG) {
      // eslint-disable-next-line no-console
      console.error(`[MIDDLEWARE] ❌ ${message}`, ...args);
    }
  },
  info: (message: string, ...args: unknown[]) => {
    // Only log important info (level >= 2)
    if (DEBUG) {
      // eslint-disable-next-line no-console
      console.log(`[MIDDLEWARE] ${message}`, ...args);
    }
  },
  verbose: (message: string, ...args: unknown[]) => {
    // Only log verbose details (level >= 3)
    if (DEBUG) {
      // eslint-disable-next-line no-console
      console.log(`[MIDDLEWARE] 🔍 ${message}`, ...args);
    }
  },
  highlight: (message: string, ...args: unknown[]) => {
    // Only log highlighted messages (level >= 2)
    if (DEBUG) {
      // eslint-disable-next-line no-console
      console.log(`🔵🔵🔵 ${message}`, ...args);
    }
  },
};

// Lightweight middleware - no special runtime needed
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - Files with extensions (.png, .jpg, .svg, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};

// Special variable specifically to disable during build
const isBuildTime =
  process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE === 'phase-production-build';

/**
 * Main middleware function that orchestrates all middleware modules
 */
export async function middleware(req: NextRequest) {
  // Skip all middleware during builds to avoid memory issues
  if (isBuildTime) {
    log.info('Skipping during build phase');
    return NextResponse.next();
  }

  // Log EVERY request that hits middleware (before any filtering)
  if (DEBUG) {
    // eslint-disable-next-line no-console
    console.log(`[MIDDLEWARE-ENTRY] ${req.method} ${req.nextUrl.toString()} | UA: ${req.headers.get('user-agent')?.substring(0, 30)}`);
  }

  try {
    const pathname = req.nextUrl.pathname;
    const url = req.nextUrl.toString();

    // Debug raw request information
    if (DEBUG) {
      // eslint-disable-next-line no-console
      console.log(`[RAW-REQUEST] Method: ${req.method}, URL: ${url}, Pathname: ${pathname}`);
      // eslint-disable-next-line no-console
      console.log(`[RAW-REQUEST] Host: ${req.headers.get('host')}, Origin: ${req.headers.get('origin')}, Referer: ${req.headers.get('referer')}`);

      // Log ALL headers to see what's actually coming through
      const allHeaders = Object.fromEntries(req.headers.entries());
      // eslint-disable-next-line no-console
      console.log(`[ALL-HEADERS] ${JSON.stringify(allHeaders, null, 2)}`);
    }

    // Enhanced RSC detection for client-side navigation - check this FIRST
    const hasRscParam =
      req.nextUrl.searchParams.has('_rsc') ||
      url.includes('_rsc=') ||
      req.headers.has('x-nextjs-data') ||
      req.headers.has('rsc') ||  // Changed from === '1' to just checking if header exists
      req.headers.get('next-router-prefetch') === '1' ||
      req.headers.get('purpose') === 'prefetch' ||
      req.headers.get('x-middleware-prefetch') === '1' ||
      req.headers.get('x-nextjs-prefetch') === '1';

    // Debug RSC detection
    if (DEBUG && (url.includes('_rsc') || req.headers.has('x-nextjs-data') || req.headers.get('rsc') || req.headers.get('next-router-prefetch'))) {
      // eslint-disable-next-line no-console
      console.log(`[RSC-DEBUG] URL: ${url}`);
      // eslint-disable-next-line no-console
      console.log(`[RSC-DEBUG] hasRscParam: ${hasRscParam}`);
      // eslint-disable-next-line no-console
      console.log(`[RSC-DEBUG] Headers: rsc=${req.headers.get('rsc')}, x-nextjs-data=${req.headers.has('x-nextjs-data')}, next-router-prefetch=${req.headers.get('next-router-prefetch')}, purpose=${req.headers.get('purpose')}`);
      // eslint-disable-next-line no-console
      console.log(`[RSC-DEBUG] URL checks: includes_rsc=${url.includes('_rsc')}, searchParams_rsc=${req.nextUrl.searchParams.has('_rsc')}`);
    }

    // IMMEDIATE early return for RSC requests - no logging, no processing
    if (hasRscParam) {
      if (DEBUG) {
        // eslint-disable-next-line no-console
        console.log(`[RSC-SKIP] ${pathname}${req.nextUrl.search} | Headers: rsc=${req.headers.get('rsc')}, prefetch=${req.headers.get('next-router-prefetch')}`);
      }
      return NextResponse.next();
    }

    // IMMEDIATE early return for monitoring requests
    if (pathname.startsWith('/monitoring')) {
      if (DEBUG) {
        // eslint-disable-next-line no-console
        console.log(`[MONITORING-SKIP] ${pathname}`);
      }
      return NextResponse.next();
    }

    // IMMEDIATE early return for static files
    if (
      pathname.startsWith('/_next/') ||
      pathname.startsWith('/api/') ||
      pathname.endsWith('.json') ||
      pathname.endsWith('.ico') ||
      pathname.endsWith('.png') ||
      pathname.endsWith('.svg') ||
      pathname.endsWith('.jpg') ||
      pathname.endsWith('.jpeg') ||
      pathname.endsWith('.webp') ||
      pathname.endsWith('.gif') ||
      pathname.endsWith('.css') ||
      pathname.endsWith('.js') ||
      pathname.endsWith('.map') ||
      pathname.endsWith('.woff') ||
      pathname.endsWith('.woff2') ||
      pathname.endsWith('.ttf') ||
      pathname.endsWith('.eot') ||
      pathname === '/robots.txt' ||
      pathname === '/sitemap.xml' ||
      pathname === '/manifest.json' ||
      pathname === '/favicon.ico'
    ) {
      if (DEBUG) {
        // eslint-disable-next-line no-console
        console.log(`[STATIC-SKIP] ${pathname}`);
      }
      return NextResponse.next();
    }

    // Debug - log requests that will be processed
    if (DEBUG) {
      // Get IP for logging
      const cfConnectingIp = req.headers.get('cf-connecting-ip');
      const realIp = req.headers.get('x-real-ip');
      const forwardedFor = req.headers.get('x-forwarded-for');
      const finalIp = cfConnectingIp || realIp || (forwardedFor ? forwardedFor.split(',')[0].trim() : '0.0.0.0');

      // eslint-disable-next-line no-console
      console.log(`[PROCESS] ${url} | IP: ${finalIp} | UA: ${req.headers.get('user-agent')?.substring(0, 50)}`);
      // eslint-disable-next-line no-console
      console.log(`[HEADERS] RSC: ${req.headers.get('rsc')}, x-nextjs-data: ${req.headers.has('x-nextjs-data')}, next-router-prefetch: ${req.headers.get('next-router-prefetch')}, purpose: ${req.headers.get('purpose')}`);

      // Debug all query parameters
      // eslint-disable-next-line no-console
      console.log(`[QUERY-PARAMS] Full search: "${req.nextUrl.search}", _rsc param: ${req.nextUrl.searchParams.get('_rsc')}, has _rsc: ${req.nextUrl.searchParams.has('_rsc')}`);

      // Debug all headers that might be RSC-related
      const allHeaders = Array.from(req.headers.entries());
      const rscHeaders = allHeaders.filter(([key]) =>
        key.includes('rsc') ||
        key.includes('next') ||
        key.includes('router') ||
        key.includes('prefetch')
      );
      if (rscHeaders.length > 0) {
        // eslint-disable-next-line no-console
        console.log(`[RSC-HEADERS] Found: ${JSON.stringify(rscHeaders)}`);
      }
    }

    // Only log for requests that will be processed
    log.highlight(`MAIN MIDDLEWARE EXECUTED for: ${pathname}`);
    log.info(`Request path: ${pathname}`);
    log.verbose(`Processing: ${pathname}`);
    log.verbose(`Method: ${req.method}, URL: ${url}`);

    // Apply lightweight bot protection - single function call
    log.verbose('Applying bot protection');
    const startTime = Date.now();
    const { response: botProtectionResponse } = await monitorBotProtection(req);
    log.verbose(`Bot protection applied in ${Date.now() - startTime}ms`);

    // If the bot protection returns a 429, return it immediately
    if (botProtectionResponse && botProtectionResponse.status === 429) {
      log.verbose('Rate limit exceeded, returning 429');
      return botProtectionResponse;
    }

    // Finally check for URL redirects
    log.verbose('Checking URL redirects');
    const redirectResponse = await handleUrlRedirects(req);
    if (redirectResponse) {
      log.verbose('URL redirect found, redirecting');
      return redirectResponse;
    }

    // If no middleware provided a response, use the bot protection response (which has headers set)
    log.verbose('No middleware actions, proceeding with request');
    return botProtectionResponse || NextResponse.next();
  } catch (error) {
    // Log any errors but never crash the application
    log.error('Global middleware error:', error);

    // Always continue with the request if middleware fails
    return NextResponse.next();
  }
}
