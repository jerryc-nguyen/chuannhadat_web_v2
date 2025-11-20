import { useState, useEffect } from 'react';

/**
 * Custom hook for implementing sticky header behavior in scrollable containers
 *
 * This hook provides a simple way to detect when a scrollable container has been
 * scrolled past a certain threshold, making it easy to implement sticky headers
 * or other scroll-based UI changes.
 *
 * @param scrollRef - React ref to the scrollable element
 * @param threshold - Scroll position threshold in pixels (default: 40px)
 * @returns boolean indicating if the scroll position exceeds the threshold
 *
 * @example
 * ```tsx
 * import { useStickyHeader } from '@common/hooks';
 *
 * const MyComponent = () => {
 *   const scrollRef = useRef<HTMLDivElement>(null);
 *   const isHeaderFixed = useStickyHeader(scrollRef, 40);
 *
 *   return (
 *     <div ref={scrollRef} className="overflow-y-auto h-screen">
 *       <header className={isHeaderFixed ? 'fixed top-0 z-10 bg-white shadow' : ''}>
 *         Header Content
 *       </header>
 *
 *       <main className="pt-16">
 *       </main>
  *    </div>
  *   );
 * };
 * ```
 */
export const useStickyHeader = (
  scrollRef: React.RefObject<HTMLElement | null>,
  threshold = 40
): boolean => {
  const [isHeaderFixed, setIsHeaderFixed] = useState<boolean>(false);

  useEffect(() => {
    const checkAndAttachScrollListener = () => {
      const scrollElement = scrollRef.current;
      if (!scrollElement) {
        // Retry after a short delay if element not found
        setTimeout(checkAndAttachScrollListener, 100);
        return;
      }

      const handleScroll = () => {
        const scrollTop = scrollElement.scrollTop;
        setIsHeaderFixed(scrollTop > threshold);
      };

      scrollElement.addEventListener('scroll', handleScroll, { passive: true });

      return () => {
        scrollElement.removeEventListener('scroll', handleScroll);
      };
    };

    const cleanup = checkAndAttachScrollListener();
    return cleanup;
  }, [scrollRef, threshold]);

  return isHeaderFixed;
};
