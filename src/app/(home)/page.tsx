import React from 'react';
import Mobile from './mobile';

import { getUserAgentInfo } from '@utils/ssrUserAgent';
import { Provider as JotaiProvider } from 'jotai';
import { useSyncParamsToState } from '@utils/useSyncParamsToState';

export default function Home() {
  console.log('render Home');
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
