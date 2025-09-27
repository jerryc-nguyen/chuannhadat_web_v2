import { getUserAgentInfo } from '@common/getUserAgentInfo';
import ServicePackageViewMobile from '@dashboard/FinancialManagement/pricing-plans/mobile';
// Next Imports
import ServicePackageViewDesktop from '@dashboard/FinancialManagement/pricing-plans';
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
        <ServicePackageViewMobile />
      ) : (
        <ServicePackageViewDesktop />
      )}
    </>
  );
};

export default Page;
