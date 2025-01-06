import { Checkbox, List, ListItem } from '@components/konsta';

import { ReactElement, useState } from 'react';
import { OptionForSelect } from '@models';
import * as React from 'react';
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
  const [priceText, setPriceText] = useState(value);

  const options = buildOptionsPrice({
    searchText: priceText,
    businessType: businessType,
  })

  return (
    <>
      <Input
        value={maskNumber(priceText).formattedValue}
        placeholder="Nhập giá bán"
        onChange={(e) => {
          setPriceText(e.target.value)
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
              after={item.count ? item.count : ''}
              media={
                <Checkbox
                  component="div"
                  checked={value == item.value}
                  onChange={() => null}
                />
              }
              onClick={() => {
                if (onSelect) {
                  onSelect(item);
                  setPriceText(item.text.toString())
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
