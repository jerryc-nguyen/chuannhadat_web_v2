import List from "@components/konsta/List";
import { directionsOptions } from "@mobile/filter_bds/constants";
import { useState } from "react";
import ListItemBtsPicker from "../bts-pickers/ListItemBtsPicker";
import ListItemBtsInput from "@mobile/bts-pickers/ListItemBtsInput";
import useModals from "@mobile/modals/hooks";

const PriceInputField = ({ value, onChange }: A) => {
  const [val, setVal] = useState(value);

  const onLocalChange = (event: EventInput) => {
    setVal(event.target.value);
  }

  const onApply = () => {
    onChange(val)
  }

  return (
    <div>
      <input type='text' value={val} onChange={onLocalChange} />
      <button onClick={onApply}>Apply</button>
    </div>
  )
}

export default function TestComponents() {
  const [direction, setDirection] = useState('west');
  const [price, setPrice] = useState<string | undefined>(undefined);
  const { openModal, closeModal } = useModals();

  const directionFieldOption = {
    onSelect: (option: A) => {
      console.log('onSelect', option)
      setDirection(option.value)
    },
    options: directionsOptions,
    btsTitle: 'Hướng',
    value: direction
  }

  const onPriceChanged = (value: string) => {
    setPrice(value);
    closeModal();
  }

  const priceFieldOption = {
    displayText: price,
    openModal: openModal,
    closeModal: closeModal,
    modal: {
      name: '',
      title: 'Giá',
      content: <PriceInputField value={price} onChange={onPriceChanged} />,
    }
  }

  return <>
    {JSON.stringify(direction)}
    <List strongIos outlineIos>
      <ListItemBtsPicker {...directionFieldOption} />
      <ListItemBtsInput {...priceFieldOption} />
    </List>
  </>
}
