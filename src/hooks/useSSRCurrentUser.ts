'use client';

import { services } from '@api/services';
import { getToken } from '@common/cookies';
import { currentUserAtom } from '@mobile/auth/states';
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { useHydrateAtoms } from 'jotai/utils';

export default function useSSRCurrentUser() {
  const authHeaders = {
    Authorization: getToken(),
  };
  const { data } = useSuspenseQuery(
    queryOptions({
      queryKey: ['ssrCurrentUserInfo', authHeaders],
      queryFn: () => {
        return services.profiles.getMyProfile(authHeaders);
      },
      staleTime: 0,
    }),
  );
  useHydrateAtoms([[currentUserAtom, data.data]]);
}
