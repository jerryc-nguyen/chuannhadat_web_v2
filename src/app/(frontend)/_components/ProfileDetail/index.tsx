import { services } from '@api/services';
import { getUserAgentInfo } from '@common/getUserAgentInfo';
import type { Params } from '@models';
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import ProfileDetailDesktop from './ProfileDetailDesktop';
import ProfileDetailMobile from './ProfileDetailMobile';

interface ProfileDetailProps {
  params: Params;
}

export default async function ProfileDetail({ params }: ProfileDetailProps) {
  const profileSlug = (await params).slug[0];
  const { isMobile } = await getUserAgentInfo();

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['get-detail-profile', profileSlug],
    queryFn: () => services.profiles.getProfileSlug(profileSlug),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      {isMobile ? (
        <ProfileDetailMobile profileSlug={profileSlug} />
      ) : (
        <ProfileDetailDesktop profileSlug={profileSlug} />
      )}
    </HydrationBoundary>
  );
}
