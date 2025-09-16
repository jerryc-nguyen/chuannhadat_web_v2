import { searchApi } from '@frontend/features/search/api/searchApi';
import { cn } from '@common/utils';
import { Button } from '@components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@components/ui/popover';
import useSearchScope, { SearchScopeEnums } from '@frontend/features/search/hooks/useSearchScope';
import Area from '../bts/Area';
import BusCatType from '../bts/BusCatType';
import BusinessTypeButtons from '../bts/BusinessTypeButtons';
import CategoryType from '../bts/CategoryType';
import Projects from '../bts/desktop/Projects';
import Direction from '../bts/Direction';
import Price from '../bts/Price';
import Rooms from '../bts/Rooms';
import SortOptions from '../bts/SortOptions';
import FilterModal from '../mobile/FilterModal';
import useFilterState from '../hooks/useFilterState';
import { FilterChipOption } from '@common/types';
import { FilterFieldName } from '@common/types';
import { useQuery } from '@tanstack/react-query';
import ProfileLocationsV2 from '@components/desktop/product-filters/ProfileLocationsV2';
import React from 'react';
import {
  ArrowUp as SortUpIcon,
  Building,
  Loader2,
  X,
  DollarSign
} from 'lucide-react';
import styles from '../FilterChip.module.scss';
import AggProjects from '../bts/AggProjects';

type FilterChipProps = {
  filterChipItem: FilterChipOption;
  onChange?: (filterState: Record<string, A>) => void;
};

const FilterChip: React.FC<FilterChipProps> = ({ filterChipItem, onChange }) => {

  const {
    copyFilterStatesToLocal,
    applySingleFilter,
    buildFilterParams,
    removeFilterValue,
    isActiveChip,
    selectedFilterText,
  } = useFilterState();

  const filterParams = buildFilterParams({ withLocal: true });
  const [isOpenPopover, setIsOpenPopover] = React.useState<boolean>(false);
  const containerChipsRef = React.useRef(null);

  const { data, isLoading } = useQuery({
    queryKey: ['FooterBtsButton', filterParams],
    queryFn: () => searchApi(filterParams),
  });
  const { searchScope } = useSearchScope();

  const onApplyFilter = () => {
    setIsOpenPopover(false);
    const newFilterState = applySingleFilter(filterChipItem);
    if (typeof onChange === 'function') {
      onChange(newFilterState);
    }
  };

  const buildContent = (filterOption: FilterChipOption) => {
    switch (filterOption.id) {
      case FilterFieldName.ProfileLocations:
        return <ProfileLocationsV2 />;
      case FilterFieldName.BusinessType:
        return <BusinessTypeButtons />;
      case FilterFieldName.CategoryType:
        return <CategoryType />;
      case FilterFieldName.BusCatType:
        return <BusCatType />;
      case FilterFieldName.Price:
        return <Price />;
      case FilterFieldName.Area:
        return <Area />;
      case FilterFieldName.FilterOverview:
        return <FilterModal />;
      case FilterFieldName.Project:
        return <Projects />;
      case FilterFieldName.Rooms:
        return <Rooms />;
      case FilterFieldName.Direction:
        return <Direction />;
      case FilterFieldName.Sort:
        return <SortOptions />;
      case FilterFieldName.AggProjects:
        return <AggProjects />;
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

  const handleRemoveFilter = (filterOption: FilterChipOption) => {
    const fieldName = filterOption.id;
    const newFilterState = removeFilterValue(fieldName);

    if (typeof onChange === 'function') {
      onChange(newFilterState);
    }
  };

  const onRenderIconChip = (filterOption: FilterChipOption) => {
    switch (filterOption.id) {
      case FilterFieldName.Project:
        return <Building className="text-xl" />;
      case FilterFieldName.Price:
        return <DollarSign className="text-xl" />;
      case FilterFieldName.Sort:
        return <SortUpIcon className="text-xl" />;
      default:
        break;
    }
  };

  const contentWidth = () => {
    switch (filterChipItem.id) {
      case FilterFieldName.Locations:
        return 'w-[350px] c-locationPC';
      case FilterFieldName.ProfileLocations:
        return 'w-[350px] c-profileLocationPC';
      case FilterFieldName.Rooms:
        return 'w-80';
      default:
        return 'min-w-80 w-fit';
    }
  };

  return (
    <div ref={containerChipsRef}>
      <Popover open={isOpenPopover} onOpenChange={setIsOpenPopover}>
        <Button
          className={cn(
            'w-fit cursor-default gap-x-4 rounded-full border px-4 font-semibold transition-all',
            isActiveChip(filterChipItem)
              ? 'bg-black text-white hover:bg-black'
              : 'bg-white text-black hover:bg-slate-50',
          )}
        >
          <PopoverTrigger asChild>
            <div
              onClick={() => {
                showFilterPopover(filterChipItem);
                setIsOpenPopover(true);
              }}
              className={cn(
                'flex cursor-pointer items-center gap-x-1',
                isActiveChip(filterChipItem) ? '' : 'text-secondary hover:text-black',
              )}
            >
              {onRenderIconChip(filterChipItem)}
              {selectedFilterText(filterChipItem)}
            </div>
          </PopoverTrigger>
          {isActiveChip(filterChipItem) && (
            <X
              onClick={() => handleRemoveFilter(filterChipItem)}
              className="cursor-pointer text-xl"
            />
          )}
        </Button>

        <PopoverContent
          container={containerChipsRef.current}
          sideOffset={5}
          align="center"
          side="bottom"
          className={cn(`!relative z-20 mt-4 ${contentWidth()}`, styles.filter_popover_content)}
        >
          <h2 className="text-left text-lg font-semibold">{filterChipItem.text}</h2>
          <section className="content-filter my-3 max-h-[20rem] overflow-y-auto">
            {buildContent(filterChipItem)}
          </section>
          {searchScope != SearchScopeEnums.ManagePosts && (
            <Button disabled={isLoading} className="w-full" onClick={() => onApplyFilter()}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? 'Đang tải' : `Xem ${data?.pagination?.total_count} kết quả`}
            </Button>
          )}
          {searchScope == SearchScopeEnums.ManagePosts && (
            <Button disabled={isLoading} className="w-full" onClick={() => onApplyFilter()}>
              Áp dụng
            </Button>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default FilterChip;
