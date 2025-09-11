import React from 'react';
import { List, ListItem } from '@components/konsta';

import { FilterFieldName } from '@common/models';
import Area from './bts/Area';
import Price from './bts/Price';
import BusinessTypeButtons from './bts/BusinessTypeButtons';
import CategoryType from './bts/CategoryType';
import Locations from './bts/Locations';
import useModals from '@components/features/layout/mobile-modals/hooks';
import useFilterState from './hooks/useFilterState';
import Direction from './bts/Direction';
import Bed from './bts/Bed';
import Bath from './bts/Bath';

export const DEFAULT_MODAL_HEIGHTS = {
  [FilterFieldName.Rooms]: 270,
  [FilterFieldName.BusinessType]: 80,
};

const FilterModal = () => {
  const { openModal2, closeModal2 } = useModals();
  const { localFilterState } = useFilterState();
  const area = localFilterState.area;
  const categoryType = localFilterState.categoryType;
  const price = localFilterState.price;
  const direction = localFilterState.direction;
  const bed = localFilterState.bed;
  const bath = localFilterState.bath;

  const bedText = (): string => {
    if (bed) {
      return `${bed.text} PN`;
    } else {
      return '';
    }
  };

  const bathText = (): string => {
    if (bath) {
      return `${bath.text} WC`;
    } else {
      return '';
    }
  };

  return (
    <>
      <p className='px-4 mt-6 mb-2'><b>Loại tin</b></p>

      <div className="bg-white">
        <BusinessTypeButtons />
      </div>

      <p className='px-4 mt-6 mb-0'><b>Loại bất động sản</b></p>

      <List strongIos outlineIos margin={'my-2'}>
        <ListItem
          link
          title="Loại BĐS"
          onClick={() => {
            openModal2({
              name: FilterFieldName.CategoryType,
              title: 'Loại BĐS',
              content: <CategoryType onSelect={() => closeModal2()} />,
            });
          }}
          after={categoryType?.text}
        />
      </List>

      <p className='px-4 mt-6 mb-0'><b>Khu vực</b></p>

      <Locations />

      <p className='px-4'><b>Thông tin chi tiết</b></p>

      <List strongIos outlineIos margin={'my-2'}>
        <ListItem
          link
          title="Mức giá"
          onClick={() => {
            openModal2({
              name: FilterFieldName.Price,
              title: 'Mức giá',
              content: <Price onSelect={() => closeModal2()} />,
            });
          }}
          after={price?.text}
        />
        <ListItem
          link
          title="Diện tích"
          onClick={() => {
            openModal2({
              name: 'bts_area',
              title: 'Diện tích',
              content: <Area onSelect={() => closeModal2()} />,
            });
          }}
          after={area?.text}
        />
        <ListItem
          link
          title="Số phòng ngủ"
          onClick={() => {
            openModal2({
              name: FilterFieldName.Bed,
              title: 'Số phòng ngủ',
              content: <Bed onSelect={() => closeModal2()} />,
            });
          }}
          after={bedText()}
        />

        <ListItem
          link
          title="Số phòng tắm"
          onClick={() => {
            openModal2({
              name: FilterFieldName.Bath,
              title: 'Số phòng tắm',
              content: <Bath onSelect={() => closeModal2()} />,
            });
          }}
          after={bathText()}
        />

        <ListItem
          link
          title="Hướng"
          onClick={() => {
            openModal2({
              name: FilterFieldName.Direction,
              title: 'Hướng',
              content: <Direction onSelect={() => closeModal2()} />,
            });
          }}
          after={direction?.text}
        />
      </List>
    </>
  );
};

export default FilterModal;
