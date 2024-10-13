import { useAtom } from 'jotai';
import { btsModal2Atom, btsModalAtom, btsModal3Atom } from '../states';
import { Modal } from '../states/types';
import { updateCurrentUrlSearchParams } from '@common/utils';

export default function useModals() {
  const [modal, setModal] = useAtom(btsModalAtom);
  const [modal2, setModal2] = useAtom(btsModal2Atom);
  const [modal3, setModal3] = useAtom(btsModal3Atom);
  
  const syncModalsStateToUrl = (pushToPath?: string) => {
    if (window.location.href.indexOf('bts') == -1 && !pushToPath) {
      const newUrl = updateCurrentUrlSearchParams({ bts: true });
      window.history.pushState({}, '', newUrl);
    }
    if (pushToPath) {
      window.history.pushState({}, '', pushToPath);
    }
  }

  const openModal = (newModal: Modal) => {
    setModal(newModal);
    syncModalsStateToUrl(newModal?.pushToPath);
  };

  const closeModal = () => {
    if (modal?.onClosed) {
      modal.onClosed();
    }
    setModal(undefined);
  };

  const openModal2 = (newModal: Modal) => {
    setModal2(newModal);
    syncModalsStateToUrl(newModal?.pushToPath);
  };

  const closeModal2 = () => {
    if (modal2?.onClosed) {
      modal2.onClosed();
    }
    setModal2(undefined);
  };

  const openModal3 = (newModal: Modal) => {
    setModal3(newModal);
    syncModalsStateToUrl(newModal?.pushToPath);
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
