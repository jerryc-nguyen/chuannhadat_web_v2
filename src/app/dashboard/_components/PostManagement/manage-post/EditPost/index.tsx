import { getUserAgentInfo } from '@common/getUserAgentInfo';
import EditPostDesktop from './EditPostDesktop';
import EditPostMobile from './mobile';

interface EditPostProps {
  productUid: string;
  isMobile?: boolean;
}

export default async function EditPost({ productUid, isMobile }: EditPostProps) {
  // If isMobile is not provided, detect it from user agent
  const userAgent = isMobile !== undefined ? { isMobile } : await getUserAgentInfo();

  return userAgent.isMobile ? (
    <EditPostMobile productUid={productUid} />
  ) : (
    <EditPostDesktop productUid={productUid} />
  );
}
