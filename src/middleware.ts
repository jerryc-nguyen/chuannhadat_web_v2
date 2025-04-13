import { NextRequest, NextResponse } from 'next/server';
import { applyBotProtection } from './middleware/bot-protection';
import { handleAuthRedirects } from './middleware/auth';
import { handleUrlRedirects } from './middleware/url-redirects';

// Enable debug mode for local development
const DEBUG = process.env.DEBUG_MIDDLEWARE === 'true';

// Helper functions for controlled logging
const log = {
  error: (message: string, ...args: any[]) => {
    // Always log errors (level >= 1)
    if (DEBUG) {
      console.error(`[MIDDLEWARE] ❌ ${message}`, ...args);
    }
  },
  info: (message: string, ...args: any[]) => {
    // Only log important info (level >= 2)
    if (DEBUG) {
      console.log(`[MIDDLEWARE] ${message}`, ...args);
    }
  },
  verbose: (message: string, ...args: any[]) => {
    // Only log verbose details (level >= 3)
    if (DEBUG) {
      console.log(`[MIDDLEWARE] 🔍 ${message}`, ...args);
    }
  },
  highlight: (message: string, ...args: any[]) => {
    // Only log highlighted messages (level >= 2)
    if (DEBUG) {
      console.log(`🔵🔵🔵 ${message}`, ...args);
    }
  }
};

// This runs in Node.js runtime (not Edge)
export const config = {
  matcher: [
    '/', // Explicitly match the home route
    '/post/:path*', // Post detail pages
    '/profile/:path*', // Profile detail pages 
    '/category/:path*', // Category pages
    '/bot-protection-dashboard', // Dashboard route
    '/((?!_next|api|_static|_vercel|\\..*).*)', // Everything else except excluded paths
  ],
  runtime: 'nodejs',
};

// Special variable specifically to disable during build
const isBuildTime = process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE === 'phase-production-build';

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

    // Enhanced debugging for RSC requests
    const urlString = req.nextUrl.toString();
    const fullRequestUrl = `${req.nextUrl.protocol}//${req.nextUrl.host}${req.nextUrl.pathname}${req.nextUrl.search}`;
    const searchParamsString = req.nextUrl.searchParams.toString();
    const rawHeadersUrl = req.headers.get('referer') || '';
    const rawUrl = req.url || '';

    // Debug full request URL information
    if (DEBUG) {
      console.log(`🔍🔍🔍 URL INSPECTION:
      - pathname: ${pathname}
      - urlString: ${urlString}
      - fullRequestUrl: ${fullRequestUrl}
      - searchParams: ${searchParamsString}
      - rawUrl: ${rawUrl}
      - referer: ${rawHeadersUrl}
      - headers: ${JSON.stringify(Object.fromEntries([...req.headers.entries()].filter(([k]) => k.includes('rsc') || k === 'x-nextjs-data')), null, 2)}
      `);
    }

    // Check for _rsc in multiple possible locations
    const hasRscParam = req.nextUrl.searchParams.has('_rsc') ||
      urlString.includes('_rsc=') ||
      searchParamsString.includes('_rsc') ||
      rawUrl.includes('_rsc') ||
      rawHeadersUrl.includes('_rsc') ||
      req.headers.has('x-nextjs-data');

    if (hasRscParam) {
      log.highlight(`[RSC] Client navigation detected: ${urlString}`);
      log.info(`RSC detection: searchParams=${req.nextUrl.searchParams.has('_rsc')}, nextUrlString=${urlString.includes('_rsc=')}, searchParamsString=${searchParamsString.includes('_rsc')}, rawUrl=${rawUrl.includes('_rsc')}, referer=${rawHeadersUrl.includes('_rsc')}, x-nextjs-data=${req.headers.has('x-nextjs-data')}`);
    }

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

    // Apply bot protection first - if it returns a response, use it
    log.verbose('Applying bot protection');
    const startTime = Date.now();
    const botProtectionResponse = await applyBotProtection(req);
    log.verbose(`Bot protection applied in ${Date.now() - startTime}ms`);

    // If the bot protection returns a 429, return it immediately
    if (botProtectionResponse && botProtectionResponse.status === 429) {
      log.verbose('Rate limit exceeded, returning 429');
      return botProtectionResponse;
    }

    // Apply authentication checks next - if it returns a response, use it
    // log.verbose('Checking authentication');
    // const authResponse = handleAuthRedirects(req);
    // if (authResponse) {
    //   log.verbose('Auth check returned a response, using it');
    //   return authResponse;
    // }


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
