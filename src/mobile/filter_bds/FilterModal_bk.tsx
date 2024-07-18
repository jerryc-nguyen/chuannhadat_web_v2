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
import CategoryType from './bts/Category';
import Locations from './bts/Locations';
import { innerBtsLocationAtom } from '@mobile/modals/states/inner_view';
import useModals from '@mobile/modals/hooks';

const FilterModal = () => {
  const [isModalOpen, setIsModalOpen] = useAtom(openFilterModalAtom);
  const [activeSegmented, setActiveSegmented] = useState(1);

  const { openModal } = useModals();

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
      <Popup
        opened={isModalOpen}
        onBackdropClick={() => {
          setIsModalOpen(false);
        }}
      >
        <Page>
          <Navbar
            title='Tìm BĐS'
            right={
              <Link
                navbar
                onClick={() => {
                  setIsModalOpen(false);
                }}
              >
                Close
              </Link>
            }
          />

          <BlockTitle>Loại tin</BlockTitle>
          <BusinessTypeButtons />

          <BlockTitle>Thông tin cơ bản</BlockTitle>

          <List strongIos outlineIos>
            <ListItem
              link
              title='Khu vực'
              onClick={() => {
                openModal({
                  name: FilterFieldName.locations.toString(),
                  title: 'Khu vực',
                  content: <Locations />,
                  onClosed: () => {
                    setInnerBtsType(undefined);
                  },
                });
              }}
            />
            <ListItem
              link
              title='Loại BĐS'
              onClick={() => {
                openModal({
                  name: FilterFieldName.categoryType.toString(),
                  title: 'Loại BĐS',
                  content: <CategoryType />,
                });
              }}
              after={localFilterState.categoryType?.text}
            />
          </List>

          <BlockTitle>Thông tin chi tiết</BlockTitle>

          <List strongIos outlineIos>
            <ListItem
              link
              title='Mức giá'
              onClick={() => {
                openModal({
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
                openModal({
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
                openModal({
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
              onClick={() => {}}
              after={''}
            />
            <ListItem
              link
              title='Hướng'
              onClick={() => {}}
              after={''}
            />
          </List>

          <br />
          <br />

          <Toolbar
            top={false}
            className={`left-0 bottom-0 fixed w-full`}
          >
            <Button onClick={applySelectedFilters}>
              Xem 1000 tin
            </Button>
          </Toolbar>
        </Page>
      </Popup>
    </>
  );
};

export default FilterModal;
