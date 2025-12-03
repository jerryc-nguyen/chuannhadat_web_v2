import { seoApi } from '@frontend/NewsPage/api/seo';
import { createMetadata } from '@common/seo';
import type { Params } from '@common/types';
import { Metadata } from 'next';
import { NewsDetail } from './_components/NewsDetail';

export async function generateMetadata({ params, searchParams }: { params: Params; searchParams: Promise<{ [key: string]: string | string[] | undefined }> }): Promise<Metadata> {
  const { slug } = await params;
  const path = `/tin-tuc/${slug[0]}`;

  // Get search params to check for query strings
  const searchParamsObj = await searchParams;
  const hasQueryString = Object.keys(searchParamsObj).length > 0;

  const rawMetadata = await seoApi.getSeoMetadata(path);
  return createMetadata(rawMetadata?.data, hasQueryString);
}

export default async function Page({ params }: { params: Params }) {
  const { slug } = await params;
  return (
    <section className="mx-auto grid max-w-screen-lg grid-cols-1 gap-4 py-4 md:grid-cols-3">
      <NewsDetail slug={slug[0]} />
    </section>
  );
}
