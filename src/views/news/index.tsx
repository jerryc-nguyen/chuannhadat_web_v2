'use client';

import { useIsMobile } from '@hooks';
import NewsMobile from '@views/news/mobile/NewsMobile';
import NormalArticleCard from '@views/news/components/NormalArticleCard';
import PrimaryArticleCard from '@views/news/components/PrimaryArticleCard';
import useNewsData from '@views/news/hooks/useGetNewsList';
import { CardNewSkeleton } from './components/Skeleton';

/**
 * TODO: Chuyển component này sang dạng mobile-first
 * TODO: Cải thiện skeleton loading
 *
 */

export function NewsList() {
  const { data, isFetching } = useNewsData();
  const isMobile = useIsMobile();

  if (isFetching)
    return (
      <div className="md:grid-cols-4 grid grid-cols-1 p-4 gap-4">
        {[...Array(12)].map((_, index) => (
          <CardNewSkeleton key={index} />
        ))}
      </div>
    );

  if (isMobile) return <NewsMobile />;

  return (
    <section className="container pt-4">
      {data?.map((item, index) => (
        <div key={index} className="mb-6">
          <h2 className="mb-2 text-[20px] font-semibold">{item.title}</h2>
          <div className="row-auto grid grid-cols-4 gap-4">
            {item.articles.map((article, index) => {
              if (index === 0) return <PrimaryArticleCard {...article} key={article.id} />;
              return <NormalArticleCard key={article.id} {...article} />;
            })}
          </div>
        </div>
      ))}
    </section>
  );
}
