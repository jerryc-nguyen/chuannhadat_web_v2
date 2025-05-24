import { useCallback, useRef } from 'react';

function useDebounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number,
): (...args: Parameters<T>) => void {
  const timeoutId = useRef<ReturnType<typeof setTimeout>>(null);

  const debouncedFunction = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutId.current) clearTimeout(timeoutId.current);
      timeoutId.current = setTimeout(() => {
        func(...args);
      }, delay);
    },
    [func, delay],
  );

  return debouncedFunction;
}

export default useDebounce;
