import { useEffect, useState, useCallback } from 'react';

export function useIsInVerticalCenterZone(
  ref: React.RefObject<HTMLElement>,
  options?: {
    topRatio?: number; // mặc định: 0.35
    bottomRatio?: number; // mặc định: 0.65
  },
) {
  const [isInCenterZone, setIsInCenterZone] = useState(false);

  // ✅ Throttle function to prevent forced reflows
  const throttle = useCallback((func: (...args: any[]) => void, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    let lastExecTime = 0;
    return (...args: any[]) => {
      const currentTime = Date.now();

      if (currentTime - lastExecTime > delay) {
        func(...args);
        lastExecTime = currentTime;
      } else {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          func(...args);
          lastExecTime = Date.now();
        }, delay - (currentTime - lastExecTime));
      }
    };
  }, []);

  useEffect(() => {
    const checkPosition = () => {
      if (!ref.current) return;

      // ✅ Use requestAnimationFrame to avoid forced reflows
      requestAnimationFrame(() => {
        if (!ref.current) return;

        const rect = ref.current.getBoundingClientRect();
        const centerY = rect.top + rect.height / 2;

        const viewportHeight = window.innerHeight;
        const topBound = viewportHeight * (options?.topRatio ?? 0.35);
        const bottomBound = viewportHeight * (options?.bottomRatio ?? 0.65);

        setIsInCenterZone(centerY >= topBound && centerY <= bottomBound);
      });
    };

    // ✅ Throttle scroll events to 16ms (60fps)
    const throttledCheckPosition = throttle(checkPosition, 16);

    checkPosition(); // check ban đầu
    window.addEventListener('scroll', throttledCheckPosition, { passive: true });
    window.addEventListener('resize', checkPosition);

    return () => {
      window.removeEventListener('scroll', throttledCheckPosition);
      window.removeEventListener('resize', checkPosition);
    };
  }, [ref, options?.topRatio, options?.bottomRatio, throttle]);

  return isInCenterZone;
}
