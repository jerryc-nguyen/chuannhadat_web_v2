// Next Imports
import type { Metadata } from 'next';
import { Provider as JotaiProvider } from 'jotai';
import { useGetUserAgentInfo } from '@hooks/useGetUserAgentInfo';
import TopUpViewMobile from '@mobile/main-financial-management/top-up';
import TopUpViewDesktop from '@desktop/dashboard/main-financial-management/top-up';

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
          <TopUpViewMobile />
        </div>
      ) : (
        <TopUpViewDesktop />
      )}
    </JotaiProvider>
  );
};

export default Page;


