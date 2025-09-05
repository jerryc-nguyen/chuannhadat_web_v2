import { type NextRequest, NextResponse } from 'next/server';
import { monitorBotProtection } from './lib/botProtectionMonitor';
import { handleUrlRedirects } from './middleware/url-redirects';

// Enable debug mode for local development
const DEBUG = process.env.DEBUG_MIDDLEWARE === 'true';

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
    '/', // Explicitly match the home route
    '/post/:path*', // Post detail pages
    '/profile/:path*', // Profile detail pages
    '/category/:path*', // Category pages
    '/((?!_next|api|_static|_vercel|\\..*).*)', // Everything else except excluded paths
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

  try {
    log.highlight(`MAIN MIDDLEWARE EXECUTED for: ${req.nextUrl.pathname}`);

    const pathname = req.nextUrl.pathname;

    // Log all requests to help with debugging
    log.info(`Request path: ${pathname}`);
    log.verbose(`Processing: ${pathname}`);
    log.verbose(`Method: ${req.method}, URL: ${req.nextUrl.toString()}`);

    // Quick RSC detection for client-side navigation
    const hasRscParam =
      req.nextUrl.searchParams.has('_rsc') ||
      req.nextUrl.toString().includes('_rsc=') ||
      req.headers.has('x-nextjs-data');

    // Skip middleware for static files
    if (
      pathname.startsWith('/_next/') ||
      pathname.endsWith('.json') ||
      pathname.endsWith('.ico') ||
      pathname.endsWith('.png') ||
      pathname.endsWith('.svg') ||
      pathname === '/robots.txt' ||
      pathname === '/sitemap.xml' ||
      hasRscParam // Skip AJAX requests for client-side transitions
    ) {
      log.verbose(`Skipping middleware for: ${hasRscParam ? 'RSC request' : 'static file'}`);
      return NextResponse.next();
    }

    // Apply lightweight bot protection - single function call
    log.verbose('Applying bot protection');
    const startTime = Date.now();
    const { response: botProtectionResponse } = await monitorBotProtection(req);
    log.verbose(`Bot protection applied in ${Date.now() - startTime}ms`);

    // If the bot protection returns a 429, return it immediately
    if (botProtectionResponse) {
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

    // If no middleware provided a response, proceed with the request
    log.verbose('No middleware actions, proceeding with request');
    return NextResponse.next();
  } catch (error) {
    // Log any errors but never crash the application
    log.error('Global middleware error:', error);

    // Always continue with the request if middleware fails
    return NextResponse.next();
  }
}
