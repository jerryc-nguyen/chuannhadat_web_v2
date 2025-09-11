import { cn } from '@common/utils';
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
    <div className={cn("relative h-36 w-48", className)}>
      <Image
        alt={title}
        src={imageUrl}
        className="md:rounded-lg border-2 object-cover"
        onError={(e) => {
          e.currentTarget.src = '/default-image.jpg'; // Set default image path
          e.currentTarget.onerror = null; // Prevents infinite loop in case the fallback image also fails
        }}
        fill
      />

      <div className="absolute left-[50%] top-1/2 inline-flex -translate-x-1/2 -translate-y-1/2 transform items-center gap-1 rounded-full bg-black/60 px-2.5 py-0.5 text-xs font-semibold text-white">
        <ImageIcon size={16} />
        <span>{images_count}</span>
        <span>hình</span>
      </div>
    </div>
  );
};
