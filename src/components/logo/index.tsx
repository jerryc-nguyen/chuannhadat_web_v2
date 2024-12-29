import { cn } from '@common/utils';
import Image from 'next/image';
import React from 'react';
type LogoProps = {
  isAlwaysShow?: boolean;
  className?: string;
};
const Logo: React.FC<LogoProps> = ({ isAlwaysShow = false, className }) => {
  return (
    <a href="/" className={cn('header-logo mr-4 flex items-center space-x-2', className)}>
      <Image
        height={40}
        src="https://chuannhadat.com/images/logo_mobile@2x.png"
        width={40}
        alt="Logo"
      />
      <div className={cn('gap-x-1 text-nowrap', isAlwaysShow ? 'flex' : 'hidden md:flex')}>
        <h2 className="text-xl font-semibold text-blue-600">Chuẩn </h2>
        <h2 className="text-xl font-semibold text-pink-600">Nhà đất</h2>
      </div>
    </a>
  );
};

export default Logo;
