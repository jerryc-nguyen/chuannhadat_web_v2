import { OptionForSelect } from '@app/types';

export const convertToFilterParams = (
  option: OptionForSelect,
  field_name: string
) => {
  return {
    text: option.text,
    params: { [field_name]: option.value },
  };
};
