import { Button } from "@components/ui/button";
import Locations from "@desktop/product-filters/Locations";
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
  return <Button onClick={() => applySelectLocations()}>Áp dụng</Button>
}

export default function MainNavLocationsPicker() {
  const { selectedLocationText } = useFilterLocations();
  const { openModal, closeModal } = useModals()
  const { copyFilterStatesToLocal } = useFilterState();

  const showModalPickLocations = () => {
    copyFilterStatesToLocal([FilterFieldName.locations]);
    openModal({
      name: 'ModalPickLocations',
      title: 'Chọn khu vực',
      content: <Locations />,
      footer: <ApplyButton closeModal={closeModal} />,
      showAsDialog: true
    })
  }

  return <><Button
    variant="outline"
    role="combobox"
    className="w-full justify-between rounded-full md:w-full"
    onClick={() => showModalPickLocations()}
  >
    <span className='flex items-center'>
      <LuMapPin className="h-4 w-4 shrink-0 opacity-50 mr-1" />
      <span className='text-black'>{selectedLocationText ?? 'Chọn khu vực'}</span>
    </span>
    <LuChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
  </Button></>;
}
