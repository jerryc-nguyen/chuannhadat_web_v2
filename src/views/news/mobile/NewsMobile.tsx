'use server';

import ArticleCard from './components/ArticleCard';
import { INews } from '../types';

function NewsMobile({ data }: { data: INews }) {
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
