import React from 'react';
import { useGetUserAgentInfo } from '@hooks/useGetUserAgentInfo';
import { Metadata } from 'next';
import AutoRefreshDesktop from '@views/dashboard/main-manage-post/auto-refresh';
import AutoRefreshMobile from '@mobile/main-manage-post/auto-refresh';

export const metadata: Metadata = {
  title: 'Cập nhật tin tức',
  description: 'Quản lý cập nhật tin tức',
};

const AutoRefeshPage: React.FC = () => {
  const { isMobile } = useGetUserAgentInfo();
  if (isMobile) {
    return (
      <div className="c-mobileApp">
        <AutoRefreshMobile />
      </div>
    );
  } else {
    return <AutoRefreshDesktop />;
  }
};

export default AutoRefeshPage;
