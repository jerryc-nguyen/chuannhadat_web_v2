import { BlockTitle, Checkbox, List, ListItem } from 'konsta/react';

import { MouseEventHandler, ReactElement, ReactNode } from 'react';

const ListItemOptionPicker = ({
  value,
  placeholder,
  onClick,
}: {
  placeholder: string;
  value?: ReactNode;
  onClick: MouseEventHandler;
}): ReactElement => {
  return (
    <>
      {!value && (
        <ListItem
          link
          title={`Chọn ${placeholder}`}
          after=''
          onClick={onClick}
        />
      )}
      {value && (
        <ListItem
          link
          header={placeholder}
          title={value}
          after='Thay đổi'
          onClick={onClick}
        />
      )}
    </>
  );
};

export default ListItemOptionPicker;
