import { cn } from '@common/utils';
import { Button } from '@components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@components/ui/popover';
import { FC, useEffect, useRef, useState } from 'react';
import { LuLoader2, LuX } from 'react-icons/lu';
import { get } from 'lodash-es';
import { useFormContext } from 'react-hook-form';
import { QueryChipOption } from '../../constant/list_chips_query';
import { ProductQuery } from '../../data/schemas';
import {
  ProductQueryFieldName,
  productQueryFromDefaultValues,
} from '../../data/type/product-query';
import { useAdminCollectionPost } from '../../hooks/use-collection-post';
import BusinessTypeButtons from './bts/BusinessTypeButtons';

const QueryChip: FC<{ queryChipItem: QueryChipOption }> = ({ queryChipItem }) => {
  const { watch, setValue, getValues } = useFormContext<ProductQuery>();
  const { data, isFetching } = useAdminCollectionPost();

  const totalRecords = data?.pagination?.total_count ?? 0;

  const [isOpenPopover, setIsOpenPopover] = useState<boolean>(false);
  const [wasCloseWithApply, setWasCloseWithApply] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpenPopover && !wasCloseWithApply) {
      setValue(queryChipItem.id, prevFormValue);
      setWasCloseWithApply(false);
    }
  }, [isOpenPopover, wasCloseWithApply]);

  const containerChipsRef = useRef(null);

  const formValue = watch(queryChipItem.id) ?? '';
  const [prevFormValue, setPrevFormValue] = useState<string>(getValues(queryChipItem.id) || '');

  const onApplyFilter = () => {
    setWasCloseWithApply(true);
    setIsOpenPopover(false);
  };

  const selectedRoomText = (): string => {
    const results = [];
    const bedRoomVal = getValues(ProductQueryFieldName.BedroomsCount);
    const bathRoomVal = getValues(ProductQueryFieldName.BathroomsCount);
    if (bedRoomVal) {
      results.push(`${bedRoomVal} PN`);
    }
    if (bathRoomVal) {
      results.push(`${bathRoomVal} WC`);
    }

    return results.join(' / ');
  };

  const selectedFilterText = () => {
    const fieldName = queryChipItem.id;
    // if (filterOption.id == FilterFieldName.Locations) {
    //   return selectedLocationText ?? 'Khu vực';
    // } else if (filterOption.id == FilterFieldName.Rooms) {
    //   return selectedRoomText() || 'Số phòng';
    // } else {
    //   return (
    //     //@ts-ignore: read value
    //     filterState[fieldName]?.text ?? filterOption.text
    //   );
    // }

    return getValues(fieldName) || queryChipItem.text;
  };

  const isActiveChip = () => {
    let isActive = false;
    const fieldName = queryChipItem.id;

    switch (fieldName) {
      // case ProductQueryFieldName.Locations:
      //   if (selectedLocationText) isActive = true;
      //   break;
      case ProductQueryFieldName.BedroomsCount:
      case ProductQueryFieldName.BathroomsCount:
        if (selectedRoomText()) isActive = true;
        break;
      default:
        if (getValues(fieldName)) isActive = true;
        break;
    }
    return isActive;
  };

  const buildContent = () => {
    switch (queryChipItem.id) {
      case ProductQueryFieldName.BusinessType:
        return (
          <BusinessTypeButtons
            value={
              getValues(ProductQueryFieldName.BusinessType) ??
              get(productQueryFromDefaultValues, ProductQueryFieldName.BusinessType)
            }
            onChange={(val: string) => {
              setValue('page', 1);
              setValue(ProductQueryFieldName.BusinessType, val);
            }}
          />
        );
      case ProductQueryFieldName.CategoryType:
        return <div>CategoryType </div>;
      case ProductQueryFieldName.Price:
        return <div>Price </div>;
      case ProductQueryFieldName.Area:
        return <div>Area </div>;
      // case ProductQueryFieldName.FilterOverview:
      //   return <div>FilterModal </div>;
      // case ProductQueryFieldName.Locations:
      //   return <div>Locations </div>;
      // case ProductQueryFieldName.Rooms:
      //   return <div>Rooms </div>;
      // case ProductQueryFieldName.Direction:
      //   return <div>Direction </div>;
      // case ProductQueryFieldName.Sort:
      //   return <div>SortOptions </div>;
      default:
        return undefined;
    }
  };

  // const showFilterPopover = (filterOption: FilterChipOption) => {
  //   if (filterOption.id == FilterFieldName.FilterOverview) {
  //     copyFilterStatesToLocal();
  //   } else {
  //     copyFilterStatesToLocal([filterOption.id as FilterFieldName]);
  //   }
  // };

  const handleRemoveFilter = () => {
    setValue(queryChipItem.id, '');
    setValue('page', 1);
  };

  // const onRenderIconChip = (filterOption: FilterChipOption) => {
  //   switch (filterOption.id) {
  //     case FilterFieldName.Price:
  //       return <PiCurrencyCircleDollar className="text-xl" />;
  //     case FilterFieldName.Area:
  //       return <BiArea className="text-xl" />;
  //     case FilterFieldName.Sort:
  //       return <BsSortUp className="text-xl" />;

  //     default:
  //       break;
  //   }
  // };

  return (
    <div ref={containerChipsRef}>
      <Popover open={isOpenPopover} onOpenChange={setIsOpenPopover}>
        <Button
          className={cn(
            'w-fit cursor-default gap-x-4 rounded-full border px-4 font-semibold transition-all',
            isActiveChip()
              ? 'bg-black text-white hover:bg-black'
              : 'bg-white text-black hover:bg-slate-50',
          )}
          onClick={() => setPrevFormValue(formValue)}
        >
          <PopoverTrigger asChild>
            <span
              onClick={() => {
                // showFilterPopover(queryChipItem);
                setIsOpenPopover(true);
              }}
              className={cn(
                'flex cursor-pointer items-center gap-x-2',
                isActiveChip() ? '' : 'text-slate-600 hover:text-black',
              )}
            >
              {/* {onRenderIconChip(queryChipItem)} */}
              {selectedFilterText()}
            </span>
          </PopoverTrigger>
          {isActiveChip() && (
            <LuX onClick={() => handleRemoveFilter()} className="cursor-pointer text-xl" />
          )}
        </Button>

        <PopoverContent
          container={containerChipsRef.current}
          sideOffset={5}
          align="center"
          side="bottom"
          className={cn('!relative z-10 mt-4 w-80')}
        >
          <h2 className="text-left text-lg font-semibold">{queryChipItem.text}</h2>
          <section className="content-filter my-3 max-h-[20rem] overflow-y-auto">
            {buildContent()}
          </section>
          <Button disabled={isFetching} className="w-full" onClick={() => onApplyFilter()}>
            {!formValue ? (
              'Đóng'
            ) : (
              <>
                {isFetching ? (
                  <>
                    <LuLoader2 className="mr-2 h-4 w-4 animate-spin" /> Đang tải
                  </>
                ) : (
                  <span>Xem {totalRecords} kết quả</span>
                )}
              </>
            )}
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default QueryChip;
