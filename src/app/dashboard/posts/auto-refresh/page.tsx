import { getUserAgentInfo } from '@common/getUserAgentInfo';
import AutoRefreshMobile from '@mobile/main-manage-post/auto-refresh';
import AutoRefreshDesktop from '@dashboard/PostManagement/auto-refresh';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Cập nhật tin tức',
  description: 'Quản lý cập nhật tin tức',
};

const AutoRefeshPage: React.FC = async () => {
  const { isMobile } = await getUserAgentInfo();
  if (isMobile) {
    return (
      <div className="c-mobileApp mx-4">
        <AutoRefreshMobile />
      </div>
    );
  } else {
    return <AutoRefreshDesktop />;
  }
};

export default AutoRefeshPage;
