import ListPostsDesktop from './ListPostsDesktop';
import ListPostsMobile from './mobile';

interface ListPostsProps {
  isMobile?: boolean;
}

export default async function ListPosts({ isMobile }: ListPostsProps) {

  return isMobile ? <ListPostsMobile /> : <ListPostsDesktop />;
}
