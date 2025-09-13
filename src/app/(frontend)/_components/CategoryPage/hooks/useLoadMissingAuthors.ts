import { useHydrateAtoms } from 'jotai/utils';
import { loadedCardAuthorsAtom } from '../states';
import useCardAuthors from './useCardAuthors';
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { cardAuthors } from '@common/api/searchApi';

export default function useLoadMissingAuthors(data: A) {
  useHydrateAtoms([[loadedCardAuthorsAtom, data?.users || {}]]);
  const { appendCardAuthors } = useCardAuthors();
  useEffect(() => {
    if (data?.users) {
      appendCardAuthors(data?.users);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.users]);

  const { data: missingAuthors, isSuccess } = useQuery({
    queryKey: ['missing-card-authors', data.missing_user_ids],
    queryFn: () => cardAuthors({ user_ids: data.missing_user_ids.join(',') }),
    enabled: !!data.missing_user_ids,
    select: (data) => data.data,
  });

  useEffect(() => {
    if (missingAuthors && isSuccess) {
      appendCardAuthors(missingAuthors);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);
}
