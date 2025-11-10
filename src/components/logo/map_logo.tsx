import { cn } from '@common/utils';
import Image from 'next/image';
import React from 'react';
import { DEFAULT_LOGO } from '@common/constants';
import useResizeImage from '@common/hooks/useResizeImage';

type LogoProps = {
  url: string;
};
const MapLogo: React.FC<LogoProps> = ({ url }) => {
  const { buildThumbnailUrl } = useResizeImage();
  return (
    // eslint-disable-next-line @next/next/no-html-link-for-pages
    <a
      href={url || '/'}
      className={cn('header-logo mr-4 flex items-center space-x-2')}
      aria-label="Chuẩn Nhà Đất - Về trang chủ"
      role="banner"
    >
      <Image
        height={40}
        width={40}
        src={buildThumbnailUrl({ imageUrl: DEFAULT_LOGO, width: 40, ratio: 1 })}
        alt="Chuẩn Nhà Đất - Logo nền tảng bất động sản"
        priority
        fetchPriority="high"
      />
    </a>
  );
};

export default MapLogo;
