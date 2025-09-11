import { UseFormReturn, ControllerRenderProps } from 'react-hook-form';
import { CardTitle } from '@components/ui/card';
import List from '@components/konsta/List';
import ListItemBtsPicker from '@frontend/features/form/mobile-pickers/ListItemBtsPicker';
import ListItem from '@components/konsta/ListItem';
import { FormField, FormItem, FormMessage } from '@components/ui/form';
import { Button } from '@components/ui/button';
import { Label } from '@components/ui/label';
import { OptionForSelect } from '@common/models';
import { IPostForm } from '@dashboard/PostManagement/types';
import { readMoney } from '@common/priceHelpers';
import { isLandProperty } from '@common/productHelpers';
import { RoundedOptionsNumberInput } from '@app/dashboard/_components/PostManagement/manage-posts/components/form-components/fields/rounded-options-number-input';
import PriceOptions from '../PriceOptions';
import {
  businessTypeOptions,
  categoryTypeOptions,
} from '@dashboard/PostManagement/manage-posts/constant';
import {
  roomsOptionsForCreate,
  areaOptionsForCreate,
} from '@frontend/CategoryPage/mobile/filter_bds/constants';

interface BasicInfoFieldsProps {
  form: UseFormReturn<IPostForm>;
  openModal: (params: any) => void;
  closeModal: () => void;
}

export default function BasicInfoFields({
  form,
  openModal,
  closeModal
}: BasicInfoFieldsProps) {
  const business_type = form.watch('business_type');
  const category_type = form.watch('category_type');

  // Check if it's land or land project using the helper function
  const isLand = isLandProperty(category_type);

  const businessTypeControl = {
    onSelect: (option: OptionForSelect) => {
      if (typeof option.value === 'string' || typeof option.value === 'number') {
        form.setValue('business_type', String(option.value));
      }
    },
    options: businessTypeOptions,
    modalOptions: { title: 'Nhu cầu (*)' },
    value: business_type,
  };

  const categoryTypeControl = {
    onSelect: (option: OptionForSelect) => {
      if (typeof option.value === 'string' || typeof option.value === 'number') {
        form.setValue('category_type', String(option.value));
      }
    },
    options: categoryTypeOptions,
    modalOptions: { title: 'Loại BĐS (*)' },
    value: category_type,
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onChangeFieldNumber = (field: ControllerRenderProps<any>, value: string) => {
    field.onChange(value);
  };

  return (
    <>
      <CardTitle className="text-md flex gap-2 px-4 pb-2">Thông tin cơ bản</CardTitle>
      <List strongIos outlineIos className="mt-0 rounded-lg">
        <ListItemBtsPicker {...businessTypeControl} />
        <ListItemBtsPicker {...categoryTypeControl} dividers={true} />

        <FormField
          control={form.control}
          name="price_in_vnd"
          render={({ field }) => (
            <ListItem
              link
              title={'Giá'}
              value={field.value}
              onClear={() => {
                field.onChange('');
              }}
              onClick={() => {
                openModal({
                  name: `ListItemBtsPicker_price`,
                  title: 'Giá',
                  content: (
                    <PriceOptions
                      value={form.getValues('price_in_vnd')}
                      onSelect={(option: OptionForSelect) => {
                        onChangeFieldNumber(field, option.value + '');
                        closeModal();
                      }}
                      businessType={form.getValues('business_type')}
                    />
                  ),
                });
              }}
              after={readMoney(form.getValues('price_in_vnd'))}
              dividers={true}
            />
          )}
        />

        <FormField
          control={form.control}
          name="area"
          render={({ field }) => (
            <FormItem>
              <ListItemBtsPicker
                onSelect={(option: OptionForSelect) => {
                  field.onChange(option.value);
                }}
                options={areaOptionsForCreate}
                value={field.value}
                modalOptions={{ title: 'Diện tích', maxHeightPercent: 0.7 }}
                formattedValue={field.value ? `${field.value} m²` : ''}
                footer={
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
                }
              />
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Only show bedroom fields if not land */}
        {!isLand && (
          <FormField
            control={form.control}
            name="bedrooms_count"
            render={({ field }) => (
              <FormItem>
                <ListItemBtsPicker
                  onSelect={(option: OptionForSelect) => {
                    field.onChange(option.value);
                  }}
                  options={roomsOptionsForCreate}
                  value={field.value}
                  modalOptions={{ title: 'Phòng ngủ', maxHeightPercent: 0.7 }}
                  formattedValue={field.value ? `${field.value} PN` : ''}
                  footer={
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
                  }
                />
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Only show bathroom fields if not land */}
        {!isLand && (
          <FormField
            control={form.control}
            name="bathrooms_count"
            render={({ field }) => (
              <FormItem>
                <ListItemBtsPicker
                  onSelect={(option: OptionForSelect) => {
                    field.onChange(option.value);
                  }}
                  options={roomsOptionsForCreate}
                  value={field.value}
                  modalOptions={{ title: 'Phòng tắm', maxHeightPercent: 0.7 }}
                  formattedValue={field.value ? `${field.value} WC` : ''}
                  footer={
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
                  }
                />
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </List>
    </>
  );
} 
