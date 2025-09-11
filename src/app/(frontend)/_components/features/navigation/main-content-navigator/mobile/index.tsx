import { Button } from '@components/ui/button';
import { DialogFooter } from '@components/ui/dialog';

import { Modal } from '@frontend/features/layout/mobile-modals/states/types';
import LocationsPicker from '@components/mobile-ui/LocationsPicker';
import { OptionForSelect } from '@common/models';
import { useCallback, useEffect } from 'react';
import useMainContentNavigator from '../hooks';
import { useLocationPicker } from '@contexts/LocationContext';

export default function MainContentNavigator({ openModal, closeModal }: { openModal: (modal: Modal) => void, closeModal: () => void }) {
  const {
    localCity,
    localDistrict,
    localWard,
    onSelectCity: originalOnSelectCity,
    onSelectDistrict: originalOnSelectDistrict,
    onSelectWard: originalOnSelectWard,
    onSubmit
  } = useMainContentNavigator();

  // Preload cities when this modal opens
  const { loadCities } = useLocationPicker();

  useEffect(() => {
    // Preload cities as soon as the location picker modal opens
    loadCities();
  }, [loadCities]);

  // Wrap the selection handlers to add the closeModal call
  const onSelectCity = useCallback((city?: OptionForSelect) => {
    const result = originalOnSelectCity(city);
    closeModal();
    return result;
  }, [closeModal, originalOnSelectCity]);

  const onSelectDistrict = useCallback((district?: OptionForSelect) => {
    const result = originalOnSelectDistrict(district);
    closeModal();
    return result;
  }, [closeModal, originalOnSelectDistrict]);

  const onSelectWard = useCallback((ward?: OptionForSelect) => {
    const result = originalOnSelectWard(ward);
    closeModal();
    return result;
  }, [closeModal, originalOnSelectWard]);

  return (
    <div>

      <LocationsPicker
        city={localCity}
        district={localDistrict}
        ward={localWard}
        onChangeCity={onSelectCity}
        onChangeDistrict={onSelectDistrict}
        onChangeWard={onSelectWard}
        withStreet={false}
        openModal={openModal}
      />

      <DialogFooter className='mt-4'>
        <Button onClick={() => onSubmit()}>Áp dụng</Button>
      </DialogFooter>
    </div>
  );
}
