import { getUserAgentInfo } from '@common/getUserAgentInfo';
import HistoryViewMobile from '@mobile/main-financial-management/history';
import HistoryViewDesktop from '@views/dashboard/main-financial-management/history';
// Next Imports
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Lịch sử nạp tiền',
  description: 'Chuẩn Nhà Đất',
};

const Page = async () => {
  const { isMobile } = await getUserAgentInfo();

  return (
    <>
      {isMobile ? (
        <div className="c-mobileApp mx-4">
          <HistoryViewMobile />
        </div>
      ) : (
        <HistoryViewDesktop />
      )}
    </>
  );
};

export default Page;
