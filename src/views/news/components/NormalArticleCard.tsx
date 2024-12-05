import { formatRelativeTime } from '@common/utils';
import { IArticle } from '@views/news/types';
import Link from 'next/link';
import React from 'react';

interface ArticleProps extends IArticle {}

function NormalArticleCard(props: ArticleProps) {
  const { path, thumb_url, title, posted_at } = props;
  return (
    <div className="group relative h-full overflow-hidden rounded-md border shadow hover:shadow-xl">
      <Link href={path} className="flex h-full flex-col">
        <div className="aspect-video w-full shrink-0 grow overflow-hidden">
          <img
            loading="lazy"
            src={thumb_url}
            alt={title}
            className="h-full w-full object-cover transition-transform hover:scale-[1.2] group-hover:scale-[1.1]"
          />
        </div>

        <div className="flex min-h-[99px] shrink-0 flex-col p-4">
          <p className="line-clamp-2 text-18 font-semibold" title={title}>
            {title}
          </p>
          <p className="mt-1 text-14">{formatRelativeTime(posted_at)}</p>
        </div>
      </Link>
    </div>
  );
}

export default NormalArticleCard;
