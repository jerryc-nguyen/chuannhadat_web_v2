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

  if (isFetching) {
    return (
      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-semibold">Top môi giới</h3>
        <HorizontalScroller className="flex gap-4 py-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <Card
              className={cn(
                'flex w-[12rem] flex-col items-center justify-center gap-4 rounded-md p-4',
              )}
              key={index}
            >
              <Skeleton className="h-16 w-16 rounded-full" />
              <div className="flex w-full flex-col items-center gap-4">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-4/5" />
              </div>
              <Skeleton className="h-4 w-16" />
            </Card>
          ))}
        </HorizontalScroller>
      </div>
    );
  }

  if (!topAuthors.length) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4 pb-8">
      <h3 className="text-lg font-semibold">Top môi giới</h3>
      <HorizontalScroller className="flex gap-4">
        {topAuthors.map((author, index) => {
          const imgSrc = author.avatar_url || default_avatar;
          return (
            <Card
              className={cn(
                'flex w-[12rem] min-w-[9rem] flex-col items-center justify-between gap-2 md:gap-4 rounded-md py-4 px-2 md:px-4',
              )}
              key={index}
            >
              <HoverCardAuthor authorSlug={author.slug}>
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
              </HoverCardAuthor>
              <div className="flex w-full flex-col items-center gap-4">
                <div className="line-clamp-2 text-center font-semibold text-sm md:text-base">{author.full_name}</div>
              </div>
              <div className='flex justify-center items-center flex-col w-full'>
                <TooltipHost content="Xếp hạng top môi giới trong khu vực dựa theo tổng số tin mới, được refresh trong 2 tuần gần đây nhất">
                  <span className="flex items-center gap-x-1 text-lg mb-2 justify-center">
                    🏆{' '}
                    <span className={cn('text-sm font-semibold')}>
                      {`Top ${author.top_position}`}
                    </span>
                  </span>
                </TooltipHost>
                <Link target="_blank" href={`/profile/${author?.slug}`} className='w-full md:w-4/5'>
                  <Button
                    className="flex items-center gap-x-2 border bg-primary_color/80 text-white hover:bg-primary_color w-full"
                    size={'sm'}
                    variant="link"
                  >
                    <BookUser size={16} />
                    Chi tiết
                  </Button>
                </Link>
              </div>
            </Card>
          );
        })}
      </HorizontalScroller>
    </div>
  );
};
