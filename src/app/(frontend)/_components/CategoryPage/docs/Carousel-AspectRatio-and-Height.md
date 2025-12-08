# Carousel Height Anchoring: Aspect Ratio + `h-full`/`w-full`

This note explains the layout ideas behind fixing the Category page carousel: why an outer `AspectRatio` and inner `h-full`/`w-full` are used, and how they prevent layout shifts and ensure images render correctly.

## Problem

- The Embla viewport uses `absolute inset-0`. Absolute children do not contribute to parent height.
- If the parent has no concrete height, the viewport collapses (height ~ 0), so images appear wrong or invisible.
- The previous implementation had height determined by dynamically initialized content, causing flicker and layout shifts during SSR → client hydration.

## Core Idea

- Anchor height with an outer `AspectRatio ratio={16/9}` so the block has a predictable height derived from its width across breakpoints.
- Inside that block, ensure every container uses `h-full w-full` so children fill the available sized area.
- Let Embla’s viewport (`absolute inset-0`) fill the sized parent instead of trying to size itself.

## Height Propagation Chain

1. Outer `AspectRatio`: computes height from width using `16/9`.
2. `section` container: `className="relative w-full h-full"` inherits height from `AspectRatio`.
3. Inner wrapper (carousel/loading state): `className="relative h-full w-full"` keeps the chain.
4. Embla viewport: `className="absolute inset-0 overflow-hidden"` fills the parent’s size.
5. Slides: `className="flex-[0_0_100%] h-full"` make each snap occupy the full viewport.
6. Image: `BlurImage` with `fill` + `className="h-full w-full object-cover"` paints the entire area consistently.

This chain guarantees the viewport and images have a real, stable height from the first paint.

## Why Outer `AspectRatio` (Single Source of Truth)

- One geometry source simplifies layout and prevents competing intrinsic sizing.
- Overlays (buttons, pagination hint, skeleton) can be positioned inside the section while the image geometry is stable.
- Avoids nested `AspectRatio` blocks that can fight each other and cause micro flickers.

## `w-full` vs `h-full` Guidelines

- `w-full`: make the container match the parent’s width.
- `h-full`: make the container match the parent’s computed height. Critical for any absolute children.
- Absolute children (`absolute inset-0`) require their parent to have a defined height; otherwise they render at zero height.

## Image Fit

- `object-cover`: fills the area, may crop edges (good for card visuals).
- `object-contain`: shows the entire image without cropping, may letterbox. Swap based on design preference.

## SSR and Layout Stability

- SSR first paint uses the outer `AspectRatio` to lock geometry, preventing vertical shifts.
- Pre-initialization state renders the first image inside the same sized block; the carousel initializes without changing container height.
- Optional skeleton overlay and opacity fade can be used to smooth visual transitions without changing geometry.

## Mobile Height Example

- With a typical mobile card width of ~384px, `16/9` computes height ≈ 216px (`384 * 9 / 16`).
- Do not hardcode pixel heights; let `AspectRatio` adapt per breakpoint.

## Quick Checklist

- Wrap the entire image/carousel in an outer `AspectRatio` (e.g., `16/9`).
- Ensure all inner containers use `h-full w-full`.
- Keep Embla viewport `absolute inset-0` inside a sized parent.
- Give slides `h-full` and images `fill` with `object-cover` or `object-contain`.

## Code References

- `ThumbsCarousel.tsx` (carousel mode wrapper):

```tsx
// Outer geometry anchor
<AspectRatio ratio={16 / 9} className="card-content_carousel group bg-muted md:rounded-md overflow-hidden">
  <section ref={containerRef} className="relative w-full h-full flex-shrink-0">
    {isCarouselInitialized ? (
      <div className="relative h-full w-full">
        <EmblaCarouselComponent ... />
        {/* overlays... */}
      </div>
    ) : (
      <div className="relative h-full w-full">
        {/* first image preview + hints... */}
      </div>
    )}
  </section>
}</AspectRatio>
```

- `EmblaCarouselComponent.tsx` (viewport and slides):

```tsx
// Top-level wrapper must have h-full
<div className="card-content_carousel group relative h-full" role="region">
  <div className="absolute inset-0 overflow-hidden" ref={emblaRef}>
    <div className="flex h-full">
      {images.map((image) => (
        <div key={image.id} className="flex-[0_0_100%] h-full">
          <div className="relative h-full bg-muted md:rounded-md overflow-hidden">
            <BlurImage fill className="h-full w-full object-cover" ... />
          </div>
        </div>
      ))}
    </div>
  </div>
</div>
```

By anchoring height with `AspectRatio` and propagating it via `h-full`, the carousel occupies a stable, predictable area from SSR through client initialization, eliminating layout shifts and ensuring images render correctly.
