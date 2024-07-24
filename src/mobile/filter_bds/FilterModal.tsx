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
import BusinessTypeButtons from './BusinessTypeButtons';
import CategoryType from './bts/CategoryType';
import Locations from './bts/Locations';
import { innerBtsLocationAtom } from '@mobile/modals/states/inner_view';
import useModals from '@mobile/modals/hooks';

export const DEFAULT_MODAL_HEIGHTS = {
  [FilterFieldName.rooms]: 270,
  [FilterFieldName.businessType]: 80,
};

const FilterModal = () => {
  const [isModalOpen, setIsModalOpen] = useAtom(openFilterModalAtom);
  const [activeSegmented, setActiveSegmented] = useState(1);

  const { openModal2 } = useModals();

  const [filterState, setFilterState] = useAtom(filterStateAtom);
  const [localFilterState, setLocalFilterState] = useAtom(
    localFilterStateAtom
  );

  const [, setInnerBtsType] = useAtom(innerBtsLocationAtom);

  const applySelectedFilters = () => {
    setFilterState({ ...filterState, ...localFilterState });
    setIsModalOpen(false);
  };

  console.log('filterState', filterState);
  console.log('localFilterState', localFilterState);

  const BUSINESS_TYPES_TEXTS = {
    sell: 'Tin Bán',
    rent: 'Tin Cho Thuê',
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
              name: FilterFieldName.categoryType.toString(),
              title: 'Loại BĐS',
              content: <CategoryType />,
            });
          }}
          after={localFilterState.categoryType?.text}
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
              name: 'bts_price',
              title: 'Mức giá',
              content: <Price />,
            });
          }}
          after={localFilterState.price?.text}
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
          after={localFilterState.area?.text}
        />
        <ListItem
          link
          title='Phòng ngủ'
          onClick={() => {
            openModal2({
              name: 'bts_bed',
              title: 'Phòng ngủ',
              content: 'Phòng ngủ',
            });
          }}
          after={''}
        />
        <ListItem
          link
          title='Phòng tắm'
          onClick={() => {
            openModal2({
              name: 'bts_bath',
              title: 'Phòng tắm',
              content: 'Phòng tắm',
            });
          }}
          after={''}
        />
        <ListItem link title='Hướng' onClick={() => {}} after={''} />
      </List>
    </>
  );
};

export default FilterModal;
