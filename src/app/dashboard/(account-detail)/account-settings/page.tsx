import AccountDetail from '@dashboard/AccountDetail';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Tài khoản',
  description: 'Cài đặt thông tin tài khoản',
};

const AccountSettingsPage: React.FC = async () => {
  return <AccountDetail />;
};

export default AccountSettingsPage;
