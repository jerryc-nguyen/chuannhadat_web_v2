import Image from 'next/image';
import React from 'react';

const Logo: React.FC = () => {
  return (
    <a href="/" className="header-logo mr-4 flex items-center space-x-2">
      <Image
        height={40}
        src="https://chuannhadat.com/images/logo_mobile@2x.png"
        width={40}
        alt="Logo"
      />
      <div className="flex gap-x-1">
        <h2 className="text-xl font-semibold text-blue-600">Chuẩn </h2>
        <h2 className="text-xl font-semibold text-pink-600">Nhà đất</h2>
      </div>
    </a>
  );
};

export default Logo;
