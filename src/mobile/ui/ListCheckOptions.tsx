import { Checkbox, List, ListItem } from '@components/konsta';

import { ReactElement, useState } from 'react';
import { OptionForSelect } from '@models';
import * as React from 'react';

const ListCheckOptions = ({
  options,
  selectedOption,
  onSelect,
  footer,
}: {
  options: OptionForSelect[];
  selectedOption?: OptionForSelect | A;
  onSelect?: (arg: A) => void;
  footer?: React.ReactNode;
}): ReactElement => {
  const [curOption, setCurOption] = useState(selectedOption);

  return (
    <>
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
                  checked={curOption?.text == item.text}
                  onChange={() => null}
                />
              }
              onClick={() => {
                if (onSelect) {
                  onSelect(item);
                  setCurOption(item);
                }
              }}
            ></ListItem>
          );
        })}
      </List>
      {footer}
    </>
  );
};

export default ListCheckOptions;
