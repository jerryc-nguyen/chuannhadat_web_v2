import { profilesApi } from './api/profiles';
import { getUserAgentInfo } from '@common/getUserAgentInfo';
import type { Params } from '@common/types';
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import ProfileDetailDesktop from './ProfileDetailDesktop';
import ProfileDetailMobile from './ProfileDetailMobile';

interface ProfileDetailProps {
  params: Params;
  initialFilterState?: Record<string, any>;
}

export default async function ProfileDetail({ params, initialFilterState }: ProfileDetailProps) {
  const profileSlug = (await params).slug[0];
  const { isMobile } = await getUserAgentInfo();

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['get-detail-profile', profileSlug],
    queryFn: () => profilesApi.getProfileSlug(profileSlug),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      {isMobile ? (
        <ProfileDetailMobile profileSlug={profileSlug} initialFilterState={initialFilterState} />
      ) : (
        <ProfileDetailDesktop profileSlug={profileSlug} initialFilterState={initialFilterState} />
      )}
    </HydrationBoundary>
  );
}
