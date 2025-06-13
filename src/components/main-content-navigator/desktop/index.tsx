import { Button } from '@components/ui/button';
import { DialogFooter } from '@components/ui/dialog';
import LocationsPicker from '@views/components/LocationsPicker';
import useMainContentNavigator from '../hooks';

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

  return (
    <div>

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
