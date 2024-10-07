'use client';
import { Button } from '@components/ui/button';
import Locations from '@desktop/product-filters/Locations';
import useFilterState from '@mobile/filter_bds/hooks/useFilterState';
import { useFilterLocations } from '@mobile/locations/hooks';
import useModals from '@mobile/modals/hooks';
import { FilterFieldName } from '@models';
import { LuChevronsUpDown, LuMapPin } from 'react-icons/lu';

const ApplyButton = ({ closeModal }: { closeModal: IFunction }) => {
  const { applySingleFilter } = useFilterState();

  const applySelectLocations = () => {
    applySingleFilter({ id: FilterFieldName.locations, text: 'Khu vực' });
    closeModal();
  };
  return <Button onClick={() => applySelectLocations()}>Áp dụng</Button>;
};

export default function MainNavLocationsPicker() {
  const { selectedLocationFullText, isSelectedLocation } = useFilterLocations();
  const { openModal, closeModal } = useModals();
  const { copyFilterStatesToLocal } = useFilterState();

  const showModalPickLocations = () => {
    copyFilterStatesToLocal([FilterFieldName.locations]);
    openModal({
      name: 'ModalPickLocations',
      title: 'Chọn khu vực',
      content: <Locations />,
      footer: <ApplyButton closeModal={closeModal} />,
      showAsDialog: true,
    });
  };

  const btnActiveClass = isSelectedLocation ? 'font-bold text-black' : 'text-slate-600';

  return (
    <>
      <Button
        variant="outline"
        role="combobox"
        className={`text-md w-full items-center justify-between rounded-full text-slate-600 md:w-full ${btnActiveClass}`}
        onClick={() => showModalPickLocations()}
      >
        <span className="flex items-center">
          <LuMapPin className={`mr-1 h-4 w-4 shrink-0 text-slate-600 ${btnActiveClass}`} />
          <span>{selectedLocationFullText || 'Chọn khu vực'}</span>
        </span>
        <LuChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
      </Button>
    </>
  );
}
