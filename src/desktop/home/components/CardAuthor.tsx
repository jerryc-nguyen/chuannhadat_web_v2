import { LuMoreHorizontal } from 'react-icons/lu';
import useCardAuthors from '../hooks/useCardAuthors';
import HoverCardAuthor from './hover-card-author/HoverCardAuthor';
import { Skeleton } from '@components/ui/skeleton';
import Image, { StaticImageData } from 'next/image';
import React from 'react';
import default_avatar from '@assets/images/default_avatar.png';
import TooltipHost from '@components/tooltip-host';

export default function CardAuthor({ product }: { product: A }) {
  const { getAuthorById } = useCardAuthors();
  const author = getAuthorById(product.user_id + '');
  const [imgSrc, setImgSrc] = React.useState<StaticImageData | string>(
    author?.avatar_url || default_avatar,
  );
  const fullName = author?.full_name ? author.full_name : 'Loading';

  return (
    <div className="flex items-center justify-between gap-x-2">
      <HoverCardAuthor authorSlug={author?.slug as string}>
        {imgSrc ? (
          <Image
            width={40}
            height={40}
            src={imgSrc}
            onError={() => {
              setImgSrc(default_avatar);
            }}
            className="aspect-square rounded-full"
            alt="avatar_author"
          />
        ) : (
          <Skeleton className="h-12 w-12 rounded-full" />
        )}
      </HoverCardAuthor>
      <div className="flex flex-1 flex-col overflow-hidden">
        <HoverCardAuthor authorSlug={author?.slug as string}>
          <p className="text-sm font-semibold leading-none hover:underline">{fullName}</p>
        </HoverCardAuthor>
        <TooltipHost content={`${product?.formatted_publish_at} · ${product?.short_location_name}`}>
          <p className="mt-1 flex-1 overflow-hidden text-ellipsis text-nowrap text-sm text-muted-foreground">
            {product?.formatted_publish_at} · {product?.short_location_name}
          </p>
        </TooltipHost>
      </div>
      <LuMoreHorizontal className="ml-2 h-5 w-5 rounded-full text-muted-foreground hover:bg-blue-50" />
    </div>
  );
}
