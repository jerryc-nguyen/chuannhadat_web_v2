import { getUserAgentInfo } from '@common/getUserAgentInfo';
import CategoryDesktopV2 from './CategoryDesktopV2';
import CategoryMobileV2 from './CategoryMobileV2';

interface CategoryPageProps {
  isMobile?: boolean;
}

export default async function CategoryPage({ isMobile }: CategoryPageProps) {
  // If isMobile is not provided, detect it
  const userAgent = isMobile !== undefined ? { isMobile } : await getUserAgentInfo();

  return userAgent.isMobile ? <CategoryMobileV2 /> : <CategoryDesktopV2 />;
}
