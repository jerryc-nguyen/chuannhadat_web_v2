'use client';
import useMainContentNavigator from '@components/main-content-navigator/hooks';
import MainContentNavigator from '@components/main-content-navigator/mobile';
import { Button } from '@components/ui/button';
import useModals from '@mobile/modals/hooks';
import React from 'react';
import { LuChevronsUpDown, LuMapPin } from 'react-icons/lu';

export default function MainNavLocationsPicker() {
  const { selectedLocationFullText } = useMainContentNavigator();

  const { openModal, openModal2, closeModal2 } = useModals();

  const showModalPickLocations = () => {
    openModal({
      name: 'ModalPickLocations',
      title: 'Chọn khu vực',
      content: <MainContentNavigator openModal={openModal2} closeModal={closeModal2} />,
      maxHeightPercent: 0.7,
      supportPushState: false
    });
  };

  const btnActiveClass = selectedLocationFullText ? 'font-bold text-black' : 'text-secondary';

  return (
    <>
      <Button
        variant="outline"
        role="combobox"
        className={`text-md w-full items-center justify-between gap-x-2 rounded-full text-secondary md:w-full ${btnActiveClass}`}
        onClick={() => showModalPickLocations()}
      >
        <span className="flex flex-1 items-center overflow-hidden">
          <LuMapPin className={`mr-1 h-4 w-4 shrink-0 text-secondary ${btnActiveClass}`} />
          <span className="w-full overflow-hidden text-ellipsis text-nowrap font-medium">
            {selectedLocationFullText || 'Chọn khu vực'}
          </span>
        </span>
        <LuChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
      </Button>
    </>
  );
}
