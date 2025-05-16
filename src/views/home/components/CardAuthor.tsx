import default_avatar from '@assets/images/default_avatar.png';
import { shortenLocationName } from '@common/stringHelpers';
import { cn } from '@common/utils';
import TooltipHost from '@components/tooltip-host';
import { Skeleton } from '@components/ui/skeleton';
import useResizeImage from '@hooks/useResizeImage';
import { filterStateAtom } from '@mobile/filter_bds/states';
import { useAtom } from 'jotai';
import Image, { StaticImageData } from 'next/image';
import Link from 'next/link';
import React, { useMemo } from 'react';
import useCardAuthors from '../hooks/useCardAuthors';
import { useTopAuthors } from '../hooks/useTopAuthors';
import HoverCardAuthor from './hover-card-author/HoverCardAuthor';

export default function CardAuthor({ product, isMobile }: { product: A; isMobile?: boolean }) {
  const { getAuthorById } = useCardAuthors();
  const [filterState] = useAtom(filterStateAtom);
  const { topAuthors } = useTopAuthors(filterState);

  const author = product.author ?? getAuthorById(product.user_id);

  const { buildThumbnailUrl } = useResizeImage();
  const [imgSrc, setImgSrc] = React.useState<StaticImageData | string>(
    author?.avatar_url || default_avatar,
  );
  const fullName = author?.full_name ? author.full_name : 'Loading';
  const topAuthor = topAuthors.find((author) => author.id === product.user_id);
  const renderIconTopAuthor = (position: number) => {
    switch (position) {
      case 1:
        return 'Top 1';
      case 2:
        return 'Top 2';
      case 3:
        return 'Top 3';
      case 4:
        return 'Top 4';
      case 5:
        return 'Top 5';
      case 6:
        return 'Top 6';
      default:
        return '';
    }
  };

  const formattedAds = useMemo((): string | null => {
    if (product.ads_type == 'vip_1') {
      return 'Tin Siêu VIP';
    } else if (product.ads_type == 'vip_3') {
      return 'Tin VIP';
    } else if (product.ads_type == 'vip_2') {
      return 'Tin VIP+';
    } else {
      return null;
    }
  }, [product]);

  const Component = isMobile ? 'div' : HoverCardAuthor;
  const linkTarget = isMobile ? {} : { target: '_blank' };
  return (
    <div className="flex items-center justify-between gap-x-2">
      <Component authorSlug={author?.slug as string}>
        {imgSrc ? (
          <Link {...linkTarget} href={`/profile/${author?.slug}`}>
            <Image
              width={40}
              height={40}
              src={
                typeof imgSrc === 'string'
                  ? buildThumbnailUrl({
                    imageUrl: imgSrc,
                    width: 40,
                    ratio: 1,
                  })
                  : imgSrc
              }
              onError={() => {
                setImgSrc(default_avatar);
              }}
              className="aspect-square rounded-full"
              unoptimized
              alt="avatar_author"
            />
          </Link>
        ) : (
          <Skeleton className="h-12 w-12 rounded-full" />
        )}
      </Component>
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex items-center gap-x-1">
          <Component authorSlug={author?.slug as string}>
            <Link
              {...linkTarget}
              href={`/profile/${author?.slug}`}
              className="flex items-center gap-x-2 text-sm font-semibold leading-none hover:underline"
            >
              {fullName}
            </Link>
          </Component>
          {topAuthor && (
            <TooltipHost content="Xếp hạng top môi giới trong khu vực dựa theo tổng số tin mới, được refresh trong 2 tuần gần đây nhất">
              <span className="flex items-center gap-x-1 pl-2 text-lg">
                🏆{' '}
                <span className={cn('text-sm font-semibold')}>
                  {renderIconTopAuthor(topAuthor?.top_position as number)}
                </span>
              </span>
            </TooltipHost>
          )}
        </div>

        <p className="mt-1 flex flex-1 gap-x-1 overflow-hidden text-ellipsis text-nowrap text-sm text-secondary">
          <Link {...linkTarget} className="hover:underline" href={`/post/${product.slug}`}>
            {product?.formatted_publish_at}
          </Link>
          ·
          <span className="overflow-hidden text-ellipsis text-nowrap">
            {shortenLocationName(product?.short_location_name)}
          </span>
          {formattedAds && (
            <>
              {' '}
              · <b>{formattedAds}</b>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
