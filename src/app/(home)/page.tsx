import React from 'react';
import Mobile from './mobile';
import Desktop from './desktop';

import { Provider as JotaiProvider } from 'jotai';
import { useGetUserAgentInfo } from '@hooks/useGetUserAgentInfo';

export default function Home() {
  console.log('render Home');
  const { isMobile } = useGetUserAgentInfo();

  const App = () => {
    // eslint-disable-next-line no-constant-condition
    if (isMobile) {
      return (
        <div className="c-mobileApp">
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
