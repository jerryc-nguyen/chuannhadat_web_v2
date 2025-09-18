export function logNonCriticalError(message: string, context: Record<string, any> = {}) {
  const error = new Error(message);
  console.warn('Non-critical error logged:', message, context);
}
