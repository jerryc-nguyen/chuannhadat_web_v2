'use client';
import { Button } from '@components/ui/button';
import Locations from '@components/main-content-navigator/desktop';
import useFilterState from '@mobile/filter_bds/hooks/useFilterState';
import { useFilterLocations } from '@mobile/locations/hooks';
import useModals from '@mobile/modals/hooks';
import { FilterFieldName } from '@models';
import { usePathname } from 'next/navigation';
import React from 'react';
import { LuChevronsUpDown, LuMapPin } from 'react-icons/lu';
import MainContentNavigator from '@components/main-content-navigator/desktop';

const ApplyButton = ({ closeModal }: { closeModal: IFunction }) => {
  const { applySingleFilter } = useFilterState();

  const applySelectLocations = () => {
    applySingleFilter({ id: FilterFieldName.Locations, text: 'Khu vực' });
    closeModal();
  };
  return <Button onClick={() => applySelectLocations()}>Áp dụng</Button>;
};

export default function MainNavLocationsPicker() {
  const { selectedLocationFullText, isSelectedLocation } = useFilterLocations();
  const { openModal, closeModal } = useModals();
  const { copyFilterStatesToLocal } = useFilterState();

  const showModalPickLocations = () => {
    copyFilterStatesToLocal([FilterFieldName.Locations]);
    openModal({
      name: 'ModalPickLocations',
      title: 'Chọn khu vực',
      content: <MainContentNavigator closeModal={closeModal} />,
      showAsDialog: true,
      allowChildOverflow: true
    });
  };

  const btnActiveClass = isSelectedLocation ? 'font-bold text-black' : 'text-secondary';

  return (
    <>
      <Button
        variant="outline"
        role="combobox"
        className={`text-md w-full items-center justify-between gap-x-3 rounded-full px-3 text-secondary ${btnActiveClass}`}
        onClick={() => showModalPickLocations()}
      >
        <span className="flex flex-1 items-center overflow-hidden">
          <LuMapPin className={`mr-1 h-4 w-4 text-secondary ${btnActiveClass}`} />
          <span className="w-full overflow-hidden text-ellipsis text-nowrap font-medium">
            {selectedLocationFullText || 'Chọn khu vực'}
          </span>
        </span>
        <span>
          <LuChevronsUpDown className="h-4 w-4 opacity-50" />
        </span>
      </Button>
    </>
  );
}
