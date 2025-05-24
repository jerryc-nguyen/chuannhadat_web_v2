import { getUserAgentInfo } from '@common/getUserAgentInfo';
import AccountSettingsMobile from '@mobile/main-account-detail/account-settings';
import AccountSettingsDesktop from '@views/dashboard/main-account-detail/account-settings';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Tài khoản',
  description: 'Cài đặt thông tin tài khoản',
};
const AccountSettingsPage: React.FC = async () => {
  const { isMobile } = await getUserAgentInfo();

  if (isMobile) {
    return (
      <div className="c-mobileApp mx-4">
        <AccountSettingsMobile />
      </div>
    );
  } else {
    return <AccountSettingsDesktop />;
  }
};

export default AccountSettingsPage;
