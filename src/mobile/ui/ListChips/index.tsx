import { ReactElement } from 'react';
import { OptionForSelect } from '@models';
import './style.scss';
import HorizontalScroller from '../HorizontalScroller';

const ListChips = ({
  options,
  value,
  onSelect = () => null,
}: {
  value?: OptionForSelect;
  options: Array<OptionForSelect>;
  onSelect?: (item: OptionForSelect) => void;
  horizontalScroll?: boolean;
}): ReactElement => {
  return (
    <>
      <div className="c-listChip is-circle">
        <HorizontalScroller>
          {options.map((item) => {
            const selectedClass =
              value?.text == item.text
                ? 'is-selected bg-blue-500 text-white border-none'
                : 'bg-white';
            return (
              <button
                className={`c-listChip__item shrink-0 rounded-full border border-black border-opacity-20 text-center ${selectedClass}`}
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
