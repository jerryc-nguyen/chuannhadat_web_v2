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


      <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-full bg-gradient-to-r from-black/70 to-gray-800/70 px-3 py-1 text-sm font-semibold text-white shadow-lg backdrop-blur-md">
        <ImageIcon size={18} />
        <span className="font-bold text-base">{images_count}</span>
        <span className="text-xs">hình</span>
      </div>
    </div>
  );
};
