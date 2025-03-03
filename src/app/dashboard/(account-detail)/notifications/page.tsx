import NotificationsDesktop from '@views/dashboard/main-account-detail/notifications';
import { useGetUserAgentInfo } from '@hooks/useGetUserAgentInfo';
import NotificationsMobile from '@mobile/main-account-detail/notifications';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Tài khoản',
  description: 'Cài đặt thông tin tài khoản',
};
const NotificationsPage: React.FC = () => {
  const { isMobile } = useGetUserAgentInfo();

  if (isMobile) {
    return (
      <div className="c-mobileApp mx-4">
        <NotificationsMobile />
      </div>
    );
  } else {
    return <NotificationsDesktop />;
  }
};

export default NotificationsPage;
