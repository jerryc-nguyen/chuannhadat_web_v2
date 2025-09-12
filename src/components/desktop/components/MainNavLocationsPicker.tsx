'use client';
import { Button } from '@components/ui/button';
import useFilterState from '@app/(frontend)/_components/features/search/filter-conditions/hooks/useFilterState';
import useModals from '@frontend/features/layout/mobile-modals/hooks';
import { FilterFieldName } from '@common/types';
import React from 'react';
import { ChevronsUpDown, MapPin } from 'lucide-react';
import MainContentNavigator from '@frontend/features/navigation/main-content-navigator/desktop';
import useMainContentNavigator from '@frontend/features/navigation/main-content-navigator/hooks';

export default function MainNavLocationsPicker() {
  const { selectedLocationFullText } = useMainContentNavigator();
  const { openModal } = useModals();
  const { copyFilterStatesToLocal } = useFilterState();
  const [isOpen, setIsOpen] = React.useState(false);

  const showModalPickLocations = () => {
    setIsOpen(true);
    copyFilterStatesToLocal([FilterFieldName.Locations]);
    openModal({
      name: 'ModalPickLocations',
      title: 'Chọn khu vực',
      content: <MainContentNavigator />,
      showAsDialog: true,
      allowChildOverflow: true,
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
        aria-describedby="desktop-location-picker-description"
        className={`text-md w-full items-center justify-between gap-x-3 rounded-full px-3 text-secondary ${btnActiveClass}`}
        onClick={() => showModalPickLocations()}
      >
        <span className="flex flex-1 items-center overflow-hidden">
          <MapPin className={`mr-1 h-4 w-4 text-secondary ${btnActiveClass}`} />
          <span className="w-full overflow-hidden text-ellipsis text-nowrap font-medium">
            {selectedLocationFullText || 'Chọn khu vực'}
          </span>
        </span>
        <span>
          <ChevronsUpDown className="h-4 w-4 opacity-50" />
        </span>
      </Button>

      {/* Hidden description for screen readers */}
      <span id="desktop-location-picker-description" className="sr-only">
        Nhấn để mở danh sách các khu vực có thể chọn
      </span>
    </>
  );
}
