import { getUserAgentInfo } from '@common/getUserAgentInfo';
import HomeMobile from '@mobile/home/HomeMobile';
import HomeDesktop from '@views/home/HomeDesktop';

export default async function HomePage() {
  const { isMobile } = await getUserAgentInfo();
  return isMobile ? <HomeMobile /> : <HomeDesktop />;
}
