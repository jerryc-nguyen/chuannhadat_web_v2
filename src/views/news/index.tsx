'use server';

import NewsMobile from '@views/news/mobile/NewsMobile';
import NormalArticleCard from '@views/news/components/NormalArticleCard';
import PrimaryArticleCard from '@views/news/components/PrimaryArticleCard';
import { getQueryClient } from '@api/react-query';
import { services } from '@api/services';
import { useGetUserAgentInfo } from '@hooks/useGetUserAgentInfo';
import SyncParamsToState from '@components/SyncParamsToState';

/**
 * TODO: Chuyển component này sang dạng mobile-first
 * TODO: Cải thiện skeleton loading
 *
 */

export async function NewsList() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { isMobile } = useGetUserAgentInfo();

  const { data } = await getQueryClient().fetchQuery({
    queryKey: ['get-news'],
    queryFn: services.news.getNews,
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
