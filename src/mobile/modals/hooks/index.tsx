import { useAtom } from 'jotai';
import {
  btsModalAtom,
  isModalOpenning,
  openBtsModalAtom,
} from '../states';
import { Modal } from '../states/types';

export default function useModals() {
  const [modal, setModal] = useAtom(btsModalAtom);
  const [, setIsOpen] = useAtom(openBtsModalAtom);
  const openModal = (newModal: Modal) => {
    setIsOpen(true);
    setModal(newModal);
  };

  const closeModal = () => {
    setIsOpen(false);
    if (modal?.onClosed) {
      modal.onClosed();
    }
    setModal(undefined);
  };

  return {
    openModal,
    closeModal,
  };
}
