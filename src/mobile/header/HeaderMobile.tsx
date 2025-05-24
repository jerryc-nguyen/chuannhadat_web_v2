import { getCookieServer } from '@app/action';
import { API_TOKEN_SERVER } from '@common/auth';
import Logo from '@components/logo';
import MainNavLocationsPicker from './MainNavLocationsPicker';
import MainNavRight from './MainNavRight';

export default async function HeaderMobile() {
  const isLogged = await getCookieServer(API_TOKEN_SERVER);

  return (
    <header className="header-mobile sticky top-0 z-10 flex flex-col justify-between gap-y-1 border-b bg-white/80 px-5 py-3 backdrop-blur-sm">
      <div className="flex items-center justify-between py-3">
        <Logo />
        <div className="flex items-center">
          <MainNavRight isLogged={!!isLogged} />
        </div>
      </div>
      <div className="relative">
        <MainNavLocationsPicker />
      </div>
    </header>
  );
}
