import useFilterState from '@mobile/filter_bds/hooks/useFilterState';
import { IoChevronDown } from 'react-icons/io5';
import SortOptions from '@mobile/filter_bds/bts/SortOptions';
import FooterSortBtsButton from '@mobile/filter_bds/FooterSortBtsButton';
import { PopoverContent, PopoverTrigger, Popover } from '@components/ui/popover';

export default function PostControls({ pagination }: { pagination: any }) {
  const { selectedSortText } = useFilterState();

  return (
    <div className="flex items-center justify-between">
      <div className="text-slate-600">Có {pagination?.total_count} tin đăng</div>
      <Popover>
        <PopoverTrigger className="relative cursor-pointer">
          <div className="flex items-center">
            <span className="mr-2 max-w-32 overflow-hidden text-ellipsis whitespace-nowrap">
              {selectedSortText}
            </span>
            <IoChevronDown />
          </div>
        </PopoverTrigger>
        <PopoverContent sideOffset={5} align="end" side="bottom" className="px-0">
          <section className="max-h-[20rem] overflow-y-auto">
            <SortOptions />
          </section>
          <div className="mt-4 px-4">
            <FooterSortBtsButton />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
