import { NextRequest, NextResponse } from 'next/server';
import { shouldRedirect } from '@components/redirect-urls';

/**
 * Handle URL redirections from the API
 * @returns NextResponse or null if no redirect needed
 */
export async function handleUrlRedirects(req: NextRequest): Promise<NextResponse | null> {
  const pathname = req.nextUrl.pathname;

  // Check if the path needs to redirect
  try {
    if (shouldRedirect(pathname)) {
      const checkForRedirectEndpoint = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/seos/check_url_redirect?path=${pathname}`;
      const redirectUrlResponse = await fetch(checkForRedirectEndpoint);

      if (!redirectUrlResponse.ok) {
        console.error('Error checking URL redirect: API returned status', redirectUrlResponse.status);
        return null;
      }

      const redirectUrl = await redirectUrlResponse.json();

      if (redirectUrl && typeof redirectUrl === 'string') {
        return NextResponse.redirect(new URL(redirectUrl, req.nextUrl), { status: 301 });
      }
    }
  } catch (error) {
    console.error('Error checking URL redirect:', error);
  }

  // No redirect needed
  return null;
} 
