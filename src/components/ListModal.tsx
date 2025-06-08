'use client';
import { BtsModals1, BtsModals2, BtsModals3 } from '@mobile/modals';
import ModalPostDetail from '@views/post-detail/components/modal-post-detail';
import SidePanel from './SidePanel';
import useBrowserPopstate from './popstate-handler/hooks';
import ConfirmEmailModal from './ui/ConfirmEmailModal';
import DepositModal from './ui/DepositModal';
import { YoutubePlayerModal } from './youtube-player-modal';

export default function ListModal() {
  useBrowserPopstate();
  return (
    <>
      <BtsModals1 />
      <BtsModals2 />
      <BtsModals3 />
      <SidePanel />
      <ModalPostDetail />
      <ConfirmEmailModal />
      <DepositModal />
      <YoutubePlayerModal />
    </>
  );
}
