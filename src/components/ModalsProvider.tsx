'use client';

import { BtsModals1, BtsModals2, BtsModals3 } from '@mobile/modals';
import SidePanel from './SidePanel';

export default function ModalsProvider() {
  return (
    <>
      <BtsModals1 />
      <BtsModals2 />
      <BtsModals3 />
      <SidePanel />
    </>
  );
}
