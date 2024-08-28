// Next Imports
import type { Metadata } from 'next';
import { Provider as JotaiProvider } from 'jotai';
import HistoryViewMobile from '@mobile/main-financial-management/history';
import HistoryViewDesktop from '@desktop/dashboard/main-financial-management/history';
import { useGetUserAgentInfo } from '@hooks/useGetUserAgentInfo';

export const metadata: Metadata = {
  title: 'Lịch sử nạp tiền',
  description: 'Chuẩn Nhà Đất',
};

const Page = () => {
  const { isMobile } = useGetUserAgentInfo();

  return (
    <JotaiProvider>
      {isMobile ? (
        <div className="c-mobileApp">
          <HistoryViewMobile />
        </div>
      ) : (
        <HistoryViewDesktop />
      )}
    </JotaiProvider>
  );
};

export default Page;
