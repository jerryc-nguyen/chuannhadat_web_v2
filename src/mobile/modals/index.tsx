import { useAtom } from 'jotai';

import { btsModal2Atom, btsModalAtom } from './states';
import './style.scss';
import { Drawer } from 'vaul';
import { IoCloseOutline } from 'react-icons/io5';
import { Modal } from './states/types';
import { getViewportSize } from '@utils/useViewportSize';

export function BtsModals1() {
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
          <div
            data-vaul-no-drag
            className='c-bts__content'
            style={{
              ...buildContentStyle(modal),
            }}
          >
            {modal?.content}
          </div>
          {modal?.footer && (
            <div data-vaul-no-drag className='c-bts__footer'>
              {modal?.footer}
            </div>
          )}
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

const buildContentStyle = (modal?: Modal) => {
  if (!modal) {
    return {};
  }
  const headerHeight = 50;
  const footerHeight = modal?.footer ? 50 : 0;
  const viewportSizes = getViewportSize();
  const maxHeightPercent = modal.maxHeightPercent ?? 0.6;
  const contentHeight =
    viewportSizes[1] * maxHeightPercent - headerHeight - footerHeight;
  return { height: contentHeight + 'px' };
};

export function BtsModals2() {
  const [modal, setModal] = useAtom(btsModal2Atom);

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
          <div
            data-vaul-no-drag
            className='c-bts__content'
            style={{
              ...buildContentStyle(modal),
            }}
          >
            {modal?.content}
          </div>
          {modal?.footer && (
            <div data-vaul-no-drag className='c-bts__footer'>
              {modal?.footer}
            </div>
          )}
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
