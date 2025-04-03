import { NextRequest, NextResponse } from 'next/server';
import { applyBotProtection } from './middleware/bot-protection';
import { handleAuthRedirects } from './middleware/auth';
import { handleUrlRedirects } from './middleware/url-redirects';

// Enable debug mode for local development
const DEBUG = false;

// Log verbosity level (0=silent, 1=errors only, 2=important, 3=verbose)
const LOG_LEVEL = parseInt(process.env.BOT_PROTECTION_LOG_LEVEL || '2', 10);

// Helper functions for controlled logging
const log = {
  error: (message: string, ...args: any[]) => {
    // Always log errors (level >= 1)
    if (LOG_LEVEL >= 1) {
      console.error(`[MIDDLEWARE] ❌ ${message}`, ...args);
    }
  },
  info: (message: string, ...args: any[]) => {
    // Only log important info (level >= 2)
    if (LOG_LEVEL >= 2) {
      console.log(`[MIDDLEWARE] ${message}`, ...args);
    }
  },
  verbose: (message: string, ...args: any[]) => {
    // Only log verbose details (level >= 3)
    if (LOG_LEVEL >= 3 || DEBUG) {
      console.log(`[MIDDLEWARE] 🔍 ${message}`, ...args);
    }
  },
  highlight: (message: string, ...args: any[]) => {
    // Only log highlighted messages (level >= 2)
    if (LOG_LEVEL >= 2) {
      console.log(`🔵🔵🔵 ${message}`, ...args);
    }
  }
};

// This runs in Node.js runtime (not Edge)
export const config = {
  matcher: [
    '/', // Explicitly match the home route
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

    // Skip middleware for static files
    if (
      pathname.endsWith('.json') ||
      pathname.endsWith('.ico') ||
      pathname.endsWith('.png') ||
      pathname.endsWith('.svg') ||
      pathname === '/robots.txt' ||
      pathname === '/sitemap.xml'
    ) {
      log.verbose('Skipping static file');
      return NextResponse.next();
    }

    // Apply bot protection first - if it returns a response, use it
    log.verbose('Applying bot protection');
    const startTime = Date.now();
    const botProtectionResponse = await applyBotProtection(req);
    log.verbose(`Bot protection applied in ${Date.now() - startTime}ms`);

    if (botProtectionResponse) {
      log.verbose('Bot protection returned a response, using it');
      return botProtectionResponse;
    }

    // Apply authentication checks next - if it returns a response, use it
    log.verbose('Checking authentication');
    const authResponse = handleAuthRedirects(req);
    if (authResponse) {
      log.verbose('Auth check returned a response, using it');
      return authResponse;
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
