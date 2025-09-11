import { seoApi } from '@frontend/NewsPage/api/seo';
import { createMetadata } from '@common/seo';
import type { Params } from '@common/models';
import { Metadata } from 'next';
import { NewsDetail } from './_components/NewsDetail';

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const path = `/tin-tuc/${slug[0]}`;
  const rawMetadata = await seoApi.getSeoMetadata(path);
  return createMetadata(rawMetadata?.data);
}

export default async function Page({ params }: { params: Params }) {
  const { slug } = await params;
  return (
    <section className="mx-auto grid max-w-screen-lg grid-cols-1 gap-4 py-4 md:grid-cols-3">
      <NewsDetail slug={slug[0]} />
    </section>
  );
}
