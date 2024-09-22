import { Button } from "@components/ui/button";
import Locations from "@desktop/product-filters/Locations";
import useModals from "@mobile/modals/hooks";
import { LuChevronsUpDown, LuMapPin } from "react-icons/lu";

export default function MainNavLocationsPicker() {
  const { openModal } = useModals()
  const showModalPickLocations = () => {
    openModal({
      name: 'ModalPickLocations',
      title: 'Chọn khu vực',
      content: <Locations />,
      showAsDialog: true
    })
  }

  return <><Button
    variant="outline"
    role="combobox"
    className="w-[200px] justify-between rounded-full"
    onClick={() => showModalPickLocations()}
  >
    <LuMapPin className="h-4 w-4 shrink-0 opacity-50" />
    <span className='text-black'>Chọn khu vực</span>
    <LuChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
  </Button></>;
}
