import ListItem from "@components/konsta/ListItem";
import useModals from "@mobile/modals/hooks";

import { OptionForSelect } from "@models";
import { directionsOptions } from "@mobile/filter_bds/constants";
import ListCheckOptions from "@mobile/ui/ListCheckOptions";

type IListItemBtsPickerProps = {
  options: Array<OptionForSelect>,
  onSelect?: (option: OptionForSelect) => void,
  value?: string,
  btsTitle?: string,
  closeAfterSelect?: boolean
}

export default function ListItemBtsPicker({ onSelect, value, options, btsTitle, closeAfterSelect }: IListItemBtsPickerProps) {
  const { openModal, closeModal } = useModals();
  const selectedOption = options.find((item: OptionForSelect) => (item.value + '') == value)

  const onLocalSelect = (option: OptionForSelect) => {
    if (onSelect) {
      onSelect(option);
    }

    if (closeAfterSelect || closeAfterSelect == undefined) {
      closeModal()
    }
  }

  return (
    <ListItem
      link
      title={btsTitle}
      onClick={() => {
        openModal({
          name: `ListItemBtsPicker_${btsTitle}`,
          title: btsTitle,
          content: <ListCheckOptions selectedOption={selectedOption} onSelect={onLocalSelect} options={options} />,
          supportPushState: false
        });
      }}
      after={selectedOption?.text}
    />

  )
}
