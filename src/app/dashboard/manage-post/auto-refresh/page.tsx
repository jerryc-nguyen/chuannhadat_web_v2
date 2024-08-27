import React from 'react';
import { useGetUserAgentInfo } from '@hooks/useGetUserAgentInfo';
import AutoRefreshDesktop from './desktop';
import { Metadata } from 'next';

type AutoRefeshPageProps = object;
export const metadata: Metadata = {
  title: 'Cập nhật tin tức',
  description: 'Quản lý cập nhật tin tức',
};

const AutoRefeshPage: React.FC<AutoRefeshPageProps> = () => {
  const { isMobile } = useGetUserAgentInfo();
  if (isMobile) {
    return (
      <div className="c-mobileApp">
        <AutoRefreshDesktop />
      </div>
    );
  } else {
    return <AutoRefreshDesktop />;
  }
};

export default AutoRefeshPage;
