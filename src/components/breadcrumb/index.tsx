'use client';
import React, { useRef, useState, useEffect } from 'react';
import {
  Breadcrumb as BreadcrumbWrap,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@components/ui/breadcrumb';
import { useAtomValue } from 'jotai';
import { breadcrumbAtom } from '@dashboard/DashboardLayout/states/breadcrumbAtom';
import Link from 'next/link';
import { genKey } from '@common/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@components/ui/button';

type BreadcrumbProps = object;

const Breadcrumb: React.FC<BreadcrumbProps> = () => {
  const breadcrumb = useAtomValue(breadcrumbAtom);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [showScrollButtons, setShowScrollButtons] = useState(false);

  // Check scroll position and update button states
  const checkScrollPosition = () => {
    if (!scrollContainerRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    setShowScrollButtons(scrollWidth > clientWidth);
  };

  // Scroll functions
  const scrollLeft = () => {
    if (!scrollContainerRef.current) return;
    scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
  };

  const scrollRight = () => {
    if (!scrollContainerRef.current) return;
    scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
  };

  // Auto-scroll to show the active (last) breadcrumb
  const scrollToActive = () => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const lastItem = container.querySelector('[data-breadcrumb-active="true"]');

    if (lastItem) {
      const containerRect = container.getBoundingClientRect();
      const itemRect = lastItem.getBoundingClientRect();

      // If the active item is not fully visible, scroll to show it
      if (itemRect.right > containerRect.right || itemRect.left < containerRect.left) {
        lastItem.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'end'
        });
      }
    }
  };

  useEffect(() => {
    checkScrollPosition();
    scrollToActive();

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollPosition);
      return () => container.removeEventListener('scroll', checkScrollPosition);
    }
  }, [breadcrumb]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      checkScrollPosition();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="relative bg-[#F5F6FA] sm:bg-transparent">
      {/* Mobile: Horizontal scroll with navigation buttons */}
      <div className="block sm:hidden">
        <div className="relative flex items-center">
          {/* Left scroll button */}
          {showScrollButtons && (
            <Button
              variant="ghost"
              size="sm"
              className={`absolute left-2 z-10 h-8 w-8 rounded-full bg-white/90 p-0 shadow-md transition-opacity ${canScrollLeft ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
              onClick={scrollLeft}
              aria-label="Scroll breadcrumbs left"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}

          {/* Scrollable breadcrumb container */}
          <div
            ref={scrollContainerRef}
            className="flex-1 overflow-x-auto scrollbar-hide py-3 px-4"
          >
            <BreadcrumbWrap className="w-fit min-w-full">
              <BreadcrumbList className="flex-nowrap whitespace-nowrap">
                {breadcrumb.map((item, index) => {
                  const isLast = index === breadcrumb.length - 1;
                  return (
                    <React.Fragment key={genKey(index)}>
                      <BreadcrumbItem
                        className="flex-shrink-0"
                        data-breadcrumb-active={isLast}
                      >
                        {item.isActive ? (
                          <BreadcrumbPage className="text-sm font-medium text-primary_color">
                            {item.title}
                          </BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink
                            asChild
                            className="breadcrumb-link text-sm font-medium transition-all hover:font-medium hover:underline"
                            href={item.link}
                          >
                            <Link href={item.link}>{item.title}</Link>
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                      {!isLast && <BreadcrumbSeparator className="flex-shrink-0" />}
                    </React.Fragment>
                  );
                })}
              </BreadcrumbList>
            </BreadcrumbWrap>
          </div>

          {/* Right scroll button */}
          {showScrollButtons && (
            <Button
              variant="ghost"
              size="sm"
              className={`absolute right-2 z-10 h-8 w-8 rounded-full bg-white/90 p-0 shadow-md transition-opacity ${canScrollRight ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
              onClick={scrollRight}
              aria-label="Scroll breadcrumbs right"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Gradient overlays for visual scroll indication */}
        {showScrollButtons && (
          <>
            <div
              className={`absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#F5F6FA] to-transparent pointer-events-none transition-opacity ${canScrollLeft ? 'opacity-100' : 'opacity-0'
                }`}
            />
            <div
              className={`absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#F5F6FA] to-transparent pointer-events-none transition-opacity ${canScrollRight ? 'opacity-100' : 'opacity-0'
                }`}
            />
          </>
        )}
      </div>

      {/* Desktop: Original layout */}
      <div className="hidden sm:block">
        <BreadcrumbWrap className="p-0">
          <BreadcrumbList>
            {breadcrumb.map((item, index) => {
              if (index !== breadcrumb.length - 1) {
                return (
                  <React.Fragment key={genKey(index)}>
                    <BreadcrumbItem>
                      {item.isActive ? (
                        <BreadcrumbPage className="text-base">{item.title}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink
                          asChild
                          className="breadcrumb-link text-base font-medium transition-all hover:font-medium hover:underline"
                          href={item.link}
                        >
                          <Link href={item.link}>{item.title}</Link>
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                  </React.Fragment>
                );
              } else {
                return (
                  <BreadcrumbItem key={item.title}>
                    <BreadcrumbPage className="text-base font-medium text-primary_color">
                      {item.title}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                );
              }
            })}
          </BreadcrumbList>
        </BreadcrumbWrap>
      </div>
    </div>
  );
};

export default Breadcrumb;
