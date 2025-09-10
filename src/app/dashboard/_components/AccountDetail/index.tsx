import { getUserAgentInfo } from '@common/getUserAgentInfo';
import AccountDetailDesktop from './account-settings';
import AccountDetailMobile from './account-settings'; // TODO: Create mobile version if needed

interface AccountDetailProps {
  isMobile?: boolean;
}

export default async function AccountDetail({ isMobile }: AccountDetailProps) {
  // If isMobile is not provided, detect it
  const userAgent = isMobile !== undefined ? { isMobile } : await getUserAgentInfo();

  return userAgent.isMobile ? <AccountDetailMobile /> : <AccountDetailDesktop />;
}
