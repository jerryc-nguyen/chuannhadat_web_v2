import { BlockTitle, Checkbox, List, ListItem } from 'konsta/react';
import { FilterOption } from '../types';
import { ReactElement } from 'react';

const ListOptions = ({
  options,
  selectedOption,
  onSelect = () => {},
}: {
  options: FilterOption[];
  selectedOption?: FilterOption;
  onSelect?: Function;
}): ReactElement => {
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
                  checked={selectedOption?.text == item.text}
                  onChange={() => {}}
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
    </>
  );
};

export default ListOptions;
