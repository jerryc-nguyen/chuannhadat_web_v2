// Next Imports
import type { Metadata } from 'next';
import { Provider as JotaiProvider } from 'jotai';
import { useGetUserAgentInfo } from '@hooks/useGetUserAgentInfo';
import RechargeViewMobile from '@mobile/main-financial-management/recharge';
import RechargeViewDesktop from '@desktop/dashboard/main-financial-management/recharge';

export const metadata: Metadata = {
  title: 'Nạp tiền vào tài khoản',
  description: 'Chuẩn Nhà Đất',
};

const Page = () => {
  const { isMobile } = useGetUserAgentInfo();

  return (
    <JotaiProvider>
      {isMobile ? (
        <div className="c-mobileApp">
          <RechargeViewMobile />
        </div>
      ) : (
        <RechargeViewDesktop />
      )}
    </JotaiProvider>
  );
};

export default Page;


