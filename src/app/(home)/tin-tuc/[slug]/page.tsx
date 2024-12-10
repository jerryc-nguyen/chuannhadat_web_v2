import { getQueryClient } from '@api/react-query';
import { services } from '@api/services';
import { cn, createMetadata, formatRelativeTime } from '@common/utils';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import parse, { attributesToProps, domToReact } from 'html-react-parser';
import type { HTMLReactParserOptions } from 'html-react-parser';
import { IArticle } from '@views/news/types';
import { DotIcon, ExternalLink } from 'lucide-react';
import SyncParamsToState from '@components/SyncParamsToState';

// TODO: Tách component ra các file riêng biệt, tái sử dụng
// TODO: Handle not found page

type Props = {
  params: { slug: string };
  searchParams: { ref: string };
};

const optionsParser: HTMLReactParserOptions = {
  replace(domNode: any) {
    if (domNode && domNode.attribs && domNode.name === 'p') {
      const props = attributesToProps(domNode.attribs);
      return (
        <p {...props} className={cn('elm-p pb-3')}>
          {domToReact(domNode.children as any, optionsParser)}
        </p>
      );
    }
    if (domNode && domNode.attribs && domNode.name === 'figcaption') {
      const props = attributesToProps(domNode.attribs);
      return (
        <figcaption {...props} className={cn('elm-figcaption py-2 text-center text-sm italic')}>
          {domToReact(domNode.children as any, optionsParser)}
        </figcaption>
      );
    }
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = params.slug;
  const path = `/tin-tuc/${slug}`;
  const rawMetadata = await services.seo.getSeoMetadata(path);
  return createMetadata(rawMetadata?.data);
}

export default async function Page({ params, searchParams }: Props) {

  const { slug } = params;
  const queryClient = getQueryClient();

  const newsByCategory = await queryClient.fetchQuery({
    queryKey: ['get-news-by-category', slug],
    queryFn: async () => {
      return services.news.getNewsByCategory(slug);
    },
  });

  if (!newsByCategory) return notFound();

  const newDetail = await queryClient.fetchQuery({
    queryKey: ['get-news-detail', searchParams.ref],
    queryFn: async () => {
      const res = await services.news.getNewsDetail(searchParams.ref);
      return res.data;
    },
  });

  const NewDetailArticle = () => {
    return (
      <>
        {newDetail && (
          <div className="flex flex-col gap-4 pb-4">
            <div className="text-xl font-semibold">
              {newDetail?.title}
            </div>
            <div className="flex items-center">
              <span className="rounded bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                {formatRelativeTime(newDetail.posted_at)}
              </span>
              <DotIcon size={24} />
              <div className="font-semibold italic text-14 md:text-16">{newDetail.location}</div>
            </div>
            <div className="news-content">{parse(newDetail.content, optionsParser)}</div>
            <div className="flex justify-end">
              <a
                href={newDetail.origin_link}
                target="_blank"
                className="flex items-center gap-1 italic"
              >
                Theo{' '}
                <span className="text-blue-500 hover:font-semibold">{newDetail.origin_name}</span>{' '}
                <ExternalLink size={16} className="text-blue-500" />
              </a>
            </div>
          </div>
        )}
      </>
    );
  };

  const ListNewByCategory = () => {

    return (
      <>
        <SyncParamsToState />
        <div className={cn("flex flex-col gap-4", newDetail && "border-t pt-4 mt-10")}>
          <div className="mb-4 text-xl font-semibold">{newsByCategory?.title}</div>
          {newsByCategory.articles.map((article) => {
            return <ArticleCard key={article.id} article={article} />;
          })}
        </div>
      </>

    );
  };

  return (
    <section className="grid max-w-screen-lg grid-cols-1 gap-4 py-4 md:grid-cols-3 mx-auto">
      <div className="px-4 md:col-span-2">
        <NewDetailArticle />
        <ListNewByCategory />
      </div>
      <div className="gap-4 px-4">
        <div className="mb-4 text-xl font-semibold">Khu vực liên quan</div>
        {newsByCategory?.related_locations.map((location) => {
          return (
            <a
              href={location.path.replaceAll('/news/', '/tin-tuc/')}
              className=""
              key={location.id}
            >
              <div
                className={cn(
                  'text-blue-500 hover:font-semibold',
                  location.path.includes(slug) && 'font-semibold',
                )}
              >
                {location.name}
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}

interface ArticleProps {
  article: IArticle;
}

function ArticleCard({ article }: ArticleProps) {
  const { path, thumb_url, title, posted_at, excerpt } = article;
  return (
    <div className="group relative h-full overflow-hidden rounded-md border shadow hover:shadow-xl">
      <a href={path} className="grid h-full grid-cols-3">
        <div className="col-span-2 flex min-h-[99px] shrink-0 flex-col gap-2 p-4">
          <p className="line-clamp-2 text-16 md:text-18 font-semibold" title={title}>
            {title}
          </p>
          <p className="line-clamp-3 text-14 md:text-16">{excerpt}</p>
          <span className="me-2 w-fit rounded bg-gray-100 px-2.5 py-0.5 text-14 font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300">
            {formatRelativeTime(posted_at)}
          </span>
        </div>
        <div className="flex aspect-video h-full w-full shrink-0 grow items-center justify-center overflow-hidden">
          <img
            loading="lazy"
            src={thumb_url}
            alt={title}
            className="h-full w-full object-cover transition-transform hover:scale-[1.2] group-hover:scale-[1.1]"
          />
        </div>
      </a>
    </div>
  );
}
