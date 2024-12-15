'use client';

import { services } from '@api/services';
import SyncParamsToState from '@components/SyncParamsToState';
import { useIsMobile } from '@hooks';
import { useSuspenseQuery } from '@tanstack/react-query';
import NormalArticleCard from '@views/news/components/NormalArticleCard';
import PrimaryArticleCard from '@views/news/components/PrimaryArticleCard';
import NewsMobile from '@views/news/mobile/NewsMobile';

export function NewsList() {
  const isMobile = useIsMobile();

  const { data } = useSuspenseQuery({
    queryKey: ['get-news'],
    queryFn: services.news.getNews,
    select: (data) => data.data,
  });
  
  if (isMobile) return <NewsMobile data={data} />;

  return (
    <section className="container pt-4">
      <SyncParamsToState />
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
