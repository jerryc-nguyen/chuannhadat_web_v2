'use client';

import React, { useState, useEffect } from 'react';
import { useAtomValue } from 'jotai';
import useBrowserPopstate from '@frontend/features/navigation/popstate-handler/hooks';

// Temporary: Use direct imports to isolate webpack runtime issue
import { BtsModals1, BtsModals2, BtsModals3 } from '@frontend/features/layout/mobile-modals';

// Temporary: Use direct imports to isolate webpack runtime issue
import { DepositModal } from '../app/dashboard/_components/features/payments';
import ModalPostDetail from '@frontend/PostDetail/components/modal-post-detail';
import { YoutubePlayerModal } from '@frontend/features/media/youtube-player-modal/YoutubePlayerModal';

// Lightweight components - keep static
import SidePanel from '@frontend/features/layout/SidePanel';
import ConfirmEmailModal from './ui/ConfirmEmailModal';

// State imports
import { btsModalAtom, btsModal2Atom, btsModal3Atom } from '@frontend/features/layout/mobile-modals/states';
import { openModalDetail } from '@frontend/PostDetail/states/modalPostDetailAtoms';
import { openModalDepositAtom } from '@dashboard/features/payments/states';
import { youtubePlayerAtom } from '@frontend/features/media/youtube-player-modal/state';

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

      {/* Temporary: Direct rendering to isolate webpack runtime issue */}
      {showBtsModal1 && <BtsModals1 />}
      {showBtsModal2 && <BtsModals2 />}
      {showBtsModal3 && <BtsModals3 />}
      {showPostDetail && <ModalPostDetail />}
      {showDeposit && <DepositModal />}
      {showYoutube && <YoutubePlayerModal />}
    </>
  );
} 
