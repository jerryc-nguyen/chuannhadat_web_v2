import { getUserAgentInfo } from '@common/getUserAgentInfo';
import HistoryViewMobile from '@dashboard/FinancialManagement/history/mobile';
import HistoryViewDesktop from '@dashboard/FinancialManagement/history';
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
