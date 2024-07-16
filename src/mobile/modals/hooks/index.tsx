import { useAtom } from 'jotai';
import { btsModalAtom, isModalOpenning } from '../states';
import { Modal } from '../states/types';

export default function useModals() {
  const [modal, setModal] = useAtom(btsModalAtom);

  const openModal = (newModal: Modal) => {
    setModal(newModal);
  };

  const closeModal = () => {
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
