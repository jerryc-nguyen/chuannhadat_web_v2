import { useAtom } from 'jotai';

import {
  openBottomSheetFilterAtom,
  curBottomSheetFieldAtom,
} from './states';

import { FilterFieldName } from './types';

import PriceBts from './bts/PriceBts';
import AreaBts from './bts/AreaBts';
import BedBts from './bts/BedBts';
import BathBts from './bts/BathBts';
import DirectionBts from './bts/DirectionBts';
import PropertyTypeBts from './bts/PropertyTypeBts';
import LocationBts from './bts/LocationBts';

export default function FilterBts() {
  const [isOpen] = useAtom(openBottomSheetFilterAtom);
  const [filterField] = useAtom(curBottomSheetFieldAtom);

  return (
    <>
      {isOpen && filterField == FilterFieldName.locations && (
        <LocationBts />
      )}
      {isOpen && filterField == FilterFieldName.propertyType && (
        <PropertyTypeBts />
      )}
      {isOpen && filterField == FilterFieldName.price && <PriceBts />}
      {isOpen && filterField == FilterFieldName.area && <AreaBts />}
      {isOpen && filterField == FilterFieldName.beds && <BedBts />}
      {isOpen && filterField == FilterFieldName.baths && <BathBts />}
      {isOpen && filterField == FilterFieldName.direction && (
        <DirectionBts />
      )}
    </>
  );
}
