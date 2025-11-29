import { useAtomValue } from 'jotai';
import { businessTypeFilterAtom, categoryTypeFilterAtom } from '../states/mapAtoms';
import { businessTypesOptions, categoryTypesOptions } from '@app/(frontend)/_components/features/search/filters-v2/constants';

interface FilterLabel {
  value: string;
  label: string;
}

export const useMapFilterLabels = () => {
  const businessType = useAtomValue(businessTypeFilterAtom);
  const categoryType = useAtomValue(categoryTypeFilterAtom);

  const activeFilters: FilterLabel[] = [];

  if (businessType) {
    const option = businessTypesOptions.find(opt => String(opt.value) === businessType);
    if (option?.text) {
      activeFilters.push({
        value: businessType,
        label: option.text
      });
    }
  }

  if (categoryType) {
    const option = categoryTypesOptions.find(opt => String(opt.value) === categoryType);
    if (option?.text) {
      activeFilters.push({
        value: categoryType,
        label: option.text
      });
    }
  }

  return activeFilters;
};

export default useMapFilterLabels;
