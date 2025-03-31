import { NextRequest, NextResponse } from 'next/server';
import { applyBotProtection } from './bot-protection';
import { handleAuthRedirects } from './auth';
import { handleUrlRedirects } from './url-redirects';

// Routes Middleware should not run on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. /api routes (except for redirects API which we want to check)
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. all root files inside /public (e.g. /favicon.ico)
     * 5. static files and images
     */
    '/((?!api/(?!v1/seos/check_url_redirect)|_next|_static|_vercel|[\\w-]+\\.\\w+).*)',
  ],
};

/**
 * Main middleware function that orchestrates all middleware modules
 */
export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // Skip middleware for static files
  if (
    pathname.endsWith('.json') ||
    pathname.endsWith('.ico') ||
    pathname.endsWith('.png') ||
    pathname.endsWith('.svg') ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml'
  ) {
    return NextResponse.next();
  }

  // Apply bot protection first - if it returns a response, use it
  const botProtectionResponse = await applyBotProtection(req);
  if (botProtectionResponse) {
    return botProtectionResponse;
  }

  // Apply authentication checks next - if it returns a response, use it
  const authResponse = handleAuthRedirects(req);
  if (authResponse) {
    return authResponse;
  }

  // Finally check for URL redirects
  const redirectResponse = await handleUrlRedirects(req);
  if (redirectResponse) {
    return redirectResponse;
  }

  // If no middleware provided a response, proceed with the request
  return NextResponse.next();
} 
