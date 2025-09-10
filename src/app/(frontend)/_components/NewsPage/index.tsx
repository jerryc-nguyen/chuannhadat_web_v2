import { getUserAgentInfo } from '@common/getUserAgentInfo';
import NewsDesktop from './NewsDesktop';
import NewsMobile from './NewsMobile';

export default async function NewsPage() {
  const { isMobile } = await getUserAgentInfo();
  return isMobile ? <NewsMobile /> : <NewsDesktop />;
}
