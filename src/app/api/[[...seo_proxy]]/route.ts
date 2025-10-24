import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const path = new URL(req.url).pathname;
  const siteMapHost = 'https://ops.imuanha.com';
  const targetUrl = `${siteMapHost}${path}`;

  const response = await fetch(targetUrl);

  if (!response.ok) {
    return NextResponse.redirect(new URL('/'));
  }

  const body = await response.body;

  return new NextResponse(body, {
    status: response.status,
    headers: {
      'Content-Type': response.headers.get('Content-Type') || 'text/plain',
    },
  });
}
