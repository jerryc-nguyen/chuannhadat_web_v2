import { useCallback, useEffect, useRef } from 'react';

/**
 * A custom hook that extends useEffect to help prevent memory leaks by ensuring proper cleanup.
 * It tracks whether the component is mounted before executing callbacks and provides utility
 * functions for managing timeouts, intervals, and event listeners safely.
 * 
 * @param callback Function to run on component mount or dependencies change
 * @param dependencies Array of dependencies that trigger the effect when changed
 */
export function useCleanupEffect(
  callback: (helpers: CleanupHelpers) => (() => void) | void,
  dependencies: React.DependencyList = []
) {
  const isMountedRef = useRef(true);

  // Collection of cleanup functions to run when the component unmounts
  const cleanupFunctionsRef = useRef<Array<() => void>>([]);

  // Add a cleanup function that will be called on unmount or dependency change
  const addCleanup = useCallback((fn: () => void) => {
    cleanupFunctionsRef.current.push(fn);
  }, []);

  // Safe setTimeout that automatically cleans up on unmount
  const safeSetTimeout = useCallback((fn: () => void, ms: number) => {
    if (!isMountedRef.current) return;

    const timeoutId = setTimeout(() => {
      if (isMountedRef.current) {
        fn();
      }
    }, ms);

    addCleanup(() => clearTimeout(timeoutId));

    return timeoutId;
  }, [addCleanup]);

  // Safe setInterval that automatically cleans up on unmount
  const safeSetInterval = useCallback((fn: () => void, ms: number) => {
    if (!isMountedRef.current) return;

    const intervalId = setInterval(() => {
      if (isMountedRef.current) {
        fn();
      }
    }, ms);

    addCleanup(() => clearInterval(intervalId));

    return intervalId;
  }, [addCleanup]);

  // Safe addEventListener that automatically cleans up on unmount
  const safeAddEventListener = useCallback(
    <T extends Window | Document | HTMLElement | EventTarget>(
      target: T,
      event: string,
      listener: EventListenerOrEventListenerObject,
      options?: boolean | AddEventListenerOptions
    ) => {
      if (!isMountedRef.current) return;

      target.addEventListener(event, listener, options);

      addCleanup(() => {
        target.removeEventListener(event, listener, options);
      });
    },
    [addCleanup]
  );

  useEffect(() => {
    isMountedRef.current = true;

    // Create helper object with utilities
    const helpers: CleanupHelpers = {
      isMounted: () => isMountedRef.current,
      addCleanup,
      setTimeout: safeSetTimeout,
      setInterval: safeSetInterval,
      addEventListener: safeAddEventListener,
    };

    // Call the provided callback with helpers
    const cleanupFn = callback(helpers);

    // If the callback returns a cleanup function, add it to our list
    if (cleanupFn) {
      addCleanup(cleanupFn);
    }

    // Run all cleanup functions when the effect is cleaned up
    return () => {
      isMountedRef.current = false;

      // Execute all cleanup functions and clear the list
      cleanupFunctionsRef.current.forEach(fn => fn());
      cleanupFunctionsRef.current = [];
    };
  }, dependencies);
}

/**
 * Helper functions provided to the callback
 */
export interface CleanupHelpers {
  /** Returns whether the component is currently mounted */
  isMounted: () => boolean;

  /** Add a function to be called when the effect is cleaned up */
  addCleanup: (fn: () => void) => void;

  /** Safe version of setTimeout that only runs if the component is mounted
   * and automatically cleans up on unmount */
  setTimeout: (fn: () => void, ms: number) => NodeJS.Timeout | undefined;

  /** Safe version of setInterval that only runs if the component is mounted
   * and automatically cleans up on unmount */
  setInterval: (fn: () => void, ms: number) => NodeJS.Timeout | undefined;

  /** Safe version of addEventListener that automatically removes the listener on unmount */
  addEventListener: <T extends Window | Document | HTMLElement | EventTarget>(
    target: T,
    event: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ) => void;
}

export default useCleanupEffect; 
