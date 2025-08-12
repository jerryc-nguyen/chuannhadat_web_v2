// Removed unused imports for SSR consistency
// import { getViewportSize } from '@hooks/useViewportSize';
// import { isServer } from '@tanstack/react-query';
import queryString from 'query-string';
import * as Sentry from '@sentry/nextjs';

const CDN_MAPS: Record<string, A> = {
  'chuannhadat-assets.sgp1.digitaloceanspaces.com': 'images.chuannhadat.com',
  'chuannhadat-assets.sgp1.cdn.digitaloceanspaces.com': 'images.chuannhadat.com',
  'chuannhadat-assets-dev.sgp1.digitaloceanspaces.com': 's3-images-dev.b-cdn.net',
};

export const MAX_THUMB_WIDTH = 376; // ✅ Reduced from 480 to match actual display size
const DEFAULT_RATIO = 16 / 9;

const DEFAULT_IMG =
  'https://images.chuannhadat.com/images/avatars/gg_avatar.png?crop=true&height=150&width=150';

export default function useResizeImage() {
  // Always use MAX_THUMB_WIDTH for SSR consistency
  // This prevents hydration mismatches while still providing good quality
  const screenWidth = MAX_THUMB_WIDTH;

  const resize = ({ imageUrl, sizes }: { imageUrl: string; sizes: Record<string, A> }): string => {
    try {
      new URL(String(imageUrl));
    } catch (error) {
      Sentry.captureException(error, { extra: { imageUrl } });
      return DEFAULT_IMG;
    }
    if (imageUrl === '[object Object]') return DEFAULT_IMG;
    const updatedCdnUrl = applyCdnUrlFor(imageUrl);
    const url = new URL(updatedCdnUrl);
    const newURLStr = updatedCdnUrl.replace(url.search, '');
    const newUrl = new URL(newURLStr);
    let newSize = {};

    if (sizes['clear'] == true) {
      newSize = {};
    } else {
      newSize = {
        ...url.searchParams,
        ...sizes,
        crop: true,
      };
    }

    newUrl.search = queryString.stringify(newSize);
    return newUrl.toString();
  };

  const buildThumbnailUrl = ({
    imageUrl,
    width,
    ratio,
  }: {
    imageUrl: string;
    width?: number;
    ratio?: number;
  }): string => {

    if (!imageUrl || imageUrl.length == 0) {
      return '';
    }

    width = width ?? thresholdWidth(screenWidth);
    width = width > MAX_THUMB_WIDTH ? MAX_THUMB_WIDTH : width;
    const curRatio = ratio ?? DEFAULT_RATIO;
    const height = Math.ceil(width / curRatio);

    // Disable retina scaling for SSR consistency
    // This ensures same URLs are generated on server and client
    // Note: This may slightly reduce image quality on retina displays
    // but prevents hydration mismatches

    return resize({
      imageUrl: imageUrl,
      sizes: {
        width: width,
        height: height,
        f: 'webp', // ✅ Force WebP format for better compression
        q: 80      // ✅ Optimize quality for performance
      },
    });
  };

  const cropSquare = (url: string, width: number): string => {
    return resize({
      imageUrl: url,
      sizes: { width: width, height: width },
    });
  };

  const applyCdnUrlFor = (url: string): string => {
    for (const host in CDN_MAPS) {
      url = url.replace(host, CDN_MAPS[host]) || url;
    }
    return url;
  };

  const thresholdWidth = (screenWidth: number) => {
    if (screenWidth <= 390) {
      return 390;
    } else if (screenWidth > 390 && screenWidth <= 480) {
      return 480;
    } else if (screenWidth > 480 && screenWidth <= 640) {
      return 640;
    } else if (screenWidth > 640 && screenWidth <= 750) {
      return 750;
    } else {
      return 1024;
    }
  };

  return {
    resize,
    thresholdWidth,
    buildThumbnailUrl,
    cropSquare,
  };
}
