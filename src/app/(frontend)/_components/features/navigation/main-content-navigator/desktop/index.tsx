import { Button } from '@components/ui/button';
import { DialogFooter } from '@components/ui/dialog';
import LocationsPicker from '@components/desktop/components/LocationsPicker';
import useMainContentNavigator from '../hooks';
import LocationsAutocomplete from '@components/ajax-pickers/LocationsAutocomplete';

export default function MainContentNavigator() {
  const {
    localCity,
    localDistrict,
    localWard,
    onSelectCity,
    onSelectDistrict,
    onSelectWard,
    onSubmit
  } = useMainContentNavigator();

  const handleSelectSearchLocation = (option: OptionForSelect) => {
    console.log(option);
  };

  return (
    <div>
      <div className='mb-4'>
        <LocationsAutocomplete
          value={localCity}
          onSelect={handleSelectSearchLocation}
        />
      </div>

      <LocationsPicker
        city={localCity}
        district={localDistrict}
        ward={localWard}
        onChangeCity={onSelectCity}
        onChangeDistrict={onSelectDistrict}
        onChangeWard={onSelectWard}
      />

      <DialogFooter className='mt-4'>
        <Button onClick={() => onSubmit()}>Áp dụng</Button>
      </DialogFooter>
    </div>
  );
}
