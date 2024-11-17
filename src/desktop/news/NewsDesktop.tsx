'use client';

import NormalArticleCard from '@desktop/news/components/NormalArticleCard';
import PrimaryArticleCard from '@desktop/news/components/PrimaryArticleCard';
import useNewsData from '@desktop/news/hooks/useGetNewsList';

function NewsDesktop() {
  const { data } = useNewsData();

  return (
    <section className="container pt-4">
      {data?.map((item, index) => (
        <div key={index} className="mb-6">
          <h2 className="mb-2 text-[20px] font-semibold">{item.title}</h2>
          <div className="row-auto grid grid-cols-4 gap-2">
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

export default NewsDesktop;
