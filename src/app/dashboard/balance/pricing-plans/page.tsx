import { getUserAgentInfo } from '@common/getUserAgentInfo';
import ServicePackageViewMobile from '@dashboard/FinancialManagement/pricing-plans/mobile';
// Next Imports
import ServicePackageViewDesktop from '@app/dashboard/_components/FinancialManagement/pricing-plans';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mua gói dịch vụ',
  description: 'Chuẩn Nhà Đất',
};

const Page = async () => {
  const { isMobile } = await getUserAgentInfo();

  return (
    <>
      {isMobile ? (
        <div className="c-mobileApp mx-4">
          <ServicePackageViewMobile />
        </div>
      ) : (
        <ServicePackageViewDesktop />
      )}
    </>
  );
};

export default Page;
