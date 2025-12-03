'use client';

import React, { useState, useCallback, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Fade from 'embla-carousel-fade';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@common/utils';
import useResizeImage from '@common/hooks/useResizeImage';
import BlurImage from '@/components/BlurImage';
import ButtonSave from '@frontend/features/product-detail-actions/save-post/ButtonSave';

type EmblaCarouselComponentProps = {
  images: A[];
  hasUserInteracted: boolean;
  onInteraction: () => void;
  onImageClick?: () => void;
  getOptimizedAltText: () => string;
  isEager?: boolean;
  postUid: string;
};

/**
 * 🎯 **Embla Carousel Component**
 * 
 * Features:
 * - Starts with first image only
 * - Preloads other images on first navigation
 * - Smooth fade transitions
 * - Touch/swipe support (mobile only for performance)
 * - Keyboard navigation
 * - Performance optimized: disables touch events on desktop
 */
export default function EmblaCarouselComponent({
  images,
  hasUserInteracted,
  onInteraction,
  onImageClick,
  getOptimizedAltText,
  isEager = false,
  postUid,
}: EmblaCarouselComponentProps) {
  // ✅ Detect if device supports touch for performance optimization
  const isTouchDevice = typeof window !== 'undefined' &&
    ('ontouchstart' in window || navigator.maxTouchPoints > 0);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      duration: 20, // Fast transitions
      // ✅ Disable drag/touch on desktop for better performance
      dragFree: false,
      containScroll: 'trimSnaps',
      // Only enable touch/drag on touch devices
      watchDrag: isTouchDevice,
      watchResize: true,
      watchSlides: true,
    },
    [Fade()]
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [viewedImages, setViewedImages] = useState<Set<number>>(new Set([0])); // Track viewed images
  const { buildThumbnailUrl } = useResizeImage();

  // ✅ Update carousel state
  const updateScrollState = useCallback(() => {
    if (!emblaApi) return;
    const currentIndex = emblaApi.selectedScrollSnap();
    setSelectedIndex(currentIndex);
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());

    // ✅ Track viewed images for better loading strategy
    setViewedImages(prev => new Set([...prev, currentIndex]));
  }, [emblaApi]);

  // ✅ Navigation handlers with interaction tracking
  const scrollPrev = useCallback(() => {
    if (!emblaApi) return;
    onInteraction(); // Trigger preloading
    emblaApi.scrollPrev();
  }, [emblaApi, onInteraction]);

  const scrollNext = useCallback(() => {
    if (!emblaApi) return;
    onInteraction(); // Trigger preloading
    emblaApi.scrollNext();
  }, [emblaApi, onInteraction]);

  const scrollTo = useCallback((index: number) => {
    if (!emblaApi) return;
    onInteraction(); // Trigger preloading
    emblaApi.scrollTo(index);
  }, [emblaApi, onInteraction]);

  // ✅ Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        scrollPrev();
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        scrollNext();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [scrollPrev, scrollNext]);

  // ✅ Setup Embla event listeners
  useEffect(() => {
    if (!emblaApi) return;

    emblaApi.on('select', updateScrollState);
    emblaApi.on('reInit', updateScrollState);
    updateScrollState();

    return () => {
      emblaApi.off('select', updateScrollState);
      emblaApi.off('reInit', updateScrollState);
    };
  }, [emblaApi, updateScrollState]);

  return (
    <div className="card-content_carousel group relative h-full" role="region" aria-label="Property images carousel">
      {/* Main carousel */}
      <div className="absolute inset-0 overflow-hidden" ref={emblaRef} role="group" aria-live="polite">
        <div className="flex h-full" role="list">
          {images.map((image: A, index: number) => (
            <div key={image.id} className="flex-[0_0_100%] h-full" role="listitem" aria-label={`Image ${index + 1} of ${images.length}`}>
              <div className="relative h-full bg-muted md:rounded-md overflow-hidden">
                <BlurImage
                  src={buildThumbnailUrl({
                    imageUrl: hasUserInteracted || viewedImages.has(index) || index === 0
                      ? image.url
                      : images[0].url
                  })}
                  alt={`${getOptimizedAltText()} - Image ${index + 1}`}
                  fill
                  loading={isEager && index === 0 ? 'eager' : 'lazy'}
                  priority={isEager && index === 0}
                  fetchPriority={isEager && index === 0 ? 'high' : 'auto'}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="h-full w-full object-cover transition-all hover:scale-105"
                  onClick={(e) => {
                    e.preventDefault();
                    onImageClick?.();
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation controls */}
      {images.length > 1 && (
        <>
          {/* Previous button */}
          <button
            className={cn(
              "absolute left-2 top-1/2 transform -translate-y-1/2",
              "bg-black/20 hover:bg-black/40 focus:bg-black/60 text-white p-2 rounded-full transition-all",
              "opacity-0 group-hover:opacity-100 focus:opacity-100",
              "focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black/20",
              !canScrollPrev && "opacity-50 cursor-not-allowed"
            )}
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            aria-label="Previous image"
            tabIndex={0}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Next button */}
          <button
            className={cn(
              "absolute right-2 top-1/2 transform -translate-y-1/2",
              "bg-black/20 hover:bg-black/40 focus:bg-black/60 text-white p-2 rounded-full transition-all",
              "opacity-0 group-hover:opacity-100 focus:opacity-100",
              "focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black/20",
              !canScrollNext && "opacity-50 cursor-not-allowed"
            )}
            onClick={scrollNext}
            disabled={!canScrollNext}
            aria-label="Next image"
            tabIndex={0}
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* ButtonSave in badge position */}
          <ButtonSave
            postUid={postUid}
            className="!absolute !top-2 !right-2 !visible !opacity-100"
          />

          {/* Dot navigation */}
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
            <div className="flex gap-1">
              {images.map((_, index) => (
                <button
                  key={index}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all",
                    "focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-1 focus:ring-offset-black/20",
                    index === selectedIndex ? "bg-white" : "bg-white/40 hover:bg-white/60"
                  )}
                  onClick={() => scrollTo(index)}
                  aria-label={`Go to image ${index + 1}`}
                  aria-current={index === selectedIndex ? "true" : "false"}
                  tabIndex={0}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
