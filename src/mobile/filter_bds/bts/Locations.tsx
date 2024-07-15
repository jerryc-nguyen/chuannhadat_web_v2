import { ReactNode, useState } from 'react';
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
import CityOptions from './CityOptions';
import DistrictOptions from './DistrictOptions';
import WardOptions from './WardOptions';
import ListItemOptionPicker from '@mobile/ui/ListItemOptionPicker';
import useLocations from '@mobile/locations/hooks';

export default function Locations() {
  useLocations();

  const [localFilterState, setLocalFilterState] = useAtom(
    localFilterStateAtom
  );

  const buildInnerViewContent = () => {
    if (localFilterState.innerViewLocationType == 'city') {
      return <CityOptions />;
    } else if (localFilterState.innerViewLocationType == 'district') {
      return <DistrictOptions />;
    } else if (localFilterState.innerViewLocationType == 'ward') {
      return <WardOptions />;
    } else {
      ('');
    }
  };

  const buildInnerViewTitle = () => {
    if (localFilterState.innerViewLocationType == 'city') {
      return 'Thành Phố';
    } else if (localFilterState.innerViewLocationType == 'district') {
      return 'Quận / Huyện';
    } else if (localFilterState.innerViewLocationType == 'ward') {
      return 'Phường / Xã';
    } else {
      ('');
    }
  };

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
            title={buildInnerViewTitle()}
            content={buildInnerViewContent()}
          />
        </div>
      )}
    </div>
  );
}
