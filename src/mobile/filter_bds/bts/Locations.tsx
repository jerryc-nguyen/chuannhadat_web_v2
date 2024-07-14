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
import {
  Button,
  Icon,
  List,
  ListInput,
  ListItem,
} from 'konsta/react';
import { IoChevronDownOutline } from 'react-icons/io5';
import InnerModal from '@mobile/modals/InnerModal';
import City from './City';
export default function Locations() {
  const [localFilterState, setLocalFilterState] = useAtom(
    localFilterStateAtom
  );

  return (
    <div>
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
          onClick={() => {
            setLocalFilterState({
              ...localFilterState,
              innerViewLocationType: 'city',
            });
          }}
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
          onClick={() => {
            setLocalFilterState({
              ...localFilterState,
              innerViewLocationType: 'district',
            });
          }}
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
          onClick={() => {
            setLocalFilterState({
              ...localFilterState,
              innerViewLocationType: 'ward',
            });
          }}
        />
      </List>
      {localFilterState.innerViewLocationType && (
        <div className='innerView'>
          <InnerModal
            onClose={() => {
              setLocalFilterState({
                ...localFilterState,
                innerViewLocationType: undefined,
              });
            }}
            title='Thành phố'
            content={<City />}
          />
        </div>
      )}
    </div>
  );
}
