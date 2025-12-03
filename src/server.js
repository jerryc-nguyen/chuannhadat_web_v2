// Apply polyfills immediately before any other imports
if (typeof global.self === 'undefined') {
  global.self = global;
}
if (typeof global.window === 'undefined') {
  global.window = undefined;
}
if (typeof global.document === 'undefined') {
  global.document = undefined;
}
if (typeof global.navigator === 'undefined') {
  global.navigator = undefined;
}

// eslint-disable-next-line
const { createServer } = require('http');
// eslint-disable-next-line
const { parse } = require('url');
// eslint-disable-next-line
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOSTNAME || '0.0.0.0';
const port = parseInt(process.env.PORT || '4500', 10);

// Initialize Next.js
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

// Bot-targeted in-memory HTML cache
// - Only caches full HTML page responses for GET requests
// - Skips assets, API routes, and Next internal paths
// - TTL-based expiration with simple LRU eviction
const HTML_CACHE_MAX_ENTRIES = 100;
const HTML_CACHE_TTL_MS = 3_600_000; // default 1 hour
const BOT_HTML_CACHE_LOG = false;

function cacheLog(...args) {
  if (BOT_HTML_CACHE_LOG) {
    console.log('[BotHTMLCache]', ...args);
  }
}

/**
 * key -> { body: Buffer, statusCode: number, headers: Record<string,string>, expiresAt: number }
 */
const htmlCache = new Map();

function isBotUserAgent(ua = '') {
  return /(Googlebot|bingbot|Baiduspider|YandexBot|DuckDuckBot|facebookexternalhit|Twitterbot|LinkedInBot|Applebot|Slurp|SemrushBot|AhrefsBot|MJ12bot|GPTBot|Claude-Web|DataForSeoBot|Sogou|Seznam|PetalBot|Pinterest)/i.test(
    ua,
  );
}

function isCacheablePath(pathname = '', _hasQuery = false) {
  if (!pathname) return false;
  // Global exclusions
  if (pathname.startsWith('/_next')) return false;
  if (pathname.startsWith('/api')) return false;
  if (pathname.endsWith('/robots.txt') || pathname.endsWith('/sitemap.xml')) return false;
  const assetExt = pathname.match(
    /\.(?:js|mjs|css|map|json|jpg|jpeg|png|gif|webp|svg|ico|avif|mp4|webm|woff|woff2|ttf|otf)$/i,
  );
  if (assetExt) return false;

  // Allowlist: only cache the following pages
  const isHome = pathname === '/';
  const isCategory = pathname.startsWith('/ban-') || pathname.startsWith('/cho-thue-');
  const isProfile = /^\/profile\/[A-Za-z0-9-_.]+\/?$/.test(pathname);
  const isPostDetail = pathname.startsWith('/post/');

  return isHome || isCategory || isProfile || isPostDetail;
}

function makeCacheKey(req) {
  const host = req.headers['host'] || hostname;
  const ae = String(req.headers['accept-encoding'] || '').toLowerCase();
  let encVariant = 'identity';
  if (ae.includes('br')) encVariant = 'br';
  else if (ae.includes('gzip')) encVariant = 'gzip';
  return `${host}${req.url}|ae:${encVariant}`;
}

function setResponseHeaders(res, headers) {
  if (!headers) return;
  for (const [key, value] of Object.entries(headers)) {
    try {
      res.setHeader(key, value);
    } catch (_) {
      // ignore header set errors
    }
  }
}

function mergeVaryHeader(existing) {
  const parts = new Set();
  if (typeof existing === 'string' && existing.length > 0) {
    existing
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .forEach((p) => parts.add(p));
  }
  parts.add('Accept-Encoding');
  parts.add('User-Agent');
  return Array.from(parts).join(', ');
}

function putInCache(key, entry) {
  if (htmlCache.size >= HTML_CACHE_MAX_ENTRIES) {
    const oldestKey = htmlCache.keys().next().value;
    if (oldestKey) htmlCache.delete(oldestKey);
  }
  htmlCache.set(key, entry);
}

