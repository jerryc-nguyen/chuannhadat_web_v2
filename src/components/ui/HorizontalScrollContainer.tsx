'use client';

import React, { useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@components/ui/button';
import { useHorizontalScroll } from '@common/hooks';
import { cn } from '@common/utils';

interface HorizontalScrollContainerProps {
  children: React.ReactNode;
  className?: string;
  activeItemSelector?: string;
  dependencies?: any[];
  gradientClassName?: string;
}

export const HorizontalScrollContainer: React.FC<HorizontalScrollContainerProps> = ({
  children,
  className,
  activeItemSelector,
  dependencies = [],
  gradientClassName = "from-[#F5F6FA]"
}) => {
  const {
    scrollContainerRef,
    canScrollLeft,
    canScrollRight,
    showScrollButtons,
    scrollLeft,
    scrollRight,
    checkScrollPosition,
    scrollToElement
  } = useHorizontalScroll();

  useEffect(() => {
    checkScrollPosition();
    if (activeItemSelector && scrollContainerRef.current) {
      const activeItem = scrollContainerRef.current.querySelector(activeItemSelector);
      if (activeItem) {
        scrollToElement(activeItem);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkScrollPosition, scrollToElement, activeItemSelector, ...dependencies]);

  return (
    <div className={cn("relative flex items-center group", className)}>
      {showScrollButtons && (
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "absolute left-2 z-10 h-8 w-8 rounded-full bg-white/90 p-0 shadow-md transition-opacity",
            canScrollLeft ? 'opacity-100' : 'opacity-0 pointer-events-none'
          )}
          onClick={scrollLeft}
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      )}

      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-x-auto scrollbar-hide py-3 px-4"
      >
        {children}
      </div>

      {showScrollButtons && (
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "absolute right-2 z-10 h-8 w-8 rounded-full bg-white/90 p-0 shadow-md transition-opacity",
            canScrollRight ? 'opacity-100' : 'opacity-0 pointer-events-none'
          )}
          onClick={scrollRight}
          aria-label="Scroll right"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}

      {showScrollButtons && (
        <>
          <div
            className={cn(
              "absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r to-transparent pointer-events-none transition-opacity",
              gradientClassName,
              canScrollLeft ? 'opacity-100' : 'opacity-0'
            )}
          />
          <div
            className={cn(
              "absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l to-transparent pointer-events-none transition-opacity",
              gradientClassName,
              canScrollRight ? 'opacity-100' : 'opacity-0'
            )}
          />
        </>
      )}
    </div>
  );
};
