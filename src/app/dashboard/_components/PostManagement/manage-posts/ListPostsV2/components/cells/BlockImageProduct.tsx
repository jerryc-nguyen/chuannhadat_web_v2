import { cn } from '@common/utils';
import * as AspectRatio from '@radix-ui/react-aspect-ratio';
import { ImageIcon } from 'lucide-react';
import Image from 'next/image';

export const BlockImageProduct = ({
  images_count,
  imageUrl,
  title,
  className,
}: {
  images_count: number;
  imageUrl: string;
  title: string;
  className?: string;
}) => {
  return (
    <div className={cn("relative group w-full", className)}>
      <AspectRatio.Root ratio={4 / 3} className="relative w-full overflow-hidden rounded-lg border-2 border-gray-200 shadow-sm">
        <Image
          alt={title}
          src={imageUrl}
          fill
          loading="lazy"
          className="h-full w-full cursor-pointer object-cover"
        />
      </AspectRatio.Root>

      <div className="absolute right-2 bottom-2 flex items-center gap-1 rounded-full px-3 py-1 text-white bg-black/30">
        <ImageIcon size={18} />
        <span>{images_count}</span>
      </div>
    </div>
  );
};
