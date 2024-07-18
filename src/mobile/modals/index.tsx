import { useAtom } from 'jotai';

import { btsModalAtom } from './states';
import './style.scss';
import { Drawer } from 'vaul';
import { IoCloseOutline } from 'react-icons/io5';

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
        <Drawer.Content className='flex flex-col rounded-t-[10px] h-[96%] mt-24 fixed bottom-0 left-0 right-0'>
          <div className='c-bts__header flex justify-between items-center'>
            <Drawer.Title className='c-bts__title'>
              {modal?.title}
            </Drawer.Title>
            <button onClick={onClose} className='c-bts__close'>
              <IoCloseOutline size={30} />
            </button>
          </div>
          <div data-vaul-no-drag className='c-bts__content'>
            {modal?.content}
          </div>
          <div data-vaul-no-drag className='c-bts__footer'>
            {modal?.footer}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
