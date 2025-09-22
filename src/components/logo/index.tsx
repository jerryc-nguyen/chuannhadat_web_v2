import { cn } from '@common/utils';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { DEFAULT_LOGO } from '@common/constants';
import useResizeImage from '@common/hooks/useResizeImage';

type LogoProps = {
  isAlwaysShow?: boolean;
  className?: string;
};
const Logo: React.FC<LogoProps> = ({ isAlwaysShow = false, className }) => {
  const { buildThumbnailUrl } = useResizeImage();
  return (
    <Link
      href="/"
      className={cn('header-logo mr-4 flex items-center space-x-2', className)}
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
      <div
        className={cn('gap-x-1 text-nowrap', isAlwaysShow ? 'flex' : 'hidden md:flex')}
        role="text"
        aria-label="Chuẩn Nhà Đất"
      >
        <span className="text-xl font-semibold text-blue-600">Chuẩn</span>
        <span className="text-xl font-semibold text-pink-600">Nhà đất</span>
      </div>
    </Link>
  );
};

export default Logo;
