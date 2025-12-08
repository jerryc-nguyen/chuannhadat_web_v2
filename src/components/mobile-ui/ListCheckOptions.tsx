import { Checkbox, List, ListItem } from '@components/konsta';

import { ReactElement } from 'react';
import { OptionForSelect } from '@common/types';
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
  return (
    <>
      <List strongIos outlineIos margin="my-0" className='pl-0'>
        {options.map((item) => {
          return (
            <ListItem
              className='c-filter__dropdownListItem'
              key={item.text}
              link
              title={item.text}
              chevron={false}
              after={item.count ? item.count : ''}
              media={
                <Checkbox
                  component="div"
                  checked={selectedOption?.text == item.text}
                  onChange={() => null}
                />
              }
              onClick={() => {
                if (onSelect) {
                  onSelect(item);
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
