'use client';

import { newsApi } from './api/news';
import SyncParamsToState from '@components/SyncParamsToState';
import { useSuspenseQuery } from '@tanstack/react-query';
import NormalArticleCard from './components/NormalArticleCard';
import PrimaryArticleCard from './components/PrimaryArticleCard';

export default function NewsList() {
  const { data } = useSuspenseQuery({
    queryKey: ['get-news'],
    queryFn: newsApi.getNews,
    select: (data) => data.data,
  });

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
