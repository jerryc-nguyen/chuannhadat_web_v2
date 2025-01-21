import * as Sentry from '@sentry/nextjs';

export function logNonCriticalError(message: string, context: Record<string, any> = {}) {
  const error = new Error(message);
  Sentry.captureException(error, {
    extra: context,
  });
  console.warn('Non-critical error logged:', message, context);
}
