// Next Imports
import type { Metadata } from 'next';
import BalanceViewMobie from '@mobile/main-financial-management/balance';
import BalanceViewDesktop from '@views/dashboard/main-financial-management/balance';
import { useGetUserAgentInfo } from '@hooks/useGetUserAgentInfo';

export const metadata: Metadata = {
  title: 'Thông tin số dư',
  description: 'Chuẩn Nhà Đất',
};

const Page = () => {
  const { isMobile } = useGetUserAgentInfo();

  return (
    <>
      {isMobile ? (
        <div className="c-mobileApp">
          <BalanceViewMobie />
        </div>
      ) : (
        <BalanceViewDesktop />
      )}
    </>
  );
};

export default Page;
