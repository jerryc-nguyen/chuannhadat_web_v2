import { cn } from '@common/utils';
import { Card } from '@components/ui/card';
import { Skeleton } from '@components/ui/skeleton';
import { useTopAuthors } from '@desktop/home/hooks/useTopAuthors';
import { filterStateAtom } from '@mobile/filter_bds/states';
import HorizontalScroller from '@mobile/ui/HorizontalScroller';
import { useAtom } from 'jotai';
import HoverCardAuthor from '../hover-card-author/HoverCardAuthor';
import Link from 'next/link';
import Image from 'next/image';
import default_avatar from '@assets/images/default_avatar.png';
import useResizeImage from '@hooks/useResizeImage';
import { Button } from '@components/ui/button';
import { BookUser } from 'lucide-react';
import TooltipHost from '@components/tooltip-host';

export const ListTopAuthor = () => {
  const [filterState] = useAtom(filterStateAtom);

  const { isFetching, topAuthors } = useTopAuthors(filterState);
  const { buildThumbnailUrl } = useResizeImage();

  if (!topAuthors.length) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4 pb-8">
      <h3 className="text-lg font-semibold text-secondary">Môi giới nổi bật</h3>
      <HorizontalScroller className="flex gap-4">
        {topAuthors.map((author, index) => {
          const imgSrc = author.avatar_url || default_avatar;
          return (
            <Card
              className={cn(
                'flex w-[12rem] min-w-[9rem] flex-col items-center justify-between gap-2 md:gap-4 rounded-md py-4 px-2 md:px-4 relative',
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
                  onError={() => {
                    //   setImgSrc(default_avatar);
                  }}
                  className="aspect-square rounded-full"
                  unoptimized
                  alt="avatar_author"
                />
              </Link>

              <HoverCardAuthor authorSlug={author.slug}>
                <div className="flex w-full flex-col items-center">
                  <Link target="_blank" href={`/profile/${author?.slug}`}>
                    <div className="line-clamp-2 text-center font-semibold text-sm md:text-base">
                      {author.full_name}
                    </div>
                  </Link>
                </div>
              </HoverCardAuthor>

              <div className='text-sm text-secondary'>
                Top #{author.top_position}
              </div>
            </Card>
          );
        })}
      </HorizontalScroller>
    </div >
  );
};
