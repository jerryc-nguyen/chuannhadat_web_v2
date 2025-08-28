/**
 * Dynamic Swiper Component
 * 
 * Dynamically imports Swiper (~150KB) only when carousels are needed
 * This removes Swiper from the main bundle until carousel interaction
 */

import { lazy, Suspense, ComponentProps } from 'react';

// Dynamic import for Swiper components
const Swiper = lazy(() => import('swiper/react').then(module => ({ default: module.Swiper })));
const SwiperSlide = lazy(() => import('swiper/react').then(module => ({ default: module.SwiperSlide })));

const SwiperLoader = () => (
  <div className="flex h-64 items-center justify-center rounded-lg bg-gray-100">
    <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
    <span className="ml-2 text-sm text-gray-600">Loading carousel...</span>
  </div>
);

type SwiperDynamicProps = ComponentProps<typeof Swiper>;
type SwiperSlideDynamicProps = ComponentProps<typeof SwiperSlide>;

export function SwiperDynamic(props: SwiperDynamicProps) {
  return (
    <Suspense fallback={<SwiperLoader />}>
      <Swiper {...props} />
    </Suspense>
  );
}

export function SwiperSlideDynamic(props: SwiperSlideDynamicProps) {
  return (
    <Suspense fallback={<div className="h-full w-full bg-gray-100" />}>
      <SwiperSlide {...props} />
    </Suspense>
  );
}

// Export function to load Swiper modules dynamically
export async function loadSwiperModules() {
  const modules = await import('swiper/modules');
  return {
    Navigation: modules.Navigation,
    Pagination: modules.Pagination,
    Autoplay: modules.Autoplay,
    EffectFade: modules.EffectFade,
  };
}
