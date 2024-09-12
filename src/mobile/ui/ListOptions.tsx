import { List, ListItem } from '@components/konsta';
import { OptionForSelect } from '@models';

import { ReactElement } from 'react';

const ListOptions = ({
  options,
  onSelect = () => null,
}: {
  options: OptionForSelect[] | undefined;
  onSelect?: (item: A) => void;
}): ReactElement => {
  return (
    <>
      <List strongIos outlineIos margin="my-0">
        {options!.map((item) => {
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
    </>
  );
};

export default ListOptions;
