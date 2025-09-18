'use client';

import ArticleCard from './mobile/ArticleCard';
import { INews } from '@frontend/NewsPage/types';
import { newsApi } from './api/news';
import { useSuspenseQuery } from '@tanstack/react-query';

function NewsMobile() {
  const { data } = useSuspenseQuery({
    queryKey: ['get-news'],
    queryFn: newsApi.getNews,
    select: (data) => data.data,
  });
  return (
    <section className="p-4 pt-4">
      {data?.map((item, index) => (
        <div key={index} className="mb-6">
          <h2 className="mb-2 text-[20px] font-semibold">{item.title}</h2>
          <div className="row-auto grid grid-cols-1 gap-4">
            {item.articles.map((article) => {
              return <ArticleCard key={article.id} {...article} />;
            })}
          </div>
        </div>
      ))}
    </section>
  );
}

export default NewsMobile;
