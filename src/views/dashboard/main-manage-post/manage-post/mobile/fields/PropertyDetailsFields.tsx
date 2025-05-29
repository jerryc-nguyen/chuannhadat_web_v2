import { UseFormReturn, ControllerRenderProps } from 'react-hook-form';
import { CardTitle } from '@components/ui/card';
import List from '@components/konsta/List';
import ListItemBtsPicker from '@mobile/bts-pickers/ListItemBtsPicker';
import { FormField, FormItem, FormMessage } from '@components/ui/form';
import { Button } from '@components/ui/button';
import { Label } from '@components/ui/label';
import { OptionForSelect } from '@models';
import { IPostForm } from '../../../types';
import { isLandProperty, isHouseProperty, isApartmentProperty } from '@common/productHelpers';
import { RoundedOptionsNumberInput } from '../../components/form-components/fields/rounded-options-number-input';
import {
  roomsOptionsForCreate,
  facadeOptionsForCreate,
} from '@mobile/filter_bds/constants';
import {
  directionOptions,
  furnitureTypeOptions,
  phapLyTypeOptions,
} from '../../constant';

interface PropertyDetailsFieldsProps {
  form: UseFormReturn<IPostForm>;
  openModal: (params: any) => void;
  closeModal: () => void;
}

export default function PropertyDetailsFields({
  form,
  openModal,
  closeModal
}: PropertyDetailsFieldsProps) {
  const category_type = form.watch('category_type');

  // Use helper functions for property type checking
  const isLand = isLandProperty(category_type);
  const isHouse = isHouseProperty(category_type);
  const isApartment = isApartmentProperty(category_type);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onChangeFieldNumber = (field: ControllerRenderProps<any>, value: string) => {
    field.onChange(value);
  };

  return (
    <>
      <CardTitle className="text-md flex gap-2 px-4 pb-2">Thông tin chi tiết</CardTitle>
      <List strongIos outlineIos className="mt-0 rounded-lg">
        <ListItemBtsPicker
          options={phapLyTypeOptions}
          modalOptions={{ title: 'Giấy tờ pháp lý' }}
          value={form.watch('phap_ly')}
          onSelect={(option) => {
            if (typeof option.value === 'string') form.setValue('phap_ly', option.value);
          }}
          footer={
            <div className="px-4 pt-4">
              <Button
                variant="default"
                className="w-full"
                onClick={() => {
                  form.setValue('phap_ly', '');
                  closeModal();
                }}
                disabled={!form.watch('phap_ly')}
              >
                Xóa
              </Button>
            </div>
          }
        />

        {/* Mặt tiền - Hide for apartment */}
        {!isApartment && (
          <FormField
            control={form.control}
            name="facade"
            render={({ field }) => (
              <FormItem>
                <ListItemBtsPicker
                  onSelect={(option: OptionForSelect) => {
                    if (typeof option.value === 'string' || typeof option.value === 'number') {
                      field.onChange(String(option.value));
                    }
                  }}
                  options={facadeOptionsForCreate}
                  value={field.value}
                  modalOptions={{ title: isHouse ? 'Mặt tiền rộng (m)' : 'Chiều ngang đất rộng (m)', maxHeightPercent: 0.7 }}
                  formattedValue={field.value ? `${field.value} m` : ''}
                  footer={
                    <>
                      <div className="px-4 pt-4">
                        <Button
                          variant="default"
                          className="w-full"
                          onClick={() => {
                            field.onChange('');
                            closeModal();
                          }}
                          disabled={!field.value}
                        >
                          Xóa
                        </Button>
                      </div>
                      <div className="flex flex-col gap-4 p-4">
                        <Label>Số khác:</Label>
                        <RoundedOptionsNumberInput
                          {...field}
                          className="relative"
                          placeholder="Nhập số"
                          onChange={(e) => onChangeFieldNumber(field, e.target.value)}
                          maxLength={3}
                          hiddenSelect
                        />
                        <Button variant="default" className="w-full" onClick={closeModal}>
                          OK
                        </Button>
                      </div>
                    </>
                  }
                />
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Số tầng / Vị trí tầng - Hide for land */}
        {!isLand && (
          <ListItemBtsPicker
            options={roomsOptionsForCreate}
            modalOptions={{ title: isApartment ? 'Vị trí tầng' : 'Số tầng' }}
            value={form.watch('floors_count')}
            onSelect={(option) => {
              if (typeof option.value === 'string' || typeof option.value === 'number') {
                form.setValue('floors_count', String(option.value));
              }
            }}
            formattedValue={form.watch('floors_count') ? `${form.watch('floors_count')} tầng` : ''}
            footer={
              <>
                <div className="px-4 pt-4">
                  <Button
                    variant="default"
                    className="w-full"
                    onClick={() => {
                      form.setValue('floors_count', '');
                      closeModal();
                    }}
                    disabled={!form.watch('floors_count')}
                  >
                    Xóa
                  </Button>
                </div>
                <div className="flex flex-col gap-4 p-4">
                  <Label>Số khác:</Label>
                  <RoundedOptionsNumberInput
                    value={form.watch('floors_count')}
                    className="relative"
                    placeholder="Nhập số"
                    onChange={(e) => form.setValue('floors_count', e.target.value)}
                    maxLength={3}
                    hiddenSelect
                  />
                  <Button variant="default" className="w-full" onClick={closeModal}>
                    OK
                  </Button>
                </div>
              </>
            }
          />
        )}

        <ListItemBtsPicker
          options={directionOptions}
          modalOptions={{ title: isApartment ? 'Hướng ban công' : 'Hướng nhà/ đất' }}
          value={form.watch('entrance_direction')}
          onSelect={(option) => {
            if (typeof option.value === 'string') form.setValue('entrance_direction', option.value);
          }}
          footer={
            <div className="px-4 pt-4">
              <Button
                variant="default"
                className="w-full"
                onClick={() => {
                  form.setValue('entrance_direction', '');
                  closeModal();
                }}
                disabled={!form.watch('entrance_direction')}
              >
                Xóa
              </Button>
            </div>
          }
        />

        {/* Nội thất - Show for house or apartment */}
        {(isHouse || isApartment) && (
          <ListItemBtsPicker
            options={furnitureTypeOptions}
            modalOptions={{ title: 'Nội thất' }}
            value={form.watch('furniture')}
            onSelect={(option) => {
              if (typeof option.value === 'string') form.setValue('furniture', option.value);
            }}
            dividers={false}
            footer={
              <div className="px-4 pt-4">
                <Button
                  variant="default"
                  className="w-full"
                  onClick={() => {
                    form.setValue('furniture', '');
                    closeModal();
                  }}
                  disabled={!form.watch('furniture')}
                >
                  Xóa
                </Button>
              </div>
            }
          />
        )}
      </List>
    </>
  );
} 
