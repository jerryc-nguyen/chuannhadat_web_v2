'use client';

import { useEffect } from 'react';
import { BtsModals1, BtsModals2, BtsModals3 } from '@mobile/modals';
import SidePanel from './SidePanel';
import useModals from '@mobile/modals/hooks';
import { removePopupState } from '@common/utils';

export default function ListModal() {
  const { closeModals } = useModals();

  const hideModalOnBack = (event: A) => {
    closeModals();
    removePopupState();
  }

  useEffect(() => {
    window.addEventListener('popstate', hideModalOnBack);

    return () => window.removeEventListener("popstate", hideModalOnBack);
  }, [])

  return (
    <>
      <BtsModals1 />
      <BtsModals2 />
      <BtsModals3 />
      <SidePanel />
    </>
  );
}
