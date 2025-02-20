import MainNavRight from './MainNavRight';
import MainNavLocationsPicker from './MainNavLocationsPicker';

import { cookies } from 'next/headers';
import { API_TOKEN_SERVER } from '@common/auth';
import Logo from '@components/logo';

export default async function HeaderDesktop() {
  const isLogged = cookies().has(API_TOKEN_SERVER);
  return (
    <header className="header-desktop sticky top-0 z-10 flex justify-between border-b bg-white/70 px-5 py-3 backdrop-blur-sm md:px-10">
      <Logo />
      <div className="header-search relative md:w-1/4">
        <MainNavLocationsPicker />
      </div>
      <MainNavRight isLogged={isLogged} />
    </header>
  );
}
