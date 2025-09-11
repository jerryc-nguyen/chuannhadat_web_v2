'use client';
import { BtsModals1, BtsModals2, BtsModals3 } from '@components/features/layout/mobile-modals';
import ModalPostDetail from '@frontend/PostDetail/components/modal-post-detail';
import SidePanel from './features/layout/SidePanel';
import useBrowserPopstate from './features/navigation/popstate-handler/hooks';
import ConfirmEmailModal from './ui/ConfirmEmailModal';
import DepositModal from './ui/DepositModal';
import { YoutubePlayerModal } from './features/media/youtube-player-modal';

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
