import { useEffect, useState } from 'react';

export function useIsInVerticalCenterZone(
  ref: React.RefObject<HTMLElement>,
  options?: {
    topRatio?: number; // mặc định: 0.35
    bottomRatio?: number; // mặc định: 0.65
  },
) {
  const [isInCenterZone, setIsInCenterZone] = useState(false);

  useEffect(() => {
    const checkPosition = () => {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const centerY = rect.top + rect.height / 2;

      const viewportHeight = window.innerHeight;
      const topBound = viewportHeight * (options?.topRatio ?? 0.35);
      const bottomBound = viewportHeight * (options?.bottomRatio ?? 0.65);

      setIsInCenterZone(centerY >= topBound && centerY <= bottomBound);
    };

    checkPosition(); // check ban đầu
    window.addEventListener('scroll', checkPosition);
    window.addEventListener('resize', checkPosition);

    return () => {
      window.removeEventListener('scroll', checkPosition);
      window.removeEventListener('resize', checkPosition);
    };
  }, [ref, options?.topRatio, options?.bottomRatio]);

  return isInCenterZone;
}
