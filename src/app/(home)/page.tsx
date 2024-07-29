import React from 'react';
import Mobile from './mobile';
import Desktop from './desktop';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { getUserAgentInfo } from '@utils/ssrUserAgent';
import { Provider as JotaiProvider } from 'jotai';

import QueryProvider from '@utils/QueryProvider';

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
      <QueryProvider>
        <App />
      </QueryProvider>
    </JotaiProvider>
  );
}
