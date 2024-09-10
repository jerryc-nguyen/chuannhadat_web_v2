import { useGetUserAgentInfo } from '@hooks/useGetUserAgentInfo';
import { Metadata } from 'next';
import React from 'react';
import AccountSettingsDesktop from '@desktop/dashboard/main-account-detail/account-settings';
import AccountSettingsMobile from '@mobile/main-account-detail/account-settings';

export const metadata: Metadata = {
  title: 'Tài khoản',
  description: 'Cài đặt thông tin tài khoản',
};
const AccountSettingsPage: React.FC = () => {
  const { isMobile } = useGetUserAgentInfo();

  if (isMobile) {
    return (
      <div className="c-mobileApp">
        <AccountSettingsMobile />
      </div>
    );
  } else {
    return <AccountSettingsDesktop />;
  }
};

export default AccountSettingsPage;
