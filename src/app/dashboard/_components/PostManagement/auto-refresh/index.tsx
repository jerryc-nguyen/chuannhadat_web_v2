import { getUserAgentInfo } from '@common/getUserAgentInfo';
import AutoRefreshDesktop from './AutoRefreshDesktop';
import AutoRefreshMobile from './mobile';

interface AutoRefreshProps {
  isMobile?: boolean;
}

export default async function AutoRefresh({ isMobile }: AutoRefreshProps) {
  // If isMobile is not provided, detect it from user agent
  const userAgent = isMobile !== undefined ? { isMobile } : await getUserAgentInfo();

  return userAgent.isMobile ? <AutoRefreshMobile /> : <AutoRefreshDesktop />;
}
