'use client';

import { Suspense, lazy } from 'react';
import { useAtomValue } from 'jotai';
import useBrowserPopstate from './popstate-handler/hooks';

// Dynamic imports for ALL modal components (including BtsModals)
const BtsModals1 = lazy(() => import('@mobile/modals').then(module => ({
  default: module.BtsModals1
})));
const BtsModals2 = lazy(() => import('@mobile/modals').then(module => ({
  default: module.BtsModals2
})));
const BtsModals3 = lazy(() => import('@mobile/modals').then(module => ({
  default: module.BtsModals3
})));

// Dynamic imports for heavy components
const DepositModal = lazy(() => import('./ui/DepositModal'));
const ModalPostDetail = lazy(() => import('@views/post-detail/components/modal-post-detail'));
const YoutubePlayerModal = lazy(() =>
  import('./youtube-player-modal/YoutubePlayerModal').then(module => ({
    default: module.YoutubePlayerModal
  }))
);

// Lightweight components - keep static
import SidePanel from './SidePanel';
import ConfirmEmailModal from './ui/ConfirmEmailModal';

// State imports
import { btsModalAtom, btsModal2Atom, btsModal3Atom } from '@mobile/modals/states';
import { openModalDetail } from '@views/post-detail/states/modalPostDetailAtoms';
import { openModalDepositAtom } from '@views/dashboard/states/depositAtoms';
import { youtubePlayerAtom } from './youtube-player-modal/state';

// Optimized loading fallback
const ModalLoader = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center">
    <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
  </div>
);

export default function ImprovedListModal() {
  useBrowserPopstate();

  // Check if any BtsModals are open
  const btsModal1 = useAtomValue(btsModalAtom);
  const btsModal2 = useAtomValue(btsModal2Atom);
  const btsModal3 = useAtomValue(btsModal3Atom);

  // Check heavy modal states
  const isPostDetailOpen = useAtomValue(openModalDetail);
  const isDepositModalOpen = useAtomValue(openModalDepositAtom);
  const youtubeState = useAtomValue(youtubePlayerAtom);

  return (
    <>
      {/* Always render lightweight modals */}
      <SidePanel />
      <ConfirmEmailModal />

      {/* Dynamically load BtsModals only when needed */}
      {btsModal1 && (
        <Suspense fallback={<ModalLoader />}>
          <BtsModals1 />
        </Suspense>
      )}

      {btsModal2 && (
        <Suspense fallback={<ModalLoader />}>
          <BtsModals2 />
        </Suspense>
      )}

      {btsModal3 && (
        <Suspense fallback={<ModalLoader />}>
          <BtsModals3 />
        </Suspense>
      )}

      {/* Dynamically load heavy modals */}
      {isPostDetailOpen && (
        <Suspense fallback={<ModalLoader />}>
          <ModalPostDetail />
        </Suspense>
      )}

      {isDepositModalOpen && (
        <Suspense fallback={<ModalLoader />}>
          <DepositModal />
        </Suspense>
      )}

      {youtubeState?.isShow && (
        <Suspense fallback={<ModalLoader />}>
          <YoutubePlayerModal />
        </Suspense>
      )}
    </>
  );
} 
