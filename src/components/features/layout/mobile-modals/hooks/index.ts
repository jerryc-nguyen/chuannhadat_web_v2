import { useAtom } from 'jotai';
import { btsModal2Atom, btsModalAtom, btsModal3Atom } from '../states';
import { Modal } from '../states/types';

import { useBrowserPushState } from '@components/features/navigation/popstate-handler/hooks';
import { updateCurrentUrlSearchParams } from '@components/features/navigation/popstate-handler/utils';

export default function useModals() {
  const { trackPushPath } = useBrowserPushState();

  const [modal, setModal] = useAtom(btsModalAtom);
  const [modal2, setModal2] = useAtom(btsModal2Atom);
  const [modal3, setModal3] = useAtom(btsModal3Atom);

  // use param: bts to mark there is an new virtual page / modal was openned 
  // so when user hit back, we can close virtual / modal 
  const syncModalsStateToUrl = (modal: Modal) => {
    if (modal.pushToPath) {
      trackPushPath(modal.pushToPath);
      window.history.pushState({}, '', modal.pushToPath);
    } else if (window.location.href.indexOf('bts') == -1) {
      const newUrl = updateCurrentUrlSearchParams({ bts: true });
      trackPushPath(newUrl);
      window.history.pushState({}, '', newUrl);
    }
  }

  const openModal = (modal: Modal) => {
    setModal(modal);
    if (modal?.supportPushState || modal?.supportPushState == undefined) {
      syncModalsStateToUrl(modal);
    }

  };

  const closeModal = () => {
    if (modal?.onClosed) {
      modal.onClosed();
    }
    setModal(undefined);
  };

  const openModal2 = (modal: Modal) => {
    setModal2(modal);
  };

  const closeModal2 = () => {
    if (modal2?.onClosed) {
      modal2.onClosed();
    }
    setModal2(undefined);
  };

  const openModal3 = (modal: Modal) => {
    setModal3(modal);
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
