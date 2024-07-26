import React from 'react';
import { BlockTitle, Chip, List, ListItem } from 'konsta/react';
import { FilterFieldName } from './types';
import Area from './bts/Area';
import Price from './bts/Price';
import BusinessTypeButtons from './bts/BusinessTypeButtons';
import CategoryType from './bts/CategoryType';
import Locations from './bts/Locations';
import useModals from '@mobile/modals/hooks';
import useFilterState from './hooks/useFilterState';
import Direction from './bts/Direction';
import Bed from './bts/Bed';
import Bath from './bts/Bath';
import { ALL_TEXT } from '@app/constants';

export const DEFAULT_MODAL_HEIGHTS = {
  [FilterFieldName.rooms]: 270,
  [FilterFieldName.businessType]: 80,
};

const FilterModal = () => {
  const { openModal2, closeModal2 } = useModals();
  const { getFieldValue } = useFilterState();
  const area = getFieldValue(FilterFieldName.area);
  const categoryType = getFieldValue(FilterFieldName.categoryType);
  const price = getFieldValue(FilterFieldName.price);
  const direction = getFieldValue(FilterFieldName.direction);
  const bed = getFieldValue(FilterFieldName.bed);
  const bath = getFieldValue(FilterFieldName.bath);

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
      <BlockTitle>Loại tin</BlockTitle>
      <br />

      <BusinessTypeButtons />

      <BlockTitle>Loại bất động sản</BlockTitle>

      <List strongIos>
        <ListItem
          link
          title='Loại BĐS'
          onClick={() => {
            openModal2({
              name: FilterFieldName.categoryType,
              title: 'Loại BĐS',
              content: (
                <CategoryType onSelect={() => closeModal2()} />
              ),
            });
          }}
          after={categoryType?.text ?? ALL_TEXT}
        />
      </List>

      <BlockTitle>Khu vực</BlockTitle>

      <Locations />

      <BlockTitle>Thông tin chi tiết</BlockTitle>

      <List strongIos outlineIos>
        <ListItem
          link
          title='Mức giá'
          onClick={() => {
            openModal2({
              name: FilterFieldName.price,
              title: 'Mức giá',
              content: <Price onSelect={() => closeModal2()} />,
            });
          }}
          after={price?.text ?? ALL_TEXT}
        />
        <ListItem
          link
          title='Diện tích'
          onClick={() => {
            openModal2({
              name: 'bts_area',
              title: 'Diện tích',
              content: <Area onSelect={() => closeModal2()} />,
            });
          }}
          after={area?.text ?? ALL_TEXT}
        />
        <ListItem
          link
          title='Số phòng ngủ'
          onClick={() => {
            openModal2({
              name: FilterFieldName.bed,
              title: 'Số phòng ngủ',
              content: <Bed onSelect={() => closeModal2()} />,
            });
          }}
          after={bedText()}
        />

        <ListItem
          link
          title='Số phòng tắm'
          onClick={() => {
            openModal2({
              name: FilterFieldName.bath,
              title: 'Số phòng tắm',
              content: <Bath onSelect={() => closeModal2()} />,
            });
          }}
          after={bathText()}
        />

        <ListItem
          link
          title='Hướng'
          onClick={() => {
            openModal2({
              name: FilterFieldName.direction,
              title: 'Hướng',
              content: <Direction onSelect={() => closeModal2()} />,
            });
          }}
          after={direction?.text ?? ALL_TEXT}
        />
      </List>
    </>
  );
};

export default FilterModal;
