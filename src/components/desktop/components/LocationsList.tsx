import { useState, useMemo } from 'react';

import { OptionForSelect } from '@common/models';
import OptionPicker from '@components/mobile-ui/OptionPicker';
import { ALL_OPTION } from '@common/constants';
import { Checkbox, List, ListItem } from '@components/konsta';
import ListEmptyMessage from '@components/mobile-ui/ListEmptyMessage';
import { isMobile } from 'react-device-detect';
import { shortenLocationName } from '@common/stringHelpers';

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

  const districtClassProp = isMobile ? 'mt-4 px-4 mb-2' : '';
  const wardClassProp = isMobile ? 'mt-5 px-4 mb-2' : 'mt-5';

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
          <p className={districtClassProp}>
            <b>Quận / Huyện</b>
          </p>

          <List strongIos outlineIos margin="my-0">
            {[ALL_OPTION, ...districtOptions].map((item: OptionForSelect) => {
              return (
                <ListItem
                  key={item.text}
                  link
                  title={shortenLocationName(item.long_text) || item.text}
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

      <div className={wardClassProp}>
        <b>Phường / Xã</b>
      </div>

      {selectedWardOptions.length == 0 && (
        <ListEmptyMessage message={curDistrict ? 'Không có dữ liệu' : 'Vui lòng chọn Quận / Huyện trước'} />
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
