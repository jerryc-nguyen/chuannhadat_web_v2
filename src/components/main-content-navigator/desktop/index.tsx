import { Button } from '@components/ui/button';
import { DialogFooter } from '@components/ui/dialog';
import LocationsPicker from '@views/components/LocationsPicker';
import OptionsTabList from '@mobile/ui/OptionsTabList';
import useMainContentNavigator from '../hooks';

export default function MainContentNavigator() {
  const {
    localCity,
    localDistrict,
    localWard,
    localContentType,
    contentOptions,
    onSelectCity,
    onSelectDistrict,
    onSelectWard,
    onContentTypeChanged,
    onSubmit
  } = useMainContentNavigator();

  return (
    <div>
      <OptionsTabList value={localContentType} options={contentOptions} onChange={onContentTypeChanged} />

      <p className='mt-4 mb-2 text-l'><b>Tại khu vực nào?</b></p>
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
