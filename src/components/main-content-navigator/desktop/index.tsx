import { Button } from '@components/ui/button';
import { DialogFooter } from '@components/ui/dialog';
import LocationsPicker from '@desktop/components/LocationsPicker';
import { OptionForSelect } from '@models';
import { useState } from 'react';
import useMainContentNavigator from '../hooks';
import OptionsTabList from '@mobile/ui/OptionsTabList';
import { navigatorApi } from '../apis';
import { NEWS_TYPE_OPTION, POSTS_TYPE_OPTION, PRICE_HISTORY_TYPE_OPTION } from '../constants';

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

  const contentOptions = [
    POSTS_TYPE_OPTION,
    NEWS_TYPE_OPTION,
    PRICE_HISTORY_TYPE_OPTION
  ]

  const [contentType, setContentType] = useState<OptionForSelect | undefined>(POSTS_TYPE_OPTION);

  const onContentTypeChanged = (option: A) => {
    setContentType(option)
  }

  const navigatorParams = (): Record<string, A> => {
    const options: Record<string, A> = {}
    options.content_type = contentType?.value || POSTS_TYPE_OPTION.value

    if (city) {
      options.city_id = city.value
    }
    if (district) {
      options.district_id = district.value
    }
    if (ward) {
      options.ward_id = ward.value
    }
    return options;
  }

  const onSubmit = async () => {
    submit({ city, district, ward })
    try {
      const path = await navigatorApi(navigatorParams())
      window.location.href = path
    } catch (error) {
      console.log('error')
    }
  };

  return (
    <div>
      {selectedLocationFullText}
      {/* <p className='mb-1'><b>Nội dung:</b></p> */}
      <OptionsTabList value={contentType} options={contentOptions} onChange={onContentTypeChanged} />

      <p className='mt-4 mb-1'><b>Tại khu vực:</b></p>
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
