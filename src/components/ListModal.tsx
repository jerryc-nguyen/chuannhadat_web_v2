'use client';

import { BtsModals1, BtsModals2, BtsModals3 } from '@mobile/modals';
import SidePanel from './SidePanel';
import useBrowserPopstate from './popstate-handler/hooks';
// import ModalPostDetail from '@desktop/post-detail/components/modal-post-detail';
import ConfirmEmailModal from './ui/ConfirmEmailModal';
import DepositModal from './ui/DepositModal';
import { Fragment } from 'react';

export default function ListModal() {
  useBrowserPopstate();
  return (
    <Fragment>
      <BtsModals1 />
      <BtsModals2 />
      <BtsModals3 />
      <SidePanel />
      {/* <ModalPostDetail /> */}
      <ConfirmEmailModal />
      <DepositModal />
    </Fragment>
  );
}
