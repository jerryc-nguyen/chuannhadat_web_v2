import { TLoadedCardAuthors, loadedCardAuthorsAtom, TCardAuthor } from '../states';
import { useAtom } from 'jotai';

export default function useCardAuthors() {
  const [allAuthors, setAllAuthors] = useAtom(loadedCardAuthorsAtom);

  const appendCardAuthors = (authors: TLoadedCardAuthors) => {
    setAllAuthors({ ...allAuthors, ...authors });
  };

  const getAuthorById = (id: string): TCardAuthor | undefined => {
    return allAuthors[id];
  };

  return {
    appendCardAuthors,
    getAuthorById,
  };
}
