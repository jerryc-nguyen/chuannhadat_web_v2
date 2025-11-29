import { useCallback, useEffect, useRef, useState } from "react";

export type FixedBottomOptions = {
  /**
   * Optional selector to locate the target element, e.g. '#id' or '.class'.
   * Prefer using the returned ref for React-friendly usage.
   */
  selector?: string;
  /** Distance from the viewport bottom in pixels */
  bottom?: number;
  /** z-index for the fixed bar */
  zIndex?: number;
  /** Enable or disable fixing behavior */
  enabled?: boolean;
  /**
   * Alignment of the fixed bar: align to its parent width/left or full viewport.
   * Default is 'parent'.
   */
  alignTo?: "parent" | "viewport";
  /** Reserve space at the parent's bottom equal to bar height to avoid overlap */
  reserveSpace?: boolean;
  /** Extra pixels to add to reserved space in addition to bar height */
  extraPadding?: number;
};

export function useFixedBottomBar<T extends HTMLElement>(
  providedRef?: React.RefObject<T>,
  options?: FixedBottomOptions
) {
  const internalRef = useRef<T>(null);
  const ref = providedRef ?? internalRef;
  const [style, setStyle] = useState<React.CSSProperties | undefined>(undefined);

  const {
    selector,
    bottom = 0,
    zIndex = 40,
    enabled = true,
    alignTo = "parent",
    reserveSpace = true,
    extraPadding = 0,
  } = options || {};

  const parentRef = useRef<HTMLElement | null>(null);
  const originalParentPaddingRef = useRef<string | null>(null);

  const update = useCallback(() => {
    if (!enabled) {
      setStyle(undefined);
      return;
    }

    let el: HTMLElement | null = (ref.current as unknown as HTMLElement) || null;
    if (!el && selector) {
      el = document.querySelector(selector) as HTMLElement | null;
    }
    if (!el) return;

    const parent = el.parentElement;
    if (!parent) return;
    parentRef.current = parent;

    const rect = parent.getBoundingClientRect();

    const next: React.CSSProperties = {
      position: "fixed",
      bottom,
      zIndex,
    };

    if (alignTo === "parent") {
      next.left = rect.left;
      next.width = rect.width;
    } else {
      next.left = 0;
      next.right = 0;
    }

    setStyle(next);

    // Reserve space at the bottom of parent to prevent last item being covered
    if (reserveSpace) {
      const barRect = el.getBoundingClientRect();
      const reservedPx = Math.max(0, Math.round(barRect.height + bottom + extraPadding));
      if (originalParentPaddingRef.current === null) {
        // store inline style paddingBottom so we can restore later
        originalParentPaddingRef.current = parent.style.paddingBottom || "";
      }
      parent.style.paddingBottom = `${reservedPx}px`;
    }
  }, [ref, selector, bottom, zIndex, enabled, alignTo, reserveSpace, extraPadding]);

  useEffect(() => {
    const onResize = () => update();
    const onScroll = () => update();
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, { passive: true });
    // initial position once mounted
    const t = setTimeout(update, 50);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      // restore parent's original padding when unmounting
      const parent = parentRef.current;
      if (parent && originalParentPaddingRef.current !== null) {
        parent.style.paddingBottom = originalParentPaddingRef.current;
        originalParentPaddingRef.current = null;
      }
    };
  }, [update]);

  // If disabled, clear fixed style and restore parent padding
  useEffect(() => {
    if (!enabled) {
      setStyle(undefined);
      const parent = parentRef.current;
      if (parent && originalParentPaddingRef.current !== null) {
        parent.style.paddingBottom = originalParentPaddingRef.current;
        originalParentPaddingRef.current = null;
      }
    } else {
      // Ensure we recompute style and padding when re-enabled
      const t = setTimeout(update, 0);
      return () => clearTimeout(t);
    }
  }, [enabled, update]);

  return { ref, style, update } as const;
}
