import { Checkbox, List, ListItem } from '@components/konsta';

import { ReactElement, useState } from 'react';
import { useMemo } from 'react';
import { Input } from '@components/ui/input';
import { buildOptionsPrice, maskNumber } from '@common/priceHelpers';

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

  return (
    <>
      <Input
        value={price}
        placeholder="Nhập và chọn giá từ gợi ý"
        onChange={(e) => {
          updatePrice(e.target.value + '')
        }}
        maxLength={12}
      />

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
