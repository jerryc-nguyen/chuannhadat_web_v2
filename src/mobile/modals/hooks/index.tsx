import { useAtom } from 'jotai';
import { btsModalAtom } from '../states';

export default function useModals() {
  const [modal, setModal] = useAtom(btsModalAtom);
  const closeModal = () => {
    if (modal?.onAfterClose) {
      modal.onAfterClose();
    }
    setModal(undefined);
  };

  return {
    closeModal,
  };
}
