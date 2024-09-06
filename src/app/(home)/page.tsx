'use client';

import React from 'react';
import Mobile from './mobile';
import Desktop from './desktop';
import { useSSROptionsContext } from '@components/providers/SSROptionsProvider';

export default function Home() {
  console.log('render Home');
  const { isMobile } = useSSROptionsContext();

  const App = () => {
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

  return <App />;
}
