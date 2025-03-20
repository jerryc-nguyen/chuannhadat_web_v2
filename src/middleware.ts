import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { API_TOKEN_CIENT } from '@common/auth';
import { shouldRedirect } from '@components/redirect-urls';

// List of paths that require authentication
const PROTECTED_PATHS = [
  '/dashboard',
  '/profile',
  '/settings',
  // Add other protected paths
];

// List of paths that should be accessible only to non-authenticated users
const PUBLIC_ONLY_PATHS = [
  '/login',
  '/register',
  // Add other public-only paths
];

// Routes Middleware should not run on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. all root files inside /public (e.g. /favicon.ico)
     */
    '/((?!api|_next|_static|_vercel|[\\w-]+\\.\\w+).*)',
  ],
};

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // Skip middleware for static files
  if (
    pathname.endsWith('.json') ||
    pathname.endsWith('.ico') ||
    pathname.endsWith('.png') ||
    pathname.endsWith('.svg')
  ) {
    return NextResponse.next();
  }

  // Check if the current route is protected or public
  const isProtectedRoute = PROTECTED_PATHS.some((prefix) => pathname.startsWith(prefix));
  const isPublicOnlyRoute = PUBLIC_ONLY_PATHS.some((prefix) => pathname.startsWith(prefix));

  // Get token from cookie for check authenticated
  const token = cookies().get(API_TOKEN_CIENT)?.value;
  const isAuthenticated = !!token;

  // Handle authentication redirects
  if (isProtectedRoute && !isAuthenticated) {
    // Store the current path for redirect after login
    const returnUrl = new URL('/login', req.nextUrl);
    returnUrl.searchParams.set('returnUrl', pathname);
    return NextResponse.redirect(returnUrl);
  }

  // Redirect to dashboard if the user is authenticated and accessing a public-only route
  if (isPublicOnlyRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl));
  }

  // Check if the path needs to redirect
  try {
    if (shouldRedirect(pathname)) {
      const checkForRedirectEndpoint = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/seos/check_url_redirect?path=${pathname}`;
      const redirectUrlResponse = await fetch(checkForRedirectEndpoint);
      const redirectUrl = await redirectUrlResponse.json();
      return NextResponse.redirect(new URL(redirectUrl, req.nextUrl), { status: 301 });
    }
  } catch (error) {
    console.error('Error checking URL redirect:', error);
    // Continue with the request if there's an error checking redirects
  }

  return NextResponse.next();
}
