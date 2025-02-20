import { TCardAuthor, TLoadedCardAuthors, loadedCardAuthorsAtom } from '../states';
import { useAtom } from 'jotai';

export default function useCardAuthors() {
  const [allAuthors, setAllAuthors] = useAtom(loadedCardAuthorsAtom);

  const appendCardAuthors = (authors: TLoadedCardAuthors) => {
    setAllAuthors({ ...allAuthors, ...authors });
  };

  const getAuthorById = (id: number): TCardAuthor | undefined => {
    return allAuthors[id] as unknown as TCardAuthor;
  };

  return {
    appendCardAuthors,
    getAuthorById,
  };
}
