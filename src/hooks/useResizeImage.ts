import { getViewportSize } from '@hooks/useViewportSize';
import { isServer } from '@tanstack/react-query';
import queryString from 'query-string';

const CDN_MAPS: Record<string, A> = {
  'chuannhadat-assets.sgp1.digitaloceanspaces.com':
    'images.chuannhadat.com',
  'chuannhadat-assets.sgp1.cdn.digitaloceanspaces.com':
    'images.chuannhadat.com',
  'chuannhadat-assets-dev.sgp1.digitaloceanspaces.com':
    's3-images-dev.b-cdn.net',
};

export const MAX_THUMB_WIDTH = 480;
const DEFAULT_RATIO = 16 / 9;

export default function useResizeImage() {
  let screenWidth = MAX_THUMB_WIDTH;

  if (!isServer) {
    [screenWidth] = getViewportSize();
  }

  const resize = ({
    imageUrl,
    sizes,
  }: {
    imageUrl: string;
    sizes: Record<string, A>;
  }): string => {
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
    width = width ?? thresholdWidth(screenWidth);
    width =
      width > MAX_THUMB_WIDTH ? MAX_THUMB_WIDTH : width;
    const curRatio = ratio ?? DEFAULT_RATIO;

    const height = Math.ceil(width / curRatio);
    if (!imageUrl || imageUrl.length == 0) {
      return '';
    }

    return resize({
      imageUrl: imageUrl,
      sizes: { width: width, height: height },
    });
  };

  const applyCdnUrlFor = (url: string): string => {
    for (const host in CDN_MAPS) {
      url = url.replace(host, CDN_MAPS[host]);
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
    resize: resize,
    thresholdWidth: thresholdWidth,
    buildThumbnailUrl: buildThumbnailUrl,
  };
}
