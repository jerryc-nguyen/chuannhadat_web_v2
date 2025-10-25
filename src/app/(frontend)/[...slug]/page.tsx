import axiosInstance from '@common/api/axiosInstance';
import { API_ROUTES } from '@common/router';
import { createMetadata } from '@common/seo';
import { Metadata } from 'next';
import CategoryPage from '@frontend/CategoryPage';

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const slug = (await params).slug;
  const slugStr = Array.isArray(slug) ? slug.join('/') : slug;
  const path = `/${slugStr}`;

  // Get search params to check for query strings
  const searchParamsObj = await searchParams;
  const hasQueryString = Object.keys(searchParamsObj).length > 0;

  const rawMetadata = (await axiosInstance.get(API_ROUTES.SEOS.SEARCH_METADATA, { params: { path } }))
    .data as Metadata;
  return createMetadata(rawMetadata, hasQueryString);
}

export default function Page() {
  return <CategoryPage />;
}
