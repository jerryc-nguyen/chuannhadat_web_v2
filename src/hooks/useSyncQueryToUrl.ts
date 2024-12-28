import { objectToQueryString } from '@common/utils';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';

export const useSyncQueryToUrl = (object: Record<string, A>) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const prevRoute = useRef('');

  useEffect(() => {
    const nextRoute = pathname + '?' + objectToQueryString(object, searchParams);
    if (prevRoute.current !== nextRoute) { // Prevent infinite loop, ui flash, only push when route change
      prevRoute.current = nextRoute;
      router.push(nextRoute);
    }
  }, [object, pathname, router, searchParams]);
};
