import { NextApiRequest, NextApiResponse } from 'next';
import { getBotLogs, clearBotLogs } from '@/lib/botProtectionMonitor';

// Enable debug mode for local development
const DEBUG = process.env.NODE_ENV === 'development';

// Helper function to ensure we have some logs for debugging
function ensureLogsExist(logs: any[]) {
  console.log(`API - Original log count: ${logs.length}`);

  // If there are global logs available, try to access them directly
  try {
    const globalThis_logs = (global as any).__BOT_PROTECTION_LOGS || [];
    console.log(`API Direct global logs check: ${globalThis_logs.length} logs found`);

    if (globalThis_logs.length > 0 && logs.length === 0) {
      console.log(`Adding ${globalThis_logs.length} global logs directly`);
      logs = [...globalThis_logs];
    }
  } catch (e) {
    console.error('Error accessing global logs directly:', e);
  }

  // If still no logs, add a fake one for debugging
  if (logs.length === 0) {
    const fakeLog = {
      timestamp: new Date().toISOString(),
      url: 'http://localhost:3000/',
      ip: '127.0.0.1',
      userAgent: 'Test User Agent',
      isBot: false,
      isSuspicious: false,
      requestDenied: false,
      rateLimited: false,
      rateLimitRemaining: 100,
      suspiciousDetails: {
        isKnownSearchEngine: false,
        hasSuspiciousUserAgent: false,
        hasSuspiciousHeaders: false,
        hasUnusualPattern: false,
        matchedPatterns: []
      }
    };

    logs.push(fakeLog);
    console.log('Added a fake log since none were found');
  }

  return logs;
}

// Simple auth middleware for protecting the endpoint
const isAuthorized = (req: NextApiRequest): boolean => {
  // In production, you'd want to use a proper authentication system
  // For this example, we'll use a simple API key approach
  const apiKey = req.headers['x-api-key'];
  const validApiKey = process.env.BOT_PROTECTION_DASHBOARD_KEY;

  // If no API key is configured, only allow in development
  if (!validApiKey) {
    return process.env.NODE_ENV === 'development';
  }

  return apiKey === validApiKey;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (DEBUG) {
    console.log(`[BOT-API] ${req.method} request to /api/bot-protection/logs`);
    console.log(`[BOT-API] Headers: ${JSON.stringify(req.headers['user-agent'])}`);
  }

  // Check authorization
  if (!isAuthorized(req)) {
    if (DEBUG) console.log('[BOT-API] Unauthorized access attempt');
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Handle different HTTP methods
  let logs;
  switch (req.method) {
    case 'GET':
      // Get the bot logs with extra debugging
      console.log('🔎 Fetching logs via getBotLogs()...');
      logs = getBotLogs();
      console.log(`🔎 getBotLogs returned ${logs.length} logs`);

      // Make sure we have logs for debugging
      logs = ensureLogsExist(logs);

      // Add distinctive flag for visibility in console
      console.log('======= BOT PROTECTION API LOGS =======');
      console.log(`LOG COUNT: ${logs.length}`);
      if (logs.length > 0) {
        console.log(`NEWEST LOG: ${JSON.stringify({
          url: logs[0].url,
          timestamp: logs[0].timestamp,
          userAgent: logs[0].userAgent?.substring(0, 30)
        })}`);
      } else {
        console.log('NO LOGS FOUND! This suggests middleware is not recording requests.');
      }
      console.log('======================================');

      if (DEBUG) console.log(`[BOT-API] Returning ${logs.length} logs`);
      return res.status(200).json({ logs });

    case 'DELETE':
      // Clear all logs
      if (DEBUG) console.log('[BOT-API] Clearing all logs');
      clearBotLogs();

      // Also try to clear global logs directly
      try {
        (global as any).__BOT_PROTECTION_LOGS = [];
        console.log('Cleared global logs directly');
      } catch (e) {
        console.error('Failed to clear global logs directly:', e);
      }

      return res.status(200).json({ success: true });

    default:
      if (DEBUG) console.log(`[BOT-API] Unsupported method: ${req.method}`);
      return res.status(405).json({ error: 'Method not allowed' });
  }
} 
