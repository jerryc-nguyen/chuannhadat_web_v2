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
import ListItemOptionPicker from '@mobile/ui/ListItemOptionPicker';
export default function Locations() {
  const [localFilterState, setLocalFilterState] = useAtom(
    localFilterStateAtom
  );

  return (
    <div>
      <List strongIos>
        <ListItemOptionPicker
          placeholder='Thành Phố'
          value={localFilterState.city?.text}
          onClick={() => {
            setLocalFilterState({
              ...localFilterState,
              innerViewLocationType: 'city',
            });
          }}
        />

        <ListItemOptionPicker
          placeholder='Quận / Huyện'
          value={localFilterState.district?.text}
          onClick={() => {
            setLocalFilterState({
              ...localFilterState,
              innerViewLocationType: 'district',
            });
          }}
        />

        <ListItemOptionPicker
          placeholder='Phường / Xã'
          value={localFilterState.ward?.text}
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
