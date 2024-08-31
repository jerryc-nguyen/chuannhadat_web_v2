import useFilterState from '@mobile/filter_bds/hooks/useFilterState';
import { IoChevronDown } from 'react-icons/io5';
import useModals from '@mobile/modals/hooks';
import SortOptions from '@mobile/filter_bds/bts/SortOptions';
import FooterSortBtsButton from '@mobile/filter_bds/FooterSortBtsButton';
import { FilterFieldName } from '@models';

export default function PostControls({ pagination }: { pagination: any }) {
  const { openModal3 } = useModals();
  const { selectedSortText, copyFilterStatesToLocal } = useFilterState();

  const onShowSortOptions = () => {
    copyFilterStatesToLocal([FilterFieldName.sort]);
    openModal3({
      name: 'sort_bts',
      title: 'Sắp xếp theo',
      content: <SortOptions />,
      footer: <FooterSortBtsButton />,
    });
  };

  return (
    <div className="flex items-center justify-between">
      <div className="text-slate-600">Có {pagination?.total_count} tin đăng</div>
      <div className="flex items-center" onClick={onShowSortOptions}>
        <span className="mr-2 max-w-32 overflow-hidden text-ellipsis whitespace-nowrap">
          {selectedSortText}
        </span>
        <IoChevronDown />
      </div>
    </div>
  );
}
