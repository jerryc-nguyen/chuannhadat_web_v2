import { NextApiRequest, NextApiResponse } from 'next';
import { getBotLogs, clearBotLogs } from '@/lib/botProtectionMonitor';

// Enable debug mode for local development
const DEBUG = process.env.NODE_ENV === 'development';

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
      // Return the bot logs
      logs = getBotLogs();

      // Add distinctive flag for visibility in console
      console.log('======= BOT PROTECTION API LOGS =======');
      console.log(`LOG COUNT: ${logs.length}`);
      if (logs.length > 0) {
        console.log(`NEWEST LOG: ${JSON.stringify(logs[0])}`);
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
      return res.status(200).json({ success: true });

    default:
      if (DEBUG) console.log(`[BOT-API] Unsupported method: ${req.method}`);
      return res.status(405).json({ error: 'Method not allowed' });
  }
} 
