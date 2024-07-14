import { useState } from 'react';
import { useAtom } from 'jotai';

import {
  FilterOption,
  FilterFieldName,
} from '@mobile/filter_bds/types';

import ListCheckOptions from './ListCheckOptions';
import {
  filterStateAtom,
  defaultFilterOption,
  localFilterStateAtom,
} from '@mobile/filter_bds/states';
import { Icon, List, ListInput, ListItem } from 'konsta/react';
import { IoChevronDownOutline } from 'react-icons/io5';
export default function Locations() {
  return (
    <>
      <List strongIos>
        <ListItem
          link
          title='Thành phố'
          after={
            <>
              Hồ chí minh
              <IoChevronDownOutline />
            </>
          }
          chevron={false}
        />

        <ListItem
          link
          title='Quận / Huyện'
          after={
            <>
              Tân phú
              <IoChevronDownOutline />
            </>
          }
          chevron={false}
        />

        <ListItem
          link
          title='Phường / Xã'
          after={
            <>
              Tân Sơn Nhì
              <IoChevronDownOutline />
            </>
          }
          chevron={false}
        />
      </List>
    </>
  );
}
