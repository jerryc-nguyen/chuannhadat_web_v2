import { services } from '@api/services';
import { createMetadata } from '@common/seo';
import { Metadata } from 'next';
import { NewsDetail } from './components/NewsDetail';

type Props = {
  params: { slug: string };
  searchParams: { ref: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = params.slug;
  const path = `/tin-tuc/${slug}`;
  const rawMetadata = await services.seo.getSeoMetadata(path);
  return createMetadata(rawMetadata?.data);
}

export default async function Page({ params }: Props) {
  const { slug } = params;

  return (
    <section className="grid max-w-screen-lg grid-cols-1 gap-4 py-4 md:grid-cols-3 mx-auto">
      <NewsDetail slug={slug} />
    </section>
  );
}
