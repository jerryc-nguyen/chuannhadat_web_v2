import { useAtom } from 'jotai';

import { btsModalAtom } from './states';
import './style.scss';
import { Drawer } from 'vaul';

export default function BtsModals() {
  const [modal, setModal] = useAtom(btsModalAtom);

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
