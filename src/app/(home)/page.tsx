import { useGetUserAgentInfo } from '@hooks/useGetUserAgentInfo';
import HomeDesktop from '@views/home/HomeDesktop';
import HomeMobile from '@mobile/home/HomeMobile';

export default function HomePage() {
  const { isMobile } = useGetUserAgentInfo();
  return isMobile ? <HomeMobile /> : <HomeDesktop />;
}
