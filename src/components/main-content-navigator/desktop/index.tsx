import { Button } from '@components/ui/button';
import { DialogFooter } from '@components/ui/dialog';
import LocationsPicker from '@desktop/components/LocationsPicker';
import { OptionForSelect } from '@models';
import { useState } from 'react';
import useMainContentNavigator from '../hooks';

export default function MainContentNavigator({ closeModal }: { closeModal: () => void }) {
  const { submit, selectedLocationFullText } = useMainContentNavigator();

  const [city, setCity] = useState<OptionForSelect | undefined>();
  const [district, setDistrict] = useState<OptionForSelect | undefined>();
  const [ward, setWard] = useState<OptionForSelect | undefined>();

  const resetDistrict = () => {
    setDistrict(undefined)
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const resetWard = () => {
    setWard(undefined)
  };

  const onSelectCity = (city?: OptionForSelect) => {
    resetDistrict();
    resetWard();
    const finalOption = city?.value != 'all' ? city : undefined;
    setCity(finalOption)
  };

  const onSelectDistrict = (district?: OptionForSelect) => {
    resetWard();

    const finalOption = district?.value != 'all' ? district : undefined;
    setDistrict(finalOption)
  };

  const onSelectWard = (ward?: OptionForSelect) => {
    const finalOption = ward?.value != 'all' ? ward : undefined;
    setWard(finalOption)
  };

  const onSubmit = () => {
    submit({ city, district, ward })
    closeModal();
  };

  return (
    <div>
      {selectedLocationFullText}
      <LocationsPicker
        city={city}
        district={district}
        ward={ward}
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
