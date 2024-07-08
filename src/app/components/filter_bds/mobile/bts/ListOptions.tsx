import { List, ListItem } from 'konsta/react';
import { FilterOption } from '../../types';
import { ReactElement } from 'react';

const ListOptions = ({
  options,
  onSelect = () => {}
}: {
  options: FilterOption[];
  onSelect?: Function;
}): ReactElement => {
  return (
    <List strongIos outlineIos>
      {options.map((item) => {
        return (
          <ListItem
            key={item.text}
            link
            title={item.text}
            onClick={() => {
              if (onSelect) {
                onSelect(item);
              }
            }}
          ></ListItem>
        );
      })}
    </List>
  );
};

export default ListOptions;
