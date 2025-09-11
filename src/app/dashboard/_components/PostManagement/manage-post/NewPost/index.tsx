import { getUserAgentInfo } from '@common/getUserAgentInfo';
import NewPostDesktop from './NewPostDesktop';
import NewPostMobile from './mobile/NewPostMobile';

interface NewPostProps {
  isMobile?: boolean;
}

export default async function NewPost({ isMobile }: NewPostProps) {
  // If isMobile is not provided, detect it from user agent
  const userAgent = isMobile !== undefined ? { isMobile } : await getUserAgentInfo();

  return userAgent.isMobile ? <NewPostMobile /> : <NewPostDesktop />;
}
