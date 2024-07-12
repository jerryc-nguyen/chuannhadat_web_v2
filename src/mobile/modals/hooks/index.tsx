import { useAtom } from 'jotai';
import { btsModalAtom } from '../states';

export default function useModals() {
  const [, setModal] = useAtom(btsModalAtom);
  const closeModal = () => {
    setModal(undefined);
  };

  return {
    closeModal,
  };
}
