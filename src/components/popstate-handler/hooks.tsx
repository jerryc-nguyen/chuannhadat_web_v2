'use client';

import { useEffect } from 'react';
import { useAtom, useSetAtom } from 'jotai';
import { openModalDetail } from '@frontend/PostDetail/states/modalPostDetailAtoms';
import { removeBrowserHistoryModalsState } from './utils';
import useModals from '@mobile/modals/hooks';
import { historyPushedPathAtom } from './states';

export const useBrowserPushState = () => {
  const [currentPath, setCurrentPath] = useAtom(historyPushedPathAtom)

  const trackPushPath = (path: string) => {
    setCurrentPath(path);
  }

  const clearPushPath = () => {
    setCurrentPath(undefined)
  }

  const historyBack = () => {
    removeBrowserHistoryModalsState(currentPath)
    if (currentPath) {
      clearPushPath();
    }
  }

  return {
    trackPushPath,
    clearPushPath,
    historyBack
  }
}

export default function useBrowserPopstate() {
  const [, setCurrentPath] = useAtom(historyPushedPathAtom)
  const { closeModals: closeBtsModals } = useModals();
  const openProductDetailModal = useSetAtom(openModalDetail);

  const hideModalOnBack = (event: A) => {
    setCurrentPath(undefined);
    removeBrowserHistoryModalsState();
    closeBtsModals();
    openProductDetailModal(false);
  }

  useEffect(() => {
    window.addEventListener('popstate', hideModalOnBack);

    return () => window.removeEventListener("popstate", hideModalOnBack);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
