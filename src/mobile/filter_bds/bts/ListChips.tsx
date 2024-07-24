import { BlockTitle, List, ListItem, Chip } from 'konsta/react';
import { FilterOption } from '../types';
import { ReactElement } from 'react';
import { BasicOption } from '@app/types';
import './style.scss';

const ListChips = ({
  options,
  onSelect = () => {},
}: {
  options?: Array<BasicOption>;
  onSelect?: Function;
}): ReactElement => {
  const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
  return (
    <>
      <div className='c-listChip flex flex-row overflow-x-scroll hidden-scrollbar'>
        {items.map((item) => {
          return (
            <div
              className='c-listChip__item is-circle border border-black rounded-full border-opacity-20'
              key={item}
            >
              {item}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default ListChips;
