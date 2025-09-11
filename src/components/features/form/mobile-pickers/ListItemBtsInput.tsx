import ListItem from "@components/konsta/ListItem";
import { Modal } from "@components/features/layout/mobile-modals/states/types";

type IListItemBtsInputProps = {
  openModal: (modal: Modal) => void,
  displayText?: string,
  closeAfterSelect?: boolean,
  modal: Modal
}

export default function ListItemBtsInput({ displayText, closeAfterSelect, modal, openModal }: IListItemBtsInputProps) {

  return (
    <ListItem
      link
      title={modal.title}
      onClick={() => {
        openModal(modal);
      }}
      after={displayText}
    />

  )
}
