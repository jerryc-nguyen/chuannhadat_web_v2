import axios from 'axios';
import { getCookie } from '@common/cookies';
import { FRONTEND_TOKEN } from '@common/auth';
import { API_ROUTES } from '@common/router';

// Define a proper type for the error object
export interface ErrorWithDigest extends Error {
  digest?: string;
  name: string;
  message: string;
  stack?: string;
}

// Function to send error or message to tracking service
// Accepts either an Error object or a raw message string
export const trackError = async (
  errorOrMessage: ErrorWithDigest | Error | string,
  category = 'unknown',
  extraInfo?: Record<string, unknown>
) => {
  try {
    // Handle both Error objects and raw message strings
    const isError = errorOrMessage instanceof Error;
    const error = isError ? errorOrMessage : null;
    const message = isError ? errorOrMessage.message : errorOrMessage;

    const payload = {
      error_name: error?.name || 'Message',
      error_message: message || 'Unknown message',
      error_category: category,
      error_digest: error && 'digest' in error ? error.digest : null,
      error_stack: error?.stack || null,
      url: typeof window !== 'undefined' ? window.location.href : null,
      user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
      timestamp: new Date().toISOString(),
      extra_info: extraInfo || null,
    };

    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    await axios.post(`${baseUrl}/${API_ROUTES.TRACKINGS.ERRORS}`, payload, {
      headers: {
        'Content-Type': 'application/json',
        'Frontend-Token': getCookie(FRONTEND_TOKEN),
      },
      timeout: 5000, // Short timeout to avoid blocking
    });
  } catch (trackingError) {
    // If tracking fails, still log to console as fallback
    console.error('Failed to track error:', trackingError);
    console.error('Original error/message:', errorOrMessage);
  }
};
