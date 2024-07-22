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
import useModals from '@mobile/modals/hooks';
import { ModalNames } from '@mobile/modals/states/types';

export default function Locations() {
  useLocations();
  const { openModal3 } = useModals();

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
          onClick={() => {
            openModal3({
              name: ModalNames.city,
              title: 'Thành Phố',
              content: <CityOptions />,
              maxHeightPercent: 0.8,
            });
          }}
        />

        <ListItem
          link
          title='Quận / Huyện'
          after=''
          onClick={() => {
            openModal3({
              name: ModalNames.district,
              title: 'Quận / Huyện',
              maxHeightPercent: 0.8,
            });
          }}
        />

        <ListItem
          link
          title='Phường / Xã'
          after=''
          onClick={() => {
            openModal3({
              name: ModalNames.ward,
              title: 'Phường / Xã',
              maxHeightPercent: 0.8,
            });
          }}
        />
      </List>
    </div>
  );
}
