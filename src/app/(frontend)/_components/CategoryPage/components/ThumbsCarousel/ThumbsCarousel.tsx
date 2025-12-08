'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { AspectRatio } from '@/components/ui/AspectRatio';
import { Skeleton } from '@/components/ui/skeleton';

import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { cn } from '@common/utils';
import useResizeImage from '@common/hooks/useResizeImage';
import BlurImage from '@/components/BlurImage';
import ButtonSave from '../../../features/product-detail-actions/save-post/ButtonSave';

// ✅ Dynamic import Embla carousel only when needed  
const EmblaCarouselComponent = dynamic(
  () => import('./EmblaCarouselComponent'),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 flex items-center justify-center">
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
    ),
  }
);

type ThumbsCarouselProps = {
  product: A;
  handleClickCardImage?: () => void;
  isEager?: boolean;
  productIndex?: number;
};

/**
 * 🎯 **NEW ThumbsCarousel Implementation**
 * 
 * Flow:
 * 1. **SSR**: Show only first image (SEO optimized)
 * 2. **Viewport**: Initialize carousel with first image + pagination
 * 3. **Interaction**: Preload remaining images when user navigates
 */
export default function ThumbsCarousel({
  product,
  handleClickCardImage,
  isEager = false,
  productIndex = 0,
}: ThumbsCarouselProps) {
  const [isInViewport, setIsInViewport] = useState(false); // Start false for SSR, hydrate to true for above-fold
  const [isCarouselInitialized, setIsCarouselInitialized] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [isPreloadingImages, setIsPreloadingImages] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { buildThumbnailUrl } = useResizeImage();

  const firstImage = product.images?.[0];
  const hasMultipleImages = product.images_count >= 2;
  const isAboveFold = productIndex < 6; // First 6 products
  const eager = isEager || isAboveFold;

  // Debug logging removed - carousel working correctly

  // ✅ Hydration and viewport detection
  useEffect(() => {
    if (isAboveFold) {
      // For above-fold products, set to viewport immediately after hydration
      setIsInViewport(true);
      if (hasMultipleImages) {
        setIsCarouselInitialized(true);
      }
      return;
    }

    // For below-fold products, use intersection observer
    if (!containerRef.current) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isInViewport) {
          setIsInViewport(true);
          if (hasMultipleImages) {
            setTimeout(() => setIsCarouselInitialized(true), 100);
          }
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [isAboveFold, hasMultipleImages, productIndex, isInViewport, isCarouselInitialized]);

  // ✅ Generate optimized alt text for SEO
  const getOptimizedAltText = useCallback(() => {
    const parts = [];
    if (product.title) parts.push(product.title);
    if (product.district_name) parts.push(product.district_name);
    if (product.city_name) parts.push(product.city_name);
    if (product.price_display) parts.push(product.price_display);

    return parts.join(' - ') || 'Property image';
  }, [product]);

  // ✅ Async image preloading with loading state
  const preloadImageSafely = useCallback(
    async (imageUrl: string): Promise<void> => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => resolve(); // Still resolve on error to avoid blocking
        img.src = buildThumbnailUrl({ imageUrl });
      });
    },
    [buildThumbnailUrl],
  );

  // ✅ Handle user interaction (navigation) with loading state
  const handleCarouselInteraction = useCallback(async () => {
    if (!hasUserInteracted) {
      setHasUserInteracted(true);

      // Show loading state
      setIsPreloadingImages(true);

      try {
        // ✅ Preload ALL remaining images asynchronously with minimum duration
        const [_preloadResult] = await Promise.all([
          Promise.all(
            product.images?.slice(1).map((image: A) => preloadImageSafely(image.url)) || []
          ),
          new Promise(resolve => setTimeout(resolve, 500)) // Minimum 500ms visibility
        ]);

        console.log('✅ Image preloading completed for product:', product.uid);
      } catch (error) {
        console.error('❌ Error during image preloading:', error);
      } finally {
        // Hide loading state
        setIsPreloadingImages(false);
      }
    }
  }, [hasUserInteracted, product.images, product.uid, preloadImageSafely]);

  // ✅ Handle case with no images
  if (!firstImage) {
    return (
      <section ref={containerRef} className="relative w-full flex-shrink-0">
        <AspectRatio ratio={16 / 9} className="card-content_carousel group bg-muted md:rounded-md overflow-hidden flex items-center justify-center">
          <div className="text-muted-foreground text-sm">No image available</div>
          <ButtonSave postUid={product.uid} className="!absolute !top-2 !right-2 !visible !opacity-100" />
        </AspectRatio>
      </section>
    );
  }

  // ✅ SSR Mode: Only first image for SEO (server-side or below-fold not in viewport)
  if (!isInViewport) {
    return (
      <section ref={containerRef} className="relative w-full flex-shrink-0" role="img" aria-label={getOptimizedAltText()}>
        {firstImage && (
          <AspectRatio ratio={16 / 9} className="card-content_carousel group bg-muted md:rounded-md overflow-hidden">
            <BlurImage
              src={buildThumbnailUrl({ imageUrl: firstImage.url })}
              alt={getOptimizedAltText()}
              fill
              loading={eager ? 'eager' : 'lazy'}
              priority={eager}
              fetchPriority={eager ? 'high' : 'auto'}
              disableEffects={eager}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="h-full w-full object-cover transition-all hover:scale-105"
              onClick={(e) => {
                e.preventDefault();
                handleClickCardImage?.();
              }}
            />
            <ButtonSave postUid={product.uid} className="!absolute !top-2 !right-2 !visible !opacity-100" />
          </AspectRatio>
        )}
      </section>
    );
  }

  // ✅ Single Image Mode: No carousel needed
  if (!hasMultipleImages) {
    return (
      <section ref={containerRef} className="relative w-full flex-shrink-0">
        {firstImage && (
          <AspectRatio ratio={16 / 9} className="card-content_carousel group bg-muted md:rounded-md overflow-hidden">
            <BlurImage
              src={buildThumbnailUrl({ imageUrl: firstImage.url })}
              alt={getOptimizedAltText()}
              fill
              loading={eager ? 'eager' : 'lazy'}
              priority={eager}
              fetchPriority={eager ? 'high' : 'auto'}
              disableEffects={eager}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="h-full w-full object-cover transition-all hover:scale-105"
              onClick={(e) => {
                e.preventDefault();
                handleClickCardImage?.();
              }}
            />
            <ButtonSave postUid={product.uid} className="!absolute !top-2 !right-2 !visible !opacity-100" />
          </AspectRatio>
        )}
      </section>
    );
  }

  // ✅ Carousel Mode: Progressive loading
  return (
    <AspectRatio ratio={16 / 9} className="card-content_carousel group bg-muted md:rounded-md overflow-hidden">
      <section ref={containerRef} className="relative w-full h-full flex-shrink-0">
        {isCarouselInitialized ? (
          <div className="relative h-full w-full">
            <EmblaCarouselComponent
              images={product.images || []}
              hasUserInteracted={hasUserInteracted}
              onInteraction={handleCarouselInteraction}
              onImageClick={handleClickCardImage}
              getOptimizedAltText={getOptimizedAltText}
              isEager={isEager}
              postUid={product.uid}
            />

            {/* Loading overlay for image preloading */}
            {isPreloadingImages && (
              <div className="absolute inset-0 bg-black/10 flex items-center justify-center rounded-lg z-50">
                <Loader2 className="h-8 w-8 animate-spin text-white opacity-50" />
              </div>
            )}
          </div>
        ) : (
          // Loading state: Show first image with carousel controls hint (no nested AspectRatio)
          <div className="relative h-full w-full">
            {firstImage && (
              <BlurImage
                src={buildThumbnailUrl({ imageUrl: firstImage.url })}
                alt={getOptimizedAltText()}
                fill
                loading={eager ? 'eager' : 'lazy'}
                priority={eager}
                fetchPriority={eager ? 'high' : 'auto'}
                disableEffects={eager}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="h-full w-full object-cover"
              />
            )}

            {/* Pagination hint */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
              <div className="flex gap-1">
                {Array.from({ length: Math.min(product.images_count, 5) }).map((_, index) => (
                  <div
                    key={index}
                    className={cn(
                      "w-1.5 h-1.5 rounded-full transition-colors",
                      index === 0 ? "bg-white" : "bg-white/40"
                    )}
                  />
                ))}
                {product.images_count > 5 && (
                  <span className="text-white text-xs ml-1">+{product.images_count - 5}</span>
                )}
              </div>
            </div>

            {/* Navigation hints */}
            <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity">
              <button
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white p-1 rounded-full transition-colors"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white p-1 rounded-full transition-colors"
                aria-label="Next image"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <ButtonSave postUid={product.uid} className="!absolute !top-2 !right-2 !visible !opacity-100" />
          </div>
        )}
      </section>
    </AspectRatio>
  );
}
