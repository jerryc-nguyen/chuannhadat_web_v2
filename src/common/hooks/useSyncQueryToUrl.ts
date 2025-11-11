import { objectToQueryString } from '@common/utils';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useMemo } from 'react';

export const useSyncQueryToUrl = (object: Record<string, A>, excludeFields: string[] = []) => {
  const router = useRouter();
  const pathname = usePathname() || '';
  const searchParams = useSearchParams();
  const prevRoute = useRef('');
  const filteredObject = useExcludeFields(object, excludeFields);
  useEffect(() => {
    const nextRoute = pathname + '?' + objectToQueryString(filteredObject, searchParams);
    if (prevRoute.current !== nextRoute) { // Prevent infinite loop, ui flash, only push when route change
      prevRoute.current = nextRoute;
      router.push(nextRoute);
    }
  }, [filteredObject, pathname, router, searchParams]);
};

export const useExcludeFields = (object: Record<string, A>, excludeFields: string[]): Record<string, A> => {
  return useMemo(() => {
    const filteredObject = Object.fromEntries(
      Object.entries(object).filter(([key]) => !excludeFields.includes(key)),
    );
    return filteredObject;
  }, [object, excludeFields]);
};
