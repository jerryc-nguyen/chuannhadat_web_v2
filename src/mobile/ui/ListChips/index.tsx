import { BlockTitle, List, ListItem, Chip } from 'konsta/react';

import { ReactElement } from 'react';
import { BasicOption } from '@app/types';
import './style.scss';

const ListChips = ({
  options,
  value,
  onSelect = (item: BasicOption) => {},
}: {
  value?: BasicOption;
  options: Array<BasicOption>;
  onSelect?: Function;
}): ReactElement => {
  return (
    <>
      <div className='c-listChip is-circle flex flex-row overflow-x-scroll hidden-scrollbar'>
        {options.map((item) => {
          const selectedClass =
            value?.text == item.text
              ? 'is-selected bg-blue-500 text-white border-none'
              : '';
          return (
            <button
              className={`c-listChip__item border border-black rounded-full border-opacity-20 bg-white ${selectedClass}`}
              key={item.id}
              onClick={() => onSelect(item)}
            >
              {item.text}
            </button>
          );
        })}
      </div>
    </>
  );
};

export default ListChips;
