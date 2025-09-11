import NewPostDesktop from './NewPostDesktop';
import NewPostMobile from './mobile/NewPostMobile';

interface NewPostProps {
  isMobile?: boolean;
}

export default async function NewPost({ isMobile }: NewPostProps) {
  return isMobile ? <NewPostMobile /> : <NewPostDesktop />;
}
