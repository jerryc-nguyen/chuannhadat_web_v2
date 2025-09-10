import axiosInstance from '@api/axiosInstance';
import { API_ROUTES } from '@common/router';
import { createMetadata } from '@common/seo';
import type { Params } from '@models';
import { Metadata } from 'next';
import PostDetail from '@frontend/PostDetail';

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const path = `/post/${slug}`;
  const rawMetadata = (await axiosInstance.get(API_ROUTES.SEOS, { params: { path } }))
    .data as Metadata;
  return createMetadata(rawMetadata);
}

export default async function PostDetailPage({ params }: { params: Params }) {
  return <PostDetail params={params} />;
}
