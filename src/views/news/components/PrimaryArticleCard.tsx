import { formatRelativeTime } from '@common/utils';
import { IArticle } from '@views/news/types';
import Link from 'next/link';
import React from 'react';

interface ArticleProps extends IArticle {}

function PrimaryArticleCard(props: ArticleProps) {
  const { path, thumb_url, title, posted_at } = props;
  return (
    <div className="group relative col-span-2 h-full overflow-hidden rounded-md border shadow hover:shadow-xl">
      <Link href={path}>
        <img
          loading="lazy"
          src={thumb_url}
          alt={title}
          className="aspect-[153/76] h-full w-full object-cover transition-transform hover:scale-[1.2] group-hover:scale-[1.1]"
        />
        <div className="absolute inset-0 flex flex-col justify-end p-4">
          <p className="line-clamp-2 text-20 font-bold text-white" title={title}>
            {title}
          </p>
          <p className="mt-1 text-14 text-white">{formatRelativeTime(posted_at)}</p>
        </div>
      </Link>
    </div>
  );
}

export default PrimaryArticleCard;
