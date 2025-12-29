import { useRef, useState, useEffect, useCallback } from 'react';

export const useHorizontalScroll = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [showScrollButtons, setShowScrollButtons] = useState(false);

  const checkScrollPosition = useCallback(() => {
    if (!scrollContainerRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 0);
    // Use a small tolerance for float calculations
    setCanScrollRight(Math.ceil(scrollLeft) < scrollWidth - clientWidth - 1);
    setShowScrollButtons(scrollWidth > clientWidth);
  }, []);

  const scrollLeft = useCallback(() => {
    if (!scrollContainerRef.current) return;
    scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
  }, []);

  const scrollRight = useCallback(() => {
    if (!scrollContainerRef.current) return;
    scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
  }, []);

  const scrollToElement = useCallback((element: Element) => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;

    const containerRect = container.getBoundingClientRect();
    const itemRect = element.getBoundingClientRect();

    // If the active item is not fully visible, scroll to show it
    if (itemRect.right > containerRect.right || itemRect.left < containerRect.left) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'end'
      });
    }
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    const handleResize = () => {
      checkScrollPosition();
    };

    if (container) {
      checkScrollPosition();
      container.addEventListener('scroll', checkScrollPosition);
      window.addEventListener('resize', handleResize);

      return () => {
        container.removeEventListener('scroll', checkScrollPosition);
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [checkScrollPosition]);

  return {
    scrollContainerRef,
    canScrollLeft,
    canScrollRight,
    showScrollButtons,
    scrollLeft,
    scrollRight,
    checkScrollPosition,
    scrollToElement,
  };
};
