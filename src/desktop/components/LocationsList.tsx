import { useState, useMemo } from 'react';

import { OptionForSelect } from '@models';
import OptionPicker from '@mobile/ui/OptionPicker';
import { ALL_OPTION } from '@common/constants';
import { Checkbox, List, ListItem } from '@components/konsta';
import ListEmptyMessage from '@mobile/ui/ListEmptyMessage';

export default function LocationsList({
  city,
  district,
  ward,
  cityOptions = [],
  districtOptions = [],
  wardOptions = [],
  onChangeDistrict,
  onChangeWard,
  onChangeCity,
}: {
  theme?: string;
  city?: OptionForSelect;
  district?: OptionForSelect;
  ward?: OptionForSelect;
  cityOptions: OptionForSelect[];
  districtOptions: OptionForSelect[];
  wardOptions: OptionForSelect[];
  onChangeCity: (city?: OptionForSelect) => void;
  onChangeDistrict: (district?: OptionForSelect) => void;
  onChangeWard: (ward?: OptionForSelect) => void;
}) {

  const [curCity, setCurCity] = useState<OptionForSelect | undefined>(city);
  const [curDistrict, setCurDistrict] = useState<OptionForSelect | undefined>(district);
  const [curWard, setCurWard] = useState<OptionForSelect | undefined>(ward);

  const resetDistrict = () => {
    setCurDistrict(undefined);
  };

  const resetWard = () => {
    setCurWard(undefined);
  };

  const onSelectCity = (city?: OptionForSelect) => {
    const finalOption = city?.value != 'all' ? city : undefined;

    resetDistrict();
    resetWard();

    setCurCity(finalOption);
    onChangeCity(finalOption);
  };

  const onSelectDistrict = (district?: OptionForSelect) => {
    const finalOption = district?.value != 'all' ? district : undefined;
    resetWard();
    setCurDistrict(finalOption);
    onChangeDistrict(finalOption);
  };

  const onSelectWard = (ward?: OptionForSelect) => {
    const finalOption = ward?.value != 'all' ? ward : undefined;
    setCurWard(finalOption);
    onChangeWard(finalOption);
  };

  const selectedWardOptions = useMemo(() => {
    return wardOptions.filter((item: A) => {
      const isSelected = curDistrict?.value?.toString() == item.district_id.toString();
      return isSelected;
    })
  }, [curDistrict, wardOptions])

  return (
    <div>
      {cityOptions.length > 0 && (
        <>
          <b>Thành phố</b>

          <OptionPicker
            theme='ios'
            options={[ALL_OPTION, ...cityOptions]}
            value={curCity}
            onSelect={onSelectCity}
          />
        </>
      )}

      {districtOptions.length > 0 && (
        <>
          <b>Quận / Huyện</b>
          {selectedWardOptions.length}
          <List strongIos outlineIos margin="my-0">
            {[ALL_OPTION, ...districtOptions].map((item: OptionForSelect) => {
              return (
                <ListItem
                  key={item.text}
                  link
                  title={item.long_text || item.text}
                  chevron={false}
                  after={item.count ? item.count : ''}
                  media={
                    <Checkbox
                      component="div"
                      checked={curDistrict && curDistrict?.text == item.text}
                      onChange={() => null}
                    />
                  }
                  onClick={() => {
                    onSelectDistrict(item)
                  }}
                ></ListItem>
              );
            })}
          </List>
        </>
      )}

      <div className='mt-4'>
        <b>Phường / Xã</b>
      </div>

      {selectedWardOptions.length == 0 && (
        <ListEmptyMessage message={'Vui lòng chọn Quận / Huyện trước'} />
      )}

      {selectedWardOptions.length > 0 && (
        <List strongIos outlineIos margin="my-0">
          {[ALL_OPTION, ...selectedWardOptions].map((item: OptionForSelect) => {
            return (
              <ListItem
                key={item.text}
                link
                title={item.text}
                chevron={false}
                after={item.count ? item.count : ''}
                media={
                  <Checkbox
                    component="div"
                    checked={curWard && curWard?.text == item.text}
                    onChange={() => null}
                  />
                }
                onClick={() => {
                  onSelectWard(item)
                }}
              ></ListItem>
            );
          })}
        </List>

      )}


    </div>
  );
}
