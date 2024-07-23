import { useAtom } from 'jotai';
import {
  btsModal2Atom,
  btsModalAtom,
  btsModal3Atom,
} from '../states';
import { Modal } from '../states/types';

export default function useModals() {
  const [modal, setModal] = useAtom(btsModalAtom);
  const [modal2, setModal2] = useAtom(btsModal2Atom);
  const [modal3, setModal3] = useAtom(btsModal3Atom);

  const openModal = (newModal: Modal) => {
    newModal.index = 1;
    setModal(newModal);
  };

  const closeModal = () => {
    if (modal?.onClosed) {
      modal.onClosed();
    }
    setModal(undefined);
  };

  const openModal2 = (newModal: Modal) => {
    newModal.index = 2;
    setModal2(newModal);
  };

  const closeModal2 = () => {
    if (modal2?.onClosed) {
      modal2.onClosed();
    }
    setModal2(undefined);
  };

  const openModal3 = (newModal: Modal) => {
    newModal.index = 3;
    setModal3(newModal);
  };

  const closeModal3 = () => {
    if (modal3?.onClosed) {
      modal3.onClosed();
    }
    setModal3(undefined);
  };

  const closeModals = () => {
    closeModal();
    closeModal2();
    closeModal3();
  };

  return {
    openModal,
    closeModal,
    openModal2,
    closeModal2,
    openModal3,
    closeModal3,
    closeModals,
  };
}
