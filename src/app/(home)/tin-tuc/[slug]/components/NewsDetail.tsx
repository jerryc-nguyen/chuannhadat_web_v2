'use client';
import { services } from '@api/services';
import { cn } from '@common/utils';
import SyncParamsToState from '@components/SyncParamsToState';
import { useSuspenseQuery } from '@tanstack/react-query';
import { notFound, useSearchParams } from 'next/navigation';
import { ArticleCard } from './ArticleCard';
import { NewDetailArticle } from './NewDetailArticle';

export const NewsDetail = ({ slug }: { slug: string }) => {
  const searchParams = useSearchParams();
  const ref = searchParams.get('ref');

  const { data: newsByCategory } = useSuspenseQuery({
    queryKey: ['get-news-by-category', slug],
    queryFn: async () => {
      return services.news.getNewsByCategory(slug);
    },
  });

  const { data: newDetail } = useSuspenseQuery({
    queryKey: ['get-news-detail', ref],
    queryFn: async () => {
      if (!ref) return null;
      const res = await services.news.getNewsDetail(ref);
      return res.data;
    },
  });

  if (!newsByCategory) return notFound();

  const ListNewByCategory = () => {
    return (
      <>
        <SyncParamsToState />
        <div className={cn('flex flex-col gap-4', newDetail && 'mt-10 border-t pt-4')}>
          <div className="mb-4 text-xl font-semibold">{newsByCategory?.title}</div>
          {newsByCategory.articles.map((article) => {
            return <ArticleCard key={article.id} article={article} />;
          })}
        </div>
      </>
    );
  };

  return (
    <>
      <div className="px-4 md:col-span-2">
        <NewDetailArticle newDetail={newDetail} />
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
    </>
  );
};
