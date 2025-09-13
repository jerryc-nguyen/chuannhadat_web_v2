import { getUserAgentInfo } from '@common/getUserAgentInfo';
import FinancialManagementDesktop from './balance';
import FinancialManagementMobile from './balance/mobile';

interface FinancialManagementProps {
  isMobile?: boolean;
}

export default async function FinancialManagement({ isMobile }: FinancialManagementProps) {
  // If isMobile is not provided, detect it
  const userAgent = isMobile !== undefined ? { isMobile } : await getUserAgentInfo();

  return userAgent.isMobile ? <FinancialManagementMobile /> : <FinancialManagementDesktop />;
}
