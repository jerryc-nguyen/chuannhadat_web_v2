'use client';
import { BtsModals1, BtsModals2, BtsModals3 } from '@frontend/features/layout/mobile-modals';
import ModalPostDetail from '@frontend/PostDetail/components/modal-post-detail';
import SidePanel from '@frontend/features/layout/SidePanel';
import useBrowserPopstate from '@frontend/features/navigation/popstate-handler/hooks';
import ConfirmEmailModal from './ui/ConfirmEmailModal';
import { DepositModal } from '../app/dashboard/_components/features/payments';
import { YoutubePlayerModal } from '@frontend/features/media/youtube-player-modal';

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
