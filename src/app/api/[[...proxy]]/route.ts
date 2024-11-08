import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const url = new URL(req.url).host;
  const path = new URL(req.url).pathname;
  const targetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${path}`;

  const response = await fetch(targetUrl);

  if (!response.ok) {
    return NextResponse.redirect(new URL('/404', url));
  }

  const body = await response.body;

  return new NextResponse(body, {
    status: response.status,
    headers: {
      'Content-Type': response.headers.get('Content-Type') || 'text/plain',
    },
  });
}
