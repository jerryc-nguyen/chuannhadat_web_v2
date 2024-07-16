import { useAtom } from 'jotai';
import { btsModalAtom } from '../states';

export default function useModals() {
  const [modal, setModal] = useAtom(btsModalAtom);
  const closeModal = () => {
    if (modal?.onClosed) {
      modal.onClosed();
    }
    setModal(undefined);
  };

  return {
    closeModal,
  };
}
