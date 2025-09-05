// Removed unused imports - only keeping essential rate limiting

// Check if bot protection is enabled from environment variable
const isBotProtectionEnabled = process.env.ENABLE_BOT_PROTECTION === 'true';

// Enable debug mode for local development
const DEBUG = process.env.DEBUG_BOT_PROTECTION === 'true';

// Simple in-memory rate limiter for middleware
// This avoids Redis dependencies in the middleware context
const ipRequestCounts = new Map<string, { count: number, timestamp: number }>();

// Memory monitoring
const MAX_ENTRIES = 5000; // Prevent memory leaks

// Removed DNS cache - not used in lightweight version

// Redis will only be used in the API routes, not middleware
export const rateLimit = async (
  ip: string,
  userAgent?: string | null,
  maxRequests = 60, // Default value if not provided
  windowSizeInSeconds = 60
): Promise<{ success: boolean; limit: number; remaining: number; reset: number }> => {
  // Minimal debug logging
  if (DEBUG && maxRequests !== 60) {
    // eslint-disable-next-line no-console
    console.log(`[RATE-LIMIT] ${ip} → ${maxRequests}/min`);
  }

  // If protection is disabled, always allow
  if (!isBotProtectionEnabled) {
    return {
      success: true,
      limit: maxRequests,
      remaining: maxRequests - 1,
      reset: Math.floor(Date.now() / 1000) + windowSizeInSeconds
    };
  }

  const now = Math.floor(Date.now() / 1000);
  const windowStart = now - (now % windowSizeInSeconds);
  const reset = windowStart + windowSizeInSeconds;

  // Check if we have a record for this IP in the current window
  const record = ipRequestCounts.get(ip);

  // If no record exists or it's from a previous window, create a new one
  if (!record || record.timestamp < windowStart) {
    // Memory protection - prevent unlimited growth
    if (ipRequestCounts.size >= MAX_ENTRIES) {
      // Emergency cleanup - remove oldest 20% of entries
      const entries = Array.from(ipRequestCounts.entries());
      entries.sort(([, a], [, b]) => a.timestamp - b.timestamp);
      const toRemove = Math.floor(entries.length * 0.2);
      for (let i = 0; i < toRemove; i++) {
        ipRequestCounts.delete(entries[i][0]);
      }
    }

    ipRequestCounts.set(ip, { count: 1, timestamp: now });
    return {
      success: true,
      limit: maxRequests,
      remaining: maxRequests - 1,
      reset
    };
  }

  // Increment the counter
  record.count += 1;

  // Check if the request is allowed
  const isAllowed = record.count <= maxRequests;
  const remaining = Math.max(0, maxRequests - record.count);

  // Log the decision
  if (DEBUG) {
    // eslint-disable-next-line no-console
    console.log(`[RATE-LIMIT] IP: ${ip}, Count: ${record.count}/${maxRequests}, Allowed: ${isAllowed}`);
  }

  // Efficient cleanup - only when needed and non-blocking
  if (ipRequestCounts.size > 1000 && now % 30 === 0) {
    // Clean every 30 seconds when map gets large (Edge Runtime compatible)
    setTimeout(() => {
      const cutoff = windowStart - windowSizeInSeconds; // Keep one extra window
      for (const [ipKey, data] of ipRequestCounts.entries()) {
        if (data.timestamp < cutoff) {
          ipRequestCounts.delete(ipKey);
        }
      }
    }, 0);
  }

  return {
    success: isAllowed,
    limit: maxRequests,
    remaining,
    reset
  };
};

// Removed all unused bot detection functions - not used in lightweight version
// Only keeping the essential rateLimit function above
