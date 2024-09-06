// Next Imports
import type { Metadata } from 'next';
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
    <>
      {isMobile ? (
        <div className="c-mobileApp">
          <HistoryViewMobile />
        </div>
      ) : (
        <HistoryViewDesktop />
      )}
    </>
  );
};

export default Page;
