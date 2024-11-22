import { LuMoreHorizontal } from 'react-icons/lu';
import useCardAuthors from '../hooks/useCardAuthors';
import HoverCardAuthor from './hover-card-author/HoverCardAuthor';
import { Skeleton } from '@components/ui/skeleton';
import Image, { StaticImageData } from 'next/image';
import React from 'react';
import default_avatar from '@assets/images/default_avatar.png';
import TooltipHost from '@components/tooltip-host';
import Link from 'next/link';
import useResizeImage from '@hooks/useResizeImage';

export default function CardAuthor({ product }: { product: A }) {
  const { getAuthorById } = useCardAuthors();
  const author = product.author ?? getAuthorById(product.user_id);
  const { buildThumbnailUrl } = useResizeImage();
  const [imgSrc, setImgSrc] = React.useState<StaticImageData | string>(
    author?.avatar_url || default_avatar,
  );
  const fullName = author?.full_name ? author.full_name : 'Loading';

  return (
    <div className="flex items-center justify-between gap-x-2">
      <HoverCardAuthor authorSlug={author?.slug as string}>
        {imgSrc ? (
          <Link target="_blank" href={`/profile/${author?.slug}`}>
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
      </HoverCardAuthor>
      <div className="flex flex-1 flex-col overflow-hidden">
        <HoverCardAuthor authorSlug={author?.slug as string}>
          <Link
            target="_blank"
            href={`/profile/${author?.slug}`}
            className="text-sm font-semibold leading-none hover:underline"
          >
            {fullName}
          </Link>
        </HoverCardAuthor>
        <p className="flex flex-1 gap-x-1 overflow-hidden text-ellipsis text-nowrap text-sm text-secondary">
          <Link target="_blank" className="hover:underline" href={`/post/${product.slug}`}>
            {product?.formatted_publish_at}
          </Link>
          ·
          <span className="overflow-hidden text-ellipsis text-nowrap">
            {product?.short_location_name}
          </span>
        </p>
      </div>
      <LuMoreHorizontal className="ml-2 h-5 w-5 rounded-full text-secondary hover:bg-blue-50" />
    </div>
  );
}
