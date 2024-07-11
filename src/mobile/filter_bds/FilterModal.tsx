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

import { openFilterModalAtom, filterStateAtom } from './states';

import { FilterFieldName } from './types';
import { selectedFilterText } from './helpers';
import { btsModalAtom } from '../modals/states';
import Area from './bts/Area';

const FilterModal = () => {
  const [isModalOpen, setIsModalOpen] = useAtom(openFilterModalAtom);

  const [activeSegmented, setActiveSegmented] = useState(1);
  const [filterState] = useAtom(filterStateAtom);
  const [, openModal] = useAtom(btsModalAtom);

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
            <ListItem link title='Khu vực' onClick={() => {}} />
            <ListItem
              link
              title='Loại BĐS'
              onClick={() => {}}
              after={selectedFilterText(
                filterState,
                FilterFieldName.categoryType
              )}
            />
          </List>

          <BlockTitle>Thông tin chi tiết</BlockTitle>

          <List strongIos outlineIos>
            <ListItem
              link
              title='Mức giá'
              onClick={() => {}}
              after={selectedFilterText(
                filterState,
                FilterFieldName.price
              )}
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
              after={selectedFilterText(
                filterState,
                FilterFieldName.area
              )}
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
              after={selectedFilterText(
                filterState,
                FilterFieldName.bed
              )}
            />
            <ListItem
              link
              title='Phòng tắm'
              onClick={() => {}}
              after={selectedFilterText(
                filterState,
                FilterFieldName.bath
              )}
            />
            <ListItem
              link
              title='Hướng'
              onClick={() => {}}
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
    </>
  );
};

export default FilterModal;
