import ListItem from "@components/konsta/ListItem";
import useModals from "@mobile/modals/hooks";

import { OptionForSelect } from "@models";
import ListCheckOptions from "@mobile/ui/ListCheckOptions";
import { Modal } from "@mobile/modals/states/types";

type IListItemBtsPickerProps = {
  options: Array<OptionForSelect>,
  onSelect?: (option: OptionForSelect) => void,
  value?: string,
  closeAfterSelect?: boolean
  dividers?: boolean
  footer?: React.ReactNode,
  modalOptions?: Modal,
  formattedValue?: string
}

export default function ListItemBtsPicker({ onSelect, value, options, closeAfterSelect, dividers, footer, modalOptions, formattedValue }: IListItemBtsPickerProps) {
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
      title={modalOptions?.title}
      value={value}
      onClear={() => {
        onSelect?.({ value: '', text: '' })
      }}
      onClick={() => {
        openModal({
          name: `ListItemBtsPicker_${modalOptions?.title}`,
          title: modalOptions?.title,
          content: <ListCheckOptions selectedOption={selectedOption} onSelect={onLocalSelect} options={options} footer={footer} />,
          ...(modalOptions || {})
        });
      }}
      after={formattedValue || selectedOption?.text}
      dividers={dividers}
    />

  )
}
