import { services } from '@api/services';
import ProfileDetailDesktop from '@desktop/profile-detail';
import { useGetUserAgentInfo } from '@hooks/useGetUserAgentInfo';
import ProfileDetailMobile from '@mobile/profile-detail';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Chuẩn nhà đất',
  description: 'Chi tiết người môi giới',
};
type ProfileDetailPage = {
  params: {
    slug: string;
  };
};
export default async function ProfileDetailPage({ params }: ProfileDetailPage) {
  const profileSlug = params.slug[0];
  const { isMobile } = useGetUserAgentInfo();
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
