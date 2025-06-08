import axiosInstance from '@api/axiosInstance';
import { services } from '@api/services';
import { getUserAgentInfo } from '@common/getUserAgentInfo';
import { API_ROUTES } from '@common/router';
import { createMetadata } from '@common/seo';
import ProfileDetailMobile from '@mobile/profile-detail';
import type { Params } from '@models';
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import ProfileDetailDesktop from '@views/profile-detail';
import { Metadata } from 'next';

type ProfileDetailPage = {
  params: Params;
};

type Props = {
  params: Params;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = (await params).slug;
  const path = `/profile/${slug}`;
  const rawMetadata = (await axiosInstance.get(API_ROUTES.SEOS, { params: { path } }))
    .data as Metadata;
  return createMetadata(rawMetadata);
}

export default async function ProfileDetailPage({ params }: ProfileDetailPage) {
  const profileSlug = (await params).slug[0];
  // eslint-disable-next-line react-hooks/rules-of-hooks
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
