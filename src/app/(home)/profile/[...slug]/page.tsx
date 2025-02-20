import axiosInstance from '@api/axiosInstance';
import { services } from '@api/services';
import { API_ROUTES } from '@common/router';
import { createMetadata } from '@common/seo';
import ProfileDetailDesktop from '@views/profile-detail';
import { useGetUserAgentInfo } from '@hooks/useGetUserAgentInfo';
import ProfileDetailMobile from '@mobile/profile-detail';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { Metadata } from 'next';
import React from 'react';

type ProfileDetailPage = {
  params: {
    slug: string;
  };
};

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = (await params).slug;
  const path = `/profile/${slug}`;
  const rawMetadata = (await axiosInstance.get(API_ROUTES.SEOS, { params: { path } }))
    .data as Metadata;
  return createMetadata(rawMetadata);
}

export default async function ProfileDetailPage({ params }: ProfileDetailPage) {
  const profileSlug = params.slug[0];
  // eslint-disable-next-line react-hooks/rules-of-hooks
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
