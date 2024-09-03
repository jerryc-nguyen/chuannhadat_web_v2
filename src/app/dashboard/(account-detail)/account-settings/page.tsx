import { useGetUserAgentInfo } from '@hooks/useGetUserAgentInfo';
import { Metadata } from 'next';
import AccountSettingsDesktop from './desktop';
import AccountSettingsMobile from './mobile';
import { services } from '@api/services';
import { useQuery } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';
import { isTriggerRefresh } from '@desktop/atoms/triggerUpdateUserAtom';
import React from 'react';

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
