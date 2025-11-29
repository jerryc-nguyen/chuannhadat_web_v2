import { OptionForSelect } from '@common/types';
import LocationsList from '@components/desktop/components/LocationsList';

interface AggLocationsFilterProps {
  city?: OptionForSelect;
  district?: OptionForSelect;
  ward?: OptionForSelect;
  cityOptions: OptionForSelect[];
  districtOptions: OptionForSelect[];
  wardOptions: OptionForSelect[];
  onLocationChange?: (location: {
    city?: OptionForSelect;
    district?: OptionForSelect;
    ward?: OptionForSelect;
  }) => void;
  loading?: {
    cities?: boolean;
    districts?: boolean;
    wards?: boolean;
  };
}

export default function AggLocationsFilter({
  city,
  district,
  ward,
  cityOptions,
  districtOptions,
  wardOptions,
  onLocationChange,
  loading: _loading = {},
}: AggLocationsFilterProps) {
  const onSelectCity = (selectedCity?: OptionForSelect) => {
    const finalOption = selectedCity?.value !== 'all' ? selectedCity : undefined;
    onLocationChange?.({
      city: finalOption,
      district: undefined, // Reset district when city changes
      ward: undefined, // Reset ward when city changes
    });
  };

  const onSelectDistrict = (selectedDistrict?: OptionForSelect) => {
    const finalOption = selectedDistrict?.value !== 'all' ? selectedDistrict : undefined;
    onLocationChange?.({
      city,
      district: finalOption,
      ward: undefined, // Reset ward when district changes
    });
  };

  const onSelectWard = (selectedWard?: OptionForSelect) => {
    const finalOption = selectedWard?.value !== 'all' ? selectedWard : undefined;
    onLocationChange?.({
      city,
      district,
      ward: finalOption,
    });
  };

  return (
    <div>
      <LocationsList
        city={city}
        district={district}
        ward={ward}
        cityOptions={cityOptions}
        districtOptions={districtOptions}
        wardOptions={wardOptions}
        onChangeCity={onSelectCity}
        onChangeDistrict={onSelectDistrict}
        onChangeWard={onSelectWard}
      />
    </div>
  );
}
