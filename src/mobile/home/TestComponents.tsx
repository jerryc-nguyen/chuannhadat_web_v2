import List from "@components/konsta/List";
import { directionsOptions, roomsOptions } from "@mobile/filter_bds/constants";
import { useMemo, useState } from "react";
import ListItemBtsPicker from "../bts-pickers/ListItemBtsPicker";
import ListItemBtsInput from "@mobile/bts-pickers/ListItemBtsInput";
import useModals from "@mobile/modals/hooks";
import { PriceAutoComplete } from "@desktop/dashboard/main-manage-post/manage-post/components/form-components/fields/price-autocomplete";
import { buildOptionsPrice, maskNumber, readMoney } from "@common/priceHelpers";
import { Input } from "@components/ui/input";
import LocationsPicker from "@mobile/ui/LocationsPicker";
import { Label } from "@components/ui/label";

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
      <PriceAutoComplete
        selectedValue={value}
        onSelectedValueChange={(value) => {
          setVal(value)
        }}
        items={buildOptionsPrice({
          searchText: val,
          businessType: 'sell',
        })}
        emptyMessage="Nhập giá bán"
        InputRender={
          <Input
            value={maskNumber(val).formattedValue}
            placeholder="Nhập giá bán"
            onChange={(e) => {
              setVal(value)
            }}
            maxLength={12}
          />
        }
      />

      <button onClick={onApply}>Apply</button>
    </div>
  )
}

export default function TestComponents() {
  const [bed, setBed] = useState('1');
  const [direction, setDirection] = useState('east');
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

  const bedFieldOption = {
    onSelect: (option: A) => {
      console.log('onSelect', option)
      setBed(option.value)
    },
    options: roomsOptions,
    btsTitle: 'Phòng ngủ',
    value: bed
  }

  const onPriceChanged = (value: string) => {
    setPrice(value);
    closeModal();
  }

  const priceFieldOption = {
    displayText: readMoney(price || ''),
    openModal: openModal,
    closeModal: closeModal,

    modal: {
      name: '',
      title: 'Giá',
      content: <PriceInputField value={price} onChange={onPriceChanged} />,
      showAsDialog: true,
      supportPushState: false
    }
  }


  const [fullAddress, setFullAddress] = useState('')

  const onChangedFullAddress = (newAddress: string) => {
    console.log('newAddress', newAddress)
    setFullAddress(newAddress)
  }

  const mapSrc = useMemo(() => {
    return `https://maps.google.com/maps?&q=${fullAddress}&output=embed`
  }, [fullAddress])

  return <>
    <List strongIos outlineIos>
      <ListItemBtsPicker {...directionFieldOption} />
      <ListItemBtsInput {...priceFieldOption} />

      {/* @ts-ignore: ok */}
      <ListItemBtsPicker {...bedFieldOption} />
    </List>

    <LocationsPicker
      openModal={openModal}
      onChangeCity={(city) => { console.log('aa'); closeModal() }}
      onChangeDistrict={(district) => { closeModal() }}
      onChangeWard={(ward) => { closeModal() }}
      onChangeStreet={(street) => { closeModal() }}
      withStreet={true}
      onChangedFullAddress={onChangedFullAddress}
    />
    <div className='p-4'>
      <Label>Địa chỉ:</Label>
      <Input
        value={fullAddress}
        placeholder="Nhập địa chỉ"
        onChange={(e) => {
          setFullAddress(e.target.value)
        }}
      />
      <br />
      <Label>Vị trí trên bản đồ</Label>

      <iframe
        className='w-full min-h-64'
        style={{ border: 0 }}
        loading="lazy"
        src={mapSrc}></iframe>

    </div>


  </>
}
