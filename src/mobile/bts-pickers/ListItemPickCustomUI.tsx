import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerOverlay,
  DrawerTitle,
  DrawerTrigger,
} from '@components/ui/drawer';
import { buildContentStyle } from '@mobile/modals';
import { Modal } from '@mobile/modals/states/types';
import { SetStateAction } from 'jotai';
import { Dispatch, useMemo, useState } from 'react';
import { IoCloseOutline } from 'react-icons/io5';

type ListItemPickCustomUIProps = {
  trigger: React.ReactNode;
  content:
    | React.ReactNode
    | (({
        setIsOpen,
        isOpen,
      }: {
        setIsOpen: Dispatch<SetStateAction<boolean>>;
        isOpen: boolean;
      }) => React.ReactNode);
  modalOptions?: Modal;
};

export const ListItemPickCustomUI = ({
  trigger,
  content,
  modalOptions,
}: ListItemPickCustomUIProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const isStringTitle = useMemo(() => {
    return typeof modalOptions?.title === 'string';
  }, [modalOptions]);

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerOverlay className="c-bts__overlay1 fixed inset-0 bg-black/40" />
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent className="fixed bottom-0 left-0 right-0 mt-24 flex flex-col rounded-t-[10px]">
        <div className={`c-bts__header flex items-center justify-between`}>
          {isStringTitle && (
            <DrawerTitle className="c-bts__title">{modalOptions?.title}</DrawerTitle>
          )}
          {!isStringTitle && <div className="w-full">{modalOptions?.title}</div>}
          <DrawerClose>
            <button className="c-bts__close">
              <IoCloseOutline size={30} />
            </button>
          </DrawerClose>
        </div>
        <div
          className="c-bts__content px-4 pt-4"
          style={{
            ...buildContentStyle(modalOptions),
          }}
        >
          {typeof content === 'function' ? content({ setIsOpen, isOpen }) : content}
        </div>
      </DrawerContent>
    </Drawer>
  );
};
