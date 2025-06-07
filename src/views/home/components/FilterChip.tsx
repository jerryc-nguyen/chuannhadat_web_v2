import { searchApi } from '@api/searchApi';
import { cn } from '@common/utils';
import { Button } from '@components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@components/ui/popover';
import useSearchScope, { SearchScopeEnums } from '@hooks/useSearchScope';
import Area from '@mobile/filter_bds/bts/Area';
import BusCatType from '@mobile/filter_bds/bts/BusCatType';
import BusinessTypeButtons from '@mobile/filter_bds/bts/BusinessTypeButtons';
import CategoryType from '@mobile/filter_bds/bts/CategoryType';
import Projects from '@mobile/filter_bds/bts/desktop/Projects';
import Direction from '@mobile/filter_bds/bts/Direction';
import Price from '@mobile/filter_bds/bts/Price';
import Rooms from '@mobile/filter_bds/bts/Rooms';
import SortOptions from '@mobile/filter_bds/bts/SortOptions';
import FilterModal from '@mobile/filter_bds/FilterModal';
import useFilterState from '@mobile/filter_bds/hooks/useFilterState';
import { filterStateAtom } from '@mobile/filter_bds/states';
import { FilterChipOption, FilterState } from '@mobile/filter_bds/types';
import { useFilterLocations } from '@mobile/locations/hooks';
import { FilterFieldName } from '@models';
import { useQuery } from '@tanstack/react-query';
import ProfileLocationsV2 from '@views/product-filters/ProfileLocationsV2';
import { useAtom } from 'jotai';
import React from 'react';
import { BiArea } from 'react-icons/bi';
import { BsSortUp } from 'react-icons/bs';
import { LuBuilding, LuLoader2, LuX } from 'react-icons/lu';
import { PiCurrencyCircleDollar } from 'react-icons/pi';
import styles from '../styles/FilterChip.module.scss';

type FilterChipProps = {
  filterChipItem: FilterChipOption;
  onChange?: ( filterState: Record<string, A> ) => void;
};

const FilterChip: React.FC<FilterChipProps> = ( { filterChipItem, onChange } ) => {
  //State !
  const [isOpenPopover, setIsOpenPopover] = React.useState<boolean>( false );
  const containerChipsRef = React.useRef( null );
  const [filterState] = useAtom( filterStateAtom );

  const { copyFilterStatesToLocal } = useFilterState();
  const { selectedLocationText } = useFilterLocations();
  const { applySingleFilter, buildFilterParams, removeFilterValue } = useFilterState();
  const filterParams = buildFilterParams( { withLocal: true } );

  const { data, isLoading } = useQuery( {
    queryKey: ['FooterBtsButton', filterParams],
    queryFn: () => searchApi( filterParams ),
  } );
  const { searchScope } = useSearchScope();

  const onApplyFilter = () => {
    setIsOpenPopover( false );
    const newFilterState = applySingleFilter( filterChipItem );
    if ( typeof onChange === 'function' ) {
      onChange( newFilterState );
    }
  };

  const selectedRoomText = (): string => {
    const results = [];
    if ( filterState.bed ) {
      results.push( `${filterState.bed.text} PN` );
    }
    if ( filterState.bath ) {
      results.push( `${filterState.bath.text} WC` );
    }

    return results.join( ' / ' );
  };

  const selectedFilterText = ( filterOption: FilterChipOption ) => {
    const fieldName = filterOption.id;
    if (
      filterOption.id == FilterFieldName.Locations ||
      filterOption.id == FilterFieldName.ProfileLocations
    ) {
      return selectedLocationText ?? 'Khu vực';
    } else if ( filterOption.id == FilterFieldName.Rooms ) {
      return selectedRoomText() || 'Số phòng';
    } else {
      return (
        //@ts-ignore: read value
        filterState[fieldName]?.text ?? filterOption.text
      );
    }
  };
  const isActiveChip = ( filterOption: FilterChipOption ) => {
    let isActive = false;
    const fieldName = filterOption.id;
    switch ( fieldName ) {
      case FilterFieldName.Locations:
        if ( selectedLocationText ) isActive = true;
        break;
      case FilterFieldName.ProfileLocations:
        if ( selectedLocationText ) isActive = true;
        break;
      case FilterFieldName.Rooms:
        if ( selectedRoomText() ) isActive = true;
        break;
      default:
        if ( filterState[fieldName as keyof FilterState]?.text ) isActive = true;
        break;
    }
    return isActive;
  };

  const buildContent = ( filterOption: FilterChipOption ) => {
    switch ( filterOption.id ) {
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
      default:
        return undefined;
    }
  };

  const showFilterPopover = ( filterOption: FilterChipOption ) => {
    if ( filterOption.id == FilterFieldName.FilterOverview ) {
      copyFilterStatesToLocal();
    } else {
      copyFilterStatesToLocal( [filterOption.id as FilterFieldName] );
    }
  };

  const handleRemoveFilter = ( filterOption: FilterChipOption ) => {
    const fieldName = filterOption.id;
    const newFilterState = removeFilterValue( fieldName );
    console.log( 'newFilterState', newFilterState );
    if ( typeof onChange === 'function' ) {
      onChange( newFilterState );
    }
  };

  const onRenderIconChip = ( filterOption: FilterChipOption ) => {
    switch ( filterOption.id ) {
      case FilterFieldName.Project:
        return <LuBuilding className="text-xl" />;
      case FilterFieldName.Price:
        return <PiCurrencyCircleDollar className="text-xl" />;
      case FilterFieldName.Area:
        return <BiArea className="text-xl" />;
      case FilterFieldName.Sort:
        return <BsSortUp className="text-xl" />;
      default:
        break;
    }
  };

  const contentWidth = () => {
    switch ( filterChipItem.id ) {
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
            isActiveChip( filterChipItem )
              ? 'bg-black text-white hover:bg-black'
              : 'bg-white text-black hover:bg-slate-50',
          )}
        >
          <PopoverTrigger asChild>
            <div
              onClick={() => {
                showFilterPopover( filterChipItem );
                setIsOpenPopover( true );
              }}
              className={cn(
                'flex cursor-pointer items-center gap-x-1',
                isActiveChip( filterChipItem ) ? '' : 'text-secondary hover:text-black',
              )}
            >
              {onRenderIconChip( filterChipItem )}
              {selectedFilterText( filterChipItem )}
            </div>
          </PopoverTrigger>
          {isActiveChip( filterChipItem ) && (
            <LuX
              onClick={() => handleRemoveFilter( filterChipItem )}
              className="cursor-pointer text-xl"
            />
          )}
        </Button>

        <PopoverContent
          container={containerChipsRef.current}
          sideOffset={5}
          align="center"
          side="bottom"
          className={cn( `!relative z-20 mt-4 ${contentWidth()}`, styles.filter_popover_content )}
        >
          <h2 className="text-left text-lg font-semibold">{filterChipItem.text}</h2>
          <section className="content-filter my-3 max-h-[20rem] overflow-y-auto">
            {buildContent( filterChipItem )}
          </section>
          {searchScope != SearchScopeEnums.ManagePosts && (
            <Button disabled={isLoading} className="w-full" onClick={() => onApplyFilter()}>
              {isLoading && <LuLoader2 className="mr-2 h-4 w-4 animate-spin" />}
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
