import { Checkbox, List, ListItem } from 'konsta/react';
import { ReactElement, useState } from 'react';
import { OptionForSelect } from '@models';

const ListCheckOptions = ({
  options,
  selectedOption,
  onSelect,
}: {
  options: OptionForSelect[] | A[];
  selectedOption?: OptionForSelect | A;
  onSelect?: (arg: A) => void;
}): ReactElement => {
  const [curOption, setCurOption] =
    useState(selectedOption);

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
    </>
  );
};

export default ListCheckOptions;
