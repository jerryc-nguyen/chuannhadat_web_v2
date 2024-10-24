'use client';

import { BtsModals1, BtsModals2, BtsModals3 } from '@mobile/modals';
import SidePanel from './SidePanel';
import useBrowserPopstate from './popstate-handler/hooks';
import ModalPostDetail from '@desktop/post-detail/components/modal-post-detail';

export default function ListModal() {
  useBrowserPopstate();

  return (
    <>
      <BtsModals1 />
      <BtsModals2 />
      <BtsModals3 />
      <SidePanel />
      <ModalPostDetail />
    </>
  );
}
