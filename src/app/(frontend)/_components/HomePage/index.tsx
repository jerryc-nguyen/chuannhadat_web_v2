import { getUserAgentInfo } from '@common/getUserAgentInfo';
import HomeDesktop from './HomeDesktop';
import HomeMobile from './HomeMobile';

interface HomePageProps {
  isMobile?: boolean;
}

export default async function HomePage({ isMobile }: HomePageProps) {
  // If isMobile is not provided, detect it
  const userAgent = isMobile !== undefined ? { isMobile } : await getUserAgentInfo();

  return userAgent.isMobile ? <HomeMobile /> : <HomeDesktop />;
}
