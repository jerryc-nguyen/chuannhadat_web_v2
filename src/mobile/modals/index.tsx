import { useAtom } from 'jotai';
import { useEffect, useRef, useState } from 'react';
import { btsRefAtom, btsModalAtom, openBtsModalAtom } from './states';
// import { BottomSheet } from 'react-spring-bottom-sheet';
// import 'react-spring-bottom-sheet/dist/style.css';
import './style.scss';
import { Drawer } from 'vaul';
// import { Toolbar } from 'konsta/react';

export default function BtsModals() {
  const btsRef = useRef(null);
  const [modal, setModal] = useAtom(btsModalAtom);
  const [_, setBtsRef] = useAtom(btsRefAtom);

  useEffect(() => {
    setBtsRef(btsRef);
  }, [setBtsRef]);

  const onClose = () => {
    if (modal?.onClosed) {
      modal.onClosed();
    }
    setModal(undefined);
  };

  const onOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Drawer.Root
      shouldScaleBackground
      open={modal != undefined}
      onOpenChange={onOpenChange}
      onClose={onClose}
    >
      <Drawer.Portal>
        <Drawer.Overlay className='fixed inset-0 bg-black/40' />
        <Drawer.Content className='bg-zinc-100 flex flex-col rounded-t-[10px] h-[96%] mt-24 fixed bottom-0 left-0 right-0'>
          <Drawer.Title className='font-medium mb-4'>
            {modal?.title}
          </Drawer.Title>
          <div className='c-bts__content'>{modal?.content}</div>
          <div className='c-bts__footer'>{modal?.footer}</div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
