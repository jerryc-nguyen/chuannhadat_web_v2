'use server';
import MainNavRight from './MainNavRight';
import MainNavLocationsPicker from './MainNavLocationsPicker';

import { cookies } from 'next/headers';
import { API_TOKEN } from '@common/auth';
import Logo from '@components/logo';
import { timeOutDuration } from '@common/constants';

export default async function HeaderDesktop() {
  const isLogged = cookies().has(API_TOKEN);
  console.log('isLogged', isLogged);
  const handleRemoveToken = () => {
    'use server';
    cookies().delete(API_TOKEN);
  };
  const handleSetToken = (token: string) => {
    'use server';
    cookies().set({
      name: API_TOKEN,
      value: token,
      httpOnly: true,
      maxAge: timeOutDuration / 1000, // in seconds
      secure: true,
      sameSite: 'lax',
    });
  };
  return (
    <header className="header-desktop sticky top-0 z-10 flex justify-between border-b bg-white/70 px-5 py-3 backdrop-blur-sm md:px-10">
      <Logo />
      <div className="header-search relative md:w-1/4">
        <MainNavLocationsPicker />
      </div>
      <MainNavRight
        handleSetToken={handleSetToken}
        handleRemoveToken={handleRemoveToken}
        isLogged={isLogged}
      />
    </header>
  );
}
