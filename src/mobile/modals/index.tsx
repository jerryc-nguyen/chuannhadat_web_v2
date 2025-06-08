import { useBrowserPushState } from '@components/popstate-handler/hooks';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@components/ui/dialog';
import { getViewportSize } from '@hooks/useViewportSize';
import { useAtom } from 'jotai';
import { useEffect, useMemo, useState } from 'react';
import { IoCloseOutline } from 'react-icons/io5';
import { Drawer } from 'vaul';
import { btsModal2Atom, btsModal3Atom, btsModalAtom } from './states';
import { Modal } from './states/types';
import './style.scss';

export const HEADER_HEIGHT = 58.59;
export const FOOTER_HEIGHT = 54.59;
export const DEFAULT_HEIGHT_PERCENT = 0.6;

function DesktopModal({
  modal,
  onOpenChange,
}: {
  modal: Modal;
  onOpenChange: (open: boolean) => void;
}) {
  const dialogClass = modal.allowChildOverflow ? '' : 'overflow-y-auto';
  return (
    <Dialog open={modal != undefined} onOpenChange={onOpenChange}>
      <DialogTrigger asChild></DialogTrigger>
      <DialogContent className={`max-h-[80vh] sm:max-w-[425px] ${dialogClass}`}>
        <DialogHeader>
          <DialogTitle>{modal.title}</DialogTitle>
          <DialogDescription>{modal.titleDescription}</DialogDescription>
        </DialogHeader>
        <div className={`${modal?.dialogContentWrapClass}`}>{modal?.content}</div>
        {modal?.footer && <DialogFooter>{modal?.footer}</DialogFooter>}
      </DialogContent>
    </Dialog>
  );
}

export function BtsModals1() {
  const { historyBack } = useBrowserPushState();
  const [modal, setModal] = useAtom(btsModalAtom);
  const [contentStyle, setContentStyle] = useState({});

  useEffect(() => {
    function handleResize() {
      setContentStyle(buildContentStyle(modal));
    }

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const onClose = () => {
    if (modal?.onClosed) {
      modal.onClosed();
    }

    setModal(undefined);

    if (modal?.supportPushState) {
      historyBack();
    }
  };

  const onOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  const headerClass = useMemo(() => {
    return buildHeaderClass(modal);
  }, [modal]);

  if (modal?.showAsDialog) {
    return <DesktopModal modal={modal} onOpenChange={onOpenChange} />;
  } else {
    return (
      <Drawer.Root
        shouldScaleBackground
        open={modal != undefined}
        onOpenChange={onOpenChange}
        onClose={onClose}
        repositionInputs={false}
      >
        <Drawer.Portal>
          <Drawer.Overlay className="c-bts__overlay1 fixed inset-0 bg-black/40" />
          <Drawer.Content className="fixed bottom-0 left-0 right-0 mt-24 flex flex-col rounded-t-[10px]">
            <div className={`c-bts__header flex items-center justify-between ${headerClass}`}>
              <Drawer.Title className="c-bts__title w-full">{modal?.title}</Drawer.Title>
              <button onClick={onClose} className="c-bts__close">
                <IoCloseOutline size={30} />
              </button>
            </div>
            <div
              data-vaul-no-drag
              className="c-bts__content"
              style={{ ...buildContentStyle(modal), ...contentStyle }}
            >
              <div className={`${modal?.btsContentWrapClass}`}>{modal?.content}</div>
            </div>
            {modal?.footer && !modal?.portalFooter && (
              <div data-vaul-no-drag className="c-bts__footer">
                {modal?.footer}
              </div>
            )}

            {modal?.footer && modal?.portalFooter && (
              <Drawer.Portal>
                <div data-vaul-no-drag className="c-bts__footer is-portal">
                  {modal?.footer}
                </div>
              </Drawer.Portal>
            )}
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    );
  }
}

export const buildContentStyle = (modal?: Modal) => {
  if (!modal) {
    return {};
  }

  const headerHeight = modal?.headerHeight ?? HEADER_HEIGHT;
  let footerHeight = modal?.footerHeight ?? FOOTER_HEIGHT;

  const viewportSizes = getViewportSize();
  const maxHeightPercent = modal.maxHeightPercent ?? DEFAULT_HEIGHT_PERCENT;
  footerHeight = modal?.footer ? footerHeight : 0;
  let contentHeight = modal.defaultContentHeight;

  if (!modal.defaultContentHeight) {
    contentHeight = viewportSizes[1] * maxHeightPercent - headerHeight - footerHeight;
  }

  return { height: contentHeight + 'px', overflow: modal?.isHiddenScroll ? 'hidden' : 'scroll-y' };
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

  if (modal?.showAsDialog) {
    return <DesktopModal modal={modal} onOpenChange={onOpenChange} />;
  } else {
    return (
      <Drawer.Root
        open={modal != undefined}
        onOpenChange={onOpenChange}
        onClose={onClose}
        repositionInputs={false}
      >
        <Drawer.Portal>
          <Drawer.Overlay className={`c-bts__overlay2 fixed inset-0 bg-black/40`} />
          <Drawer.Content className="fixed bottom-0 left-0 right-0 mt-24 flex flex-col rounded-t-[10px]">
            <div className={`c-bts__header flex items-center justify-between ${headerClass}`}>
              <Drawer.Title className="c-bts__title">{modal?.title}</Drawer.Title>
              <button onClick={onClose} className="c-bts__close">
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
              <div className={`${modal?.btsContentWrapClass}`}>{modal?.content}</div>
            </div>
            {modal?.footer && (
              <div data-vaul-no-drag className="c-bts__footer">
                {modal?.footer}
              </div>
            )}
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    );
  }
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

  if (modal?.showAsDialog) {
    return <DesktopModal modal={modal} onOpenChange={onOpenChange} />;
  } else {
    return (
      <Drawer.Root
        open={modal != undefined}
        onOpenChange={onOpenChange}
        onClose={onClose}
        repositionInputs={false}
      >
        <Drawer.Portal>
          <Drawer.Overlay className={`c-bts__overlay3 fixed inset-0 bg-black/40`} />
          <Drawer.Content className="fixed bottom-0 left-0 right-0 mt-24 flex flex-col rounded-t-[10px]">
            <div className={`c-bts__header flex items-center justify-between ${headerClass}`}>
              <Drawer.Title className="c-bts__title">{modal?.title}</Drawer.Title>
              <button onClick={onClose} className="c-bts__close">
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
              <div className={`${modal?.btsContentWrapClass}`}>{modal?.content}</div>
            </div>
            {modal?.footer && (
              <div data-vaul-no-drag className="c-bts__footer">
                {modal?.footer}
              </div>
            )}
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    );
  }
}
