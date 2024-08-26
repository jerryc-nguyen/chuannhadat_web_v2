// Next Imports
import type { Metadata } from 'next';
import { Provider as JotaiProvider } from 'jotai';
import BalanceViewMobie from '@mobile/main-financial-management/balance';
import BalanceViewDesktop from '@desktop/dashboard/main-financial-management/balance';
import { useGetUserAgentInfo } from '@hooks/useGetUserAgentInfo';

export const metadata: Metadata = {
  title: 'Thông tin số dư',
  description: 'Chuẩn Nhà Đất',
};

const Page = () => {
  const { isMobile } = useGetUserAgentInfo();

  return (
    <JotaiProvider>
      {isMobile ? (
        <div className="c-mobileApp">
          <BalanceViewMobie />
        </div>
      ) : (
        <BalanceViewDesktop />
      )}
    </JotaiProvider>
  );
};

export default Page;
