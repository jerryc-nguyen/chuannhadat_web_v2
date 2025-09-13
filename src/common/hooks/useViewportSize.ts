import {
  useCallback,
  useLayoutEffect,
  useState,
} from 'react';
import useCleanupEffect from './useCleanupEffect';

const useBrowserLayoutEffect =
  typeof window !== 'undefined'
    ? useLayoutEffect
    : () => null;

type Width = number;
type Height = number;
type Size = [Width, Height];

/**
 * Get the current size of the Viewport. Do not call this excessively, as it may
 * cause performance issues in WebKit. Querying innerWidth/height triggers a
 * relayout of the page.
 */
export const getViewportSize = (): Size => {
  if (window.visualViewport) {
    // visualViewport is a new prop intended for this exact behavior, prefer it
    // over all else when available
    // https://developer.mozilla.org/en-US/docs/Web/API/Visual_Viewport_API
    return [
      window.visualViewport.width,
      window.visualViewport.height,
    ] as const;
  }

  return [
    window.innerWidth,
    // window.innerHeight gets updated when a user opens the soft keyboard, so
    // it should be preferred over documentElement.clientHeight
    // Want more? https://blog.opendigerati.com/the-eccentric-ways-of-ios-safari-with-the-keyboard-b5aa3f34228d
    window.innerHeight,
  ] as const;
};

/**
 * Returns the viewport size. This can also be used as a dependency in a
 * useEffect to trigger an update when the browser resizes.
 */
const useViewportSize = () => {
  const [viewportSize, setViewportSize] = useState<
    Size | undefined
  >();

  const updateViewportSize = useCallback(() => {
    const viewportSize = getViewportSize();

    setViewportSize((oldViewportSize) => {
      if (
        oldViewportSize &&
        oldViewportSize[0] === viewportSize[0] &&
        oldViewportSize[1] === viewportSize[1]
      ) {
        // Maintain old instance to prevent unnecessary updates
        return oldViewportSize;
      }

      return viewportSize;
    });
  }, []);

  useBrowserLayoutEffect(updateViewportSize, [
    updateViewportSize,
  ]);

  // Replace useEffect with useCleanupEffect for safer event handling
  useCleanupEffect((helpers) => {
    const effectTwice = () => {
      updateViewportSize();
      // Closing the OSK in iOS does not immediately update the visual viewport
      // size :<
      helpers.setTimeout(updateViewportSize, 1000);
    };

    // Add all event listeners with automatic cleanup
    helpers.addEventListener(window, 'resize', effectTwice);

    // From the top of my head this used to be required for older browsers since
    // this didn't trigger a resize event. Keeping it in to be safe.
    helpers.addEventListener(window, 'orientationchange', effectTwice);

    // This is needed on iOS to resize the viewport when the Virtual/OnScreen
    // Keyboard opens. This does not trigger A other event, or the standard
    // resize event.
    if (window.visualViewport) {
      helpers.addEventListener(window.visualViewport, 'resize', effectTwice);
    }
  }, [updateViewportSize]);

  return viewportSize;
};

export default useViewportSize;
