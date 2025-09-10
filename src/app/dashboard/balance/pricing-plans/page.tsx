import { getUserAgentInfo } from '@common/getUserAgentInfo';
import ServicePackageViewMobile from '@mobile/main-financial-management/service-package';
// Next Imports
import ServicePackageViewDesktop from '@dashboard/FinancialManagement/service-package';
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
