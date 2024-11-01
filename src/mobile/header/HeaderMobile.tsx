import MainNavRight from './MainNavRight';
import Image from 'next/image';
import { cookies } from 'next/headers';
import { API_TOKEN_SERVER } from '@common/auth';
import MainNavLocationsPicker from './MainNavLocationsPicker';

export default async function HeaderMobile() {
  const isLogged = cookies().has(API_TOKEN_SERVER);
  console.log('🚀 ~ HeaderMobile ~ isLogged:', isLogged);

  return (
    <header className="header-mobile sticky top-0 z-10 flex flex-col justify-between gap-y-1 border-b bg-white/80 px-5 py-3 backdrop-blur-sm">
      <div className="flex items-center justify-between py-3">
        <a href="/" className="mr-4 flex items-center space-x-2">
          <Image
            height={40}
            src="https://chuannhadat.com/images/logo_mobile@2x.png"
            width="40"
            alt="Logo"
          />
        </a>
        <div className="flex items-center">
          <MainNavRight isLogged={isLogged} />
        </div>
      </div>
      <div className="relative">
        <MainNavLocationsPicker />
      </div>
    </header>
  );
}
