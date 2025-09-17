# Production Rate Limiting Debug Guide

## Issue

Rate limiting works correctly in localhost but not in production environment.

## Debugging Steps

### 1. Enable Production Logging

Add this environment variable to your production deployment:

```bash
ENABLE_PROD_MIDDLEWARE_LOG=true
```

### 2. Check Production Logs

Look for these log patterns in your production logs:

#### ✅ Good Logs (Requests Being Skipped)

```
[RSC-SKIP] /profile/some-profile?_rsc=1q0l6
[MONITORING-SKIP] /monitoring
[STATIC-SKIP] /favicon-32x32.png
[BOT-EXCLUDED] /some-path - IP: 1.2.3.4
```

#### ❌ Problem Logs (Requests Being Processed)

```
[PROD-PROCESS] /profile/some-profile?_rsc=1q0l6 | UA: Mozilla/5.0... | Headers: {...}
🚫 RATE LIMITED /some-path: IP=1.2.3.4, UA=..., Limit=60, Remaining=0
```

#### 🔍 Debug Logs (RSC Detection)

```
[RSC-DEBUG] URL: https://example.com/path?_rsc=1q0l6 | hasRscParam: true | Headers: rsc=null, x-nextjs-data=false, next-router-prefetch=null
```

### 3. Common Production Issues

#### Issue 1: Different Request Headers

Production environments (Cloudflare + nginx) might strip or modify headers.

**Check:** Look for `[RSC-DEBUG]` logs to see if RSC detection is working.

#### Issue 2: Different URL Patterns

Production might have different base URLs or proxy configurations.

**Check:** Compare the URLs in `[PROD-PROCESS]` logs with localhost.

#### Issue 3: CDN/Proxy Interference

Cloudflare or nginx might be caching or modifying requests.

**Check:** Look for requests that should be skipped but appear in `[PROD-PROCESS]` logs.

#### Issue 4: Environment Variables

Production environment variables might not be set correctly.

**Check:** Verify `NODE_ENV=production` and other env vars.

### 4. Potential Fixes

#### Fix 1: Enhanced RSC Detection

If RSC requests aren't being detected, the middleware includes additional debug logging to identify why.

#### Fix 2: Nginx Configuration

Your nginx config shows proper proxy headers. Ensure these are working:

```nginx
proxy_set_header X-Real-IP $remote_addr;
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
```

#### Fix 3: Middleware Matcher

The middleware matcher has been simplified to avoid complex patterns that might behave differently in production.

### 5. Quick Test

1. Deploy with `ENABLE_PROD_MIDDLEWARE_LOG=true`
2. Reload a page in production
3. Check logs for the patterns above
4. Share the logs to identify the specific issue

### 6. Expected Behavior

After the fix, you should see:

- 1 `[PROD-PROCESS]` log for the main page
- Multiple `[RSC-SKIP]` logs for RSC requests
- Multiple `[STATIC-SKIP]` or `[MONITORING-SKIP]` logs
- Rate limit should only decrease by 1 per page reload

## Next Steps

1. Enable production logging
2. Capture logs from a page reload
3. Share the logs to identify the root cause
4. Apply targeted fix based on the findings
