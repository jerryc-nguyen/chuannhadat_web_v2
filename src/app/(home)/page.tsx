import React from 'react';
import Mobile from './mobile';
import Desktop from './desktop';

import { getUserAgentInfo } from '@utils/ssrUserAgent';
import { Provider as JotaiProvider } from 'jotai';

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
      return <Mobile />;
    }
  };

  return (
    <JotaiProvider>
      <App />
    </JotaiProvider>
  );
}
