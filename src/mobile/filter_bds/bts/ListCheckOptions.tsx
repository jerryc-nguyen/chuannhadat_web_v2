import { Checkbox, List, ListItem } from 'konsta/react';
import { FilterOption } from '../types';
import { ReactElement, useState } from 'react';

const ListOptions = ({
  options,
  selectedOption,
  onSelect,
}: {
  options: FilterOption[] | any[];
  selectedOption?: FilterOption | any;
  onSelect?: Function;
}): ReactElement => {
  const [curOption, setCurOption] = useState(selectedOption);

  return (
    <>
      <List strongIos outlineIos margin='my-0'>
        {options.map((item) => {
          return (
            <ListItem
              key={item.text}
              link
              title={item.text}
              chevron={false}
              media={
                <Checkbox
                  component='div'
                  name='demo-checkbox'
                  checked={curOption?.text == item.text}
                  onChange={() => {}}
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
    </>
  );
};

export default ListOptions;
