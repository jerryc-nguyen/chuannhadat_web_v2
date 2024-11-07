import MainNavRight from './MainNavRight';
import { cookies } from 'next/headers';
import { API_TOKEN_SERVER } from '@common/auth';
import MainNavLocationsPicker from './MainNavLocationsPicker';
import Logo from '@components/logo';

export default async function HeaderMobile() {
  const isLogged = cookies().has(API_TOKEN_SERVER);

  return (
    <header className="header-mobile sticky top-0 z-10 flex flex-col justify-between gap-y-1 border-b bg-white/80 px-5 py-3 backdrop-blur-sm">
      <div className="flex items-center justify-between py-3">
        <Logo />
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
