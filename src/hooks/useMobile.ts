import * as React from 'react';
import useCleanupEffect from './useCleanupEffect';

const MOBILE_BREAKPOINT = 480;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

  useCleanupEffect((helpers) => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    // Add event listener safely with automatic cleanup
    helpers.addEventListener(mql, 'change', onChange);

    // Set initial value
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
  }, []);

  return !!isMobile;
}
