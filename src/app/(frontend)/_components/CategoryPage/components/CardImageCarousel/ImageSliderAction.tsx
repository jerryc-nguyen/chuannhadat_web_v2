import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@components/ui/button';
import { type CarouselApi } from '@components/ui/carousel';
import { cn } from '@common/utils';

type ImageSliderActionProps = {
  api: CarouselApi | undefined;
  countImages: number;
  onClick?: () => void;
};

const ImageSliderAction: React.FC<ImageSliderActionProps> = ({
  api,
  countImages,
  onClick
}) => {
  if (!api || countImages <= 1) return null;

  const canScrollPrev = api.canScrollPrev();
  const canScrollNext = api.canScrollNext();

  return (
    <>
      {/* Previous button */}
      <Button
        variant="outline"
        size="icon"
        className={cn(
          "absolute left-2 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white/90",
          "shadow-md transition-all duration-200",
          !canScrollPrev && "opacity-0 pointer-events-none"
        )}
        onClick={(e) => {
          e.stopPropagation();
          api.scrollPrev();
          onClick?.();
        }}
        disabled={!canScrollPrev}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {/* Next button */}
      <Button
        variant="outline"
        size="icon"
        className={cn(
          "absolute right-2 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white/90",
          "shadow-md transition-all duration-200",
          !canScrollNext && "opacity-0 pointer-events-none"
        )}
        onClick={(e) => {
          e.stopPropagation();
          api.scrollNext();
          onClick?.();
        }}
        disabled={!canScrollNext}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </>
  );
};

export default ImageSliderAction;
