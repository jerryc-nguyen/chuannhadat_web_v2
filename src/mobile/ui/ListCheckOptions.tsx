import { Checkbox, List, ListItem } from 'konsta/react';
import { ReactElement, useState } from 'react';
import { OptionForSelect } from '@commons/interfaces';

const ListCheckOptions = ({
  options,
  selectedOption,
  onSelect,
}: {
  options: OptionForSelect[] | any[];
  selectedOption?: OptionForSelect | any;
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

export default ListCheckOptions;
