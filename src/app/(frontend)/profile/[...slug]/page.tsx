import axiosInstance from '@api/axiosInstance';
import { API_ROUTES } from '@common/router';
import { createMetadata } from '@common/seo';
import type { Params } from '@models';
import { Metadata } from 'next';
import ProfileDetail from '@frontend/ProfileDetail';

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

export default async function ProfileDetailPage({ params }: Props) {
  return <ProfileDetail params={params} />;
}
