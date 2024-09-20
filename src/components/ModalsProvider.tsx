'use client';

import { BtsModals1, BtsModals2, BtsModals3 } from '@mobile/modals';
import SidePanel from './SidePanel';

export default function ModalsProvider(props: any) {
  return (
    <>
      {props.children}
      <BtsModals1 />
      <BtsModals2 />
      <BtsModals3 />
      <SidePanel />
    </>
  );
}
