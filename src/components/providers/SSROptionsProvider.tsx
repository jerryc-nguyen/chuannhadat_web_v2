'use client';

import React, { useContext, createContext } from 'react';

type TContextProps = {
  isMobile: boolean;
  selectedCookies: Record<string, string | undefined | null>;
};

const SSROptionsContext = createContext<TContextProps>({ isMobile: false, selectedCookies: {} });

export default function SSROptionsProvider({
  children,
  isMobile,
  selectedCookies,
}: {
  children: A;
  isMobile: boolean;
  selectedCookies: A;
}) {
  return (
    <SSROptionsContext.Provider value={{ isMobile, selectedCookies }}>
      {children}
    </SSROptionsContext.Provider>
  );
}

export const useSSROptionsContext = () => ({
  ...useContext(SSROptionsContext),
});
