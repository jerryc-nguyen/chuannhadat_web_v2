'use client';

import { toParamsApi } from '@api/searchApi';
import { usePathname } from 'next/navigation';

function useSyncParamsToState() {
  const currentPage = usePathname();
  console.log('currentPage', currentPage);

  const syncSearchParamsToState = function () {
    const params = { path: currentPage };
    toParamsApi(params)
      .then((response) => response.json())
      .then((response) => {
        const { data } = response;
        if (data) {
          console.log(data);
        }
      });
  };

  return {
    syncSearchParamsToState,
  };
}

export { useSyncParamsToState };
