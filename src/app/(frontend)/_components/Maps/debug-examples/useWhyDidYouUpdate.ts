import { useEffect, useRef } from 'react';

// Custom hook to debug why components/effects update
export const useWhyDidYouUpdate = (name: string, props: Record<string, any>) => {
  const previous = useRef<Record<string, any>>();

  useEffect(() => {
    if (previous.current) {
      const allKeys = Object.keys({ ...previous.current, ...props });
      const changedProps: Record<string, [any, any]> = {};

      allKeys.forEach(key => {
        if (previous.current![key] !== props[key]) {
          changedProps[key] = [previous.current![key], props[key]];
        }
      });

      if (Object.keys(changedProps).length > 0) {
        console.log('[why-did-you-update]', name, changedProps);

        // Special handling for functions
        Object.entries(changedProps).forEach(([key, [oldVal, newVal]]) => {
          if (typeof oldVal === 'function' && typeof newVal === 'function') {
            console.log(`🔄 Function "${key}" reference changed:`, {
              old: oldVal.toString().slice(0, 100) + '...',
              new: newVal.toString().slice(0, 100) + '...',
              same: oldVal === newVal
            });
          }
        });
      }
    }
    previous.current = props;
  });
};

// Usage example:
export const ExampleComponent = () => {
  const { buildThumbnailUrl } = useResizeImage();

  // Debug why this component updates
  useWhyDidYouUpdate('ExampleComponent', { buildThumbnailUrl });

  return <div>...</div>;
};
