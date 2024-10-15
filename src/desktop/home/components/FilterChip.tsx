import { cn } from '@common/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@components/ui/popover';
import { SelectTrigger, SelectValue } from '@components/ui/select';
import React from 'react';
import styles from '../styles/filter-chip.module.scss';
import { FilterFieldName } from '@models';
import BusinessTypeButtons from '@mobile/filter_bds/bts/BusinessTypeButtons';
import CategoryType from '@mobile/filter_bds/bts/CategoryType';
import Price from '@mobile/filter_bds/bts/Price';
import Area from '@mobile/filter_bds/bts/Area';
import FilterModal from '@mobile/filter_bds/FilterModal';
import Locations from '@desktop/product-filters/Locations';
import Rooms from '@mobile/filter_bds/bts/Rooms';
import Direction from '@mobile/filter_bds/bts/Direction';
import { useAtom } from 'jotai';
import useFilterState from '@mobile/filter_bds/hooks/useFilterState';
import { useFilterLocations } from '@mobile/locations/hooks';
import { filterStateAtom } from '@mobile/filter_bds/states';
import { FilterChipOption } from '@mobile/filter_bds/types';
import { Button } from '@components/ui/button';
import { LuLoader2 } from 'react-icons/lu';
import { useQuery } from '@tanstack/react-query';
import { searchApi } from '@api/searchApi';
type FilterChipProps = {
  filterChipItem: FilterChipOption;
  isRedirectAfterApplyFilter: boolean;
};

const FilterChip: React.FC<FilterChipProps> = ({ filterChipItem, isRedirectAfterApplyFilter }) => {
  const [isOpenPopover, setIsOpenPopover] = React.useState<boolean>(false);
  const containerChipsRef = React.useRef(null);
  const [filterState] = useAtom(filterStateAtom);
  const { copyFilterStatesToLocal } = useFilterState();
  const { selectedLocationText } = useFilterLocations();
  const { applySingleFilter, buildFilterParams } = useFilterState();
  const filterParams = buildFilterParams({ withLocal: true });
  const { data, isLoading } = useQuery({
    queryKey: ['FooterBtsButton', filterParams],
    queryFn: () => searchApi(filterParams),
  });

  const onApplyFilter = () => {
    setIsOpenPopover(false);
    applySingleFilter(filterChipItem);
  };
  const selectedRoomText = (): string => {
    const results = [];
    if (filterState.bed) {
      results.push(`${filterState.bed.text} PN`);
    }
    if (filterState.bath) {
      results.push(`${filterState.bath.text} WC`);
    }

    return results.join(' / ');
  };

  const selectedFilterText = (filterOption: FilterChipOption) => {
    const fieldName = filterOption.id;

    if (filterOption.id == FilterFieldName.Locations) {
      return selectedLocationText ?? 'Khu vực';
    } else if (filterOption.id == FilterFieldName.Rooms) {
      return selectedRoomText() || 'Số phòng';
    } else {
      return (
        //@ts-ignore: read value
        filterState[fieldName]?.text ?? filterOption.text
      );
    }
  };

  const buildContent = (filterOption: FilterChipOption) => {
    switch (filterOption.id) {
      case FilterFieldName.BusinessType:
        return <BusinessTypeButtons />;
      case FilterFieldName.CategoryType:
        return <CategoryType />;
      case FilterFieldName.Price:
        return <Price />;
      case FilterFieldName.Area:
        return <Area />;
      case FilterFieldName.FilterOverview:
        return <FilterModal />;
      case FilterFieldName.Locations:
        return <Locations />;
      case FilterFieldName.Rooms:
        return <Rooms />;
      case FilterFieldName.Direction:
        return <Direction />;
      default:
        return undefined;
    }
  };

  const showFilterPopover = (filterOption: FilterChipOption) => {
    if (filterOption.id == FilterFieldName.FilterOverview) {
      copyFilterStatesToLocal();
    } else {
      copyFilterStatesToLocal([filterOption.id as FilterFieldName]);
    }
  };

  return (
    <div ref={containerChipsRef}>
      <Popover open={isOpenPopover} onOpenChange={setIsOpenPopover}>
        <PopoverTrigger asChild>
          <SelectTrigger
            onClick={() => {
              showFilterPopover(filterChipItem);
              setIsOpenPopover(true);
            }}
            className="w-fit gap-x-4 bg-black text-white"
          >
            <SelectValue placeholder={selectedFilterText(filterChipItem)} />
          </SelectTrigger>
        </PopoverTrigger>

        <PopoverContent
          container={containerChipsRef.current}
          sideOffset={5}
          align="center"
          side="bottom"
          className={cn('!relative mt-4 w-80', styles.filter_popover_content)}
        >
          <h2 className="text-left text-lg font-semibold">{filterChipItem.text}</h2>
          <section className="content-filter my-4 max-h-[20rem] overflow-y-auto">
            {buildContent(filterChipItem)}
          </section>
          <Button disabled={isLoading} className="w-full" onClick={() => onApplyFilter()}>
            {isLoading && <LuLoader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? 'Đang tải' : `Xem ${data?.pagination?.total_count} kết quả`}
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default FilterChip;
