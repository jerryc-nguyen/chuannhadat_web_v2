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
    <div className={cn("relative group overflow-hidden rounded-lg border-2 border-gray-200 shadow-sm transition-all duration-200 hover:shadow-lg", className)}>
      <Image
        alt={title}
        src={imageUrl}
        height={150}
        width={200}
        className="object-cover w-full h-full transition-all duration-200 group-hover:scale-105 group-hover:blur-[1px]"
        onError={(e) => {
          e.currentTarget.src = '/default-image.jpg'; // Set default image path
          e.currentTarget.onerror = null; // Prevents infinite loop in case the fallback image also fails
        }}
      />

      <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-full bg-gradient-to-r from-black/70 to-gray-800/70 px-3 py-1 text-sm font-semibold text-white shadow-lg backdrop-blur-md">
        <ImageIcon size={18} />
        <span className="font-bold text-base">{images_count}</span>
        <span className="text-xs">hình</span>
      </div>
    </div>
  );
};
