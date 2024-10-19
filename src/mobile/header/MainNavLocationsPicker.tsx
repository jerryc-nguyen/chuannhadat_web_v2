'use client';
import { Button } from '@components/ui/button';
import { useRefCallback } from '@hooks/useRefCallback';
import Locations from '@mobile/filter_bds/bts/Locations';
import useFilterState from '@mobile/filter_bds/hooks/useFilterState';
import { useFilterLocations } from '@mobile/locations/hooks';
import useModals from '@mobile/modals/hooks';
import { FilterFieldName } from '@models';
import { usePathname } from 'next/navigation';
import React from 'react';
import { LuChevronsUpDown, LuMapPin } from 'react-icons/lu';

export default function MainNavLocationsPicker() {
  const { selectedLocationFullText, isSelectedLocation } = useFilterLocations();
  const { openModal, closeModal } = useModals();
  const pathName = usePathname();
  const isRedirectAfterApplyFilter = pathName === '/';
  const { copyFilterStatesToLocal, applySingleFilter, setIsRedirect } = useFilterState();
  const applySelectLocations = useRefCallback(() => {
    applySingleFilter({ id: FilterFieldName.Locations, text: 'Khu vực' });
    closeModal();
  });
  React.useEffect(() => {
    setIsRedirect(isRedirectAfterApplyFilter);
  }, []);
  const renderFooterApply = () => (
    <Button className="w-full" onClick={() => applySelectLocations()}>
      Áp dụng
    </Button>
  );

  const showModalPickLocations = () => {
    copyFilterStatesToLocal([FilterFieldName.Locations]);
    openModal({
      name: 'ModalPickLocations',
      title: 'Chọn khu vực',
      content: <Locations />,
      footer: renderFooterApply(),
      maxHeightPercent: 0.5,
      supportPushState: false
    });
  };

  const btnActiveClass = isSelectedLocation ? 'font-bold text-black' : 'text-slate-600';

  return (
    <>
      <Button
        variant="outline"
        role="combobox"
        className={`text-md w-full items-center justify-between gap-x-2 rounded-full text-slate-600 md:w-full ${btnActiveClass}`}
        onClick={() => showModalPickLocations()}
      >
        <span className="flex flex-1 items-center overflow-hidden">
          <LuMapPin className={`mr-1 h-4 w-4 shrink-0 text-slate-600 ${btnActiveClass}`} />
          <span className="w-full overflow-hidden text-ellipsis text-nowrap font-medium">
            {selectedLocationFullText || 'Chọn khu vực'}
          </span>
        </span>
        <LuChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
      </Button>
    </>
  );
}
