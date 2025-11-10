# Pagination Footer – Fixed Fit Solution

This document explains the current, working pagination footer implementation that stays pinned to the viewport bottom while matching the width of the content pane (not overlapping the dashboard sidebar). It also covers why other approaches may fail and how to troubleshoot.

## Overview

- Uses `position="fixed-fit"` in `Pagination.tsx`.
- Calculates `left` and `width` from the parent container’s bounding rect so the footer aligns with the content pane only.
- Updates measurements on `resize` and `scroll`.
- Adds bottom padding (`pb-14`) to the scroll container so the final row doesn’t sit under the footer.

## How to Use

1) Wrap the table content in a scroll container:

```tsx
<div className="h-full">
  <div className="relative h-full pb-14 overflow-y-auto">
    {/* table content */}
    <Pagination table={table} position="fixed-fit" />
  </div>
 </div>
```

2) Ensure the right pane (where the table lives) has a defined height. In most dashboard layouts, the parent uses a CSS grid or flex layout with `min-h-screen` or `h-full`. The inner wrappers above (`h-full`) allow the scroll container to compute dimensions correctly.

3) Provide `totalCount` when page count is server-driven. `Pagination.tsx` will infer page count as `Math.ceil(totalCount / pageSize)` if the table instance does not expose `getPageCount` directly.

### Numbered Pages

The footer renders numbered page buttons with ellipses where appropriate: `1 … 4 5 6 … 20`. The current page is highlighted. Clicking a number updates the page via the table instance.

## API Notes

- `position`: key modes
  - `fixed-fit` (recommended): viewport-fixed footer sized/positioned to the parent content pane.
  - `inline`: default inline rendering (no sticking) for simple lists.
  - `sticky`/`fixed`/`container`: kept for fallback/testing; see pitfalls below.
- `showTotal`: shows the total row count when available.

## Why Sticky or Absolute Didn’t Work

### Case: `position: sticky` didn’t stick

Common causes:
- Missing scroll context: the element sticks within the nearest scrollable ancestor. If the scroll is on `window` but the sticky element is inside a non-scrollable div, `sticky` won’t engage.
- Undetermined height: without `h-full`/explicit height, the browser can’t compute the sticky constraints.
- Overflow clipping: ancestors with `overflow: hidden` or `overflow: auto` can change the sticky containing block unexpectedly.
- Transforms on ancestors: `transform` creates a new containing block and may change how `sticky` computes the viewport.

Outcome: Sticky worked inconsistently and often failed in complex dashboard layouts where the right pane scrolls differently than the main window.

### Case: `position: absolute` anchored in a relative container

Absolute positioning can limit width to the content area, but it won’t stay pinned to the viewport bottom while the container scrolls. It scrolls away with the content or overlays content depending on padding and height, leading to poor UX.

### Case: `position: fixed` full-width

Fixed across the viewport bottom ignores the content pane width and overlaps the sidebar. This was unacceptable for the dashboard layout.

## Why `fixed-fit` Works

- Uses `position: fixed` to stick to the viewport bottom.
- Measures the content pane and applies dynamic `left` and `width` so the footer aligns to the pane and not the sidebar.
- Listens to `scroll` and `resize` to re-measure when the layout changes.

## Implementation Details

- The footer computes items like `Prev`, `Next`, and numbered pages based on the table’s current page index and page count.
- The shared base classes are centralized to keep styling consistent across modes.
- Bottom padding (`pb-14`) prevents content from being hidden behind the footer.

## Troubleshooting Checklist

- Ensure the content pane has `h-full` and is inside a layout that defines height (`min-h-screen`, grid row sizing, etc.).
- Confirm the scroll container is the pane with `overflow-y-auto` and the footer is inside that pane when using `fixed-fit`.
- Check for parent elements with `transform` or unusual `overflow` that might affect bounding rect calculations.
- Verify `totalCount` and `pageSize` if pages appear incorrect.

## Example: Desktop + Mobile

Both `DataTableBase.tsx` and `DataTableBaseMobile.tsx` use the same approach:

```tsx
<div className="h-full">
  <div className="relative h-full pb-14 overflow-y-auto">
    {/* table */}
    <Pagination table={table} position="fixed-fit" />
  </div>
</div>
```

This ensures:
- Pane scrolls independently.
- Footer stays visible and aligned to pane width.
- Padding avoids overlap with the last row.

## Notes

- If you prefer `sticky`, make sure the scroll container and heights are correctly set, and be aware of the pitfalls. In complex layouts, `fixed-fit` is more reliable.