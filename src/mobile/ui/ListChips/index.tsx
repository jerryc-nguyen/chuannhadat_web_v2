import { ReactElement } from 'react';
import { OptionForSelect } from '@app/types';
import './style.scss';
import HorizontalScroller from '../HorizontalScroller';

const ListChips = ({
  options,
  value,
  onSelect = (item: OptionForSelect) => {},
}: {
  value?: OptionForSelect;
  options: Array<OptionForSelect>;
  onSelect?: Function;
  horizontalScroll?: boolean;
}): ReactElement => {
  return (
    <>
      <div className='c-listChip is-circle'>
        <HorizontalScroller>
          {options.map((item) => {
            const selectedClass =
              value?.text == item.text
                ? 'is-selected bg-blue-500 text-white border-none'
                : '';
            return (
              <button
                className={`c-listChip__item border border-black rounded-full border-opacity-20 bg-white ${selectedClass}`}
                key={item.text}
                onClick={() => onSelect(item)}
              >
                {item.text}
              </button>
            );
          })}
        </HorizontalScroller>
      </div>
    </>
  );
};

export default ListChips;
