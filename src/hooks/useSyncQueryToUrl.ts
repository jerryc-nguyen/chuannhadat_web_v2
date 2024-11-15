import { objectToQueryString } from '@common/utils';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export const useSyncQueryToUrl = (object: Record<string, A>) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    router.push(pathname + '?' + objectToQueryString(object, searchParams));
  }, [object, pathname, router, searchParams]);
};
