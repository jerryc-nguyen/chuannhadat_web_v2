import axiosInstance from '@api/axiosInstance';
import { API_ROUTES } from '@common/router';
import { createMetadata } from '@common/seo';
import { Metadata } from 'next';
import NewsPage from '@frontend/NewsPage';

export async function generateMetadata(): Promise<Metadata> {
  const path = 'tin-tuc';
  const rawMetadata = (await axiosInstance.get(API_ROUTES.SEOS, { params: { path } }))
    .data as Metadata;
  return createMetadata(rawMetadata);
}

export default function Page() {
  return <NewsPage />;
}
