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
import {
  innerBtsLocationAtom,
  InnerBtsEnum,
} from '@mobile/modals/states/inner_view';

export default function Locations() {
  useLocations();

  const [localFilterState, setLocalFilterState] = useAtom(
    localFilterStateAtom
  );

  const [innerBtsLocation, setInnerBtsType] = useAtom(
    innerBtsLocationAtom
  );

  const buildInnerViewContent = () => {
    if (innerBtsLocation == InnerBtsEnum.city) {
      return <CityOptions />;
    } else if (innerBtsLocation == InnerBtsEnum.district) {
      return <DistrictOptions />;
    } else if (innerBtsLocation == InnerBtsEnum.ward) {
      return <WardOptions />;
    } else {
      ('');
    }
  };

  const buildInnerViewTitle = () => {
    if (innerBtsLocation == InnerBtsEnum.city) {
      return 'Thành Phố';
    } else if (innerBtsLocation == InnerBtsEnum.district) {
      return 'Quận / Huyện';
    } else if (innerBtsLocation == InnerBtsEnum.ward) {
      return 'Phường / Xã';
    } else {
      ('');
    }
  };

  return (
    <div>
      <List strongIos>
        <ListItem
          link
          title='Thành Phố'
          after=''
          onClick={() => {}}
        />

        <ListItem
          link
          title='Quận / Huyện'
          after=''
          onClick={() => {}}
        />

        <ListItem
          link
          title='Phường / Xã'
          after=''
          onClick={() => {}}
        />
      </List>
    </div>
  );
}
