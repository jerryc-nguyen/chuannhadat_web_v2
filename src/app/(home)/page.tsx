import React from 'react';
import Mobile from './mobile';

import { Provider as JotaiProvider } from 'jotai';
import { useGetUserAgentInfo } from '@hooks/useGetUserAgentInfo';

export default function Home() {
  console.log('render Home');
  const { isMobile } = useGetUserAgentInfo();

  const App = () => {
    if (isMobile) {
      return (
        <div className="c-mobileApp">
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
