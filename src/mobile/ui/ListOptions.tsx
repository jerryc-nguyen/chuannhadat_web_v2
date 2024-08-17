import { OptionForSelect } from 'src/types';
import { List, ListItem } from 'konsta/react';
import { ReactElement } from 'react';

const ListOptions = ({
  options,
  onSelect = () => {},
}: {
  options: OptionForSelect[] | undefined;
  onSelect?: Function;
}): ReactElement => {
  return (
    <>
      <List strongIos outlineIos margin='my-0'>
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
