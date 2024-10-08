import * as React from 'react';
const useRefCallback = <T extends (...arg: A[]) => A>(callback: T) => {
  const callbackRef: React.MutableRefObject<T> = React.useRef(callback);
  callbackRef.current = callback;
  return React.useCallback((...args: A[]) => callbackRef.current(...args), []) as T;
};
export { useRefCallback };
