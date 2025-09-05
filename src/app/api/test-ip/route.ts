import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  // Extract headers from the request
  const headers = Object.fromEntries(req.headers.entries());

  // Get all IP-related headers
  const allIpHeaders = Object.keys(headers)
    .filter(key =>
      key.includes('ip') ||
      key.includes('forward') ||
      key.includes('cf-') ||
      key.includes('real') ||
      key.includes('client')
    )
    .reduce((obj, key) => {
      obj[key] = headers[key];
      return obj;
    }, {} as Record<string, string>);

  const response = {
    timestamp: new Date().toISOString(),
    url: req.url,
    method: req.method,
    headers: {
      'cf-connecting-ip': headers['cf-connecting-ip'] || null,
      'x-forwarded-for': headers['x-forwarded-for'] || null,
      'x-real-ip': headers['x-real-ip'] || null,
      'x-client-ip': headers['x-client-ip'] || null,
      'x-forwarded': headers['x-forwarded'] || null,
      'forwarded-for': headers['forwarded-for'] || null,
      'forwarded': headers['forwarded'] || null,
    },
    // Show all IP-related headers
    allIpHeaders,
    // Additional debugging info
    userAgent: headers['user-agent'] || null,
    host: headers['host'] || null,
    // Show first 10 headers for debugging
    allHeaders: Object.keys(headers).slice(0, 10).reduce((obj, key) => {
      obj[key] = headers[key];
      return obj;
    }, {} as Record<string, string>)
  };

  return NextResponse.json(response, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    }
  });
}

// Also support POST method for testing
export async function POST(req: NextRequest) {
  return GET(req);
}
