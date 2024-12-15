import { formatRelativeTime } from '@common/utils';
import { IArticle } from '@views/news/types';

interface ArticleProps {
  article: IArticle;
}

export function ArticleCard({ article }: ArticleProps) {
  const { path, thumb_url, title, posted_at, excerpt } = article;
  return (
    <div className="group relative h-full overflow-hidden rounded-md border shadow hover:shadow-xl">
      <a href={path} className="grid h-full grid-cols-3">
        <div className="col-span-2 flex min-h-[99px] shrink-0 flex-col gap-2 p-4">
          <p className="line-clamp-2 text-16 font-semibold md:text-18" title={title}>
            {title}
          </p>
          <p className="line-clamp-3 text-14 md:text-16">{excerpt}</p>
          <span className="me-2 w-fit rounded bg-gray-100 px-2.5 py-0.5 text-14 font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300">
            {formatRelativeTime(posted_at)}
          </span>
        </div>
        <div className="flex aspect-video h-full w-full shrink-0 grow items-center justify-center overflow-hidden">
          <img
            loading="lazy"
            src={thumb_url}
            alt={title}
            className="h-full w-full object-cover transition-transform hover:scale-[1.2] group-hover:scale-[1.1]"
          />
        </div>
      </a>
    </div>
  );
}
