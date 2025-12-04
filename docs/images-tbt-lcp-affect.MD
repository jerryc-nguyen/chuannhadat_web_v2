# Images, LCP, and TBT: Practical Guidance

This document explains how image loading affects Largest Contentful Paint (LCP) and Total Blocking Time (TBT), and how this project configures images to optimize both. It also provides actionable patterns, code examples, and a checklist for PRs.

## Key Concepts

- LCP: Time when the largest content element becomes visible. Often the hero image or first product thumbnail.
- TBT: Sum of main-thread “long tasks” (>50ms) between First Contentful Paint and Time to Interactive. Heavy JS during image initialization, transitions, and synchronous work worsen TBT.

## How Images Affect LCP

- Resource priority: Above-the-fold images should be fetched with high priority to paint quickly.
- Connection setup: DNS/TCP/TLS to the image CDN can delay first bytes if not preconnected.
- Decode and paint: Large images or oversized sources increase decode time and paint cost.
- Onload effects: Heavy transitions (blur/scale/grayscale) or complex JS on `onLoad` delay the final “settled” paint.

## How Images Affect TBT

- Expensive `onLoad` handlers: Doing work (DOM mutations, layout trashing, heavy JS) when the image fires `load` can create long tasks.
- Carousel initialization: Booting a carousel or complex UI before interaction increases blocking time if done during initial render.
- Unnecessary effects: CSS transitions and filters on critical images add main-thread work while the page is stabilizing.

## Project Configuration and Patterns

### 1) BlurImage Defaults

- File: `src/components/BlurImage.tsx`
- Non-critical images default to `loading="lazy"` and `fetchPriority="low"`.
- Critical images (with `priority`) keep `fetchPriority="high"` and preload automatically.
- `disableEffects` lets us skip costly visual transitions on critical images.

### 2) ThumbsCarousel Heuristics

- File: `src/app/(frontend)/_components/CategoryPage/components/ThumbsCarousel/ThumbsCarousel.tsx`
- Above-the-fold heuristic: `productIndex < 6` marks the first 6 products as likely critical.
- `const eager = isEager || isAboveFold` so we can force eagerness via props or by position.
- Example usage (line 167 and similar):

```tsx
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
```

### 3) CDN Preconnect and DNS Prefetch

- File: `src/app/layout.tsx`
- Preconnect to image CDNs to reduce connection setup latency:

```tsx
<link rel="preconnect" href="https://images.chuannhadat.com" crossOrigin="" />
<link rel="dns-prefetch" href="//images.chuannhadat.com" />
<link rel="preconnect" href="https://s3-images-dev.b-cdn.net" crossOrigin="" />
<link rel="dns-prefetch" href="//s3-images-dev.b-cdn.net" />
```

### 4) Resize Hook and Formats

- File: `src/common/hooks/useResizeImage.ts`
- Generates URLs with `f=webp` and constrained `width/height` to avoid oversized sources.
- Maps various origins to CDN hosts to standardize delivery.

## Choosing Eager vs Lazy

- Use `eager` when:
  - The image is above-the-fold and likely to be the LCP candidate.
  - You need the image visible immediately (hero section, primary thumbnail).
- Use `lazy` when:
  - The image is below-the-fold or secondary.
  - You want to avoid network contention and main-thread work during initial render.

## Additional Recommendations

- Accurate `sizes`: Provide realistic `sizes` to ensure the browser selects the smallest appropriate source.
- Avoid heavy transitions for LCP: Use `disableEffects` on critical images to minimize main-thread work.
- Defer offscreen rendering: Apply `content-visibility: auto` and `contain-intrinsic-size` on offscreen containers to defer layout/paint.
- Strong caching: Serve CDN images with `Cache-Control: public, max-age=31536000, immutable` to reduce origin dependence.
- Consider modern formats: Continue with `webp`; add `avif` support if compatible with the service.

## Troubleshooting Slow Image Services

- Preconnect not present: Ensure `<link rel="preconnect">` to the image CDN is in root layout.
- Oversized sources: Verify `sizes` and URL params generate appropriately sized images.
- TBT spikes: Audit for heavy `onLoad` handlers, carousel boot on first render, or CSS filter transitions on critical images.
- LCP variability: Confirm critical images are marked `priority` and not blocked by heavy effects or JS.

## PR Checklist

- Critical image uses `priority` and `fetchPriority="high"`.
- Non-critical images default to `loading="lazy"` and `fetchPriority="low/auto"`.
- `disableEffects` on above-the-fold images to avoid heavy transitions.
- `sizes` reflect actual layout width across breakpoints.
- Preconnect/DNS-prefetch entries exist for image CDNs.

By following these patterns, we minimize blocking time during initial render while ensuring the primary content paints quickly and consistently.
