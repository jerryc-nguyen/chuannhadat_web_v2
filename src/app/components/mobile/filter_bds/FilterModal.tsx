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
  openBtsFilterAtom,
  filterStateAtom,
} from './states';

import FilterBts from './FilterBts';
import { FilterFieldName } from './types';
import { selectedFilterText } from './helpers';

const FilterModal = () => {
  const [isModalOpen, setIsModalOpen] = useAtom(openFilterModalAtom);
  const [, openBtsFilter] = useAtom(openBtsFilterAtom);

  const [activeSegmented, setActiveSegmented] = useState(1);
  const [filterState] = useAtom(filterStateAtom);

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
          <Block strongIos outlineIos className='space-y-4'>
            <Segmented outline>
              <SegmentedButton
                active={activeSegmented === 1}
                onClick={() => setActiveSegmented(1)}
              >
                Tin Bán
              </SegmentedButton>
              <SegmentedButton
                active={activeSegmented === 2}
                onClick={() => setActiveSegmented(2)}
              >
                Tin Cho Thuê
              </SegmentedButton>
            </Segmented>
          </Block>

          <BlockTitle>Thông tin cơ bản</BlockTitle>

          <List strongIos outlineIos>
            <ListItem
              link
              title='Khu vực'
              onClick={() => {
                openBtsFilter(FilterFieldName.locations);
              }}
            />
            <ListItem
              link
              title='Loại BĐS'
              onClick={() => {
                openBtsFilter(FilterFieldName.propertyType);
              }}
              after={selectedFilterText(
                filterState,
                FilterFieldName.propertyType
              )}
            />
          </List>

          <BlockTitle>Thông tin chi tiết</BlockTitle>

          <List strongIos outlineIos>
            <ListItem
              link
              title='Mức giá'
              onClick={() => {
                openBtsFilter(FilterFieldName.price);
              }}
              after={selectedFilterText(
                filterState,
                FilterFieldName.price
              )}
            />
            <ListItem
              link
              title='Diện tích'
              onClick={() => {
                openBtsFilter(FilterFieldName.area);
              }}
              after={selectedFilterText(
                filterState,
                FilterFieldName.area
              )}
            />
            <ListItem
              link
              title='Phòng ngủ'
              onClick={() => {
                openBtsFilter(FilterFieldName.beds);
              }}
              after={selectedFilterText(
                filterState,
                FilterFieldName.beds
              )}
            />
            <ListItem
              link
              title='Phòng tắm'
              onClick={() => {
                openBtsFilter(FilterFieldName.baths);
              }}
              after={selectedFilterText(
                filterState,
                FilterFieldName.baths
              )}
            />
            <ListItem
              link
              title='Hướng'
              onClick={() => {
                openBtsFilter(FilterFieldName.direction);
              }}
              after={selectedFilterText(
                filterState,
                FilterFieldName.direction
              )}
            />
          </List>

          <br />
          <br />

          <Toolbar
            top={false}
            className={`left-0 bottom-0 fixed w-full`}
          >
            <Button>Xem 1000 tin</Button>
          </Toolbar>
        </Page>
      </Popup>

      <FilterBts />
    </>
  );
};

export default FilterModal;
