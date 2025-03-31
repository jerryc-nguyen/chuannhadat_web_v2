import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { API_TOKEN_CIENT } from '@common/auth';

// List of paths that require authentication
export const PROTECTED_PATHS = [
  '/dashboard',
  '/profile',
  '/settings',
  // Add other protected paths
];

// List of paths that should be accessible only to non-authenticated users
export const PUBLIC_ONLY_PATHS = [
  '/login',
  '/register',
  // Add other public-only paths
];

/**
 * Check if user is authenticated and handle redirects
 * @returns NextResponse or null if no redirect needed
 */
export function handleAuthRedirects(req: NextRequest): NextResponse | null {
  const pathname = req.nextUrl.pathname;

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

  // No redirect needed
  return null;
} 
