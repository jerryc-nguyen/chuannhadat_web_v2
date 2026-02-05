import { getUserAgentInfo } from '@common/getUserAgentInfo';
import type { Params } from '@common/types';
import ProfileDetailDesktop from './ProfileDetailDesktop';
import ProfileDetailMobile from './ProfileDetailMobile';

interface ProfileDetailProps {
  params: Params;
  initialFilterState?: Record<string, any>;
}

export default async function ProfileDetail({ params, initialFilterState }: ProfileDetailProps) {
  const profileSlug = (await params).slug[0];
  const { isMobile } = await getUserAgentInfo();

  return isMobile ? (
    <ProfileDetailMobile profileSlug={profileSlug} initialFilterState={initialFilterState} />
  ) : (
    <ProfileDetailDesktop profileSlug={profileSlug} initialFilterState={initialFilterState} />
  );
}
