import { BlockTitle, Checkbox, List, ListItem } from 'konsta/react';
import { FilterOption } from '../types';
import { ReactElement } from 'react';

const ListOptions = ({
  options,
  onSelect = () => {},
}: {
  options: FilterOption[];
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
                  checked={false}
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
