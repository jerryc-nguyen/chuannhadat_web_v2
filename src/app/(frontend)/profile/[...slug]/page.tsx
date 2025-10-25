import axiosInstance from '@common/api/axiosInstance';
import { API_ROUTES } from '@common/router';
import { createMetadata } from '@common/seo';
import type { Params } from '@common/types';
import { Metadata } from 'next';
import ProfileDetail from '@frontend/ProfileDetail';

type Props = {
  params: Params;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const slug = (await params).slug;
  const path = `/profile/${slug}`;

  // Get search params to check for query strings
  const searchParamsObj = await searchParams;
  const hasQueryString = Object.keys(searchParamsObj).length > 0;

  const rawMetadata = (await axiosInstance.get(API_ROUTES.SEOS.METADATA, { params: { path } }))
    .data as Metadata;
  return createMetadata(rawMetadata, hasQueryString);
}

export default async function ProfileDetailPage({ params }: Props) {
  return <ProfileDetail params={params} />;
}
