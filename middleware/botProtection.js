const { RateLimiterMemory } = require('rate-limiter-flexible');
const ipRateLimiter = new RateLimiterMemory({
  points: 60, // Number of requests
  duration: 60, // Per minute
});

// List of allowed bot user agents (lowercase for case-insensitive matching)
const allowedBots = {
  // Google bots
  googlebot: true,
  'adsbot-google': true,
  'apis-google': true,
  'mediapartners-google': true,
  'feedfetcher-google': true,
  'google-read-aloud': true,
  'storebot-google': true,

  // Bing bots
  bingbot: true,
  msnbot: true,
  adidxbot: true,
  bingpreview: true,
};

// Verify Google and Bing bots through reverse DNS lookup (optional advanced verification)
const verifySearchEngineBotByDNS = async (ip, userAgent) => {
  try {
    const dns = require('dns');
    const util = require('util');
    const reverseLookup = util.promisify(dns.reverse);
    const addresses = await reverseLookup(ip);

    if (addresses.length > 0) {
      const hostname = addresses[0].toLowerCase();

      // Check if the hostname belongs to Google or Bing
      if (userAgent.includes('google') && hostname.includes('googlebot.com')) {
        return true;
      }

      if (userAgent.includes('bing') && hostname.includes('search.msn.com')) {
        return true;
      }
    }

    return false;
  } catch (error) {
    console.error('DNS verification error:', error);
    return false;
  }
};

// Helper function to check if the request is from a known bot
const isKnownBot = (userAgent) => {
  if (!userAgent) return false;

  userAgent = userAgent.toLowerCase();

  // Check for known legitimate bots
  for (const botName in allowedBots) {
    if (userAgent.includes(botName)) {
      return true;
    }
  }

  return false;
};

// Bot detection patterns
const botPatterns = [
  /crawl/i,
  /bot/i,
  /spider/i,
  /scraper/i,
  /curl/i,
  /wget/i,
  /phantom/i,
  /headless/i,
  /archiver/i,
  /slurp/i,
  /facebook/i,
  /chrome-lighthouse/i,
  /dataminr/i,
  /semrush/i,
  /python-requests/i,
  /python-urllib/i,
  /ahrefs/i,
  /screaming frog/i,
];

// Helper function to detect suspicious bot behavior
const isSuspiciousBot = (userAgent) => {
  if (!userAgent) return true; // No user agent is suspicious

  // Check for patterns of suspicious bots
  for (const pattern of botPatterns) {
    if (pattern.test(userAgent) && !isKnownBot(userAgent)) {
      return true;
    }
  }

  return false;
};

// Check for missing or suspicious headers commonly absent in bots
const hasSuspiciousHeaders = (req) => {
  // Bots often don't set these headers
  const noAcceptHeader = !req.headers.accept;
  const noAcceptLanguage = !req.headers['accept-language'];
  const noAcceptEncoding = !req.headers['accept-encoding'];

  // Most bots don't have referer headers
  const hasReferer = !!req.headers.referer;

  return noAcceptHeader && noAcceptLanguage && noAcceptEncoding && !hasReferer;
};

// Detect unusual navigation patterns
const hasUnusualRequestPattern = (req) => {
  // Bots often request robots.txt, sitemap.xml, or API endpoints directly
  const path = req.path.toLowerCase();
  const isSuspiciousPath =
    path.includes('wp-') || // WordPress probing
    path.includes('admin') || // Admin area probing
    path.includes('.php') || // PHP file probing
    path.endsWith('.xml') || // XML files (except sitemaps for legitimate bots)
    path.includes('.env') || // Environment file probing
    path.includes('config') || // Configuration files
    path.includes('backup'); // Backup files

  if (isSuspiciousPath && isSuspiciousBot(req.headers['user-agent'])) {
    return true;
  }

  return false;
};

const botProtectionMiddleware = async (req, res, next) => {
  try {
    const ip = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'] || '';

    // Allow known search engine bots to bypass rate limiting
    if (isKnownBot(userAgent)) {
      // Optional: Verify Google/Bing bots via reverse DNS lookup for enhanced security
      // if (userAgent.includes('google') || userAgent.includes('bing')) {
      //   const isVerified = await verifySearchEngineBotByDNS(ip, userAgent);
      //   if (!isVerified) {
      //     return res.status(403).send('Access denied: Bot verification failed');
      //   }
      // }

      // Allow verified search engine bots to access your site
      return next();
    }

    // Check for suspicious bot patterns
    if (isSuspiciousBot(userAgent)) {
      // For suspicious bots, apply strict rate limiting
      try {
        await ipRateLimiter.consume(ip, 3); // Higher consumption rate for suspicious bots
      } catch (e) {
        return res.status(429).send('Too many requests. Please try again later.');
      }
    }

    // Additional checks for suspicious behavior
    if (hasSuspiciousHeaders(req) || hasUnusualRequestPattern(req)) {
      return res.status(403).send('Access denied');
    }

    // Apply normal rate limiting for all other requests
    try {
      await ipRateLimiter.consume(ip);
    } catch (e) {
      return res.status(429).send('Too many requests. Please try again later.');
    }

    next();
  } catch (error) {
    console.error('Bot protection error:', error);
    next(error);
  }
};

module.exports = botProtectionMiddleware;
