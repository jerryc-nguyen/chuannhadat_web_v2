import { BlockTitle, List, ListItem, Chip } from 'konsta/react';

import { ReactElement } from 'react';
import { BasicOption } from '@app/types';
import './style.scss';

const ListChips = ({
  options,
  onSelect = () => {},
}: {
  options: Array<BasicOption>;
  onSelect?: Function;
}): ReactElement => {
  return (
    <>
      <div className='c-listChip is-circle flex flex-row overflow-x-scroll hidden-scrollbar'>
        {options.map((item) => {
          return (
            <button
              className='c-listChip__item border border-black rounded-full border-opacity-20'
              key={item.id}
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
