import { Checkbox, List, ListItem } from '@components/konsta';

import { ReactElement, useState } from 'react';
import { useMemo } from 'react';
import { Input } from '@components/ui/input';
import { buildOptionsPrice, maskNumber } from '@common/priceHelpers';
import { Button } from '@components/ui/button';

const PriceOptions = ({
  value,
  onSelect,
  businessType
}: {
  value: string;
  onSelect?: (arg: A) => void;
  businessType: string
}): ReactElement => {
  const { formattedValue: formattedPrice } = maskNumber(value + '')
  const [selectedPrice, setSelectedPrice] = useState(formattedPrice);
  const [price, setPrice] = useState(formattedPrice);

  const priceNumber = useMemo(() => {
    return (price + '').replace(/\D/g, '')
  }, [price])

  const selectedPriceNumber = useMemo(() => {
    return (selectedPrice + '').replace(/\D/g, '')
  }, [selectedPrice])

  const options = useMemo(() => {
    return buildOptionsPrice({
      searchText: priceNumber,
      businessType: businessType,
    })
  }, [businessType, priceNumber])


  const updateSelectedPrice = (price: string) => {
    const { formattedValue } = maskNumber(price + '')
    setSelectedPrice(formattedValue)
    updatePrice(price)
  }

  const updatePrice = (price: string) => {
    const { formattedValue } = maskNumber(price + '')
    setPrice(formattedValue)
  }

  const updateCustomPrice = () => {
    updateSelectedPrice(price);
    const { formattedValue } = maskNumber(priceNumber)
    if (onSelect) {
      onSelect({ text: formattedValue, value: priceNumber });
    }
  }

  return (
    <>
      <div className="flex w-full max-w-sm items-center space-x-2 p-4">
        <Input
          value={price}
          placeholder="Nhập và chọn giá từ gợi ý"
          onChange={(e) => {
            updatePrice(e.target.value + '')
          }}
          maxLength={14}
        />
        <Button type="submit" onClick={updateCustomPrice}> Chọn</Button>
      </div >

      <List strongIos outlineIos margin="my-0">
        {options.map((item) => {
          return (
            <ListItem
              key={item.text}
              link
              title={item.text}
              chevron={false}
              after={item.description}
              media={
                <Checkbox
                  component="div"
                  checked={selectedPriceNumber == item.value}
                  onChange={() => null}
                />
              }
              onClick={() => {
                if (onSelect) {
                  updateSelectedPrice(item.value + '')
                  onSelect(item);
                }
              }}
            ></ListItem>
          );
        })}
      </List>
    </>
  );
};

export default PriceOptions;
