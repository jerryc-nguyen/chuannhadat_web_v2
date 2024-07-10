import { useAtom } from 'jotai';
import { useCallback, useMemo } from 'react';
import { Modal } from '../states/types';
import { Content, Footer } from 'react-sheet-slide';
import { btsModalAtom } from '../states';

export default function useModalBuilder(
  activeModal: Modal | undefined
) {
  const [modal, setModal] = useAtom(btsModalAtom);

  const title = useMemo(() => {
    return 'Modal Title 3';
  }, []);

  const content = useMemo(() => {
    return (
      <>
        <div>Add more storage to keep everything on online</div>
        <div>
          Online includes plenty of storage to keep all your data safe
          and features to protect your privacy.
        </div>
        <div>Learn More About Online</div>
        <div>Add more storage to keep everything on online</div>
        <div>
          Online includes plenty of storage to keep all your data safe
          and features to protect your privacy.
        </div>
        <div>Learn More About Online</div>
      </>
    );
  }, []);

  const footer = useMemo(() => {
    return (
      <button
        type='button'
        onClick={() => {
          setModal(undefined);
        }}
      >
        Close
      </button>
    );
  }, []);
  return { title, content, footer };
}
