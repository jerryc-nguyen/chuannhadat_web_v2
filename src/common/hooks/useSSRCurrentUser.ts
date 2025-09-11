'use client';

import { profileApi } from '@dashboard/AccountDetail/api/profile';
import { getTokenClient } from '@common/cookies';
import { currentUserAtom } from '@components/features/auth/mobile/states';
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { useHydrateAtoms } from 'jotai/utils';

export default function useSSRCurrentUser() {
  const authHeaders = {
    Authorization: getTokenClient(),
  };
  const { data } = useSuspenseQuery(
    queryOptions({
      queryKey: ['ssrCurrentUserInfo', authHeaders],
      queryFn: () => {
        return profileApi.getMyProfile();
      },
      staleTime: 0,
    }),
  );
  useHydrateAtoms([[currentUserAtom, data.data]]);
}
