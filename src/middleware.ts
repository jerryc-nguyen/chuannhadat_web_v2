import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { applyBotProtection } from './middleware/bot-protection';
import { handleAuthRedirects } from './middleware/auth';
import { handleUrlRedirects } from './middleware/url-redirects';

// Enable debug mode for local development
const DEBUG = process.env.NODE_ENV === 'development' ? true : false;

// This is the ONLY middleware Next.js will recognize
export const config = {
  matcher: [
    '/', // Explicitly match the home route
    '/bot-protection-dashboard', // Dashboard route
    '/((?!_next|api|_static|_vercel|\\..*).*)', // Everything else except excluded paths
  ],
};

/**
 * Main middleware function that orchestrates all middleware modules
 */
export async function middleware(req: NextRequest) {
  console.log('🔵🔵🔵 MAIN MIDDLEWARE EXECUTED for:', req.nextUrl.pathname);

  const pathname = req.nextUrl.pathname;

  // Log all requests to help with debugging
  console.log(`[MIDDLEWARE] Request path: ${pathname}`);

  // Only show special markers for home page
  if (pathname === '/' || pathname === '/home' || pathname === '/index') {
    console.log('★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★');
    console.log(`✅ HOME PAGE REQUEST DETECTED IN MIDDLEWARE: ${req.method} ${req.nextUrl.toString()}`);
    console.log(`✅ IP: ${req.ip || 'unknown'}, User-Agent: ${req.headers.get('user-agent')?.substring(0, 50)}...`);
    console.log('★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★★');
  }

  if (DEBUG) {
    console.log(`[MIDDLEWARE] Processing: ${pathname}`);
    console.log(`[MIDDLEWARE] Method: ${req.method}, URL: ${req.nextUrl.toString()}`);
  }

  // Skip middleware for static files
  if (
    pathname.endsWith('.json') ||
    pathname.endsWith('.ico') ||
    pathname.endsWith('.png') ||
    pathname.endsWith('.svg') ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml'
  ) {
    if (DEBUG) console.log('[MIDDLEWARE] Skipping static file');
    return NextResponse.next();
  }

  // Apply bot protection first - if it returns a response, use it
  if (DEBUG) console.log('[MIDDLEWARE] Applying bot protection');
  const startTime = Date.now();
  const botProtectionResponse = await applyBotProtection(req);
  if (DEBUG) console.log(`[MIDDLEWARE] Bot protection applied in ${Date.now() - startTime}ms`);

  if (botProtectionResponse) {
    if (DEBUG) console.log('[MIDDLEWARE] Bot protection returned a response, using it');
    return botProtectionResponse;
  }

  // Apply authentication checks next - if it returns a response, use it
  if (DEBUG) console.log('[MIDDLEWARE] Checking authentication');
  const authResponse = handleAuthRedirects(req);
  if (authResponse) {
    if (DEBUG) console.log('[MIDDLEWARE] Auth check returned a response, using it');
    return authResponse;
  }

  // Finally check for URL redirects
  if (DEBUG) console.log('[MIDDLEWARE] Checking URL redirects');
  const redirectResponse = await handleUrlRedirects(req);
  if (redirectResponse) {
    if (DEBUG) console.log('[MIDDLEWARE] URL redirect found, redirecting');
    return redirectResponse;
  }

  // If no middleware provided a response, proceed with the request
  if (DEBUG) console.log('[MIDDLEWARE] No middleware actions, proceeding with request');
  return NextResponse.next();
} 
