import { TCardAuthor, TLoadedCardAuthors, loadedCardAuthorsAtom } from '../states';
import { useAtom } from 'jotai';
import { useCallback } from 'react';

export default function useCardAuthors() {
  const [allAuthors, setAllAuthors] = useAtom(loadedCardAuthorsAtom);

  // ✅ Memoize appendCardAuthors to prevent unnecessary re-renders
  const appendCardAuthors = useCallback((authors: TLoadedCardAuthors) => {
    setAllAuthors(prevAuthors => ({ ...prevAuthors, ...authors }));
  }, [setAllAuthors]);

  // ✅ Memoize getAuthorById for consistency
  const getAuthorById = useCallback((id: number): TCardAuthor | undefined => {
    return allAuthors[id] as unknown as TCardAuthor;
  }, [allAuthors]);

  return {
    appendCardAuthors,
    getAuthorById,
  };
}
