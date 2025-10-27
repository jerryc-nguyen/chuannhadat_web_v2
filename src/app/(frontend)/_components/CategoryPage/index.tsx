import { getUserAgentInfo } from '@common/getUserAgentInfo';
import CategoryDesktopV2 from './CategoryDesktopV2';
import CategoryMobile from './CategoryMobile';

interface CategoryPageProps {
  isMobile?: boolean;
}

export default async function CategoryPage({ isMobile }: CategoryPageProps) {
  // If isMobile is not provided, detect it
  const userAgent = isMobile !== undefined ? { isMobile } : await getUserAgentInfo();

  return userAgent.isMobile ? <CategoryMobile /> : <CategoryDesktopV2 />;
}
