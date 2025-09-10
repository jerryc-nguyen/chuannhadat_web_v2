import { getUserAgentInfo } from '@common/getUserAgentInfo';
import PostManagementDesktop from './collection-post';
import { ListPostMobile } from './collection-post/mobile/ListPostMobile';

interface PostManagementProps {
  isMobile?: boolean;
}

export default async function PostManagement({ isMobile }: PostManagementProps) {
  // If isMobile is not provided, detect it
  const userAgent = isMobile !== undefined ? { isMobile } : await getUserAgentInfo();

  return userAgent.isMobile ? <ListPostMobile table={null} contentEmpty={null} /> : <PostManagementDesktop />;
}
