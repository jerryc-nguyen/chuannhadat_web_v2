import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { API_TOKEN_SERVER } from '@common/auth';

// 1. Specify protected and public routes
const protectedRoutes = ['/dashboard'];

export function middleware(req: NextRequest) {
  // 2. Check if the current route is protected or public
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.some((prefix) => path.startsWith(prefix));

  // 3. Get token from cookie for check authenticated
  const token = cookies().get(API_TOKEN_SERVER)?.value;

  // 4. Redirect to home page if the user is not authenticated
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/', req.nextUrl));
  }

  return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
};
