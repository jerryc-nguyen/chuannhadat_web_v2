import { isServer } from '@tanstack/react-query';

/**
 * Hook to handle CDN assets with conditional prefix based on environment
 */
export default function useCdnAsset() {
  const assetPrefix = process.env.NEXT_PUBLIC_ASSET_PREFIX || '';

  /**
   * Converts a relative asset path to a CDN URL in production or local path in development
   * @param path - Relative path to the asset
   * @returns Full URL including CDN if in production
   */
  const getAssetUrl = (path: string): string => {
    // If the path is already a full URL, return it as is
    if (path.startsWith('http') || path.startsWith('//')) {
      return path;
    }

    // Remove any leading slash for consistency
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;

    // In production, prepend the CDN URL
    if (process.env.NODE_ENV === 'production' && assetPrefix) {
      return `${assetPrefix}/${cleanPath}`;
    }

    // In development, use the local path
    return `/${cleanPath}`;
  };

  return {
    getAssetUrl,
  };
} 
