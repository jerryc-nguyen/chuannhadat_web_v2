import React from 'react';
import Mobile from './mobile';
import Desktop from './desktop';
import { Provider as JotaiProvider } from 'jotai';
import { getUserAgentInfo } from '@utils/ssrUserAgent';

export default function Home() {
  const { isMobile } = getUserAgentInfo();

  const App = () => {
    if (isMobile) {
      return (
        <div className='c-mobileApp'>
          <Mobile />
        </div>
      );
    } else {
      return <Desktop />;
    }
  };

  return (
    <JotaiProvider>
      <App />
    </JotaiProvider>
  );
}
