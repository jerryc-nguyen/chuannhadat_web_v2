import { Button } from "@components/ui/button";
import Locations from "@mobile/filter_bds/bts/Locations";

import useFilterState from "@mobile/filter_bds/hooks/useFilterState";
import { useFilterLocations } from "@mobile/locations/hooks";
import useModals from "@mobile/modals/hooks";
import { FilterFieldName } from "@models";
import { LuChevronsUpDown, LuMapPin } from "react-icons/lu";

const ApplyButton = ({ closeModal }: { closeModal: IFunction }) => {
  const { applySingleFilter } = useFilterState();

  const applySelectLocations = () => {
    applySingleFilter({ id: FilterFieldName.locations, text: 'Khu vực' })
    closeModal();
  }
  return <Button className='w-full' onClick={() => applySelectLocations()}>Áp dụng</Button>
}

export default function MainNavLocationsPicker() {
  const { selectedLocationFullText, isSelectedLocation } = useFilterLocations();
  const { openModal, closeModal } = useModals()
  const { copyFilterStatesToLocal } = useFilterState();

  const showModalPickLocations = () => {
    copyFilterStatesToLocal([FilterFieldName.locations]);
    openModal({
      name: 'ModalPickLocations',
      title: 'Chọn khu vực',
      content: <Locations />,
      footer: <ApplyButton closeModal={closeModal} />,
      maxHeightPercent: 0.5,
    })
  }

  const btnActiveClass = isSelectedLocation ? 'font-bold text-black' : 'text-slate-600';

  return <>
    <Button
      variant='outline'
      role="combobox"
      className={`w-full justify-between items-center rounded-full md:w-full text-md text-slate-600 ${btnActiveClass}`}
      onClick={() => showModalPickLocations()}
    >
      <span className='flex items-center overflow-hidden'>
        <LuMapPin className={`h-4 w-4 shrink-0 mr-1 text-slate-600 ${btnActiveClass}`} />
        <span>{selectedLocationFullText || 'Chọn khu vực'}</span>
      </span>
      <LuChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
    </Button >
  </>;
}
