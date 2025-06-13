import { Button } from '@components/ui/button';
import { DialogFooter } from '@components/ui/dialog';

import { Modal } from '@mobile/modals/states/types';
import LocationsPicker from '@mobile/ui/LocationsPicker';
import OptionsTabList from '@mobile/ui/OptionsTabList';
import { OptionForSelect } from '@models';
import { useCallback } from 'react';
import useMainContentNavigator from '../hooks';

export default function MainContentNavigator({ openModal, closeModal }: { openModal: (modal: Modal) => void, closeModal: () => void }) {
  const {
    localCity,
    localDistrict,
    localWard,
    localContentType,
    contentOptions,
    onSelectCity: originalOnSelectCity,
    onSelectDistrict: originalOnSelectDistrict,
    onSelectWard: originalOnSelectWard,
    onContentTypeChanged,
    onSubmit
  } = useMainContentNavigator();

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
