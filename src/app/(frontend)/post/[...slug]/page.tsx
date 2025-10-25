import axiosInstance from '@common/api/axiosInstance';
import { API_ROUTES } from '@common/router';
import { createMetadata } from '@common/seo';
import type { Params } from '@common/types';
import { Metadata } from 'next';
import PostDetail from '@frontend/PostDetail';

export async function generateMetadata({ params, searchParams }: { params: Params; searchParams: Promise<{ [key: string]: string | string[] | undefined }> }): Promise<Metadata> {
  const { slug } = await params;
  const path = `/post/${slug}`;

  // Get search params to check for query strings
  const searchParamsObj = await searchParams;
  const hasQueryString = Object.keys(searchParamsObj).length > 0;

  const rawMetadata = (await axiosInstance.get(API_ROUTES.SEOS.METADATA, { params: { path } }))
    .data as Metadata;
  return createMetadata(rawMetadata, hasQueryString);
}

export default async function PostDetailPage({ params }: { params: Params }) {
  return <PostDetail params={params} />;
}
