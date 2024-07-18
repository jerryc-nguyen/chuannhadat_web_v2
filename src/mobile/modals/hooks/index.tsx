import { useAtom } from 'jotai';
import { btsModal2Atom, btsModalAtom } from '../states';
import { Modal } from '../states/types';

export default function useModals() {
  const [modal, setModal] = useAtom(btsModalAtom);
  const [modal2, setModal2] = useAtom(btsModal2Atom);

  const openModal = (newModal: Modal) => {
    setModal(newModal);
  };

  const closeModal = () => {
    if (modal?.onClosed) {
      modal.onClosed();
    }
    setModal(undefined);
  };

  const openModal2 = (newModal: Modal) => {
    setModal2(newModal);
  };

  const closeModal2 = () => {
    if (modal2?.onClosed) {
      modal2.onClosed();
    }
    setModal2(undefined);
  };

  return {
    openModal,
    closeModal,
    openModal2,
    closeModal2,
  };
}
