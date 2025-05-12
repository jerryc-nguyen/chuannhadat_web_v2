import axiosInstance from '@api/axiosInstance';
import CategoryPage from '@app/(home)/page';
import { API_ROUTES } from '@common/router';
import { createMetadata } from '@common/seo';
import { Metadata } from 'next';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = (await params).slug;
  const slugStr = Array.isArray(slug) ? slug.join('/') : slug;
  const path = `/category/${slugStr}`;

  const rawMetadata = (await axiosInstance.get(API_ROUTES.SEOS, { params: { path } }))
    .data as Metadata;
  return createMetadata(rawMetadata);
}
export default function Page() {
  return <CategoryPage />;
}
