import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { API_TOKEN_SERVER } from '@common/auth';

// Specify protected and public routes
const protectedRoutes = ['/dashboard'];

// The pathnames need to check for redirect
const pathsToCheckForRedirect: string[] = [];

// Api endpoint to check for redirect
const checkForRedirectEndpoint = `${process.env.NEXT_PUBLIC_API_BASE_URL}/xxxx`;

export async function middleware(req: NextRequest) {
  // Check if the current route is protected or public
  const pathname = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.some((prefix) => pathname.startsWith(prefix));

  // Get token from cookie for check authenticated
  const token = cookies().get(API_TOKEN_SERVER)?.value;

  // Redirect to home page if the user is not authenticated
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/', req.nextUrl));
  }

  // Check if the path needs to redirect
  try {
    if (pathsToCheckForRedirect.some((path) => path.startsWith(pathname))) {
      const redirectUrlResponse = await fetch(checkForRedirectEndpoint);
      const redirectUrl = await redirectUrlResponse.json();
      return NextResponse.redirect(new URL(redirectUrl, req.nextUrl));
    }
  } catch {
    return NextResponse.next();
  }

  return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
};
