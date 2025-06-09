'use client';
import { Button } from '@components/ui/button';
import useFilterState from '@mobile/filter_bds/hooks/useFilterState';
import useModals from '@mobile/modals/hooks';
import { FilterFieldName } from '@models';
import React from 'react';
import { LuChevronsUpDown, LuMapPin } from 'react-icons/lu';
import MainContentNavigator from '@components/main-content-navigator/desktop';
import useMainContentNavigator from '@components/main-content-navigator/hooks';

export default function MainNavLocationsPicker() {
  const { selectedLocationFullText } = useMainContentNavigator();
  const { openModal } = useModals();
  const { copyFilterStatesToLocal } = useFilterState();

  const showModalPickLocations = () => {
    copyFilterStatesToLocal([FilterFieldName.Locations]);
    openModal({
      name: 'ModalPickLocations',
      title: 'Bạn đang quan tâm nội dung gì?',
      content: <MainContentNavigator />,
      showAsDialog: true,
      allowChildOverflow: true
    });
  };

  const btnActiveClass = selectedLocationFullText ? 'font-bold text-black' : 'text-secondary';

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
