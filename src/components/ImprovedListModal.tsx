'use client';

import React, { Suspense, lazy, useState, useEffect } from 'react';
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

/**
 * ImprovedListModal - Enhanced modal manager with smooth close animations
 * 
 * This component manages all modals in the application and provides smooth closing animations
 * by keeping modals rendered for a short period (350ms) after they're meant to close,
 * allowing their internal animations to complete before unmounting.
 * 
 * Features:
 * - Immediate opening (no delay when modal opens)
 * - Delayed unmounting (350ms delay when modal closes to allow animations)
 * - Lazy loading for heavy modals to improve performance
 * - Centralized modal state management
 */
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

  // Track which modals should stay visible during close animations
  const [showBtsModal1, setShowBtsModal1] = useState(false);
  const [showBtsModal2, setShowBtsModal2] = useState(false);
  const [showBtsModal3, setShowBtsModal3] = useState(false);
  const [showPostDetail, setShowPostDetail] = useState(false);
  const [showDeposit, setShowDeposit] = useState(false);
  const [showYoutube, setShowYoutube] = useState(false);
  const delayAnimation = 500;
  // BtsModal1 state management with delayed hiding
  useEffect(() => {
    if (btsModal1) {
      setShowBtsModal1(true);
    } else if (showBtsModal1) {
      const timer = setTimeout(() => setShowBtsModal1(false), delayAnimation);
      return () => clearTimeout(timer);
    }
  }, [btsModal1, showBtsModal1]);

  // BtsModal2 state management with delayed hiding
  useEffect(() => {
    if (btsModal2) {
      setShowBtsModal2(true);
    } else if (showBtsModal2) {
      const timer = setTimeout(() => setShowBtsModal2(false), delayAnimation);
      return () => clearTimeout(timer);
    }
  }, [btsModal2, showBtsModal2]);

  // BtsModal3 state management with delayed hiding
  useEffect(() => {
    if (btsModal3) {
      setShowBtsModal3(true);
    } else if (showBtsModal3) {
      const timer = setTimeout(() => setShowBtsModal3(false), delayAnimation);
      return () => clearTimeout(timer);
    }
  }, [btsModal3, showBtsModal3]);

  // PostDetail modal state management with delayed hiding
  useEffect(() => {
    if (isPostDetailOpen) {
      setShowPostDetail(true);
    } else if (showPostDetail) {
      const timer = setTimeout(() => setShowPostDetail(false), delayAnimation);
      return () => clearTimeout(timer);
    }
  }, [isPostDetailOpen, showPostDetail]);

  // Deposit modal state management with delayed hiding
  useEffect(() => {
    if (isDepositModalOpen) {
      setShowDeposit(true);
    } else if (showDeposit) {
      const timer = setTimeout(() => setShowDeposit(false), delayAnimation);
      return () => clearTimeout(timer);
    }
  }, [isDepositModalOpen, showDeposit]);

  // Youtube modal state management with delayed hiding
  useEffect(() => {
    if (youtubeState?.isShow) {
      setShowYoutube(true);
    } else if (showYoutube) {
      const timer = setTimeout(() => setShowYoutube(false), delayAnimation);
      return () => clearTimeout(timer);
    }
  }, [youtubeState?.isShow, showYoutube]);

  return (
    <>
      {/* Always render lightweight modals */}
      <SidePanel />
      <ConfirmEmailModal />

      {/* Dynamically load BtsModals only when needed */}
      {showBtsModal1 && (
        <Suspense fallback={<ModalLoader />}>
          <BtsModals1 />
        </Suspense>
      )}

      {showBtsModal2 && (
        <Suspense fallback={<ModalLoader />}>
          <BtsModals2 />
        </Suspense>
      )}

      {showBtsModal3 && (
        <Suspense fallback={<ModalLoader />}>
          <BtsModals3 />
        </Suspense>
      )}

      {/* Dynamically load heavy modals */}
      {showPostDetail && (
        <Suspense fallback={<ModalLoader />}>
          <ModalPostDetail />
        </Suspense>
      )}

      {showDeposit && (
        <Suspense fallback={<ModalLoader />}>
          <DepositModal />
        </Suspense>
      )}

      {showYoutube && (
        <Suspense fallback={<ModalLoader />}>
          <YoutubePlayerModal />
        </Suspense>
      )}
    </>
  );
} 
