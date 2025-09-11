'use client';
import useMainContentNavigator from '@components/features/navigation/main-content-navigator/hooks';
import MainContentNavigator from '@components/features/navigation/main-content-navigator/mobile';
import { Button } from '@components/ui/button';
import useModals from '@components/features/layout/mobile-modals/hooks';
import React from 'react';
import { ChevronsUpDown, MapPin } from 'lucide-react';

export default function MainNavLocationsPicker() {
  const { selectedLocationFullText } = useMainContentNavigator();
  const [isOpen, setIsOpen] = React.useState(false);

  const { openModal, openModal2, closeModal2 } = useModals();

  const showModalPickLocations = () => {
    setIsOpen(true);
    openModal({
      name: 'ModalPickLocations',
      title: 'Chọn khu vực',
      content: <MainContentNavigator openModal={openModal2} closeModal={closeModal2} />,
      maxHeightPercent: 0.7,
      supportPushState: false,
      onClosed: () => setIsOpen(false)
    });
  };

  const btnActiveClass = selectedLocationFullText ? 'font-bold text-black' : 'text-secondary';

  return (
    <>
      <Button
        variant="outline"
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label="Chọn khu vực"
        aria-describedby="location-picker-description"
        className={`text-md w-full items-center justify-between gap-x-2 rounded-full text-secondary md:w-full ${btnActiveClass}`}
        onClick={() => showModalPickLocations()}
      >
        <span className="flex flex-1 items-center overflow-hidden">
          <MapPin className={`mr-1 h-4 w-4 shrink-0 text-secondary ${btnActiveClass}`} />
          <span className="w-full overflow-hidden text-ellipsis text-nowrap font-medium">
            {selectedLocationFullText || 'Chọn khu vực'}
          </span>
        </span>
        <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
      </Button>

      {/* Hidden description for screen readers */}
      <span id="location-picker-description" className="sr-only">
        Nhấn để mở danh sách các khu vực có thể chọn
      </span>
    </>
  );
}
