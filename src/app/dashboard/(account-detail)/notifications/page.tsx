import NotificationsDesktop from '@dashboard/AccountDetail/notifications';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Tài khoản',
  description: 'Cài đặt thông tin tài khoản',
};
const NotificationsPage: React.FC = async () => {
  return <NotificationsDesktop />;
};

export default NotificationsPage;
