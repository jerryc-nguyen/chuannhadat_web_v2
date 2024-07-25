import React, { useState } from 'react';

import {
  Page,
  Navbar,
  Popup,
  List,
  ListItem,
  Link,
  Button,
  Block,
  BlockTitle,
  Checkbox,
  Segmented,
  SegmentedButton,
  Toolbar,
} from 'konsta/react';
import { useAtom } from 'jotai';

import {
  openFilterModalAtom,
  filterStateAtom,
  localFilterStateAtom,
} from './states';

import { FilterFieldName } from './types';

import Area from './bts/Area';
import Price from './bts/Price';
import BusinessTypeButtons from './bts/BusinessTypeButtons';
import CategoryType from './bts/CategoryType';
import Locations from './bts/Locations';
import { innerBtsLocationAtom } from '@mobile/modals/states/inner_view';
import useModals from '@mobile/modals/hooks';
import useFilterState from './hooks/useFilterState';
import Rooms from './bts/Rooms';
import Direction from './bts/Direction';

export const DEFAULT_MODAL_HEIGHTS = {
  [FilterFieldName.rooms]: 270,
  [FilterFieldName.businessType]: 80,
};

const FilterModal = () => {
  const { openModal2 } = useModals();
  const { getFieldValue } = useFilterState();
  const area = getFieldValue(FilterFieldName.area);
  const categoryType = getFieldValue(FilterFieldName.categoryType);
  const price = getFieldValue(FilterFieldName.price);
  const direction = getFieldValue(FilterFieldName.direction);
  const bed = getFieldValue(FilterFieldName.bed);
  const bath = getFieldValue(FilterFieldName.bath);

  const roomsText = (): string => {
    const results = [];
    if (bed) {
      results.push(`${bed.text} PN`);
    }
    if (bath) {
      results.push(`${bath.text} WC`);
    }

    return results.join(' / ');
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
              content: <CategoryType />,
            });
          }}
          after={categoryType?.text}
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
              content: <Price />,
            });
          }}
          after={price?.text}
        />
        <ListItem
          link
          title='Diện tích'
          onClick={() => {
            openModal2({
              name: 'bts_area',
              title: 'Diện tích',
              content: <Area />,
            });
          }}
          after={area?.text}
        />
        <ListItem
          link
          title='Số phòng'
          onClick={() => {
            openModal2({
              name: FilterFieldName.rooms,
              title: 'Số phòng',
              content: <Rooms />,
            });
          }}
          after={roomsText()}
        />

        <ListItem
          link
          title='Hướng'
          onClick={() => {
            openModal2({
              name: FilterFieldName.direction,
              title: 'Hướng',
              content: <Direction />,
            });
          }}
          after={direction?.text}
        />
      </List>
    </>
  );
};

export default FilterModal;
