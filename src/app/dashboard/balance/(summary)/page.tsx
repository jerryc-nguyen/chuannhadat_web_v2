import { getUserAgentInfo } from '@common/getUserAgentInfo';
import BalanceViewMobie from '@mobile/main-financial-management/balance';
import BalanceViewDesktop from '@views/dashboard/main-financial-management/balance';
// Next Imports
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Thông tin số dư',
  description: 'Chuẩn Nhà Đất',
};

const Page = async () => {
  const { isMobile } = await getUserAgentInfo();

  return (
    <>
      {isMobile ? (
        <div className="c-mobileApp mx-4">
          <BalanceViewMobie />
        </div>
      ) : (
        <BalanceViewDesktop />
      )}
    </>
  );
};

export default Page;
