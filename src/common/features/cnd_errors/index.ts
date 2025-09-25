// Define a proper type for the error object
export interface ErrorWithDigest extends Error {
  digest?: string;
  name: string;
  message: string;
  stack?: string;
}

// Function to check if error is a chunk load error
export const isChunkLoadError = (error: ErrorWithDigest): boolean => {
  return error.name === 'ChunkLoadError' ||
    error.message?.includes('Loading chunk') ||
    error.message?.includes('ChunkLoadError');
};

// Function to handle chunk load errors with automatic recovery
export const handleChunkLoadError = (error: ErrorWithDigest) => {
  if (isChunkLoadError(error)) {
    console.warn('Chunk load error detected, attempting recovery...', error);

    // Track the error first
    trackError(error, 'chunk_load_error').finally(() => {
      // Add a small delay to avoid immediate retry loops
      setTimeout(() => {
        if (typeof window === 'undefined') return;

        // Clear any cached chunks and reload
        const reloadPage = () => window.location.reload();

        if ('caches' in window) {
          caches.keys().then(cacheNames => {
            cacheNames.forEach(cacheName => {
              if (cacheName.includes('next') || cacheName.includes('chunk')) {
                caches.delete(cacheName);
              }
            });
          }).finally(reloadPage);
        } else {
          reloadPage();
        }
      }, 1000); // 1 second delay
    });

    return true; // Indicates we handled the error
  }
  return false; // Not a chunk load error
};


// Function to send error to tracking service
export const trackError = async (error: ErrorWithDigest, category = 'unknown') => {
  try {
    const { default: axiosInstance } = await import('@common/api/axiosInstance');
    const { getCookie } = await import('@common/cookies');
    const { FRONTEND_TOKEN } = await import('@common/auth');
    const { API_ROUTES } = await import('@common/router');

    const payload = {
      error_name: error.name || 'Unknown Error',
      error_message: error.message || 'Unknown error message',
      error_category: category,
      error_digest: error.digest || null,
      error_stack: error.stack || null,
      url: typeof window !== 'undefined' ? window.location.href : null,
      user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
      timestamp: new Date().toISOString(),
    };

    await axiosInstance.post(API_ROUTES.TRACKINGS.ERRORS, payload, {
      headers: {
        'Frontend-Token': getCookie(FRONTEND_TOKEN),
      },
    });
  } catch (trackingError) {
    // If tracking fails, still log to console as fallback
    console.error('Failed to track error:', trackingError);
    console.error('Original error:', error);
  }
};