// Prepare the app
app.prepare().then(() => {
  // Create HTTP server
  const server = createServer(async (req, res) => {
    try {
      // Parse the URL
      const parsedUrl = parse(req.url, true);

      const ua = req.headers['user-agent'] || '';
      const isGet = (req.method || 'GET').toUpperCase() === 'GET';
      const isBot = isBotUserAgent(ua);
      const hasQuery = Object.keys(parsedUrl.query || {}).length > 0;
      const isCategoryPath =
        parsedUrl.pathname.startsWith('/ban-') || parsedUrl.pathname.startsWith('/cho-thue-');
      const cacheable = isGet && isCacheablePath(parsedUrl.pathname, hasQuery);

      // Always log the request basics for easier debugging
      cacheLog('REQ', {
        method: req.method,
        path: parsedUrl.pathname,
        isBot,
        cacheable,
      });

      if (isBot) {
        if (!isGet) {
          res.setHeader('X-Bot-Cache', 'BYPASS');
          res.setHeader('X-Bot-Cache-Reason', 'non-GET-method');
          cacheLog('BYPASS (method)', { method: req.method, path: parsedUrl.pathname });
        } else if (!isCacheablePath(parsedUrl.pathname, hasQuery)) {
          // Special-case: category page with query string
          if (isCategoryPath && hasQuery) {
            res.setHeader('X-Bot-Cache', 'BYPASS');
            res.setHeader('X-Bot-Cache-Reason', 'category-with-query');
            cacheLog('BYPASS (category+query)', {
              path: parsedUrl.pathname,
              query: parsedUrl.query,
            });
          } else {
            res.setHeader('X-Bot-Cache', 'BYPASS');
            res.setHeader('X-Bot-Cache-Reason', 'path-not-allowed');
            cacheLog('BYPASS (path)', { path: parsedUrl.pathname });
          }
        }
      } else if (BOT_HTML_CACHE_LOG) {
        cacheLog('BYPASS (non-bot)', { path: parsedUrl.pathname });
      }

      if (isBot && cacheable) {
        const key = makeCacheKey(req);
        const cached = htmlCache.get(key);
        const now = Date.now();
        if (cached && cached.expiresAt > now) {
          // Serve from cache
          res.statusCode = cached.statusCode || 200;
          const cachedAtMs = cached.expiresAt - HTML_CACHE_TTL_MS;
          const ageSec = Math.max(0, Math.floor((Date.now() - cachedAtMs) / 1000));
          const headers = Object.assign(
            {
              'Content-Type': 'text/html; charset=utf-8',
              'Cache-Control': `public, max-age=0, s-maxage=${Math.floor(HTML_CACHE_TTL_MS / 1000)}, stale-while-revalidate=${Math.floor(HTML_CACHE_TTL_MS / 1000)}`,
              'X-Bot-Cache': 'HIT',
              'X-Bot-Cache-Age': String(ageSec),
            },
            cached.headers || {},
          );
          headers.Vary = mergeVaryHeader(headers.Vary);
          setResponseHeaders(res, headers);
          cacheLog('HIT', { key, path: parsedUrl.pathname, ageSec });
          res.end(cached.body);
          return;
        }

        // Miss: capture response body to cache after render
        const chunks = [];
        const origWrite = res.write.bind(res);
        const origEnd = res.end.bind(res);
        const origWriteHead = res.writeHead.bind(res);

        res.setHeader('X-Bot-Cache', 'MISS');
        try {
          const currentVary = res.getHeader && res.getHeader('Vary');
          res.setHeader('Vary', mergeVaryHeader(currentVary));
        } catch (_) {
          // ignore header set errors
        }
        cacheLog('MISS', { key, path: parsedUrl.pathname });

        res.write = function (chunk, encoding, cb) {
          try {
            if (chunk) {
              chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk, encoding));
            }
          } catch (_) {
            void 0;
          }
          return origWrite(chunk, encoding, cb);
        };

        res.end = function (chunk, encoding, cb) {
          try {
            if (chunk) {
              chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk, encoding));
            }
          } catch (_) {
            void 0;
          }
          const result = origEnd(chunk, encoding, cb);
          try {
            const body = Buffer.concat(chunks);
            const statusCode = res.statusCode || 200;
            const contentType = res.getHeader && res.getHeader('Content-Type');
            const isHtml = typeof contentType === 'string' ? /text\/html/i.test(contentType) : true;
            if (statusCode >= 200 && statusCode < 400 && isHtml && body && body.length > 0) {
              const headers = {};
              const headerNames = ['Content-Type', 'Content-Encoding', 'Vary'];
              headerNames.forEach((h) => {
                const v = res.getHeader && res.getHeader(h);
                if (typeof v !== 'undefined') headers[h] = v;
              });
              headers.Vary = mergeVaryHeader(headers.Vary);
              putInCache(key, {
                body,
                statusCode,
                headers,
                expiresAt: Date.now() + HTML_CACHE_TTL_MS,
              });
              cacheLog('STORE', { key, statusCode, bytes: body.length });
            }
          } catch (_) {
            void 0;
          }
          return result;
        };

        res.writeHead = function (...args) {
          return origWriteHead(...args);
        };

        await handle(req, res, parsedUrl);
        return;
      }

      // Non-bot or non-cacheable: normal handling
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling request:', err);
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  });

  // Configure server error handling
  server.on('error', (err) => {
    console.error('Server error:', err);
  });

  // Start listening
  server.listen(port, hostname, (err) => {
    if (err) throw err;

    // Log startup info
    console.log(`> Ready on http://${hostname}:${port}`);

    // Send ready signal to PM2
    if (typeof process.send === 'function') {
      process.send('ready');
      console.log('Sent ready signal to PM2');
    }
  });

  // Handle graceful shutdown
  const signals = ['SIGTERM', 'SIGINT'];
  signals.forEach((signal) => {
    process.on(signal, () => {
      console.log(`Received ${signal}, closing server...`);
      server.close(() => {
        console.log('Server closed');
        process.exit(0);
      });

      // Force close after 30s
      setTimeout(() => {
        console.error('Forcing server shutdown after timeout');
        process.exit(1);
      }, 30000);
    });
  });
});
