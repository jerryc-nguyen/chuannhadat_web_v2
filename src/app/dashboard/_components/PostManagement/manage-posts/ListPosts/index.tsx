import ListPostsDesktopV2 from '@app/dashboard/_components/PostManagement/manage-posts/ListPostsV2';
import ListPostsMobile from './mobile';

interface ListPostsProps {
  isMobile?: boolean;
}

export default async function ListPosts({ isMobile }: ListPostsProps) {

  return isMobile ? <ListPostsMobile /> : <ListPostsDesktopV2 />;
}
