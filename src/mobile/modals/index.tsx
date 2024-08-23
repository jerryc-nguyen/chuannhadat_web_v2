import { useAtom } from 'jotai';

import {
  btsModal2Atom,
  btsModal3Atom,
  btsModalAtom,
} from './states';
import './style.scss';
import { Drawer } from 'vaul';
import { IoCloseOutline } from 'react-icons/io5';
import { Modal } from './states/types';
import { getViewportSize } from '@hooks/useViewportSize';
import { useMemo } from 'react';

export const HEADER_HEIGHT = 58.59;
export const FOOTER_HEIGHT = 54.59;
export const DEFAULT_HEIGHT_PERCENT = 0.6;

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

  const headerClass = useMemo(() => {
    return buildHeaderClass(modal);
  }, [modal]);

  return (
    <Drawer.Root
      shouldScaleBackground
      open={modal != undefined}
      onOpenChange={onOpenChange}
      onClose={onClose}
    >
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 c-bts__overlay1" />
        <Drawer.Content className="flex flex-col rounded-t-[10px] mt-24 fixed bottom-0 left-0 right-0">
          <div
            className={`c-bts__header flex justify-between items-center ${headerClass}`}
          >
            <Drawer.Title className="c-bts__title">
              {modal?.title}
            </Drawer.Title>
            <button
              onClick={onClose}
              className="c-bts__close"
            >
              <IoCloseOutline size={30} />
            </button>
          </div>
          <div
            data-vaul-no-drag
            className="c-bts__content"
            style={{
              ...buildContentStyle(modal),
            }}
          >
            {modal?.content}
          </div>
          {modal?.footer && (
            <div
              data-vaul-no-drag
              className="c-bts__footer"
            >
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

  const viewportSizes = getViewportSize();
  const maxHeightPercent =
    modal.maxHeightPercent ?? DEFAULT_HEIGHT_PERCENT;
  const footerHeight = modal?.footer ? FOOTER_HEIGHT : 0;
  let contentHeight = modal.defaultContentHeight;

  if (!modal.defaultContentHeight) {
    contentHeight =
      viewportSizes[1] * maxHeightPercent -
      HEADER_HEIGHT -
      footerHeight;
  }

  return { height: contentHeight + 'px' };
};

const buildHeaderClass = (modal?: Modal) => {
  if (!modal) {
    return '';
  }
  return modal.maxHeightPercent == 1 ? 'isFull' : '';
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

  const headerClass = useMemo(() => {
    return buildHeaderClass(modal);
  }, [modal]);

  return (
    <Drawer.Root
      open={modal != undefined}
      onOpenChange={onOpenChange}
      onClose={onClose}
    >
      <Drawer.Portal>
        <Drawer.Overlay
          className={`fixed inset-0 bg-black/40 c-bts__overlay2`}
        />
        <Drawer.Content className="flex flex-col rounded-t-[10px] mt-24 fixed bottom-0 left-0 right-0">
          <div
            className={`c-bts__header flex justify-between items-center ${headerClass}`}
          >
            <Drawer.Title className="c-bts__title">
              {modal?.title}
            </Drawer.Title>
            <button
              onClick={onClose}
              className="c-bts__close"
            >
              <IoCloseOutline size={30} />
            </button>
          </div>
          <div
            data-vaul-no-drag
            className="c-bts__content"
            style={{
              ...buildContentStyle(modal),
            }}
          >
            {modal?.content}
          </div>
          {modal?.footer && (
            <div
              data-vaul-no-drag
              className="c-bts__footer"
            >
              {modal?.footer}
            </div>
          )}
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

export function BtsModals3() {
  const [modal, setModal] = useAtom(btsModal3Atom);

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

  const headerClass = useMemo(() => {
    return buildHeaderClass(modal);
  }, [modal]);

  return (
    <Drawer.Root
      open={modal != undefined}
      onOpenChange={onOpenChange}
      onClose={onClose}
    >
      <Drawer.Portal>
        <Drawer.Overlay
          className={`fixed inset-0 bg-black/40 c-bts__overlay3`}
        />
        <Drawer.Content className="flex flex-col rounded-t-[10px] mt-24 fixed bottom-0 left-0 right-0">
          <div
            className={`c-bts__header flex justify-between items-center ${headerClass}`}
          >
            <Drawer.Title className="c-bts__title">
              {modal?.title}
            </Drawer.Title>
            <button
              onClick={onClose}
              className="c-bts__close"
            >
              <IoCloseOutline size={30} />
            </button>
          </div>
          <div
            data-vaul-no-drag
            className="c-bts__content"
            style={{
              ...buildContentStyle(modal),
            }}
          >
            {modal?.content}
          </div>
          {modal?.footer && (
            <div
              data-vaul-no-drag
              className="c-bts__footer"
            >
              {modal?.footer}
            </div>
          )}
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
