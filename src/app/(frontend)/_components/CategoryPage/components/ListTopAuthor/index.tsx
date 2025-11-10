import default_avatar from '@assets/images/default_avatar.png';
import { cn } from '@common/utils';
import { Card } from '@components/ui/card';
import useResizeImage from '@common/hooks/useResizeImage';
import { filterStateAtom } from '../../../features/search/filters-v2/states';
import HorizontalScroller from '@components/mobile-ui/HorizontalScroller';
import { useTopAuthors } from '../../hooks/useTopAuthors';
import { useAtom } from 'jotai';
import Image from 'next/image';
import Link from 'next/link';
import HoverCardAuthor from '../hover-card-author/HoverCardAuthor';

export const ListTopAuthor = () => {
  const [filterState] = useAtom(filterStateAtom);

  const { topAuthors } = useTopAuthors(filterState);
  const { buildThumbnailUrl } = useResizeImage();

  if (!topAuthors.length) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4 pb-8">
      <h3 className="text-lg font-semibold text-secondary">Môi giới nổi bật</h3>
      <HorizontalScroller className="flex gap-4">
        {topAuthors.map((author: A, index) => {
          const imgSrc = author.avatar_url || default_avatar;
          return (
            <Card
              className={cn(
                'relative flex w-[12rem] min-w-[9rem] flex-col items-center justify-between gap-2 rounded-md px-2 py-4 md:gap-4 md:px-4',
              )}
              key={index}
            >
              <Link target="_blank" href={`/profile/${author?.slug}`}>
                <Image
                  width={64}
                  height={64}
                  src={
                    typeof imgSrc === 'string'
                      ? buildThumbnailUrl({
                        imageUrl: imgSrc,
                        width: 64,
                        ratio: 1,
                      })
                      : imgSrc
                  }
                  className="aspect-square rounded-full"
                  unoptimized
                  alt="avatar_author"
                  loading={index < 6 ? 'eager' : 'lazy'}
                  priority={index < 3}
                />
              </Link>

              <HoverCardAuthor authorSlug={author.slug}>
                <div className="flex w-full flex-col items-center">
                  <Link target="_blank" href={`/profile/${author?.slug}`}>
                    <div className="line-clamp-2 text-center text-sm font-semibold md:text-base">
                      {author.full_name}
                    </div>
                  </Link>
                </div>
              </HoverCardAuthor>

              <div className="text-sm text-secondary">Top #{author.top_position}</div>
            </Card>
          );
        })}
      </HorizontalScroller>
    </div>
  );
};
